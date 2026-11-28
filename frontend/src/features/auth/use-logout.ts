
"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
    useLogoutMutation,
} from "./authApi";

import { logout } from "./authSlice";

import {
    useAppDispatch,
} from "@/store/hooks";

import {
    baseApi,
} from "@/store/api/baseApi";

import {
    getApiErrorMessage,
} from "@/lib/api-error";

export function useLogout() {
    const router = useRouter();

    const dispatch = useAppDispatch();

    const [logoutUser, { isLoading }] =
        useLogoutMutation();

    async function signOut() {
        if (isLoading) return;

        try {
            await logoutUser().unwrap();

            dispatch(logout());

            dispatch(
                baseApi.util.resetApiState()
            );

            toast.success(
                "Logged out successfully"
            );

            router.replace("/login");
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Logout failed. Please try again."
                )
            );
        }
    }

    return {
        signOut,
        isLoggingOut: isLoading,
    };
}
