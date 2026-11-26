
import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(2, "Name must have at least 2 characters").max(80),
    email: z.string().trim().email("Enter a valid email").transform((value) => value.toLowerCase()),
    password: z.string().min(8, "Password must have at least 8 characters").max(72),
});

export const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email").transform((value) => value.toLowerCase()),
    password: z.string().min(1, "Password is required").max(72),
});
