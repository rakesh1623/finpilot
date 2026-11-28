
"use client";

import { PieChart as PieChartIcon } from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import {
    EmptyState,
} from "@/components/shared/empty-state";

import {
    SectionError,
} from "@/components/shared/section-error";

import {
    ChartSkeleton,
} from "@/components/shared/chart-skeleton";

import {
    formatCurrency,
    formatPercentage,
} from "@/lib/formatters";

import {
    getApiErrorMessage,
} from "@/lib/api-error";

import {
    CHART_COLORS,
} from "../analytics.utils";

import type {
    CategoryAnalytics,
} from "../analytics.types";

interface SpendingBreakdownProps {
    data?: CategoryAnalytics;
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
    onRetry: () => void;
}

export function SpendingBreakdown({
    data,
    isLoading,
    isError,
    error,
    onRetry,
}: SpendingBreakdownProps) {
    const chartData =
        data?.categories
            .filter(
                (category) =>
                    Number(category.amount) > 0
            )
            .map((category, index) => ({
                ...category,
                name: category.categoryName,
                value: Number(category.amount),
                color:
                    CHART_COLORS[
                    index % CHART_COLORS.length
                    ],
            })) ?? [];

    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle>
                    Spending breakdown
                </CardTitle>

                <CardDescription>
                    Expenses by category for the
                    selected month
                </CardDescription>
            </CardHeader>

            <CardContent>
                {isError ? (
                    <SectionError
                        message={getApiErrorMessage(error)}
                        onRetry={onRetry}
                    />
                ) : isLoading || !data ? (
                    <ChartSkeleton />
                ) : chartData.length === 0 ? (
                    <EmptyState
                        icon={PieChartIcon}
                        title="No expenses recorded"
                        description="Your spending breakdown will appear once you record expenses for this month."
                    />
                ) : (
                    <div className="space-y-5">
                        <div className="relative h-62.5 min-w-0">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="62%"
                                        outerRadius="88%"
                                        paddingAngle={2}
                                        stroke="none"
                                    >
                                        {chartData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={
                                                        entry.categoryId ??
                                                        `uncategorized-${index}`
                                                    }
                                                    fill={entry.color}
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip
                                        formatter={(value) =>
                                            formatCurrency(
                                                Number(value),
                                                data.currency
                                            )
                                        }
                                        contentStyle={{
                                            background:
                                                "var(--popover)",
                                            color:
                                                "var(--popover-foreground)",
                                            border:
                                                "1px solid var(--border)",
                                            borderRadius: "12px",
                                        }}
                                        itemStyle={{
                                            color:
                                                "var(--popover-foreground)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <p className="max-w-[55%] wrap-break-word text-center text-lg font-bold tabular-nums">
                                    {formatCurrency(
                                        data.totalExpenses,
                                        data.currency
                                    )}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Total expenses
                                </p>
                            </div>
                        </div>

                        <div className="max-h-70 space-y-3 overflow-y-auto">
                            {chartData.map(
                                (category, index) => (
                                    <div
                                        key={
                                            category.categoryId ??
                                            `uncategorized-${index}`
                                        }
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span
                                                className="size-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        category.color,
                                                }}
                                            />

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {category.categoryName}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {category.transactionCount}{" "}
                                                    transactions
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-medium tabular-nums">
                                                {formatCurrency(
                                                    category.amount,
                                                    data.currency
                                                )}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {formatPercentage(
                                                    category.percentage
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
