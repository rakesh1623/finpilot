import type { Metadata } from "next";

import {
    FeaturePlaceholder,
} from "@/components/shared/feature-placeholder";

export const metadata: Metadata = {
    title: "Imports",
};

export default function ImportsPage() {
    return (
        <FeaturePlaceholder href="/imports" />
    );
}