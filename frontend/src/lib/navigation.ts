
import {
    LayoutDashboard,
    ArrowLeftRight,
    Tags,
    Wallet,
    FileSpreadsheet,
    ScanLine,
    Sparkles,
    Settings,
    type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
    title: string;
    href: string;
    icon: LucideIcon;
    description: string;
}

export interface NavigationGroup {
    title: string;
    items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
    {
        title: "Workspace",
        items: [
            {
                title: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
                description: "Your personal financial overview",
            },
            {
                title: "Transactions",
                href: "/transactions",
                icon: ArrowLeftRight,
                description: "Manage your income and expenses",
            },
            {
                title: "Categories",
                href: "/categories",
                icon: Tags,
                description: "Organize your financial transactions",
            },
            {
                title: "Budgets",
                href: "/budgets",
                icon: Wallet,
                description: "Set spending limits and track budgets",
            },
        ],
    },
    {
        title: "Data Management",
        items: [
            {
                title: "Imports",
                href: "/imports",
                icon: FileSpreadsheet,
                description: "Import transactions from CSV and Excel",
            },
            {
                title: "Receipts",
                href: "/receipts",
                icon: ScanLine,
                description: "Scan receipts and extract transactions",
            },
        ],
    },
    {
        title: "Intelligence",
        items: [
            {
                title: "AI Copilot",
                href: "/copilot",
                icon: Sparkles,
                description: "Explore your finances with AI",
            },
        ],
    },
    {
        title: "Preferences",
        items: [
            {
                title: "Settings",
                href: "/settings",
                icon: Settings,
                description: "Manage your account and preferences",
            },
        ],
    },
];

export const navigationItems =
    navigationGroups.flatMap((group) => group.items);

export function isActiveRoute(
    pathname: string,
    href: string
): boolean {
    return (
        pathname === href ||
        pathname.startsWith(`${href}/`)
    );
}

export function getCurrentNavigation(
    pathname: string
) {
    return navigationItems.find((item) =>
        isActiveRoute(pathname, item.href)
    );
}
