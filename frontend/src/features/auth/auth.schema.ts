
import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .email("Enter a valid email address")
    .toLowerCase();

const passwordSchema = z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password is too long")
    .refine(
        (value) =>
            new TextEncoder().encode(value).length <= 72,
        "Password must not exceed 72 bytes"
    );

export const loginSchema = z.object({
    email: emailSchema,

    password: z
        .string()
        .min(1, "Password is required")
        .max(72, "Password is too long"),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must contain at least 2 characters")
            .max(80, "Name is too long"),

        email: emailSchema,

        password: passwordSchema,

        confirmPassword: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine(
        (data) =>
            data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

export type LoginFormValues =
    z.infer<typeof loginSchema>;

export type RegisterFormValues =
    z.infer<typeof registerSchema>;
