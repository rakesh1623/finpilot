
"use client";

import {
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
    Percent,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Skeleton,
} from "@/components/ui/skeleton";

import {
    SectionError,
} from "@/components/shared/section-error";

import {
    formatCurrency,
    formatPercentage,
} from "@/lib/formatters";

import {
    getApiErrorMessage,
} from "@/lib/api-error";

import {
    SummaryCard,
} from "./summary-card";

import {
    getPeriodLabel,
} from "../analytics.utils";

import type {
    AnalyticsPeriod,
    FinancialOverview,
} from "../analytics.types";

interface FinancialSummaryProps {
    period: AnalyticsPeriod;
    data?: FinancialOverview;
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
    onRetry: () => void;
}

export function FinancialSummary({
    period,
    data,
    isLoading,
    isError,
    error,
    onRetry,
}: FinancialSummaryProps) {
    if (isError) {
        return (
            <SectionError
                title="Unable to load financial summary"
                message={getApiErrorMessage(error)}
                onRetry={onRetry}
            />
        );
    }

    if (isLoading || !data) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map(
                    (_, index) => (
                        <Card key={index}>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="size-10 rounded-xl" />
                                </div>

                                <Skeleton className="h-8 w-36 max-w-full" />

                                <Skeleton className="h-3 w-28" />
                            </CardContent>
                        </Card>
                    )
                )}
            </div>
        );
    }

    const periodLabel =
        getPeriodLabel(period);

    const hasIncome =
        Number(data.income) > 0;

    const hasNegativeSavings =
        Number(data.netSavings) < 0;

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
                title="Total income"
                value={formatCurrency(
                    data.income,
                    data.currency
                )}
                description={`Income in ${periodLabel}`}
                icon={ArrowDownLeft}
                iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />

            <SummaryCard
                title="Total expenses"
                value={formatCurrency(
                    data.expenses,
                    data.currency
                )}
                description={`Expenses in ${periodLabel}`}
                icon={ArrowUpRight}
                iconClassName="bg-red-500/10 text-red-600 dark:text-red-400"
            />

            <SummaryCard
                title="Net savings"
                value={formatCurrency(
                    data.netSavings,
                    data.currency
                )}
                description="Income minus expenses"
                icon={Wallet}
                iconClassName="bg-teal-500/10 text-teal-600 dark:text-teal-400"
                valueClassName={
                    hasNegativeSavings
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                }
            />

            <SummaryCard
                title="Savings rate"
                value={
                    hasIncome
                        ? formatPercentage(
                            data.savingsRate
                        )
                        : "—"
                }
                description={
                    hasIncome
                        ? "Percentage of income saved"
                        : "No income recorded"
                }
                icon={Percent}
                iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            />
        </div>
    );
}
