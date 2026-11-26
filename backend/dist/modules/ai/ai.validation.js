import { z } from "zod";
export const chatSchema = z.object({
    message: z.string().trim().min(1).max(2000),
    conversationId: z.string().uuid().optional(),
}).strict();
export const toolPeriodSchema = z.object({
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000).max(2100),
}).strict();
export const conversationIdSchema = z.string().uuid();
export const updateConversationSchema = z.object({
    title: z.string().trim().min(1).max(100),
}).strict();
export const conversationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});
export const messageQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
});
export const compareSpendingSchema = z.object({
    baseMonth: z.number().int().min(1).max(12),
    baseYear: z.number().int().min(2000).max(2100),
    targetMonth: z.number().int().min(1).max(12),
    targetYear: z.number().int().min(2000).max(2100),
}).strict();
export const spendingTrendsSchema = toolPeriodSchema.extend({
    months: z.number().int().min(2).max(24),
});
export const searchTransactionsSchema = z.object({
    search: z.string().trim().min(1).max(100),
    type: z.enum(["INCOME", "EXPENSE"]).nullable(),
    month: z.number().int().min(1).max(12).nullable(),
    year: z.number().int().min(2000).max(2100).nullable(),
    limit: z.number().int().min(1).max(20),
}).strict().refine((data) => (data.month === null) === (data.year === null), {
    message: "Month and year must be provided together",
});
export const topExpensesSchema = toolPeriodSchema.extend({
    limit: z.number().int().min(1).max(20),
});
//# sourceMappingURL=ai.validation.js.map