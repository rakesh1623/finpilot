import { AppError } from "../../utils/AppError.js";
import { importIdSchema, importQuerySchema, importPreviewQuerySchema, } from "./import.validation.js";
import { prepareImport, getImportPreview, listImports, confirmImport, cancelImport, } from "./import.service.js";
export async function upload(req, res) {
    if (!req.file) {
        throw new AppError(400, "Transaction file is required");
    }
    const result = await prepareImport(req.user.userId, req.file.originalname, req.file.buffer);
    res.status(201).json({
        success: true,
        message: "File processed successfully",
        data: result,
    });
}
export async function getAll(req, res) {
    const { page, limit } = importQuerySchema.parse(req.query);
    const result = await listImports(req.user.userId, page, limit);
    res.status(200).json({
        success: true,
        data: result,
    });
}
export async function getPreview(req, res) {
    const id = importIdSchema.parse(req.params.id);
    const filters = importPreviewQuerySchema.parse(req.query);
    const result = await getImportPreview(req.user.userId, id, filters);
    res.status(200).json({
        success: true,
        data: result,
    });
}
export async function confirm(req, res) {
    const id = importIdSchema.parse(req.params.id);
    const result = await confirmImport(req.user.userId, id);
    res.status(200).json({
        success: true,
        message: result.alreadyCompleted
            ? "Import already completed"
            : "Transactions imported successfully",
        data: result,
    });
}
export async function remove(req, res) {
    const id = importIdSchema.parse(req.params.id);
    const result = await cancelImport(req.user.userId, id);
    res.status(200).json({
        success: true,
        message: "Import cancelled successfully",
        data: result,
    });
}
//# sourceMappingURL=import.controller.js.map