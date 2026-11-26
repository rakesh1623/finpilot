import { Prisma } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
const ZERO = new Prisma.Decimal(0);
const CURRENCY = "INR";
function monthRange(year, month) {
    return {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lt: new Date(Date.UTC(year, month, 1)),
    };
}
function money(value) {
    return (value ?? ZERO).toFixed(2);
}
function percentage(numerator, denominator) {
    if (denominator.isZero())
        return 0;
    return Number(numerator.div(denominator).mul(100).toFixed(2));
}
export async function getOverview(userId, period) {
    const totals = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
            userId,
            currency: CURRENCY,
            transactionDate: monthRange(period.year, period.month),
        },
        _sum: { amount: true },
    });
    const income = totals.find(t => t.type === "INCOME")
        ?._sum.amount ?? ZERO;
    const expenses = totals.find(t => t.type === "EXPENSE")
        ?._sum.amount ?? ZERO;
    const netSavings = income.minus(expenses);
    return {
        period,
        currency: CURRENCY,
        income: money(income),
        expenses: money(expenses),
        netSavings: money(netSavings),
        savingsRate: percentage(netSavings, income),
    };
}
export async function getCategoryBreakdown(userId, period) {
    const grouped = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
            userId,
            currency: CURRENCY,
            type: "EXPENSE",
            transactionDate: monthRange(period.year, period.month),
        },
        _sum: { amount: true },
        _count: { _all: true },
    });
    const categoryIds = grouped
        .map(g => g.categoryId)
        .filter((id) => id !== null);
    const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true },
    });
    const names = new Map(categories.map(c => [c.id, c.name]));
    const total = grouped.reduce((sum, row) => sum.plus(row._sum.amount ?? ZERO), ZERO);
    const breakdown = grouped.map(row => {
        const amount = row._sum.amount ?? ZERO;
        return {
            categoryId: row.categoryId,
            categoryName: row.categoryId
                ? names.get(row.categoryId) ?? "Unknown"
                : "Uncategorized",
            amount: money(amount),
            transactionCount: row._count._all,
            percentage: percentage(amount, total),
        };
    });
    breakdown.sort((a, b) => Number(b.amount) - Number(a.amount));
    return {
        period,
        currency: CURRENCY,
        totalExpenses: money(total),
        categories: breakdown,
    };
}
export async function getMonthlyTrends(userId, period) {
    const end = new Date(Date.UTC(period.year, period.month, 1));
    const start = new Date(Date.UTC(period.year, period.month - period.months, 1));
    const grouped = await prisma.transaction.groupBy({
        by: ["type", "transactionDate"],
        where: {
            userId,
            currency: CURRENCY,
            transactionDate: { gte: start, lt: end },
        },
        _sum: { amount: true },
    });
    const result = [];
    for (let i = period.months - 1; i >= 0; i--) {
        const date = new Date(Date.UTC(period.year, period.month - 1 - i, 1));
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        let income = new Prisma.Decimal(0);
        let expenses = new Prisma.Decimal(0);
        for (const row of grouped) {
            const transactionDate = row.transactionDate;
            if (transactionDate.getUTCFullYear() !== year ||
                transactionDate.getUTCMonth() + 1 !== month) {
                continue;
            }
            const amount = row._sum.amount ?? ZERO;
            if (row.type === "INCOME") {
                income = income.plus(amount);
            }
            else {
                expenses = expenses.plus(amount);
            }
        }
        result.push({
            year,
            month,
            label: date.toLocaleString("en-US", {
                month: "short",
                year: "numeric",
                timeZone: "UTC",
            }),
            income: money(income),
            expenses: money(expenses),
            netSavings: money(income.minus(expenses)),
        });
    }
    return {
        currency: CURRENCY,
        months: result,
    };
}
export async function getBudgetAnalytics(userId, period) {
    const budgets = await prisma.budget.findMany({
        where: {
            userId,
            month: period.month,
            year: period.year,
        },
        include: {
            category: {
                select: { id: true, name: true },
            },
        },
    });
    const spending = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
            userId,
            type: "EXPENSE",
            currency: CURRENCY,
            transactionDate: monthRange(period.year, period.month),
            categoryId: {
                in: budgets.map(b => b.categoryId),
            },
        },
        _sum: { amount: true },
    });
    const spentByCategory = new Map(spending.map(s => [
        s.categoryId,
        s._sum.amount ?? ZERO,
    ]));
    const result = budgets.map(budget => {
        const spent = spentByCategory.get(budget.categoryId) ?? ZERO;
        const limit = budget.monthlyLimit;
        const used = percentage(spent, limit);
        return {
            id: budget.id,
            category: budget.category,
            monthlyLimit: money(limit),
            spent: money(spent),
            remaining: money(limit.minus(spent)),
            percentageUsed: used,
            status: spent.greaterThan(limit)
                ? "EXCEEDED"
                : used >= 80
                    ? "WARNING"
                    : "ON_TRACK",
        };
    });
    return {
        period,
        currency: CURRENCY,
        budgets: result,
    };
}
export async function getRecentTransactions(userId, limit) {
    return prisma.transaction.findMany({
        where: { userId },
        take: limit,
        orderBy: [
            { transactionDate: "desc" },
            { createdAt: "desc" },
        ],
        include: {
            category: {
                select: { id: true, name: true },
            },
        },
    });
}
//# sourceMappingURL=analytics.service.js.map