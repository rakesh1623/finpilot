import { Prisma } from "../../../generated/prisma/index.js";
type CreateBudgetInput = {
    categoryId: string;
    monthlyLimit: string;
    month: number;
    year: number;
};
type BudgetFilters = {
    month?: number;
    year?: number;
};
export declare function createBudget(userId: string, data: CreateBudgetInput): Promise<{
    id: string;
    userId: string;
    categoryId: string;
    monthlyLimit: Prisma.Decimal;
    month: number;
    year: number;
    createdAt: Date;
    spent: string;
    remaining: string;
    percentageUsed: number;
    status: "EXCEEDED" | "ON_TRACK" | "WARNING";
}>;
export declare function getBudgets(userId: string, filters: BudgetFilters): Promise<{
    id: string;
    userId: string;
    categoryId: string;
    monthlyLimit: Prisma.Decimal;
    month: number;
    year: number;
    createdAt: Date;
    spent: string;
    remaining: string;
    percentageUsed: number;
    status: "EXCEEDED" | "ON_TRACK" | "WARNING";
}[]>;
export declare function getBudgetById(userId: string, budgetId: string): Promise<{
    id: string;
    userId: string;
    categoryId: string;
    monthlyLimit: Prisma.Decimal;
    month: number;
    year: number;
    createdAt: Date;
    spent: string;
    remaining: string;
    percentageUsed: number;
    status: "EXCEEDED" | "ON_TRACK" | "WARNING";
}>;
export declare function updateBudget(userId: string, budgetId: string, monthlyLimit: string): Promise<{
    id: string;
    userId: string;
    categoryId: string;
    monthlyLimit: Prisma.Decimal;
    month: number;
    year: number;
    createdAt: Date;
    spent: string;
    remaining: string;
    percentageUsed: number;
    status: "EXCEEDED" | "ON_TRACK" | "WARNING";
}>;
export declare function deleteBudget(userId: string, budgetId: string): Promise<{
    id: string;
}>;
export {};
