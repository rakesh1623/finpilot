
import { z } from "zod";

const currentYear = new Date().getUTCFullYear();
const currentMonth = new Date().getUTCMonth() + 1;

export const periodQuerySchema = z.object({
    month: z.coerce.number().int().min(1).max(12)
        .default(currentMonth),
    year: z.coerce.number().int().min(2000).max(2100)
        .default(currentYear),
});

export const trendsQuerySchema = z.object({
    months: z.coerce.number().int().min(1).max(24)
        .default(6),
    year: z.coerce.number().int().min(2000).max(2100)
        .default(currentYear),
    month: z.coerce.number().int().min(1).max(12)
        .default(currentMonth),
});

export const recentQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(50)
        .default(5),
});
