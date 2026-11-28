
"use client";

import { CalendarDays } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { MONTHS } from "@/lib/constants";

import {
    getYearOptions,
} from "../analytics.utils";

import type {
    AnalyticsPeriod,
} from "../analytics.types";

interface DashboardFiltersProps {
    period: AnalyticsPeriod;
    onChange: (
        period: AnalyticsPeriod
    ) => void;
}

export function DashboardFilters({
    period,
    onChange,
}: DashboardFiltersProps) {
    const years = getYearOptions();

    return (
        <div className="flex flex-wrap items-center gap-2">
            <CalendarDays className="hidden size-4 text-muted-foreground sm:block" />

            <Select
                value={String(period.month)}
                onValueChange={(value) =>
                    onChange({
                        ...period,
                        month: Number(value),
                    })
                }
            >
                <SelectTrigger
                    aria-label="Select month"
                    className="w-35"
                >
                    <SelectValue placeholder="Month" />
                </SelectTrigger>

                <SelectContent>
                    {MONTHS.map((month, index) => (
                        <SelectItem
                            key={month}
                            value={String(index + 1)}
                        >
                            {month}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={String(period.year)}
                onValueChange={(value) =>
                    onChange({
                        ...period,
                        year: Number(value),
                    })
                }
            >
                <SelectTrigger
                    aria-label="Select year"
                    className="w-25"
                >
                    <SelectValue placeholder="Year" />
                </SelectTrigger>

                <SelectContent>
                    {years.map((year) => (
                        <SelectItem
                            key={year}
                            value={String(year)}
                        >
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
