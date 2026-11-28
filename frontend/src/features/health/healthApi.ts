
import { baseApi } from "@/store/api/baseApi";

interface HealthResponse {
    success: boolean;
    message: string;
    timestamp: string;
}

export const healthApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHealth: builder.query<
            HealthResponse,
            void
        >({
            query: () => "/health",
        }),
    }),
});

export const {
    useGetHealthQuery,
} = healthApi;
