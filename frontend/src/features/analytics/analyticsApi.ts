
import {
    baseApi,
} from "@/store/api/baseApi";

import type {
    ApiResponse,
} from "@/types/api.types";

import type {
    AnalyticsPeriod,
    FinancialOverview,
    CategoryAnalytics,
    TrendsAnalytics,
    BudgetAnalytics,
    RecentTransactionsAnalytics,
    TrendsQuery,
    RecentTransactionsQuery,
} from "./analytics.types";

export const analyticsApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({
            getFinancialOverview: builder.query<
                ApiResponse<FinancialOverview>,
                AnalyticsPeriod
            >({
                query: (params) => ({
                    url: "/analytics/overview",
                    params,
                }),

                providesTags: ["Analytics"],
            }),

            getCategoryAnalytics: builder.query<
                ApiResponse<CategoryAnalytics>,
                AnalyticsPeriod
            >({
                query: (params) => ({
                    url: "/analytics/categories",
                    params,
                }),

                providesTags: ["Analytics"],
            }),

            getMonthlyTrends: builder.query<
                ApiResponse<TrendsAnalytics>,
                TrendsQuery
            >({
                query: (params) => ({
                    url: "/analytics/trends",
                    params,
                }),

                providesTags: ["Analytics"],
            }),

            getBudgetAnalytics: builder.query<
                ApiResponse<BudgetAnalytics>,
                AnalyticsPeriod
            >({
                query: (params) => ({
                    url: "/analytics/budgets",
                    params,
                }),

                providesTags: [
                    "Analytics",
                    "Budget",
                ],
            }),

            getRecentTransactions: builder.query<
                ApiResponse<RecentTransactionsAnalytics>,
                RecentTransactionsQuery
            >({
                query: (params) => ({
                    url: "/analytics/recent",
                    params,
                }),

                providesTags: [
                    "Analytics",
                    "Transaction",
                ],
            }),
        }),
    });

export const {
    useGetFinancialOverviewQuery,
    useGetCategoryAnalyticsQuery,
    useGetMonthlyTrendsQuery,
    useGetBudgetAnalyticsQuery,
    useGetRecentTransactionsQuery,
} = analyticsApi;
