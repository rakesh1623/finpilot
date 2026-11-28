
"use client";

import { useState } from "react";

import {
    RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    PageHeader,
} from "@/components/shared/page-header";

import {
    useAppSelector,
} from "@/store/hooks";

import {
    useGetFinancialOverviewQuery,
    useGetCategoryAnalyticsQuery,
    useGetMonthlyTrendsQuery,
    useGetBudgetAnalyticsQuery,
    useGetRecentTransactionsQuery,
} from "../analyticsApi";

import {
    getCurrentPeriod,
    getPeriodLabel,
} from "../analytics.utils";

import type {
    AnalyticsPeriod,
} from "../analytics.types";

import {
    DashboardFilters,
} from "./dashboard-filters";

import {
    FinancialSummary,
} from "./financial-summary";

import {
    SpendingBreakdown,
} from "./spending-breakdown";

import {
    MonthlyTrends,
} from "./monthly-trends";

import {
    BudgetUtilization,
} from "./budget-utilization";

import {
    RecentTransactions,
} from "./recent-transactions";

const QUERY_OPTIONS = {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 60,
};

export function FinancialDashboard() {
    const user = useAppSelector(
        (state) => state.auth.user
    );

    const [period, setPeriod] =
        useState<AnalyticsPeriod>(
            getCurrentPeriod
        );

    const [trendMonths, setTrendMonths] =
        useState(6);

    const overviewQuery =
        useGetFinancialOverviewQuery(
            period,
            QUERY_OPTIONS
        );

    const categoriesQuery =
        useGetCategoryAnalyticsQuery(
            period,
            QUERY_OPTIONS
        );

    const trendsQuery =
        useGetMonthlyTrendsQuery(
            {
                months: trendMonths,
            },
            QUERY_OPTIONS
        );

    const budgetsQuery =
        useGetBudgetAnalyticsQuery(
            period,
            QUERY_OPTIONS
        );

    const recentQuery =
        useGetRecentTransactionsQuery(
            {
                limit: 5,
            },
            QUERY_OPTIONS
        );

    const isRefreshing =
        overviewQuery.isFetching ||
        categoriesQuery.isFetching ||
        trendsQuery.isFetching ||
        budgetsQuery.isFetching ||
        recentQuery.isFetching;

    const firstName =
        user?.name.trim().split(/\s+/)[0] ??
        "there";

    const periodLabel =
        getPeriodLabel(period);

    function refreshDashboard() {
        void Promise.allSettled([
            overviewQuery.refetch(),
            categoriesQuery.refetch(),
            trendsQuery.refetch(),
            budgetsQuery.refetch(),
            recentQuery.refetch(),
        ]);
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description={`Welcome back, ${firstName}. Here's your financial overview.`}
                actions={
                    <>
                        <DashboardFilters
                            period={period}
                            onChange={setPeriod}
                        />

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={isRefreshing}
                            onClick={refreshDashboard}
                            aria-label="Refresh dashboard"
                            title="Refresh dashboard"
                        >
                            <RefreshCw
                                className={
                                    isRefreshing
                                        ? "size-4 animate-spin"
                                        : "size-4"
                                }
                            />
                        </Button>
                    </>
                }
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                    Financial summary — {periodLabel}
                </p>

                <p className="text-xs text-muted-foreground">
                    Analytics currency: INR
                </p>
            </div>

            <FinancialSummary
                period={period}
                data={
                    overviewQuery.currentData?.data
                }
                isLoading={
                    overviewQuery.isFetching &&
                    !overviewQuery.currentData
                }
                isError={overviewQuery.isError}
                error={overviewQuery.error}
                onRetry={() =>
                    void overviewQuery.refetch()
                }
            />

            <MonthlyTrends
                data={
                    trendsQuery.currentData?.data
                }
                months={trendMonths}
                onMonthsChange={setTrendMonths}
                isLoading={
                    trendsQuery.isFetching &&
                    !trendsQuery.currentData
                }
                isError={trendsQuery.isError}
                error={trendsQuery.error}
                onRetry={() =>
                    void trendsQuery.refetch()
                }
            />

            <div className="grid min-w-0 gap-6 xl:grid-cols-2">
                <SpendingBreakdown
                    data={
                        categoriesQuery.currentData?.data
                    }
                    isLoading={
                        categoriesQuery.isFetching &&
                        !categoriesQuery.currentData
                    }
                    isError={categoriesQuery.isError}
                    error={categoriesQuery.error}
                    onRetry={() =>
                        void categoriesQuery.refetch()
                    }
                />

                <BudgetUtilization
                    data={
                        budgetsQuery.currentData?.data
                    }
                    isLoading={
                        budgetsQuery.isFetching &&
                        !budgetsQuery.currentData
                    }
                    isError={budgetsQuery.isError}
                    error={budgetsQuery.error}
                    onRetry={() =>
                        void budgetsQuery.refetch()
                    }
                />
            </div>

            <RecentTransactions
                data={recentQuery.currentData?.data.transactions}
                isLoading={
                    recentQuery.isFetching &&
                    !recentQuery.currentData
                }
                isError={recentQuery.isError}
                error={recentQuery.error}
                onRetry={() =>
                    void recentQuery.refetch()
                }
            />

            <p className="text-center text-xs text-muted-foreground">
                Financial analytics are based on your
                recorded INR transactions. Recent
                activity includes all recorded
                currencies.
            </p>
        </div>
    );
}
