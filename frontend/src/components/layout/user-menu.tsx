
"use client";

import Link from "next/link";

import {
    ChevronDown,
    Settings,
    LogOut,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    useAppSelector,
} from "@/store/hooks";

import {
    useLogout,
} from "@/features/auth/use-logout";

function getInitials(name: string): string {
    return (
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "U"
    );
}

export function UserMenu() {
    const user = useAppSelector(
        (state) => state.auth.user
    );

    const {
        signOut,
        isLoggingOut,
    } = useLogout();

    if (!user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    disabled={isLoggingOut}
                    aria-label="Open user account menu"
                    className="h-auto gap-2 px-1.5 py-1 sm:px-2"
                >
                    <Avatar className="size-9">
                        <AvatarFallback className="bg-teal-500/15 text-xs font-semibold text-teal-700 dark:text-teal-400">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="hidden max-w-35 text-left sm:block">
                        <p className="truncate text-sm font-medium">
                            {user.name}
                        </p>

                        <p className="truncate text-[11px] text-muted-foreground">
                            Personal account
                        </p>
                    </div>

                    <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64"
            >
                <DropdownMenuLabel>
                    <div className="space-y-1">
                        <p className="truncate text-sm font-semibold">
                            {user.name}
                        </p>

                        <p className="truncate text-xs font-normal text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 size-4" />

                        Account settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={isLoggingOut}
                    onSelect={(event) => {
                        event.preventDefault();

                        void signOut();
                    }}
                    className="text-destructive focus:text-destructive"
                >
                    {isLoggingOut ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                        <LogOut className="mr-2 size-4" />
                    )}

                    {isLoggingOut
                        ? "Signing out..."
                        : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
