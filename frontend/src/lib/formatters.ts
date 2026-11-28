
import { format, isValid } from "date-fns";

export function formatCurrency(
    amount: number | string,
    currency = "INR"
): string {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
        return "—";
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatPercentage(
    value: number | string
): string {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    return `${number.toFixed(2)}%`;
}

export function formatDate(
    date: string | Date,
    pattern = "dd MMM yyyy"
): string {
    const value = new Date(date);

    if (!isValid(value)) {
        return "Invalid date";
    }

    return format(value, pattern);
}

export function formatTransactionDate(
    date: string
): string {
    const value = new Date(date);

    if (!isValid(value)) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(value);
}

export function formatCompactCurrency(
    amount: number | string
): string {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
        return "—";
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}
