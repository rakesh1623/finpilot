import { Prisma } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { prepareReceiptImage, } from "./receipt.image.js";
import { extractReceiptData, } from "./receipt.extraction.js";
import { receiptReviewSchema, confirmReceiptSchema, } from "./receipt.validation.js";
import { generateTransactionFingerprint, } from "../imports/import.fingerprint.js";
import { suggestCategory, } from "../imports/import.categorization.js";
async function getOwnedReceipt(userId, receiptId) {
    const receipt = await prisma.receiptScan.findFirst({
        where: {
            id: receiptId,
            userId,
        },
    });
    if (!receipt) {
        throw new AppError(404, "Receipt scan not found");
    }
    return receipt;
}
async function validateReceiptCategory(db, userId, categoryId, type) {
    if (!categoryId)
        return;
    const category = await db.category.findFirst({
        where: {
            id: categoryId,
            OR: [
                { userId },
                { userId: null },
            ],
        },
    });
    if (!category) {
        throw new AppError(404, "Category not found");
    }
    if (!type || category.type !== type) {
        throw new AppError(400, "Category does not match transaction type");
    }
}
async function findDuplicateTransaction(db, userId, data) {
    const fingerprint = generateTransactionFingerprint(data);
    const start = new Date(`${data.date}T00:00:00.000Z`);
    const end = new Date(start.getTime() + 86400000);
    const transactions = await db.transaction.findMany({
        where: {
            userId,
            currency: data.currency,
            OR: [
                { fingerprint },
                {
                    fingerprint: null,
                    amount: data.amount,
                    type: data.type,
                    transactionDate: {
                        gte: start,
                        lt: end,
                    },
                },
            ],
        },
        select: {
            id: true,
            fingerprint: true,
            amount: true,
            description: true,
            merchant: true,
            transactionDate: true,
            type: true,
            currency: true,
        },
    });
    const duplicate = transactions.find((transaction) => {
        const existingFingerprint = transaction.fingerprint ??
            generateTransactionFingerprint({
                date: transaction.transactionDate
                    .toISOString()
                    .slice(0, 10),
                amount: transaction.amount.toFixed(2),
                description: transaction.description,
                merchant: transaction.merchant,
                type: transaction.type,
                currency: transaction.currency,
            });
        return existingFingerprint === fingerprint;
    });
    return {
        fingerprint,
        duplicateDetected: Boolean(duplicate),
        duplicateTransactionId: duplicate?.id ?? null,
    };
}
async function checkReviewDuplicate(db, userId, review) {
    const result = confirmReceiptSchema.safeParse(review);
    if (!result.success) {
        return {
            fingerprint: null,
            duplicateDetected: false,
            duplicateTransactionId: null,
        };
    }
    return findDuplicateTransaction(db, userId, result.data);
}
export async function scanReceipt(userId, filename, buffer) {
    const image = await prepareReceiptImage(buffer);
    // Avoid repeated AI calls for the same image.
    const existing = await prisma.receiptScan.findFirst({
        where: {
            userId,
            imageHash: image.imageHash,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (existing) {
        return {
            receipt: existing,
            alreadyScanned: true,
        };
    }
    // External AI request stays outside DB transactions.
    const extracted = await extractReceiptData(image.buffer);
    const categories = await prisma.category.findMany({
        where: {
            OR: [
                { userId },
                { userId: null },
            ],
        },
        select: {
            id: true,
            name: true,
            type: true,
        },
    });
    let categoryId = null;
    if (extracted.type) {
        const category = suggestCategory({
            date: extracted.date ?? "",
            description: extracted.description ?? "",
            amount: extracted.amount ?? "0",
            type: extracted.type,
            merchant: extracted.merchant,
            category: extracted.suggestedCategory,
            currency: "INR",
        }, categories);
        categoryId = category?.id ?? null;
    }
    const reviewedData = receiptReviewSchema.parse({
        amount: extracted.amount
            ? new Prisma.Decimal(extracted.amount).toFixed(2)
            : null,
        currency: extracted.currency,
        date: extracted.date,
        merchant: extracted.merchant,
        description: extracted.description?.trim() || null,
        type: extracted.type,
        categoryId,
    });
    const duplicate = await checkReviewDuplicate(prisma, userId, reviewedData);
    const receipt = await prisma.receiptScan.create({
        data: {
            userId,
            filename,
            imageHash: image.imageHash,
            status: "REVIEW",
            extractedData: extracted,
            reviewedData,
            ...duplicate,
        },
    });
    return {
        receipt,
        alreadyScanned: false,
    };
}
export async function getReceipt(userId, receiptId) {
    return getOwnedReceipt(userId, receiptId);
}
export async function listReceipts(userId, filters) {
    const where = {
        userId,
        ...(filters.status && {
            status: filters.status,
        }),
    };
    const [receipts, total] = await prisma.$transaction([
        prisma.receiptScan.findMany({
            where,
            skip: (filters.page - 1) * filters.limit,
            take: filters.limit,
            orderBy: [
                { createdAt: "desc" },
                { id: "desc" },
            ],
            select: {
                id: true,
                filename: true,
                status: true,
                reviewedData: true,
                duplicateDetected: true,
                transactionId: true,
                createdAt: true,
                updatedAt: true,
            },
        }),
        prisma.receiptScan.count({ where }),
    ]);
    return {
        receipts,
        pagination: {
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages: Math.ceil(total / filters.limit),
        },
    };
}
export async function updateReceipt(userId, receiptId, updates) {
    const receipt = await getOwnedReceipt(userId, receiptId);
    if (receipt.status !== "REVIEW") {
        throw new AppError(409, "Completed receipts cannot be edited");
    }
    const current = receiptReviewSchema.parse(receipt.reviewedData);
    const reviewedData = receiptReviewSchema.parse({
        ...current,
        ...updates,
    });
    if (reviewedData.amount) {
        reviewedData.amount =
            new Prisma.Decimal(reviewedData.amount).toFixed(2);
    }
    await validateReceiptCategory(prisma, userId, reviewedData.categoryId, reviewedData.type);
    const duplicate = await checkReviewDuplicate(prisma, userId, reviewedData);
    const result = await prisma.receiptScan.updateMany({
        where: {
            id: receiptId,
            userId,
            status: "REVIEW",
            updatedAt: receipt.updatedAt,
        },
        data: {
            reviewedData,
            ...duplicate,
        },
    });
    if (result.count === 0) {
        throw new AppError(409, "Receipt was modified. Refresh and try again.");
    }
    return getOwnedReceipt(userId, receiptId);
}
export async function confirmReceipt(userId, receiptId) {
    try {
        return await prisma.$transaction(async (tx) => {
            const receipt = await tx.receiptScan.findFirst({
                where: {
                    id: receiptId,
                    userId,
                },
            });
            if (!receipt) {
                throw new AppError(404, "Receipt scan not found");
            }
            if (receipt.status === "COMPLETED") {
                return {
                    receipt,
                    transactionId: receipt.transactionId,
                    alreadyCompleted: true,
                };
            }
            const result = confirmReceiptSchema.safeParse(receipt.reviewedData);
            if (!result.success) {
                throw new AppError(400, "Complete all required receipt fields before confirmation");
            }
            const data = result.data;
            // Claim the receipt within the DB transaction.
            const claimed = await tx.receiptScan.updateMany({
                where: {
                    id: receiptId,
                    userId,
                    status: "REVIEW",
                    updatedAt: receipt.updatedAt,
                },
                data: {
                    status: "COMPLETED",
                },
            });
            if (claimed.count === 0) {
                throw new AppError(409, "Receipt was modified. Refresh and try again.");
            }
            await validateReceiptCategory(tx, userId, data.categoryId, data.type);
            // Recheck duplicates at confirmation time.
            const duplicate = await findDuplicateTransaction(tx, userId, data);
            if (duplicate.duplicateDetected) {
                throw new AppError(409, "Matching transaction already exists");
            }
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    categoryId: data.categoryId,
                    amount: data.amount,
                    currency: data.currency,
                    description: data.description,
                    merchant: data.merchant,
                    type: data.type,
                    transactionDate: new Date(`${data.date}T00:00:00.000Z`),
                    fingerprint: duplicate.fingerprint,
                },
            });
            const completedReceipt = await tx.receiptScan.update({
                where: {
                    id: receiptId,
                    userId,
                },
                data: {
                    status: "COMPLETED",
                    transactionId: transaction.id,
                    fingerprint: duplicate.fingerprint,
                    duplicateDetected: false,
                    duplicateTransactionId: null,
                },
            });
            return {
                receipt: completedReceipt,
                transactionId: transaction.id,
                alreadyCompleted: false,
            };
        }, {
            maxWait: 10000,
            timeout: 15000,
        });
    }
    catch (error) {
        if (error instanceof
            Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            throw new AppError(409, "Matching transaction already exists");
        }
        throw error;
    }
}
export async function cancelReceipt(userId, receiptId) {
    const receipt = await getOwnedReceipt(userId, receiptId);
    if (receipt.status !== "REVIEW") {
        throw new AppError(409, "Completed receipts cannot be cancelled");
    }
    const result = await prisma.receiptScan.deleteMany({
        where: {
            id: receiptId,
            userId,
            status: "REVIEW",
        },
    });
    if (result.count === 0) {
        throw new AppError(409, "Receipt is no longer available for cancellation");
    }
    return {
        id: receiptId,
    };
}
//# sourceMappingURL=receipt.service.js.map