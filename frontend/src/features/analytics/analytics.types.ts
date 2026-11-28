
import type {
    TransactionType,
} from "@/types/api.types";

export type Money = string;

export interface AnalyticsPeriod {
    month: number;
    year: number;
}

export interface FinancialOverview {
    period: AnalyticsPeriod;
    currency: string;
    income: Money;
    expenses: Money;
    netSavings: Money;
    savingsRate: number;
}

export interface CategorySpending {
    categoryId: string | null;
    categoryName: string;
    amount: Money;
    transactionCount: number;
    percentage: number;
}

export interface CategoryAnalytics {
    period: AnalyticsPeriod;
    currency: string;
    totalExpenses: Money;
    categories: CategorySpending[];
}

export interface MonthlyTrend {
    year: number;
    month: number;
    label: string;
    income: Money;
    expenses: Money;
    netSavings: Money;
}

export interface TrendsAnalytics {
    currency: string;
    months: MonthlyTrend[];
}

export type BudgetStatus =
    | "ON_TRACK"
    | "WARNING"
    | "EXCEEDED";

export interface BudgetUsage {
    id: string;

    category: {
        id: string;
        name: string;
    };

    monthlyLimit: Money;
    spent: Money;
    remaining: Money;
    percentageUsed: number;
    status: BudgetStatus;
}

export interface BudgetAnalytics {
    period: AnalyticsPeriod;
    currency: string;
    budgets: BudgetUsage[];
}

export interface RecentTransaction {
    id: string;
    description: string;
    merchant: string | null;
    amount: Money;
    currency: string;
    type: TransactionType;
    transactionDate: string;

    category: {
        id: string;
        name: string;
    } | null;
}
export interface RecentTransactionsAnalytics {
    transactions: RecentTransaction[];
}
export interface TrendsQuery {
    months: number;
}

export interface RecentTransactionsQuery {
    limit: number;
}
