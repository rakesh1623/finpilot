import { z } from "zod";
const dateSchema = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must use YYYY-MM-DD format",
})
    .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (!Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value);
}, "Invalid calendar date");
const amountSchema = z.string()
    .trim()
    .refine((value) => /^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/.test(value)
    && Number(value) > 0, "Amount must be positive with at most 2 decimal places");
export const importRowSchema = z.object({
    date: dateSchema,
    description: z.string()
        .trim()
        .min(1)
        .max(200),
    amount: amountSchema,
    type: z.enum(["INCOME", "EXPENSE"]),
    merchant: z.string()
        .trim()
        .max(100)
        .nullable(),
    category: z.string()
        .trim()
        .max(50)
        .nullable(),
    currency: z.literal("INR"),
});
export const normalizedImportRowSchema = importRowSchema.extend({
    categoryId: z.string().uuid().nullable(),
});
export const importIdSchema = z.string().uuid();
export const importQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});
export const importPreviewQuerySchema = importQuerySchema.extend({
    status: z.enum([
        "PENDING",
        "IMPORTED",
        "DUPLICATE",
        "REJECTED",
    ]).optional(),
});
//# sourceMappingURL=import.validation.js.map