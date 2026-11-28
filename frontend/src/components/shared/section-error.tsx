
"use client";

import {
    AlertCircle,
    RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface SectionErrorProps {
    title?: string;
    message?: string;
    onRetry: () => void;
}

export function SectionError({
    title = "Unable to load data",
    message = "Please try again in a moment.",
    onRetry,
}: SectionErrorProps) {
    return (
        <div
            role="alert"
            className="flex min-h-45 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center"
        >
            <AlertCircle className="size-8 text-destructive" />

            <h3 className="text-sm font-semibold">
                {title}
            </h3>

            <p className="max-w-sm text-sm text-muted-foreground">
                {message}
            </p>

            <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
            >
                <RefreshCw className="size-4" />
                Retry
            </Button>
        </div>
    );
}
