
import {
    baseApi,
} from "@/store/api/baseApi";

import type {
    ApiResponse,
} from "@/types/api.types";

import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
} from "./auth.types";

export const authApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({
            login: builder.mutation<
                ApiResponse<AuthResponse>,
                LoginRequest
            >({
                query: (credentials) => ({
                    url: "/auth/login",
                    method: "POST",
                    body: credentials,
                }),
            }),

            register: builder.mutation<
                ApiResponse<AuthResponse>,
                RegisterRequest
            >({
                query: (credentials) => ({
                    url: "/auth/register",
                    method: "POST",
                    body: credentials,
                }),
            }),

            getMe: builder.query<
                ApiResponse<AuthResponse>,
                void
            >({
                query: () => "/auth/me",

                providesTags: ["Auth"],

                keepUnusedDataFor: 0,
            }),

            logout: builder.mutation<
                { success: boolean; message: string },
                void
            >({
                query: () => ({
                    url: "/auth/logout",
                    method: "POST",
                }),
            }),
        }),
    });

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetMeQuery,
    useLazyGetMeQuery,
    useLogoutMutation,
} = authApi;
