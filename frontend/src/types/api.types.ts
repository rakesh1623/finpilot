
export interface ApiResponse<T> {
    success: true;
    message?: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: {
        field: string;
        message: string;
    }[];
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export type TransactionType =
    | "INCOME"
    | "EXPENSE";

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    userId: string | null;
}
