import type { Metadata } from "next";

import {
    FeaturePlaceholder,
} from "@/components/shared/feature-placeholder";

export const metadata: Metadata = {
    title: "Categories",
};

export default function CategoriesPage() {
    return (
        <FeaturePlaceholder href="/categories" />
    );
}