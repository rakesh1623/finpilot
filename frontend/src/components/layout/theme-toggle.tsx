
"use client";

import { useTheme } from "next-themes";

import {
    Sun,
    Moon,
    Monitor,
    Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMounted } from "@/hooks/use-mounted";

const themeOptions = [
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

export function ThemeToggle() {
    const mounted = useMounted();

    const {
        theme,
        resolvedTheme,
        setTheme,
    } = useTheme();

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                disabled
                aria-label="Loading theme"
            >
                <Sun className="size-5" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Change application theme"
                >
                    {resolvedTheme === "dark" ? (
                        <Moon className="size-5" />
                    ) : (
                        <Sun className="size-5" />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-40"
            >
                <DropdownMenuLabel>
                    Appearance
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {themeOptions.map((option) => {
                    const Icon = option.icon;

                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onSelect={() =>
                                setTheme(option.value)
                            }
                        >
                            <Icon className="mr-2 size-4" />

                            {option.label}

                            {theme === option.value && (
                                <Check className="ml-auto size-4 text-teal-500" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
