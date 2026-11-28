
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
    registerSchema,
    type RegisterFormValues,
} from "../auth.schema";

import {
    useRegisterMutation,
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

export function RegisterForm() {
    const router = useRouter();

    const dispatch = useAppDispatch();

    const [registerUser, { isLoading }] =
        useRegisterMutation();

    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),

        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const busy = isLoading || isSubmitting;

    async function onSubmit(
        values: RegisterFormValues
    ) {
        clearErrors("root");

        try {
            const response = await registerUser({
                name: values.name,
                email: values.email,
                password: values.password,
            }).unwrap();

            dispatch(
                baseApi.util.resetApiState()
            );

            dispatch(
                setCredentials(response.data.user)
            );

            toast.success(
                "Your FinPilot account is ready!"
            );

            router.replace("/dashboard");
        } catch (error) {
            setError("root", {
                message: getApiErrorMessage(
                    error,
                    "Unable to create account"
                ),
            });
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                    Create account
                </CardTitle>

                <CardDescription>
                    Start your financial journey with FinPilot
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
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
                        <Label htmlFor="name">
                            Full name
                        </Label>

                        <Input
                            id="name"
                            placeholder="Enter your name"
                            autoComplete="name"
                            disabled={busy}
                            aria-invalid={!!errors.name}
                            aria-describedby={
                                errors.name ? "name-error" : undefined
                            }
                            {...register("name")}
                        />

                        {errors.name && (
                            <p id="name-error" className="text-xs text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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
                                errors.email ? "email-error" : undefined
                            }
                            {...register("email")}
                        />

                        {errors.email && (
                            <p id="email-error" className="text-xs text-destructive">
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
                            placeholder="Create a password"
                            autoComplete="new-password"
                            disabled={busy}
                            aria-invalid={!!errors.password}
                            aria-describedby="password-help"
                            {...register("password")}
                        />

                        <p
                            id="password-help"
                            className={`text-xs ${errors.password
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                                }`}
                        >
                            {errors.password?.message ??
                                "Use at least 8 characters."}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm password
                        </Label>

                        <PasswordInput
                            id="confirmPassword"
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            disabled={busy}
                            aria-invalid={!!errors.confirmPassword}
                            aria-describedby={
                                errors.confirmPassword
                                    ? "confirm-password-error"
                                    : undefined
                            }
                            {...register("confirmPassword")}
                        />

                        {errors.confirmPassword && (
                            <p
                                id="confirm-password-error"
                                className="text-xs text-destructive"
                            >
                                {errors.confirmPassword.message}
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

                        {busy
                            ? "Creating account..."
                            : "Create account"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}

                        <Link
                            href="/login"
                            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
