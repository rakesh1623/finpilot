
import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";

import type {
    AuthState,
    User,
} from "./auth.types";

const initialState: AuthState = {
    user: null,
    status: "checking",
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<User>
        ) => {
            state.user = action.payload;
            state.status = "authenticated";
            state.isAuthenticated = true;
        },

        setChecking: (state) => {
            state.status = "checking";
            state.isAuthenticated = false;
        },

        setSessionError: (state) => {
            state.user = null;
            state.status = "error";
            state.isAuthenticated = false;
        },

        logout: (state) => {
            state.user = null;
            state.status = "unauthenticated";
            state.isAuthenticated = false;
        },
    },
});

export const {
    setCredentials,
    setChecking,
    setSessionError,
    logout,
} = authSlice.actions;

export default authSlice.reducer;
