
import { z } from "zod";

const dateSchema = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => {
        const date = new Date(
            `${value}T00:00:00.000Z`
        );

        return (
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value
        );
    }, "Invalid calendar date");

const amountSchema = z.string()
    .trim()
    .refine(
        (value) =>
            /^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/.test(value)
            && Number(value) > 0,
        "Amount must be positive with at most 2 decimal places"
    );

const transactionTypeSchema =
    z.enum(["INCOME", "EXPENSE"]);

// Original AI extraction.
// Unknown values are explicitly nullable.
export const receiptExtractionSchema = z.object({
    isTransactionReceipt: z.boolean(),

    amount: amountSchema.nullable(),
    currency: z.string().regex(/^[A-Z]{3}$/).nullable(),
    date: dateSchema.nullable(),

    merchant: z.string().max(100).nullable(),
    description: z.string().max(200).nullable(),

    type: transactionTypeSchema.nullable(),

    suggestedCategory: z.string().max(50).nullable(),

    paymentMethod: z.enum([
        "UPI",
        "CARD",
        "CASH",
        "BANK_TRANSFER",
        "OTHER",
        "UNKNOWN",
    ]),

    referenceNumber: z.string().max(150).nullable(),

    warnings: z.array(
        z.string().max(300)
    ).max(10),
}).strict();

// Editable data stored during review.
export const receiptReviewSchema = z.object({
    amount: amountSchema.nullable(),
    currency: z.string().regex(/^[A-Z]{3}$/).nullable(),
    date: dateSchema.nullable(),

    merchant: z.string()
        .trim()
        .max(100)
        .nullable(),

    description: z.string()
        .trim()
        .min(1)
        .max(200)
        .nullable(),

    type: transactionTypeSchema.nullable(),

    categoryId: z.string().uuid().nullable(),
}).strict();

export const updateReceiptSchema =
    receiptReviewSchema.partial().refine(
        (data) => Object.keys(data).length > 0,
        "At least one field must be provided"
    );

// All required fields must be valid before confirmation.
export const confirmReceiptSchema = z.object({
    amount: amountSchema,
    currency: z.literal("INR"),
    date: dateSchema,

    merchant: z.string()
        .trim()
        .max(100)
        .nullable(),

    description: z.string()
        .trim()
        .min(1)
        .max(200),

    type: transactionTypeSchema,
    categoryId: z.string().uuid().nullable(),
}).strict();

export const receiptIdSchema =
    z.string().uuid();

export const receiptQuerySchema = z.object({
    page: z.coerce.number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce.number()
        .int()
        .min(1)
        .max(100)
        .default(20),

    status: z.enum([
        "REVIEW",
        "COMPLETED",
    ]).optional(),
});

export type ReceiptExtraction =
    z.infer<typeof receiptExtractionSchema>;

export type ReceiptReview =
    z.infer<typeof receiptReviewSchema>;

export type ConfirmedReceipt =
    z.infer<typeof confirmReceiptSchema>;

export type UpdateReceipt =
    z.infer<typeof updateReceiptSchema>;
