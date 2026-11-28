
import {
    navigationItems,
} from "@/lib/navigation";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
    PageHeader,
} from "./page-header";

interface FeaturePlaceholderProps {
    href: string;
}

export function FeaturePlaceholder({
    href,
}: FeaturePlaceholderProps) {
    const feature = navigationItems.find(
        (item) => item.href === href
    );

    if (!feature) {
        return null;
    }

    const Icon = feature.icon;

    return (
        <div className="space-y-6">
            <PageHeader
                title={feature.title}
                description={feature.description}
            />

            <Card>
                <CardContent className="flex min-h-95 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <Icon className="size-8" />
                    </div>

                    <Badge variant="secondary">
                        Coming soon
                    </Badge>

                    <h2 className="text-xl font-semibold">
                        {feature.title}
                    </h2>

                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                        {feature.description}. This workspace
                        will be implemented in an upcoming
                        development milestone.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
