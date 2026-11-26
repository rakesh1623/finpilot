type Period = {
    month: number;
    year: number;
};
export declare function compareMonthlySpending(userId: string, input: {
    baseMonth: number;
    baseYear: number;
    targetMonth: number;
    targetYear: number;
}): Promise<{
    currency: string;
    basePeriod: {
        month: number;
        year: number;
    };
    targetPeriod: {
        month: number;
        year: number;
    };
    previousExpenses: string;
    currentExpenses: string;
    difference: string;
    percentageChange: number | null;
    direction: string;
    categoryChanges: {
        categoryId: string | null;
        categoryName: string;
        previousSpending: string;
        currentSpending: string;
        difference: string;
        percentageChange: number | null;
    }[];
}>;
export declare function getSpendingTrends(userId: string, input: Period & {
    months: number;
}): Promise<{
    currency: string;
    totalExpenses: string;
    averageMonthlyExpenses: string;
    overallPercentageChange: number | null;
    highestSpendingMonth: {
        year: number;
        month: number;
        label: string;
        income: string;
        expenses: string;
        netSavings: string;
    };
    months: {
        year: number;
        month: number;
        label: string;
        income: string;
        expenses: string;
        netSavings: string;
        monthOverMonthChange: number | null;
    }[];
}>;
export declare function searchFinancialTransactions(userId: string, input: {
    search: string;
    type: "INCOME" | "EXPENSE" | null;
    month: number | null;
    year: number | null;
    limit: number;
}): Promise<{
    currency: string;
    search: string;
    totalMatches: number;
    returnedCount: number;
    hasMore: boolean;
    totalIncome: string;
    totalExpenses: string;
    transactions: {
        amount: string;
        category: {
            name: string;
        } | null;
        description: string;
        id: string;
        merchant: string | null;
        transactionDate: Date;
        type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
    }[];
}>;
export declare function getTopExpenses(userId: string, input: Period & {
    limit: number;
}): Promise<{
    currency: string;
    period: {
        month: number;
        year: number;
    };
    returnedCount: number;
    totalOfReturnedExpenses: string;
    transactions: {
        rank: number;
        amount: string;
        category: {
            name: string;
        } | null;
        description: string;
        id: string;
        merchant: string | null;
        transactionDate: Date;
    }[];
}>;
export declare function getBudgetRecommendations(userId: string, period: Period): Promise<{
    period: Period;
    currency: string;
    totalRecommendations: number;
    recommendations: ({
        priority: string;
        type: string;
        category: string;
        monthlyLimit: string;
        spent: string;
        exceededBy: string;
        recommendation: string;
        percentageUsed?: undefined;
        remaining?: undefined;
        percentageOfExpenses?: undefined;
    } | {
        monthlyLimit?: undefined;
        exceededBy?: undefined;
        priority: string;
        type: string;
        category: string;
        percentageUsed: number;
        remaining: string;
        recommendation: string;
        spent?: undefined;
        percentageOfExpenses?: undefined;
    } | {
        monthlyLimit?: undefined;
        exceededBy?: undefined;
        percentageUsed?: undefined;
        remaining?: undefined;
        priority: string;
        type: string;
        category: string;
        spent: string;
        percentageOfExpenses: number;
        recommendation: string;
    })[];
}>;
export declare function getSavingsAnalysis(userId: string, input: Period & {
    months: number;
}): Promise<{
    currency: string;
    totalIncome: string;
    totalExpenses: string;
    totalSavings: string;
    averageMonthlySavings: string;
    overallSavingsRate: number | null;
    savingsDifference: string;
    bestSavingsMonth: {
        year: number;
        month: number;
        label: string;
        income: string;
        expenses: string;
        netSavings: string;
        savingsRate: number | null;
    };
    months: {
        year: number;
        month: number;
        label: string;
        income: string;
        expenses: string;
        netSavings: string;
        savingsRate: number | null;
    }[];
}>;
export {};
