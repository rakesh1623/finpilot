
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/index.js";
import { AppError } from "../../utils/AppError.js";

type CreateTransactionData = {
    amount: string;
    description: string;
    merchant?: string | null;
    type: "INCOME" | "EXPENSE";
    categoryId?: string | null;
    currency: string;
    transactionDate: Date;
};

type UpdateTransactionData = Partial<CreateTransactionData>;

async function validateCategory(
    userId: string,
    categoryId: string | null | undefined,
    type: "INCOME" | "EXPENSE"
) {
    if (!categoryId) return;

    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            OR: [
                { userId },
                { userId: null },
            ],
        },
    });

    if (!category) {
        throw new AppError(404, "Category not found");
    }

    if (category.type !== type) {
        throw new AppError(
            400,
            "Category type does not match transaction type"
        );
    }
}

export async function createTransaction(
    userId: string,
    data: CreateTransactionData
) {
    await validateCategory(userId, data.categoryId, data.type);

    return prisma.transaction.create({
        data: {
            amount: data.amount,
            description: data.description,
            merchant: data.merchant,
            type: data.type,
            currency: data.currency,
            transactionDate: data.transactionDate,
            user: {
                connect: { id: userId },
            },
            category: data.categoryId
                ? { connect: { id: data.categoryId } }
                : undefined,
        },
        include: {
            category: true,
        },
    });
}

export async function getTransactions(
    userId: string,
    filters: {
        page: number;
        limit: number;
        type?: "INCOME" | "EXPENSE";
        categoryId?: string;
        search?: string;
        from?: Date;
        to?: Date;
        sort: "newest" | "oldest";
    }
) {
    const where: Prisma.TransactionWhereInput = {
        userId,
        ...(filters.type && { type: filters.type }),
        ...(filters.categoryId && {
            categoryId: filters.categoryId,
        }),
        ...(filters.search && {
            OR: [
                {
                    description: {
                        contains: filters.search,
                        mode: "insensitive",
                    },
                },
                {
                    merchant: {
                        contains: filters.search,
                        mode: "insensitive",
                    },
                },
            ],
        }),
        ...(filters.from || filters.to
            ? {
                transactionDate: {
                    ...(filters.from && { gte: filters.from }),
                    ...(filters.to && { lte: filters.to }),
                },
            }
            : {}),
    };

    const skip = (filters.page - 1) * filters.limit;

    const [transactions, total] = await prisma.$transaction([
        prisma.transaction.findMany({
            where,
            skip,
            take: filters.limit,
            orderBy: {
                transactionDate:
                    filters.sort === "newest" ? "desc" : "asc",
            },
            include: {
                category: true,
            },
        }),
        prisma.transaction.count({ where }),
    ]);

    return {
        transactions,
        pagination: {
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages: Math.ceil(total / filters.limit),
        },
    };
}

export async function getTransactionById(
    userId: string,
    transactionId: string
) {
    const transaction = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            userId,
        },
        include: {
            category: true,
        },
    });

    if (!transaction) {
        throw new AppError(404, "Transaction not found");
    }

    return transaction;
}

export async function updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionData
) {
    const existing = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            userId,
        },
    });

    if (!existing) {
        throw new AppError(404, "Transaction not found");
    }

    const effectiveCategoryId =
        data.categoryId !== undefined
            ? data.categoryId
            : existing.categoryId;

    const effectiveType = data.type ?? existing.type;

    await validateCategory(
        userId,
        effectiveCategoryId,
        effectiveType
    );

    return prisma.transaction.update({
        where: {
            id: transactionId,
        },
        data: {
            ...(data.amount !== undefined && { amount: data.amount }),
            ...(data.description !== undefined && {
                description: data.description,
            }),
            ...(data.merchant !== undefined && {
                merchant: data.merchant,
            }),
            ...(data.type !== undefined && { type: data.type }),
            ...(data.currency !== undefined && {
                currency: data.currency,
            }),
            ...(data.transactionDate !== undefined && {
                transactionDate: data.transactionDate,
            }),
            ...(data.categoryId !== undefined && {
                category: data.categoryId
                    ? { connect: { id: data.categoryId } }
                    : { disconnect: true },
            }),
        },
        include: {
            category: true,
        },
    });
}

export async function deleteTransaction(
    userId: string,
    transactionId: string
) {
    const existing = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            userId,
        },
        select: { id: true },
    });

    if (!existing) {
        throw new AppError(404, "Transaction not found");
    }

    await prisma.transaction.delete({
        where: {
            id: existing.id,
        },
    });

    return { id: existing.id };
}
