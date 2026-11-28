
import { Loader2 } from "lucide-react";

interface FullPageLoaderProps {
    message?: string;
}

export function FullPageLoader({
    message = "Loading FinPilot...",
}: FullPageLoaderProps) {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background"
            role="status"
            aria-live="polite"
        >
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />

            <p className="text-sm text-muted-foreground">
                {message}
            </p>
        </div>
    );
}
