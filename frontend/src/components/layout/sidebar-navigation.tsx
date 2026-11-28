
"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    navigationGroups,
    isActiveRoute,
} from "@/lib/navigation";

import { cn } from "@/lib/utils";

interface SidebarNavigationProps {
    collapsed?: boolean;
    onNavigate?: () => void;
}

export function SidebarNavigation({
    collapsed = false,
    onNavigate,
}: SidebarNavigationProps) {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Main navigation"
            className="space-y-6"
        >
            {navigationGroups.map((group) => (
                <div
                    key={group.title}
                    className="space-y-1"
                >
                    {!collapsed && (
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {group.title}
                        </p>
                    )}

                    {collapsed && (
                        <div className="mx-2 mb-3 border-t" />
                    )}

                    {group.items.map((item) => {
                        const Icon = item.icon;

                        const active = isActiveRoute(
                            pathname,
                            item.href
                        );

                        const link = (
                            <Link
                                href={item.href}
                                onClick={onNavigate}
                                aria-label={item.title}
                                aria-current={
                                    active ? "page" : undefined
                                }
                                className={cn(
                                    "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                                    collapsed &&
                                    "justify-center px-0",
                                    active
                                        ? "bg-teal-500/10 text-teal-700 dark:text-teal-400"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <Icon className="size-5 shrink-0" />

                                {!collapsed && (
                                    <span className="truncate">
                                        {item.title}
                                    </span>
                                )}
                            </Link>
                        );

                        if (collapsed) {
                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>
                                        {link}
                                    </TooltipTrigger>

                                    <TooltipContent
                                        side="right"
                                        sideOffset={10}
                                    >
                                        {item.title}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return (
                            <div key={item.href}>
                                {link}
                            </div>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}
