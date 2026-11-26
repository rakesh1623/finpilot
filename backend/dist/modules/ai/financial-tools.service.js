import { Prisma } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { getCategoryBreakdown, getMonthlyTrends, getBudgetAnalytics, } from "../analytics/analytics.service.js";
const ZERO = new Prisma.Decimal(0);
const CURRENCY = "INR";
function money(value) {
    return value.toFixed(2);
}
function monthRange(year, month) {
    return {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lt: new Date(Date.UTC(year, month, 1)),
    };
}
function percentageChange(previous, current) {
    if (previous.isZero()) {
        return current.isZero() ? 0 : null;
    }
    return Number(current
        .minus(previous)
        .div(previous.abs())
        .mul(100)
        .toFixed(2));
}
export async function compareMonthlySpending(userId, input) {
    const basePeriod = {
        month: input.baseMonth,
        year: input.baseYear,
    };
    const targetPeriod = {
        month: input.targetMonth,
        year: input.targetYear,
    };
    const [base, target] = await Promise.all([
        getCategoryBreakdown(userId, basePeriod),
        getCategoryBreakdown(userId, targetPeriod),
    ]);
    const previous = new Prisma.Decimal(base.totalExpenses);
    const current = new Prisma.Decimal(target.totalExpenses);
    const categories = new Map();
    for (const item of base.categories) {
        categories.set(item.categoryId, {
            categoryName: item.categoryName,
            previous: new Prisma.Decimal(item.amount),
            current: ZERO,
        });
    }
    for (const item of target.categories) {
        const existing = categories.get(item.categoryId);
        if (existing) {
            existing.current = new Prisma.Decimal(item.amount);
        }
        else {
            categories.set(item.categoryId, {
                categoryName: item.categoryName,
                previous: ZERO,
                current: new Prisma.Decimal(item.amount),
            });
        }
    }
    const categoryChanges = Array.from(categories.entries()).map(([categoryId, item]) => ({
        categoryId,
        categoryName: item.categoryName,
        previousSpending: money(item.previous),
        currentSpending: money(item.current),
        difference: money(item.current.minus(item.previous)),
        percentageChange: percentageChange(item.previous, item.current),
    }));
    categoryChanges.sort((a, b) => new Prisma.Decimal(b.difference)
        .abs()
        .comparedTo(new Prisma.Decimal(a.difference).abs()));
    return {
        currency: CURRENCY,
        basePeriod,
        targetPeriod,
        previousExpenses: money(previous),
        currentExpenses: money(current),
        difference: money(current.minus(previous)),
        percentageChange: percentageChange(previous, current),
        direction: current.greaterThan(previous)
            ? "INCREASED"
            : current.lessThan(previous)
                ? "DECREASED"
                : "UNCHANGED",
        categoryChanges,
    };
}
export async function getSpendingTrends(userId, input) {
    const result = await getMonthlyTrends(userId, input);
    const monthlyExpenses = result.months.map((item) => new Prisma.Decimal(item.expenses));
    const totalExpenses = monthlyExpenses.reduce((sum, value) => sum.plus(value), ZERO);
    const averageExpenses = totalExpenses.div(monthlyExpenses.length);
    const first = monthlyExpenses[0] ?? ZERO;
    const last = monthlyExpenses[monthlyExpenses.length - 1] ?? ZERO;
    const highestSpendingMonth = result.months.reduce((highest, current) => new Prisma.Decimal(current.expenses).greaterThan(new Prisma.Decimal(highest.expenses))
        ? current
        : highest);
    const monthlyChanges = result.months.map((item, index) => ({
        ...item,
        monthOverMonthChange: index === 0
            ? null
            : percentageChange(monthlyExpenses[index - 1], monthlyExpenses[index]),
    }));
    return {
        currency: CURRENCY,
        totalExpenses: money(totalExpenses),
        averageMonthlyExpenses: money(averageExpenses),
        overallPercentageChange: percentageChange(first, last),
        highestSpendingMonth,
        months: monthlyChanges,
    };
}
export async function searchFinancialTransactions(userId, input) {
    const where = {
        userId,
        currency: CURRENCY,
        ...(input.type && {
            type: input.type,
        }),
        ...(input.month !== null &&
            input.year !== null && {
            transactionDate: monthRange(input.year, input.month),
        }),
        OR: [
            {
                description: {
                    contains: input.search,
                    mode: "insensitive",
                },
            },
            {
                merchant: {
                    contains: input.search,
                    mode: "insensitive",
                },
            },
            {
                category: {
                    is: {
                        name: {
                            contains: input.search,
                            mode: "insensitive",
                        },
                    },
                },
            },
        ],
    };
    const [transactions, summary] = await prisma.$transaction([
        prisma.transaction.findMany({
            where,
            take: input.limit,
            orderBy: [
                { transactionDate: "desc" },
                { id: "desc" },
            ],
            select: {
                id: true,
                amount: true,
                description: true,
                merchant: true,
                type: true,
                transactionDate: true,
                category: {
                    select: { name: true },
                },
            },
        }),
        prisma.transaction.groupBy({
            by: ["type"],
            where,
            _sum: { amount: true },
            _count: { _all: true },
        }),
    ]);
    const income = summary.find((item) => item.type === "INCOME");
    const expenses = summary.find((item) => item.type === "EXPENSE");
    const totalMatches = summary.reduce((sum, item) => sum + item._count._all, 0);
    return {
        currency: CURRENCY,
        search: input.search,
        totalMatches,
        returnedCount: transactions.length,
        hasMore: totalMatches > transactions.length,
        totalIncome: money(income?._sum.amount ?? ZERO),
        totalExpenses: money(expenses?._sum.amount ?? ZERO),
        transactions: transactions.map((item) => ({
            ...item,
            amount: money(item.amount),
        })),
    };
}
export async function getTopExpenses(userId, input) {
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            currency: CURRENCY,
            type: "EXPENSE",
            transactionDate: monthRange(input.year, input.month),
        },
        take: input.limit,
        orderBy: [
            { amount: "desc" },
            { transactionDate: "desc" },
            { id: "desc" },
        ],
        select: {
            id: true,
            amount: true,
            description: true,
            merchant: true,
            transactionDate: true,
            category: {
                select: { name: true },
            },
        },
    });
    const total = transactions.reduce((sum, item) => sum.plus(item.amount), ZERO);
    return {
        currency: CURRENCY,
        period: {
            month: input.month,
            year: input.year,
        },
        returnedCount: transactions.length,
        totalOfReturnedExpenses: money(total),
        transactions: transactions.map((item, index) => ({
            rank: index + 1,
            ...item,
            amount: money(item.amount),
        })),
    };
}
export async function getBudgetRecommendations(userId, period) {
    const [budgetData, categoryData] = await Promise.all([
        getBudgetAnalytics(userId, period),
        getCategoryBreakdown(userId, period),
    ]);
    const recommendations = [];
    for (const budget of budgetData.budgets) {
        const spent = new Prisma.Decimal(budget.spent);
        const limit = new Prisma.Decimal(budget.monthlyLimit);
        if (spent.greaterThan(limit)) {
            recommendations.push({
                priority: "HIGH",
                type: "BUDGET_EXCEEDED",
                category: budget.category.name,
                monthlyLimit: budget.monthlyLimit,
                spent: budget.spent,
                exceededBy: money(spent.minus(limit)),
                recommendation: "Review remaining discretionary spending in this category.",
            });
        }
        else if (budget.percentageUsed >= 80) {
            recommendations.push({
                priority: "MEDIUM",
                type: "BUDGET_WARNING",
                category: budget.category.name,
                percentageUsed: budget.percentageUsed,
                remaining: budget.remaining,
                recommendation: "Monitor additional spending to stay within the budget.",
            });
        }
    }
    const budgetedCategoryIds = new Set(budgetData.budgets.map((budget) => budget.category.id));
    for (const category of categoryData.categories) {
        if (category.categoryId &&
            !budgetedCategoryIds.has(category.categoryId) &&
            category.percentage >= 10) {
            recommendations.push({
                priority: "LOW",
                type: "MISSING_BUDGET",
                category: category.categoryName,
                spent: category.amount,
                percentageOfExpenses: category.percentage,
                recommendation: "Consider setting a monthly budget for this category.",
            });
        }
    }
    const priorityOrder = {
        HIGH: 0,
        MEDIUM: 1,
        LOW: 2,
    };
    recommendations.sort((a, b) => priorityOrder[a.priority] -
        priorityOrder[b.priority]);
    return {
        period,
        currency: CURRENCY,
        totalRecommendations: recommendations.length,
        recommendations,
    };
}
export async function getSavingsAnalysis(userId, input) {
    const result = await getMonthlyTrends(userId, input);
    let totalIncome = new Prisma.Decimal(0);
    let totalExpenses = new Prisma.Decimal(0);
    const months = result.months.map((item) => {
        const income = new Prisma.Decimal(item.income);
        const expenses = new Prisma.Decimal(item.expenses);
        const savings = income.minus(expenses);
        totalIncome = totalIncome.plus(income);
        totalExpenses = totalExpenses.plus(expenses);
        return {
            ...item,
            netSavings: money(savings),
            savingsRate: income.isZero()
                ? null
                : Number(savings.div(income).mul(100).toFixed(2)),
        };
    });
    const totalSavings = totalIncome.minus(totalExpenses);
    const bestSavingsMonth = months.reduce((best, current) => new Prisma.Decimal(current.netSavings).greaterThan(new Prisma.Decimal(best.netSavings))
        ? current
        : best);
    const firstSavings = new Prisma.Decimal(months[0].netSavings);
    const latestSavings = new Prisma.Decimal(months[months.length - 1].netSavings);
    return {
        currency: CURRENCY,
        totalIncome: money(totalIncome),
        totalExpenses: money(totalExpenses),
        totalSavings: money(totalSavings),
        averageMonthlySavings: money(totalSavings.div(months.length)),
        overallSavingsRate: totalIncome.isZero()
            ? null
            : Number(totalSavings
                .div(totalIncome)
                .mul(100)
                .toFixed(2)),
        savingsDifference: money(latestSavings.minus(firstSavings)),
        bestSavingsMonth,
        months,
    };
}
//# sourceMappingURL=financial-tools.service.js.map