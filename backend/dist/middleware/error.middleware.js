import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import multer from "multer";
export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof multer.MulterError) {
        const statusCode = err.code === "LIMIT_FILE_SIZE"
            ? 413
            : 400;
        res.status(statusCode).json({
            success: false,
            message: err.code === "LIMIT_FILE_SIZE"
                ? "File exceeds the maximum allowed size of 5 MB"
                : err.message,
        });
        return;
    }
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
//# sourceMappingURL=error.middleware.js.map