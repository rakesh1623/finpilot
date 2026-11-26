import { z } from "zod";
export declare const createBudgetSchema: z.ZodObject<{
    categoryId: z.ZodString;
    monthlyLimit: z.ZodString;
    month: z.ZodNumber;
    year: z.ZodNumber;
}, z.core.$strict>;
export declare const updateBudgetSchema: z.ZodObject<{
    monthlyLimit: z.ZodString;
}, z.core.$strict>;
export declare const budgetQuerySchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const budgetIdSchema: z.ZodString;
