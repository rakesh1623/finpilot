import { z } from "zod";
const moneySchema = z
    .string()
    .regex(/^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/, "Enter a valid amount with at most 2 decimal places")
    .refine((value) => Number(value) > 0, "Budget limit must be greater than zero");
export const createBudgetSchema = z.object({
    categoryId: z.string().uuid(),
    monthlyLimit: moneySchema,
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000).max(2100),
}).strict();
export const updateBudgetSchema = z.object({
    monthlyLimit: moneySchema,
}).strict();
export const budgetQuerySchema = z.object({
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
});
export const budgetIdSchema = z.string().uuid();
//# sourceMappingURL=budget.validation.js.map