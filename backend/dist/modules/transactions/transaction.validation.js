import { z } from "zod";
const amountSchema = z
    .union([z.string(), z.number()])
    .transform(String)
    .refine((value) => /^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/.test(value) &&
    Number(value) > 0, "Amount must be positive and have at most 2 decimal places");
export const transactionIdSchema = z.string().uuid();
const transactionFields = {
    amount: amountSchema,
    description: z.string().trim().min(1).max(200),
    merchant: z.string().trim().max(100).nullable().optional(),
    type: z.enum(["INCOME", "EXPENSE"]),
    categoryId: z.string().uuid().nullable().optional(),
    currency: z.string().regex(/^[A-Z]{3}$/).default("INR"),
    transactionDate: z.coerce.date(),
};
export const createTransactionSchema = z.object(transactionFields);
export const updateTransactionSchema = z
    .object(transactionFields)
    .partial()
    .refine((data) => Object.keys(data).length > 0, "At least one field must be provided");
export const transactionQuerySchema = z
    .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    categoryId: z.string().uuid().optional(),
    search: z.string().trim().max(100).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    sort: z.enum(["newest", "oldest"]).default("newest"),
})
    .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: "'from' date must be before or equal to 'to' date",
    path: ["from"],
});
//# sourceMappingURL=transaction.validation.js.map