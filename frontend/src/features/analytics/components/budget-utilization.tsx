
"use client";

import Link from "next/link";

import {
    Wallet,
    ArrowUpRight,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import {
    Skeleton,
} from "@/components/ui/skeleton";

import {
    EmptyState,
} from "@/components/shared/empty-state";

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

import { cn } from "@/lib/utils";

import {
    getBudgetStatusLabel,
    getBudgetStatusColor,
    getBudgetProgressColor,
    clampPercentage,
} from "../analytics.utils";

import type {
    BudgetAnalytics,
} from "../analytics.types";

interface BudgetUtilizationProps {
    data?: BudgetAnalytics;
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
    onRetry: () => void;
}

export function BudgetUtilization({
    data,
    isLoading,
    isError,
    error,
    onRetry,
}: BudgetUtilizationProps) {
    const budgets = [
        ...(data?.budgets ?? []),
    ].sort(
        (a, b) =>
            b.percentageUsed -
            a.percentageUsed
    );

    return (
        <Card className="min-w-0">
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                        <CardTitle>
                            Budget utilization
                        </CardTitle>

                        <CardDescription>
                            Track spending against your
                            monthly limits
                        </CardDescription>
                    </div>

                    <Link
                        href="/budgets"
                        className="flex shrink-0 items-center gap-1 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
                    >
                        View all

                        <ArrowUpRight className="size-3.5" />
                    </Link>
                </div>
            </CardHeader>

            <CardContent>
                {isError ? (
                    <SectionError
                        message={getApiErrorMessage(error)}
                        onRetry={onRetry}
                    />
                ) : isLoading || !data ? (
                    <div className="space-y-6">
                        {Array.from({ length: 4 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="space-y-3"
                                >
                                    <Skeleton className="h-4 w-32" />

                                    <Skeleton className="h-2 w-full" />

                                    <Skeleton className="h-3 w-44 max-w-full" />
                                </div>
                            )
                        )}
                    </div>
                ) : budgets.length === 0 ? (
                    <EmptyState
                        icon={Wallet}
                        title="No budgets configured"
                        description="Create monthly budgets to monitor your spending and avoid exceeding your limits."
                        action={
                            <Link
                                href="/budgets"
                                className="text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
                            >
                                Go to budgets
                            </Link>
                        }
                    />
                ) : (
                    <div className="max-h-120 space-y-6 overflow-y-auto pr-1">
                        {budgets.map((budget) => {
                            const percentage =
                                clampPercentage(
                                    budget.percentageUsed
                                );

                            const exceeded =
                                budget.status === "EXCEEDED";

                            return (
                                <div
                                    key={budget.id}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-sm font-medium">
                                            {budget.category.name}
                                        </p>

                                        <span
                                            className={cn(
                                                "shrink-0 text-xs font-medium",
                                                getBudgetStatusColor(
                                                    budget.status
                                                )
                                            )}
                                        >
                                            {getBudgetStatusLabel(
                                                budget.status
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-muted-foreground">
                                        <span>
                                            {formatCurrency(
                                                budget.spent,
                                                data.currency
                                            )}{" "}
                                            /{" "}
                                            {formatCurrency(
                                                budget.monthlyLimit,
                                                data.currency
                                            )}
                                        </span>

                                        <span className="tabular-nums">
                                            {formatPercentage(
                                                budget.percentageUsed
                                            )}
                                        </span>
                                    </div>

                                    <div
                                        role="progressbar"
                                        aria-label={`${budget.category.name} budget utilization`}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={percentage}
                                        aria-valuetext={`${budget.percentageUsed}% of budget used`}
                                        className="h-2.5 overflow-hidden rounded-full bg-muted"
                                    >
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
                                                getBudgetProgressColor(
                                                    budget.status
                                                )
                                            )}
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />
                                    </div>

                                    <p
                                        className={cn(
                                            "text-xs",
                                            exceeded
                                                ? "text-red-600 dark:text-red-400"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {exceeded
                                            ? `${formatCurrency(
                                                Math.abs(
                                                    Number(
                                                        budget.remaining
                                                    )
                                                ),
                                                data.currency
                                            )} over budget`
                                            : `${formatCurrency(
                                                budget.remaining,
                                                data.currency
                                            )} remaining`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
