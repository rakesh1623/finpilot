
"use client";

import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { Provider } from "react-redux";

import {
    setupListeners,
} from "@reduxjs/toolkit/query";

import { ThemeProvider } from "next-themes";

import { Toaster } from "sonner";

import {
    makeStore,
} from "@/store/store";
import AuthProvider from "./auth-provider";
import { TooltipProvider } from "../ui/tooltip";

interface AppProviderProps {
    children: ReactNode;
}

export default function AppProvider({
    children,
}: AppProviderProps) {
    const [store] = useState(makeStore);

    useEffect(() => {
        const cleanup = setupListeners(
            store.dispatch
        );

        return cleanup;
    }, [store]);

    return (
        <Provider store={store}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <TooltipProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>

                    <Toaster
                        position="top-right"
                        richColors
                        closeButton
                    />
                </TooltipProvider>
            </ThemeProvider>
        </Provider>
    );
}
