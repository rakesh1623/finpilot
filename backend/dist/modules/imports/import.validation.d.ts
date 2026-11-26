import { z } from "zod";
export declare const importRowSchema: z.ZodObject<{
    date: z.ZodString;
    description: z.ZodString;
    amount: z.ZodString;
    type: z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>;
    merchant: z.ZodNullable<z.ZodString>;
    category: z.ZodNullable<z.ZodString>;
    currency: z.ZodLiteral<"INR">;
}, z.core.$strip>;
export declare const normalizedImportRowSchema: z.ZodObject<{
    date: z.ZodString;
    description: z.ZodString;
    amount: z.ZodString;
    type: z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>;
    merchant: z.ZodNullable<z.ZodString>;
    category: z.ZodNullable<z.ZodString>;
    currency: z.ZodLiteral<"INR">;
    categoryId: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const importIdSchema: z.ZodString;
export declare const importQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const importPreviewQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    status: z.ZodOptional<z.ZodEnum<{
        DUPLICATE: "DUPLICATE";
        IMPORTED: "IMPORTED";
        PENDING: "PENDING";
        REJECTED: "REJECTED";
    }>>;
}, z.core.$strip>;
export type ValidImportRow = z.infer<typeof importRowSchema>;
export type NormalizedImportRow = z.infer<typeof normalizedImportRowSchema>;
