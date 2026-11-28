
import Link from "next/link";

import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

interface AppLogoProps {
    collapsed?: boolean;
    className?: string;
    onClick?: () => void;
}

export function AppLogo({
    collapsed = false,
    className,
    onClick,
}: AppLogoProps) {
    return (
        <Link
            href="/dashboard"
            onClick={onClick}
            aria-label="FinPilot AI Dashboard"
            className={cn(
                "flex items-center gap-3",
                collapsed && "justify-center",
                className
            )}
        >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <Wallet className="size-5" />
            </div>

            {!collapsed && (
                <div className="min-w-0">
                    <p className="whitespace-nowrap text-lg font-bold tracking-tight">
                        FinPilot{" "}
                        <span className="text-teal-600 dark:text-teal-400">
                            AI
                        </span>
                    </p>

                    <p className="whitespace-nowrap text-[10px] text-muted-foreground">
                        Financial Intelligence
                    </p>
                </div>
            )}
        </Link>
    );
}
