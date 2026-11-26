import { z } from "zod";
export declare const periodQuerySchema: z.ZodObject<{
    month: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    year: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const trendsQuerySchema: z.ZodObject<{
    months: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    year: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    month: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const recentQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
