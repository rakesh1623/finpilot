
import type { LucideIcon } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface SummaryCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    iconClassName?: string;
    valueClassName?: string;
}

export function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
    valueClassName,
}: SummaryCardProps) {
    return (
        <Card className="min-w-0 gap-3">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>

                <div
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        iconClassName
                    )}
                >
                    <Icon className="size-5" />
                </div>
            </CardHeader>

            <CardContent className="space-y-2">
                <p
                    className={cn(
                        "wrap-break-word text-2xl font-bold tracking-tight tabular-nums sm:text-3xl",
                        valueClassName
                    )}
                >
                    {value}
                </p>

                <p className="text-xs leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
