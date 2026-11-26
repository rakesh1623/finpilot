import { z } from "zod";
export declare const receiptExtractionSchema: z.ZodObject<{
    isTransactionReceipt: z.ZodBoolean;
    amount: z.ZodNullable<z.ZodString>;
    currency: z.ZodNullable<z.ZodString>;
    date: z.ZodNullable<z.ZodString>;
    merchant: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    type: z.ZodNullable<z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>>;
    suggestedCategory: z.ZodNullable<z.ZodString>;
    paymentMethod: z.ZodEnum<{
        BANK_TRANSFER: "BANK_TRANSFER";
        CARD: "CARD";
        CASH: "CASH";
        OTHER: "OTHER";
        UNKNOWN: "UNKNOWN";
        UPI: "UPI";
    }>;
    referenceNumber: z.ZodNullable<z.ZodString>;
    warnings: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export declare const receiptReviewSchema: z.ZodObject<{
    amount: z.ZodNullable<z.ZodString>;
    currency: z.ZodNullable<z.ZodString>;
    date: z.ZodNullable<z.ZodString>;
    merchant: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    type: z.ZodNullable<z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>>;
    categoryId: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
export declare const updateReceiptSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    currency: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    merchant: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>>>;
    categoryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const confirmReceiptSchema: z.ZodObject<{
    amount: z.ZodString;
    currency: z.ZodLiteral<"INR">;
    date: z.ZodString;
    merchant: z.ZodNullable<z.ZodString>;
    description: z.ZodString;
    type: z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>;
    categoryId: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
export declare const receiptIdSchema: z.ZodString;
export declare const receiptQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    status: z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        REVIEW: "REVIEW";
    }>>;
}, z.core.$strip>;
export type ReceiptExtraction = z.infer<typeof receiptExtractionSchema>;
export type ReceiptReview = z.infer<typeof receiptReviewSchema>;
export type ConfirmedReceipt = z.infer<typeof confirmReceiptSchema>;
export type UpdateReceipt = z.infer<typeof updateReceiptSchema>;
