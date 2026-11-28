
"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import {
  useAppSelector,
} from "@/store/hooks";

import {
  FullPageLoader,
} from "@/components/shared/full-page-loader";

export default function HomePage() {
  const router = useRouter();

  const status = useAppSelector(
    (state) => state.auth.status
  );

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }

    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  return (
    <FullPageLoader
      message="Opening FinPilot..."
    />
  );
}
