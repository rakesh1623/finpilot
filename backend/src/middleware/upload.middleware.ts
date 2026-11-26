
import multer from "multer";
import path from "node:path";
import { AppError } from "../utils/AppError.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const uploadTransactionFile = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
        fields: 5,
        parts: 6,
    },

    fileFilter: (_req, file, callback) => {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        if (![".csv", ".xlsx"].includes(extension)) {
            return callback(
                new AppError(
                    400,
                    "Only CSV and XLSX files are supported"
                )
            );
        }

        callback(null, true);
    },
});
