
import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import type {
    AuthState,
} from "@/features/auth/auth.types";

import {
    logout,
} from "@/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl:
        process.env.NEXT_PUBLIC_API_URL ??
        "http://localhost:5000/api/v1",

    credentials: "include",

    prepareHeaders: (headers) => {
        headers.set("x-auth-mode", "cookie");

        return headers;
    },
});

const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(
        args,
        api,
        extraOptions
    );

    const excludedEndpoints = [
        "login",
        "register",
        "getMe",
        "logout",
    ];

    if (
        result.error?.status === 401 &&
        !excludedEndpoints.includes(api.endpoint)
    ) {
        const state = api.getState() as {
            auth: AuthState;
        };

        if (state.auth.isAuthenticated) {
            api.dispatch(logout());

            api.dispatch(
                baseApi.util.resetApiState()
            );
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",

    baseQuery: baseQueryWithAuth,

    tagTypes: [
        "Auth",
        "Transaction",
        "Category",
        "Budget",
        "Analytics",
        "Import",
        "Receipt",
        "Conversation",
    ],

    endpoints: () => ({}),
});
