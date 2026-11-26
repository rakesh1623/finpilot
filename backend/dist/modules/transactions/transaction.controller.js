import { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction, } from "./transaction.service.js";
import { createTransactionSchema, updateTransactionSchema, transactionQuerySchema, transactionIdSchema } from "./transaction.validation.js";
export async function create(req, res) {
    const data = createTransactionSchema.parse(req.body);
    const transaction = await createTransaction(req.user.userId, data);
    return res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: { transaction },
    });
}
export async function getAll(req, res) {
    const filters = transactionQuerySchema.parse(req.query);
    const result = await getTransactions(req.user.userId, filters);
    return res.status(200).json({
        success: true,
        data: result,
    });
}
export async function getOne(req, res) {
    const transaction = await getTransactionById(req.user.userId, transactionIdSchema.parse(req.params.id));
    return res.status(200).json({
        success: true,
        data: { transaction },
    });
}
export async function update(req, res) {
    const data = updateTransactionSchema.parse(req.body);
    const transaction = await updateTransaction(req.user.userId, transactionIdSchema.parse(req.params.id), data);
    return res.status(200).json({
        success: true,
        message: "Transaction updated successfully",
        data: { transaction },
    });
}
export async function remove(req, res) {
    const result = await deleteTransaction(req.user.userId, transactionIdSchema.parse(req.params.id));
    return res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
        data: result,
    });
}
//# sourceMappingURL=transaction.controller.js.map