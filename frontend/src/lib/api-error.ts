
export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong"
): string {
    if (
        typeof error !== "object" ||
        error === null
    ) {
        return fallback;
    }

    if ("status" in error) {
        if (error.status === "FETCH_ERROR") {
            return "Unable to connect to the server. Please try again.";
        }

        if (error.status === "TIMEOUT_ERROR") {
            return "The request timed out. Please try again.";
        }
    }

    if ("data" in error) {
        const data = error.data;

        if (
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof data.message === "string"
        ) {
            return data.message;
        }
    }

    return fallback;
}
