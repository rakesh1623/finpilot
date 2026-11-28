
export const APP_NAME = "FinPilot AI";

export const DEFAULT_CURRENCY = "INR";

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_UPLOAD_SIZE =
    5 * 1024 * 1024;

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    TRANSACTIONS: "/transactions",
    CATEGORIES: "/categories",
    BUDGETS: "/budgets",
    IMPORTS: "/imports",
    RECEIPTS: "/receipts",
    COPILOT: "/copilot",
    SETTINGS: "/settings",
} as const;

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
] as const;
