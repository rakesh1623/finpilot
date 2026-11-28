import type { Metadata } from "next";

import {
    FeaturePlaceholder,
} from "@/components/shared/feature-placeholder";

export const metadata: Metadata = {
    title: "Transactions",
};

export default function TransactionsPage() {
    return (
        <FeaturePlaceholder href="/transactions" />
    );
}