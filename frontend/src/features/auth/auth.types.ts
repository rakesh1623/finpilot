
export interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
}

export type AuthStatus =
    | "checking"
    | "authenticated"
    | "unauthenticated"
    | "error";

export interface AuthState {
    user: User | null;
    status: AuthStatus;
    isAuthenticated: boolean;
}
