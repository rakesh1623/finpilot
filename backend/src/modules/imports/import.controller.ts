
import type {
    Request,
    Response,
} from "express";

import { AppError } from "../../utils/AppError.js";

import {
    importIdSchema,
    importQuerySchema,
    importPreviewQuerySchema,
} from "./import.validation.js";

import {
    prepareImport,
    getImportPreview,
    listImports,
    confirmImport,
    cancelImport,
} from "./import.service.js";

export async function upload(
    req: Request,
    res: Response
) {
    if (!req.file) {
        throw new AppError(400, "Transaction file is required");
    }

    const result = await prepareImport(
        req.user!.userId,
        req.file.originalname,
        req.file.buffer
    );

    res.status(201).json({
        success: true,
        message: "File processed successfully",
        data: result,
    });
}

export async function getAll(
    req: Request,
    res: Response
) {
    const { page, limit } =
        importQuerySchema.parse(req.query);

    const result = await listImports(
        req.user!.userId,
        page,
        limit
    );

    res.status(200).json({
        success: true,
        data: result,
    });
}

export async function getPreview(
    req: Request,
    res: Response
) {
    const id = importIdSchema.parse(req.params.id);

    const filters =
        importPreviewQuerySchema.parse(req.query);

    const result = await getImportPreview(
        req.user!.userId,
        id,
        filters
    );

    res.status(200).json({
        success: true,
        data: result,
    });
}

export async function confirm(
    req: Request,
    res: Response
) {
    const id = importIdSchema.parse(req.params.id);

    const result = await confirmImport(
        req.user!.userId,
        id
    );

    res.status(200).json({
        success: true,
        message: result.alreadyCompleted
            ? "Import already completed"
            : "Transactions imported successfully",
        data: result,
    });
}

export async function remove(
    req: Request,
    res: Response
) {
    const id = importIdSchema.parse(req.params.id);

    const result = await cancelImport(
        req.user!.userId,
        id
    );

    res.status(200).json({
        success: true,
        message: "Import cancelled successfully",
        data: result,
    });
}
