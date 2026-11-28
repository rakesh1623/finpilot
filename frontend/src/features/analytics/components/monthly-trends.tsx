
"use client";

import {
    BarChart3,
} from "lucide-react";

import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import {
    ChartSkeleton,
} from "@/components/shared/chart-skeleton";

import {
    SectionError,
} from "@/components/shared/section-error";

import {
    EmptyState,
} from "@/components/shared/empty-state";

import {
    formatCurrency,
    formatCompactCurrency,
} from "@/lib/formatters";

import {
    getApiErrorMessage,
} from "@/lib/api-error";

import {
    INCOME_COLOR,
    EXPENSE_COLOR,
} from "../analytics.utils";

import type {
    TrendsAnalytics,
} from "../analytics.types";

interface MonthlyTrendsProps {
    data?: TrendsAnalytics;
    months: number;
    onMonthsChange: (months: number) => void;
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
    onRetry: () => void;
}

export function MonthlyTrends({
    data,
    months,
    onMonthsChange,
    isLoading,
    isError,
    error,
    onRetry,
}: MonthlyTrendsProps) {
    const chartData =
        data?.months.map((item) => ({
            label: item.label,
            income: Number(item.income),
            expenses: Number(item.expenses),
            netSavings: Number(item.netSavings),
        })) ?? [];

    const hasActivity = chartData.some(
        (item) =>
            item.income > 0 ||
            item.expenses > 0
    );

    return (
        <Card className="min-w-0">
            <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1.5">
                        <CardTitle>
                            Financial trends
                        </CardTitle>

                        <CardDescription>
                            Income and expenses over the
                            latest {months} months
                        </CardDescription>
                    </div>

                    <Tabs
                        value={String(months)}
                        onValueChange={(value) =>
                            onMonthsChange(Number(value))
                        }
                    >
                        <TabsList aria-label="Trend duration">
                            <TabsTrigger value="3">
                                3M
                            </TabsTrigger>

                            <TabsTrigger value="6">
                                6M
                            </TabsTrigger>

                            <TabsTrigger value="12">
                                12M
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>

            <CardContent>
                {isError ? (
                    <SectionError
                        message={getApiErrorMessage(error)}
                        onRetry={onRetry}
                    />
                ) : isLoading || !data ? (
                    <ChartSkeleton />
                ) : !hasActivity ? (
                    <EmptyState
                        icon={BarChart3}
                        title="No financial activity"
                        description="Record income and expenses to start tracking your monthly financial trends."
                    />
                ) : (
                    <div className="h-75 min-w-0 sm:h-85">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 8,
                                    left: 0,
                                    bottom: 5,
                                }}
                                barGap={4}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    stroke="var(--border)"
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{
                                        fontSize: 11,
                                        fill:
                                            "var(--muted-foreground)",
                                    }}
                                    minTickGap={12}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    width={65}
                                    tick={{
                                        fontSize: 11,
                                        fill:
                                            "var(--muted-foreground)",
                                    }}
                                    tickFormatter={(value) =>
                                        formatCompactCurrency(
                                            Number(value)
                                        )
                                    }
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "var(--muted)",
                                        opacity: 0.4,
                                    }}
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
                                    labelStyle={{
                                        color:
                                            "var(--popover-foreground)",
                                    }}
                                />

                                <Legend
                                    wrapperStyle={{
                                        fontSize: 12,
                                        paddingTop: 12,
                                    }}
                                />

                                <Bar
                                    dataKey="income"
                                    name="Income"
                                    fill={INCOME_COLOR}
                                    radius={[5, 5, 0, 0]}
                                    maxBarSize={36}
                                />

                                <Bar
                                    dataKey="expenses"
                                    name="Expenses"
                                    fill={EXPENSE_COLOR}
                                    radius={[5, 5, 0, 0]}
                                    maxBarSize={36}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
