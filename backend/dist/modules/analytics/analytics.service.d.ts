import { Prisma } from "../../../generated/prisma/index.js";
type Period = {
    month: number;
    year: number;
};
export declare function getOverview(userId: string, period: Period): Promise<{
    period: Period;
    currency: string;
    income: string;
    expenses: string;
    netSavings: string;
    savingsRate: number;
}>;
export declare function getCategoryBreakdown(userId: string, period: Period): Promise<{
    period: Period;
    currency: string;
    totalExpenses: string;
    categories: {
        categoryId: string | null;
        categoryName: string;
        amount: string;
        transactionCount: number;
        percentage: number;
    }[];
}>;
export declare function getMonthlyTrends(userId: string, period: Period & {
    months: number;
}): Promise<{
    currency: string;
    months: {
        year: number;
        month: number;
        label: string;
        income: string;
        expenses: string;
        netSavings: string;
    }[];
}>;
export declare function getBudgetAnalytics(userId: string, period: Period): Promise<{
    period: Period;
    currency: string;
    budgets: {
        id: string;
        category: {
            id: string;
            name: string;
        };
        monthlyLimit: string;
        spent: string;
        remaining: string;
        percentageUsed: number;
        status: string;
    }[];
}>;
export declare function getRecentTransactions(userId: string, limit: number): Promise<({
    category: {
        id: string;
        name: string;
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
})[]>;
export {};
