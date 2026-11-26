import type { Prisma } from "../../../generated/prisma/index.js";
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
export declare function createTransaction(userId: string, data: CreateTransactionData): Promise<{
    category: {
        id: string;
        userId: string | null;
        name: string;
        type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
        createdAt: Date;
    } | null;
} & {
    id: string;
    userId: string;
    categoryId: string | null;
    amount: Prisma.Decimal;
    currency: string;
    type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
    description: string;
    merchant: string | null;
    transactionDate: Date;
    fingerprint: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function getTransactions(userId: string, filters: {
    page: number;
    limit: number;
    type?: "INCOME" | "EXPENSE";
    categoryId?: string;
    search?: string;
    from?: Date;
    to?: Date;
    sort: "newest" | "oldest";
}): Promise<{
    transactions: ({
        category: {
            id: string;
            userId: string | null;
            name: string;
            type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
            createdAt: Date;
        } | null;
    } & {
        id: string;
        userId: string;
        categoryId: string | null;
        amount: Prisma.Decimal;
        currency: string;
        type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
        description: string;
        merchant: string | null;
        transactionDate: Date;
        fingerprint: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function getTransactionById(userId: string, transactionId: string): Promise<{
    category: {
        id: string;
        userId: string | null;
        name: string;
        type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
        createdAt: Date;
    } | null;
} & {
    id: string;
    userId: string;
    categoryId: string | null;
    amount: Prisma.Decimal;
    currency: string;
    type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
    description: string;
    merchant: string | null;
    transactionDate: Date;
    fingerprint: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function updateTransaction(userId: string, transactionId: string, data: UpdateTransactionData): Promise<{
    category: {
        id: string;
        userId: string | null;
        name: string;
        type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
        createdAt: Date;
    } | null;
} & {
    id: string;
    userId: string;
    categoryId: string | null;
    amount: Prisma.Decimal;
    currency: string;
    type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
    description: string;
    merchant: string | null;
    transactionDate: Date;
    fingerprint: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function deleteTransaction(userId: string, transactionId: string): Promise<{
    id: string;
}>;
export {};
