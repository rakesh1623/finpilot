
import sharp from "sharp";
import { createHash } from "node:crypto";

import { AppError } from "../../utils/AppError.js";

const MAX_PIXELS = 20_000_000;
const MAX_DIMENSION = 2048;

const SUPPORTED_FORMATS = [
    "jpeg",
    "png",
    "webp",
];

export async function prepareReceiptImage(
    buffer: Buffer
) {
    try {
        const image = sharp(buffer, {
            limitInputPixels: MAX_PIXELS,
            failOn: "error",
        });

        const metadata = await image.metadata();

        if (
            !metadata.format ||
            !SUPPORTED_FORMATS.includes(metadata.format)
        ) {
            throw new AppError(
                400,
                "Unsupported image content"
            );
        }

        if (!metadata.width || !metadata.height) {
            throw new AppError(
                400,
                "Invalid image dimensions"
            );
        }

        if ((metadata.pages ?? 1) > 1) {
            throw new AppError(
                400,
                "Animated images are not supported"
            );
        }

        const processedBuffer = await image
            .rotate()
            .resize({
                width: MAX_DIMENSION,
                height: MAX_DIMENSION,
                fit: "inside",
                withoutEnlargement: true,
            })
            .flatten({
                background: "#ffffff",
            })
            .jpeg({
                quality: 90,
            })
            .toBuffer();

        const imageHash = createHash("sha256")
            .update(processedBuffer)
            .digest("hex");

        return {
            buffer: processedBuffer,
            imageHash,
            mimeType: "image/jpeg",
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            400,
            "Unable to process receipt image"
        );
    }
}
