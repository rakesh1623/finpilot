import { getOverview, getCategoryBreakdown, getMonthlyTrends, getBudgetAnalytics, getRecentTransactions, } from "./analytics.service.js";
import { periodQuerySchema, trendsQuerySchema, recentQuerySchema, } from "./analytics.validation.js";
export async function overview(req, res) {
    const period = periodQuerySchema.parse(req.query);
    const data = await getOverview(req.user.userId, period);
    return res.status(200).json({
        success: true,
        data,
    });
}
export async function categories(req, res) {
    const period = periodQuerySchema.parse(req.query);
    const data = await getCategoryBreakdown(req.user.userId, period);
    return res.status(200).json({
        success: true,
        data,
    });
}
export async function trends(req, res) {
    const period = trendsQuerySchema.parse(req.query);
    const data = await getMonthlyTrends(req.user.userId, period);
    return res.status(200).json({
        success: true,
        data,
    });
}
export async function budgets(req, res) {
    const period = periodQuerySchema.parse(req.query);
    const data = await getBudgetAnalytics(req.user.userId, period);
    return res.status(200).json({
        success: true,
        data,
    });
}
export async function recent(req, res) {
    const { limit } = recentQuerySchema.parse(req.query);
    const transactions = await getRecentTransactions(req.user.userId, limit);
    return res.status(200).json({
        success: true,
        data: { transactions },
    });
}
//# sourceMappingURL=analytics.controller.js.map