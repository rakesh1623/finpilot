
import type { Metadata } from "next";

import {
    FinancialDashboard,
} from "@/features/analytics/components/financial-dashboard";

export const metadata: Metadata = {
    title: "Dashboard",
};

export default function DashboardPage() {
    return <FinancialDashboard />;
}
