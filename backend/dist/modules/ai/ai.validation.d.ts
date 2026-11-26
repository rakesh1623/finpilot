import { z } from "zod";
export declare const chatSchema: z.ZodObject<{
    message: z.ZodString;
    conversationId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const toolPeriodSchema: z.ZodObject<{
    month: z.ZodNumber;
    year: z.ZodNumber;
}, z.core.$strict>;
export declare const conversationIdSchema: z.ZodString;
export declare const updateConversationSchema: z.ZodObject<{
    title: z.ZodString;
}, z.core.$strict>;
export declare const conversationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const messageQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const compareSpendingSchema: z.ZodObject<{
    baseMonth: z.ZodNumber;
    baseYear: z.ZodNumber;
    targetMonth: z.ZodNumber;
    targetYear: z.ZodNumber;
}, z.core.$strict>;
export declare const spendingTrendsSchema: z.ZodObject<{
    month: z.ZodNumber;
    year: z.ZodNumber;
    months: z.ZodNumber;
}, z.core.$strict>;
export declare const searchTransactionsSchema: z.ZodObject<{
    search: z.ZodString;
    type: z.ZodNullable<z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>>;
    month: z.ZodNullable<z.ZodNumber>;
    year: z.ZodNullable<z.ZodNumber>;
    limit: z.ZodNumber;
}, z.core.$strict>;
export declare const topExpensesSchema: z.ZodObject<{
    month: z.ZodNumber;
    year: z.ZodNumber;
    limit: z.ZodNumber;
}, z.core.$strict>;
