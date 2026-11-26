
import multer from "multer";
import { AppError } from "../utils/AppError.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export const uploadReceiptImage = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
        fields: 3,
        parts: 4,
    },

    fileFilter: (_req, file, callback) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
            return callback(
                new AppError(
                    400,
                    "Only JPEG, PNG and WebP images are supported"
                )
            );
        }

        callback(null, true);
    },
});
