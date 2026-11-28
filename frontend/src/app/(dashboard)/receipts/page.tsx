import type { Metadata } from "next";

import {
    FeaturePlaceholder,
} from "@/components/shared/feature-placeholder";

export const metadata: Metadata = {
    title: "Receipts",
};

export default function ReceiptsPage() {
    return (
        <FeaturePlaceholder href="/receipts" />
    );
}