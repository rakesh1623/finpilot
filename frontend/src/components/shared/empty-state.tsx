
import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex min-h-55 flex-col items-center justify-center gap-3 px-5 py-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                <Icon className="size-7 text-muted-foreground" />
            </div>

            <h3 className="text-sm font-semibold">
                {title}
            </h3>

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {description}
            </p>

            {action}
        </div>
    );
}
