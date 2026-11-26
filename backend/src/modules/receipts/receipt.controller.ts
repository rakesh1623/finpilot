
import type {
    Request,
    Response,
} from "express";

import { AppError } from "../../utils/AppError.js";

import {
    receiptIdSchema,
    receiptQuerySchema,
    updateReceiptSchema,
} from "./receipt.validation.js";

import {
    scanReceipt,
    getReceipt,
    listReceipts,
    updateReceipt,
    confirmReceipt,
    cancelReceipt,
} from "./receipt.service.js";

export async function scan(
    req: Request,
    res: Response
) {
    if (!req.file) {
        throw new AppError(
            400,
            "Receipt image is required"
        );
    }

    const result = await scanReceipt(
        req.user!.userId,
        req.file.originalname,
        req.file.buffer
    );

    res.status(
        result.alreadyScanned ? 200 : 201
    ).json({
        success: true,

        message: result.alreadyScanned
            ? "Receipt already scanned"
            : "Receipt extracted successfully",

        data: result,
    });
}

export async function getAll(
    req: Request,
    res: Response
) {
    const filters =
        receiptQuerySchema.parse(req.query);

    const result = await listReceipts(
        req.user!.userId,
        filters
    );

    res.status(200).json({
        success: true,
        data: result,
    });
}

export async function getOne(
    req: Request,
    res: Response
) {
    const id = receiptIdSchema.parse(req.params.id);

    const result = await getReceipt(
        req.user!.userId,
        id
    );

    res.status(200).json({
        success: true,
        data: result,
    });
}

export async function update(
    req: Request,
    res: Response
) {
    const id = receiptIdSchema.parse(req.params.id);

    const updates =
        updateReceiptSchema.parse(req.body);

    const result = await updateReceipt(
        req.user!.userId,
        id,
        updates
    );

    res.status(200).json({
        success: true,
        message: "Receipt updated successfully",
        data: result,
    });
}

export async function confirm(
    req: Request,
    res: Response
) {
    const id = receiptIdSchema.parse(req.params.id);

    const result = await confirmReceipt(
        req.user!.userId,
        id
    );

    res.status(200).json({
        success: true,

        message: result.alreadyCompleted
            ? "Receipt already completed"
            : "Receipt transaction created successfully",

        data: result,
    });
}

export async function remove(
    req: Request,
    res: Response
) {
    const id = receiptIdSchema.parse(req.params.id);

    const result = await cancelReceipt(
        req.user!.userId,
        id
    );

    res.status(200).json({
        success: true,
        message: "Receipt cancelled successfully",
        data: result,
    });
}
