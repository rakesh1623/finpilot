import { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget, } from "./budget.service.js";
import { createBudgetSchema, updateBudgetSchema, budgetQuerySchema, budgetIdSchema, } from "./budget.validation.js";
export async function create(req, res) {
    const data = createBudgetSchema.parse(req.body);
    const budget = await createBudget(req.user.userId, data);
    return res.status(201).json({
        success: true,
        message: "Budget created successfully",
        data: { budget },
    });
}
export async function getAll(req, res) {
    const filters = budgetQuerySchema.parse(req.query);
    const budgets = await getBudgets(req.user.userId, filters);
    return res.status(200).json({
        success: true,
        data: { budgets },
    });
}
export async function getOne(req, res) {
    const budgetId = budgetIdSchema.parse(req.params.id);
    const budget = await getBudgetById(req.user.userId, budgetId);
    return res.status(200).json({
        success: true,
        data: { budget },
    });
}
export async function update(req, res) {
    const budgetId = budgetIdSchema.parse(req.params.id);
    const { monthlyLimit } = updateBudgetSchema.parse(req.body);
    const budget = await updateBudget(req.user.userId, budgetId, monthlyLimit);
    return res.status(200).json({
        success: true,
        message: "Budget updated successfully",
        data: { budget },
    });
}
export async function remove(req, res) {
    const budgetId = budgetIdSchema.parse(req.params.id);
    const result = await deleteBudget(req.user.userId, budgetId);
    return res.status(200).json({
        success: true,
        message: "Budget deleted successfully",
        data: result,
    });
}
//# sourceMappingURL=budget.controller.js.map