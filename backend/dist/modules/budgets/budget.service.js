import { Prisma, } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
function getMonthRange(year, month) {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    return { start, end };
}
async function validateExpenseCategory(userId, categoryId) {
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            type: "EXPENSE",
            OR: [{ userId }, { userId: null }],
        },
        select: { id: true },
    });
    if (!category) {
        throw new AppError(404, "Expense category not found");
    }
}
async function calculateBudgetUsage(userId, budget) {
    const { start, end } = getMonthRange(budget.year, budget.month);
    const result = await prisma.transaction.aggregate({
        where: {
            userId,
            categoryId: budget.categoryId,
            type: "EXPENSE",
            transactionDate: {
                gte: start,
                lt: end,
            },
        },
        _sum: {
            amount: true,
        },
    });
    const spent = result._sum.amount ?? new Prisma.Decimal(0);
    const limit = budget.monthlyLimit;
    const remaining = limit.minus(spent);
    const percentageUsed = spent.div(limit).mul(100);
    let status;
    if (spent.greaterThan(limit)) {
        status = "EXCEEDED";
    }
    else if (percentageUsed.greaterThanOrEqualTo(80)) {
        status = "WARNING";
    }
    else {
        status = "ON_TRACK";
    }
    return {
        ...budget,
        spent: spent.toFixed(2),
        remaining: remaining.toFixed(2),
        percentageUsed: Number(percentageUsed.toFixed(2)),
        status,
    };
}
export async function createBudget(userId, data) {
    await validateExpenseCategory(userId, data.categoryId);
    const existing = await prisma.budget.findUnique({
        where: {
            userId_categoryId_month_year: {
                userId,
                categoryId: data.categoryId,
                month: data.month,
                year: data.year,
            },
        },
    });
    if (existing) {
        throw new AppError(409, "Budget already exists for this category and month");
    }
    try {
        const budget = await prisma.budget.create({
            data: {
                userId,
                categoryId: data.categoryId,
                monthlyLimit: data.monthlyLimit,
                month: data.month,
                year: data.year,
            },
        });
        return calculateBudgetUsage(userId, budget);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            throw new AppError(409, "Budget already exists");
        }
        throw error;
    }
}
export async function getBudgets(userId, filters) {
    const budgets = await prisma.budget.findMany({
        where: {
            userId,
            ...(filters.month && { month: filters.month }),
            ...(filters.year && { year: filters.year }),
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                },
            },
        },
        orderBy: [
            { year: "desc" },
            { month: "desc" },
            { createdAt: "desc" },
        ],
    });
    return Promise.all(budgets.map((budget) => calculateBudgetUsage(userId, budget)));
}
export async function getBudgetById(userId, budgetId) {
    const budget = await prisma.budget.findFirst({
        where: {
            id: budgetId,
            userId,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                },
            },
        },
    });
    if (!budget) {
        throw new AppError(404, "Budget not found");
    }
    return calculateBudgetUsage(userId, budget);
}
export async function updateBudget(userId, budgetId, monthlyLimit) {
    const result = await prisma.budget.updateMany({
        where: {
            id: budgetId,
            userId,
        },
        data: { monthlyLimit },
    });
    if (result.count === 0) {
        throw new AppError(404, "Budget not found");
    }
    return getBudgetById(userId, budgetId);
}
export async function deleteBudget(userId, budgetId) {
    const result = await prisma.budget.deleteMany({
        where: {
            id: budgetId,
            userId,
        },
    });
    if (result.count === 0) {
        throw new AppError(404, "Budget not found");
    }
    return { id: budgetId };
}
//# sourceMappingURL=budget.service.js.map