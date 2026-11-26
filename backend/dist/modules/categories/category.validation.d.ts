import { z } from "zod";
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>;
}, z.core.$strict>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strict>;
export declare const categoryQuerySchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>>;
}, z.core.$strip>;
export declare const categoryIdSchema: z.ZodString;
