import type { Metadata } from "next";

import {
    FeaturePlaceholder,
} from "@/components/shared/feature-placeholder";

export const metadata: Metadata = {
    title: "Budgets",
};

export default function BudgetsPage() {
    return (
        <FeaturePlaceholder href="/budgets" />
    );
}