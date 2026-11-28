
"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import {
    loginSchema,
    type LoginFormValues,
} from "../auth.schema";

import {
    useLoginMutation,
} from "../authApi";

import {
    setCredentials,
} from "../authSlice";

import {
    useAppDispatch,
} from "@/store/hooks";

import {
    baseApi,
} from "@/store/api/baseApi";

import {
    getApiErrorMessage,
} from "@/lib/api-error";

import {
    PasswordInput,
} from "./password-input";

export function LoginForm() {
    const router = useRouter();

    const dispatch = useAppDispatch();

    const [login, { isLoading }] =
        useLoginMutation();

    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),

        defaultValues: {
            email: "",
            password: "",
        },
    });

    const busy = isLoading || isSubmitting;

    async function onSubmit(
        values: LoginFormValues
    ) {
        clearErrors("root");

        try {
            const response = await login(
                values
            ).unwrap();

            dispatch(
                baseApi.util.resetApiState()
            );

            dispatch(
                setCredentials(response.data.user)
            );

            toast.success("Welcome back!");

            router.replace("/dashboard");
        } catch (error) {
            setError("root", {
                message: getApiErrorMessage(
                    error,
                    "Unable to sign in"
                ),
            });
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                    Welcome back
                </CardTitle>

                <CardDescription>
                    Sign in to your FinPilot account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                >
                    {errors.root?.message && (
                        <div
                            role="alert"
                            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                        >
                            {errors.root.message}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email address
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={busy}
                            aria-invalid={!!errors.email}
                            aria-describedby={
                                errors.email
                                    ? "email-error"
                                    : undefined
                            }
                            {...register("email")}
                        />

                        {errors.email && (
                            <p
                                id="email-error"
                                className="text-xs text-destructive"
                            >
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password
                        </Label>

                        <PasswordInput
                            id="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={busy}
                            aria-invalid={!!errors.password}
                            aria-describedby={
                                errors.password
                                    ? "password-error"
                                    : undefined
                            }
                            {...register("password")}
                        />

                        {errors.password && (
                            <p
                                id="password-error"
                                className="text-xs text-destructive"
                            >
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={busy}
                        className="w-full bg-teal-600 text-white hover:bg-teal-700"
                    >
                        {busy && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}

                        {busy ? "Signing in..." : "Sign in"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}

                        <Link
                            href="/register"
                            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
