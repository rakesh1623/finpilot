import type { Metadata } from "next";

import {
    FeaturePlaceholder,
} from "@/components/shared/feature-placeholder";

export const metadata: Metadata = {
    title: "AI Copilot",
};

export default function CopilotPage() {
    return (
        <FeaturePlaceholder href="/copilot" />
    );
}