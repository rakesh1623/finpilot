
"use client";

import { useTheme } from "next-themes";

import {
    UserRound,
    Palette,
    Sun,
    Moon,
    Monitor,
    ShieldCheck,
    Check,
} from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
    PageHeader,
} from "@/components/shared/page-header";

import {
    LogoutButton,
} from "@/features/auth/components/logout-button";

import {
    useAppSelector,
} from "@/store/hooks";

import { useMounted } from "@/hooks/use-mounted";

import { formatDate } from "@/lib/formatters";

import { cn } from "@/lib/utils";

const themes = [
    {
        value: "light",
        label: "Light",
        icon: Sun,
    },
    {
        value: "dark",
        label: "Dark",
        icon: Moon,
    },
    {
        value: "system",
        label: "System",
        icon: Monitor,
    },
] as const;

export default function SettingsPage() {
    const user = useAppSelector(
        (state) => state.auth.user
    );

    const mounted = useMounted();

    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                description="Manage your account and application preferences"
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserRound className="size-5 text-teal-500" />
                        Account information
                    </CardTitle>

                    <CardDescription>
                        Your registered FinPilot account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <dl className="grid gap-6 sm:grid-cols-2">
                        <div className="min-w-0 space-y-1">
                            <dt className="text-sm text-muted-foreground">
                                Full name
                            </dt>

                            <dd className="break-words font-medium">
                                {user?.name ?? "—"}
                            </dd>
                        </div>

                        <div className="min-w-0 space-y-1">
                            <dt className="text-sm text-muted-foreground">
                                Email address
                            </dt>

                            <dd className="break-all font-medium">
                                {user?.email ?? "—"}
                            </dd>
                        </div>

                        <div className="space-y-1">
                            <dt className="text-sm text-muted-foreground">
                                Member since
                            </dt>

                            <dd className="font-medium">
                                {user?.createdAt
                                    ? formatDate(user.createdAt)
                                    : "—"}
                            </dd>
                        </div>

                        <div className="space-y-1">
                            <dt className="text-sm text-muted-foreground">
                                Account type
                            </dt>

                            <dd>
                                <Badge variant="secondary">
                                    Personal
                                </Badge>
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="size-5 text-teal-500" />
                        Appearance
                    </CardTitle>

                    <CardDescription>
                        Choose your preferred application theme
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {themes.map((option) => {
                            const Icon = option.icon;

                            const selected =
                                mounted && theme === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    disabled={!mounted}
                                    aria-pressed={selected}
                                    onClick={() =>
                                        setTheme(option.value)
                                    }
                                    className={cn(
                                        "relative flex flex-col items-center gap-3 rounded-xl border p-5 transition-colors",
                                        selected
                                            ? "border-teal-500 bg-teal-500/5"
                                            : "hover:bg-accent"
                                    )}
                                >
                                    {selected && (
                                        <Check className="absolute right-3 top-3 size-4 text-teal-500" />
                                    )}

                                    <Icon className="size-6" />

                                    <span className="text-sm font-medium">
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="size-5 text-teal-500" />
                        Session
                    </CardTitle>

                    <CardDescription>
                        Manage your current browser session
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium">
                            Sign out of FinPilot
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            End your current browser session.
                        </p>
                    </div>

                    <LogoutButton />
                </CardContent>
            </Card>
        </div>
    );
}
