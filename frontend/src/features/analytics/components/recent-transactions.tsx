
"use client";

import Link from "next/link";

import {
    ArrowDownLeft,
    ArrowUpRight,
    ArrowLeftRight,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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
    formatTransactionDate,
} from "@/lib/formatters";

import {
    getApiErrorMessage,
} from "@/lib/api-error";

import { cn } from "@/lib/utils";

import type {
    RecentTransaction,
} from "../analytics.types";

interface RecentTransactionsProps {
    data?: RecentTransaction[];
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
    onRetry: () => void;
}

export function RecentTransactions({
    data,
    isLoading,
    isError,
    error,
    onRetry,
}: RecentTransactionsProps) {
    return (
        <Card className="min-w-0">
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                        <CardTitle>
                            Recent transactions
                        </CardTitle>

                        <CardDescription>
                            Your latest financial activity
                            across all dates
                        </CardDescription>
                    </div>

                    <Link
                        href="/transactions"
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
                    <div className="space-y-5">
                        {Array.from({ length: 5 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <Skeleton className="size-10 shrink-0 rounded-xl" />

                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32 max-w-full" />

                                        <Skeleton className="h-3 w-20" />
                                    </div>

                                    <Skeleton className="h-4 w-20" />
                                </div>
                            )
                        )}
                    </div>
                ) : data.length === 0 ? (
                    <EmptyState
                        icon={ArrowLeftRight}
                        title="No transactions yet"
                        description="Add your first income or expense to start building your financial history."
                        action={
                            <Link
                                href="/transactions"
                                className="text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
                            >
                                Go to transactions
                            </Link>
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Transaction
                                    </TableHead>

                                    <TableHead className="hidden md:table-cell">
                                        Category
                                    </TableHead>

                                    <TableHead className="hidden sm:table-cell">
                                        Date
                                    </TableHead>

                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {data.map((transaction) => {
                                    const isIncome =
                                        transaction.type ===
                                        "INCOME";

                                    const Icon = isIncome
                                        ? ArrowDownLeft
                                        : ArrowUpRight;

                                    return (
                                        <TableRow
                                            key={transaction.id}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "flex size-10 shrink-0 items-center justify-center rounded-xl",
                                                            isIncome
                                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                                : "bg-muted text-muted-foreground"
                                                        )}
                                                    >
                                                        <Icon className="size-5" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="max-w-35 truncate text-sm font-medium sm:max-w-60">
                                                            {transaction.description}
                                                        </p>

                                                        <p className="max-w-35 truncate text-xs text-muted-foreground sm:max-w-60">
                                                            {transaction.merchant ??
                                                                transaction.category?.name ??
                                                                "Uncategorized"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-muted-foreground sm:hidden">
                                                            {formatTransactionDate(
                                                                transaction.transactionDate
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                                                {transaction.category?.name ??
                                                    "Uncategorized"}
                                            </TableCell>

                                            <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                                                {formatTransactionDate(
                                                    transaction.transactionDate
                                                )}
                                            </TableCell>

                                            <TableCell
                                                className={cn(
                                                    "whitespace-nowrap text-right text-sm font-semibold tabular-nums",
                                                    isIncome &&
                                                    "text-emerald-600 dark:text-emerald-400"
                                                )}
                                            >
                                                {isIncome ? "+" : "−"}

                                                {formatCurrency(
                                                    transaction.amount,
                                                    transaction.currency
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
