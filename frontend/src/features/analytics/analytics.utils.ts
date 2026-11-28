
import type {
    AnalyticsPeriod,
    BudgetStatus,
} from "./analytics.types";

export const CHART_COLORS = [
    "#14b8a6",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
    "#94a3b8",
];

export const INCOME_COLOR = "#14b8a6";

export const EXPENSE_COLOR = "#f59e0b";

export function getCurrentPeriod():
    AnalyticsPeriod {
    const now = new Date();

    return {
        month: now.getUTCMonth() + 1,
        year: now.getUTCFullYear(),
    };
}

export function getPeriodLabel(
    period: AnalyticsPeriod
): string {
    const date = new Date(
        Date.UTC(
            period.year,
            period.month - 1,
            1
        )
    );

    return new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export function getYearOptions(): number[] {
    const currentYear =
        new Date().getUTCFullYear();

    return Array.from(
        { length: currentYear - 1999 },
        (_, index) => currentYear - index
    );
}

export function getBudgetStatusLabel(
    status: BudgetStatus
): string {
    switch (status) {
        case "ON_TRACK":
            return "On track";

        case "WARNING":
            return "Near limit";

        case "EXCEEDED":
            return "Exceeded";
    }
}

export function getBudgetStatusColor(
    status: BudgetStatus
): string {
    switch (status) {
        case "ON_TRACK":
            return "text-emerald-600 dark:text-emerald-400";

        case "WARNING":
            return "text-amber-600 dark:text-amber-400";

        case "EXCEEDED":
            return "text-red-600 dark:text-red-400";
    }
}

export function getBudgetProgressColor(
    status: BudgetStatus
): string {
    switch (status) {
        case "ON_TRACK":
            return "bg-teal-500";

        case "WARNING":
            return "bg-amber-500";

        case "EXCEEDED":
            return "bg-red-500";
    }
}

export function clampPercentage(
    value: number
): number {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, value)
    );
}
