
import type OpenAI from "openai";
import { z } from "zod";

import {
    toolPeriodSchema,
    compareSpendingSchema,
    spendingTrendsSchema,
    searchTransactionsSchema,
    topExpensesSchema,
} from "./ai.validation.js";

import {
    getOverview,
    getCategoryBreakdown,
    getBudgetAnalytics,
} from "../analytics/analytics.service.js";

import {
    compareMonthlySpending,
    getSpendingTrends,
    searchFinancialTransactions,
    getTopExpenses,
    getBudgetRecommendations,
    getSavingsAnalysis,
} from "./financial-tools.service.js";

const monthProperty = {
    type: "integer",
    description: "Calendar month from 1 to 12",
};

const yearProperty = {
    type: "integer",
    description: "Four-digit calendar year",
};

const limitProperty = {
    type: "integer",
    description: "Number of records to return, from 1 to 20",
};

const periodProperties = {
    month: monthProperty,
    year: yearProperty,
};

const trendsProperties = {
    ...periodProperties,
    months: {
        type: "integer",
        description:
            "Number of months, from 2 to 24, ending at the specified month",
    },
};

function defineTool(
    name: string,
    description: string,
    properties: Record<string, unknown>
): OpenAI.Responses.Tool {
    return {
        type: "function",
        name,
        description,
        strict: true,
        parameters: {
            type: "object",
            properties,
            required: Object.keys(properties),
            additionalProperties: false,
        },
    };
}

export const financialTools: OpenAI.Responses.Tool[] = [
    defineTool(
        "get_financial_overview",
        "Get income, expenses, net savings and savings rate for one month.",
        periodProperties
    ),

    defineTool(
        "get_category_spending",
        "Get expense totals grouped by category for one month.",
        periodProperties
    ),

    defineTool(
        "get_budget_status",
        "Get budget limits, spending, remaining amounts and utilization.",
        periodProperties
    ),

    defineTool(
        "compare_monthly_spending",
        "Compare expenses between two months. Returns exact differences, percentage changes and category-level contributions. Base is the reference month and target is the month being compared.",
        {
            baseMonth: monthProperty,
            baseYear: yearProperty,
            targetMonth: monthProperty,
            targetYear: yearProperty,
        }
    ),

    defineTool(
        "get_spending_trends",
        "Analyze spending across multiple months, including averages, highest-spending month and monthly percentage changes.",
        trendsProperties
    ),

    defineTool(
        "search_transactions",
        "Find transactions by merchant, description or category. Returns matching records and aggregate totals. Use null for both month and year to search all dates.",
        {
            search: {
                type: "string",
                description: "Merchant, description or category keyword",
            },
            type: {
                type: ["string", "null"],
                enum: ["INCOME", "EXPENSE", null],
                description: "Transaction type or null for both types",
            },
            month: {
                type: ["integer", "null"],
                description: "Month from 1 to 12, or null",
            },
            year: {
                type: ["integer", "null"],
                description: "Four-digit year, or null",
            },
            limit: limitProperty,
        }
    ),

    defineTool(
        "get_top_expenses",
        "Find the largest individual expense transactions for a month.",
        {
            ...periodProperties,
            limit: limitProperty,
        }
    ),

    defineTool(
        "get_budget_recommendations",
        "Identify exceeded budgets, budget warnings and significant spending categories without budgets.",
        periodProperties
    ),

    defineTool(
        "get_savings_analysis",
        "Analyze recorded income, expenses, net savings and savings rates across multiple months.",
        trendsProperties
    ),
];

export async function executeFinancialTool(
    name: string,
    rawArguments: string,
    userId: string
): Promise<unknown> {
    let parsed: unknown;

    try {
        parsed = JSON.parse(rawArguments);
    } catch {
        return { error: "Invalid tool arguments" };
    }

    try {
        switch (name) {
            case "get_financial_overview":
                return await getOverview(
                    userId,
                    toolPeriodSchema.parse(parsed)
                );

            case "get_category_spending":
                return await getCategoryBreakdown(
                    userId,
                    toolPeriodSchema.parse(parsed)
                );

            case "get_budget_status":
                return await getBudgetAnalytics(
                    userId,
                    toolPeriodSchema.parse(parsed)
                );

            case "compare_monthly_spending":
                return await compareMonthlySpending(
                    userId,
                    compareSpendingSchema.parse(parsed)
                );

            case "get_spending_trends":
                return await getSpendingTrends(
                    userId,
                    spendingTrendsSchema.parse(parsed)
                );

            case "search_transactions":
                return await searchFinancialTransactions(
                    userId,
                    searchTransactionsSchema.parse(parsed)
                );

            case "get_top_expenses":
                return await getTopExpenses(
                    userId,
                    topExpensesSchema.parse(parsed)
                );

            case "get_budget_recommendations":
                return await getBudgetRecommendations(
                    userId,
                    toolPeriodSchema.parse(parsed)
                );

            case "get_savings_analysis":
                return await getSavingsAnalysis(
                    userId,
                    spendingTrendsSchema.parse(parsed)
                );

            default:
                return { error: "Unknown financial tool" };
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                error: "Invalid tool arguments",
                issues: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            };
        }

        throw error;
    }
}
