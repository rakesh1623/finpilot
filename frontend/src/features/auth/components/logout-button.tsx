
"use client";

import {
    LogOut,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useLogout } from "../use-logout";

export function LogoutButton() {
    const {
        signOut,
        isLoggingOut,
    } = useLogout();

    return (
        <Button
            variant="outline"
            disabled={isLoggingOut}
            onClick={() => void signOut()}
        >
            {isLoggingOut ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <LogOut className="size-4" />
            )}

            {isLoggingOut
                ? "Signing out..."
                : "Sign out"}
        </Button>
    );
}
