import { z } from "zod";
export const createCategorySchema = z.object({
    name: z.string().trim().min(2).max(50),
    type: z.enum(["INCOME", "EXPENSE"]),
}).strict();
export const updateCategorySchema = z.object({
    name: z.string().trim().min(2).max(50),
}).strict();
export const categoryQuerySchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
});
export const categoryIdSchema = z.string().uuid();
//# sourceMappingURL=category.validation.js.map