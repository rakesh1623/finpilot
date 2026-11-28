
"use client";

import { ShieldCheck } from "lucide-react";

import { AppLogo } from "./app-logo";

import {
    SidebarNavigation,
} from "./sidebar-navigation";

import { cn } from "@/lib/utils";

interface DesktopSidebarProps {
    collapsed: boolean;
}

export function DesktopSidebar({
    collapsed,
}: DesktopSidebarProps) {
    return (
        <aside
            id="desktop-sidebar"
            className={cn(
                "sticky top-0 hidden h-dvh shrink-0 flex-col border-r bg-card transition-[width] duration-300 motion-reduce:transition-none lg:flex",
                collapsed ? "w-19" : "w-65"
            )}
        >
            <div
                className={cn(
                    "flex h-16 shrink-0 items-center border-b",
                    collapsed
                        ? "justify-center px-2"
                        : "px-5"
                )}
            >
                <AppLogo collapsed={collapsed} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
                <SidebarNavigation
                    collapsed={collapsed}
                />
            </div>

            <div className="shrink-0 border-t p-3">
                {collapsed ? (
                    <div
                        className="flex justify-center py-2"
                        aria-label="Personal financial workspace"
                    >
                        <ShieldCheck className="size-5 text-teal-500" />
                    </div>
                ) : (
                    <div className="rounded-xl bg-muted/50 p-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-teal-500" />

                            <p className="text-xs font-medium">
                                Personal workspace
                            </p>
                        </div>

                        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                            Your financial journey, organized
                            in one place.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}
