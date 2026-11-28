
"use client";

import {
    useEffect,
    type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import {
    Wallet,
    Sparkles,
    ShieldCheck,
    ChartNoAxesCombined,
} from "lucide-react";

import {
    useAppSelector,
} from "@/store/hooks";

import {
    FullPageLoader,
} from "@/components/shared/full-page-loader";

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    const router = useRouter();

    const status = useAppSelector(
        (state) => state.auth.status
    );

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    if (status !== "unauthenticated") {
        return <FullPageLoader />;
    }

    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />

                <div className="relative flex items-center gap-3">
                    <div className="rounded-xl bg-teal-600 p-3">
                        <Wallet className="h-6 w-6" />
                    </div>

                    <span className="text-xl font-semibold">
                        FinPilot AI
                    </span>
                </div>

                <div className="relative max-w-lg">
                    <p className="mb-4 text-sm font-medium text-teal-400">
                        YOUR INTELLIGENT FINANCIAL COMPANION
                    </p>

                    <h1 className="text-5xl font-bold leading-tight tracking-tight">
                        Make smarter financial decisions.
                    </h1>

                    <p className="mt-6 text-lg leading-relaxed text-slate-400">
                        Understand your spending, manage
                        your budgets and discover financial
                        insights with your personal AI copilot.
                    </p>

                    <div className="mt-10 space-y-5">
                        <div className="flex items-center gap-3">
                            <ChartNoAxesCombined className="h-5 w-5 text-teal-400" />
                            Intelligent financial analytics
                        </div>

                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-teal-400" />
                            AI-powered financial insights
                        </div>

                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-teal-400" />
                            Private, user-specific financial data
                        </div>
                    </div>
                </div>

                <p className="relative text-sm text-slate-500">
                    FinPilot AI — Personal finance intelligence
                </p>
            </section>

            <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10">
                <div className="flex items-center gap-3 lg:hidden">
                    <div className="rounded-xl bg-teal-600 p-2.5 text-white">
                        <Wallet className="h-5 w-5" />
                    </div>

                    <span className="text-xl font-semibold">
                        FinPilot AI
                    </span>
                </div>

                {children}
            </section>
        </main>
    );
}
