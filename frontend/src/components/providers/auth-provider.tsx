
"use client";

import {
    useEffect,
    useCallback,
    type ReactNode,
} from "react";

import {
    useLazyGetMeQuery,
} from "@/features/auth/authApi";

import {
    setCredentials,
    setChecking,
    setSessionError,
    logout,
} from "@/features/auth/authSlice";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    FullPageLoader,
} from "@/components/shared/full-page-loader";

import { Button } from "@/components/ui/button";

import {
    baseApi,
} from "@/store/api/baseApi";

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({
    children,
}: AuthProviderProps) {
    const dispatch = useAppDispatch();

    const status = useAppSelector(
        (state) => state.auth.status
    );

    const [getMe] = useLazyGetMeQuery();

    const restoreSession = useCallback(
        async () => {
            dispatch(setChecking());

            try {
                const response = await getMe(
                    undefined,
                    false
                ).unwrap();

                dispatch(
                    setCredentials(response.data.user)
                );
            } catch (error) {
                if (
                    typeof error === "object" &&
                    error !== null &&
                    "status" in error &&
                    error.status === 401
                ) {
                    dispatch(logout());

                    dispatch(
                        baseApi.util.resetApiState()
                    );
                } else {
                    dispatch(setSessionError());
                }
            }
        },
        [dispatch, getMe]
    );

    useEffect(() => {
        void restoreSession();
    }, [restoreSession]);

    if (status === "checking") {
        return (
            <FullPageLoader
                message="Checking your session..."
            />
        );
    }

    if (status === "error") {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
                <h1 className="text-xl font-semibold">
                    Unable to verify your session
                </h1>

                <p className="text-sm text-muted-foreground">
                    Please check your connection and try again.
                </p>

                <Button
                    onClick={() => void restoreSession()}
                >
                    Retry
                </Button>
            </main>
        );
    }

    return <>{children}</>;
}
