
"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import {
  useAppSelector,
} from "@/store/hooks";

import {
  FullPageLoader,
} from "@/components/shared/full-page-loader";

import {
  AppShell,
} from "@/components/layout/app-shell";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const status = useAppSelector(
    (state) => state.auth.status
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <FullPageLoader
        message="Verifying access..."
      />
    );
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
