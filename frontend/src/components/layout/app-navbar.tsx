
"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
    PanelLeftClose,
    PanelLeftOpen,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    getCurrentNavigation,
} from "@/lib/navigation";

import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

interface AppNavbarProps {
    collapsed: boolean;
    onToggleSidebar: () => void;
}

export function AppNavbar({
    collapsed,
    onToggleSidebar,
}: AppNavbarProps) {
    const pathname = usePathname();

    const currentPage =
        getCurrentNavigation(pathname);

    const pageTitle =
        currentPage?.title ?? "Workspace";

    const toggleLabel = collapsed
        ? "Expand sidebar"
        : "Collapse sidebar";

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background/95 px-3 backdrop-blur-sm sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
                <MobileSidebar />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:inline-flex"
                            onClick={onToggleSidebar}
                            aria-label={toggleLabel}
                            aria-expanded={!collapsed}
                            aria-controls="desktop-sidebar"
                        >
                            {collapsed ? (
                                <PanelLeftOpen className="size-5" />
                            ) : (
                                <PanelLeftClose className="size-5" />
                            )}
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent side="bottom">
                        {toggleLabel}
                    </TooltipContent>
                </Tooltip>

                <div className="hidden h-5 w-px bg-border lg:block" />

                <nav
                    aria-label="Breadcrumb"
                    className="flex min-w-0 items-center gap-2 text-sm"
                >
                    <Link
                        href="/dashboard"
                        className="hidden text-muted-foreground hover:text-foreground md:inline"
                    >
                        Workspace
                    </Link>

                    <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground md:block" />

                    <span
                        aria-current="page"
                        className="truncate font-medium"
                    >
                        {pageTitle}
                    </span>
                </nav>
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                <ThemeToggle />

                <div className="h-7 w-px bg-border" />

                <UserMenu />
            </div>
        </header>
    );
}
