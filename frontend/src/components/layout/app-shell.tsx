
"use client";

import type { ReactNode } from "react";

import {
    useSidebar,
} from "@/hooks/use-sidebar";

import {
    DesktopSidebar,
} from "./desktop-sidebar";

import { AppNavbar } from "./app-navbar";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({
    children,
}: AppShellProps) {
    const {
        collapsed,
        toggleSidebar,
    } = useSidebar();

    return (
        <div className="flex min-h-dvh bg-muted/30">
            <a
                href="#main-content"
                className="sr-only z-50 rounded-md bg-background p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                Skip to main content
            </a>

            <DesktopSidebar
                collapsed={collapsed}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <AppNavbar
                    collapsed={collapsed}
                    onToggleSidebar={toggleSidebar}
                />

                <main
                    id="main-content"
                    tabIndex={-1}
                    className="min-w-0 flex-1 p-4 outline-none sm:p-6 lg:p-8"
                >
                    <div className="mx-auto w-full max-w-[1600px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
