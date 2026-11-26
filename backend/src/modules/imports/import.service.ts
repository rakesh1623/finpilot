
import { randomUUID } from "node:crypto";

import { Prisma } from "../../../generated/prisma/index.js";

import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

import {
    importRowSchema,
    normalizedImportRowSchema,
    type NormalizedImportRow,
} from "./import.validation.js";

import {
    parseTransactionFile,
} from "./import.parser.js";

import {
    generateTransactionFingerprint,
} from "./import.fingerprint.js";

import {
    suggestCategory,
} from "./import.categorization.js";

type DatabaseClient =
    | typeof prisma
    | Prisma.TransactionClient;

type PreparedRow = {
    rowNumber: number;
    rawData: Prisma.InputJsonValue;
    normalizedData: Prisma.InputJsonValue;
    fingerprint: string;
    status: "PENDING" | "DUPLICATE" | "REJECTED";
    errorMessage?: string;
};

type RowStatus =
    | "PENDING"
    | "IMPORTED"
    | "DUPLICATE"
    | "REJECTED";

function normalizeRow(raw: Record<string, string>) {
    return {
        date: (raw.date ?? "").trim(),
        description: (raw.description ?? "").trim(),
        amount: (raw.amount ?? "").trim(),
        type: (raw.type ?? "").trim().toUpperCase(),
        merchant: raw.merchant?.trim() || null,
        category: raw.category?.trim() || null,
        currency: raw.currency?.trim().toUpperCase() || "INR",
    };
}

async function findExistingFingerprints(
    db: DatabaseClient,
    userId: string,
    rows: NormalizedImportRow[]
) {
    if (rows.length === 0) {
        return new Set<string>();
    }

    const fingerprints = rows.map(
        generateTransactionFingerprint
    );

    const dates = [...new Set(
        rows.map((row) => row.date)
    )];

    const dateRanges = dates.map((date) => {
        const start = new Date(`${date}T00:00:00.000Z`);
        const end = new Date(start.getTime() + 86400000);

        return {
            transactionDate: {
                gte: start,
                lt: end,
            },
        };
    });

    const transactions = await db.transaction.findMany({
        where: {
            userId,
            currency: "INR",

            OR: [
                {
                    fingerprint: {
                        in: fingerprints,
                    },
                },
                {
                    fingerprint: null,
                    OR: dateRanges,
                },
            ],
        },

        select: {
            fingerprint: true,
            amount: true,
            description: true,
            merchant: true,
            type: true,
            currency: true,
            transactionDate: true,
        },
    });

    return new Set(
        transactions.map((transaction) =>
            transaction.fingerprint ??
            generateTransactionFingerprint({
                date: transaction.transactionDate
                    .toISOString()
                    .slice(0, 10),

                amount: transaction.amount.toFixed(2),
                description: transaction.description,
                merchant: transaction.merchant,
                type: transaction.type,
                currency: transaction.currency,
            })
        )
    );
}


export async function prepareImport(
    userId: string,
    filename: string,
    buffer: Buffer
) {
    const parsedRows = await parseTransactionFile(
        filename,
        buffer
    );

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

    const preparedRows: PreparedRow[] = [];
    const validRows: NormalizedImportRow[] = [];

    for (const row of parsedRows) {
        const result = importRowSchema.safeParse(
            normalizeRow(row.rawData)
        );

        if (!result.success) {
            preparedRows.push({
                rowNumber: row.rowNumber,
                rawData: row.rawData,
                normalizedData: {},
                fingerprint: `invalid:${randomUUID()}`,
                status: "REJECTED",

                errorMessage: result.error.issues
                    .map(
                        (issue) =>
                            `${issue.path.join(".")}: ${issue.message}`
                    )
                    .join("; "),
            });

            continue;
        }

        const category = suggestCategory(
            result.data,
            categories
        );

        const normalized: NormalizedImportRow = {
            ...result.data,

            amount: new Prisma.Decimal(
                result.data.amount
            ).toFixed(2),

            category: category?.name ?? null,
            categoryId: category?.id ?? null,
        };

        const fingerprint =
            generateTransactionFingerprint(normalized);

        validRows.push(normalized);

        preparedRows.push({
            rowNumber: row.rowNumber,
            rawData: row.rawData,
            normalizedData: normalized,
            fingerprint,
            status: "PENDING",
        });
    }

    const existingFingerprints =
        await findExistingFingerprints(
            prisma,
            userId,
            validRows
        );

    const seenFingerprints = new Set<string>();

    for (const row of preparedRows) {
        if (row.status === "REJECTED") {
            continue;
        }

        if (existingFingerprints.has(row.fingerprint)) {
            row.status = "DUPLICATE";
            row.errorMessage =
                "Matching transaction already exists";

        } else if (seenFingerprints.has(row.fingerprint)) {
            row.status = "DUPLICATE";
            row.errorMessage =
                "Duplicate transaction within uploaded file";
        }

        seenFingerprints.add(row.fingerprint);
    }

    const batch = await prisma.importBatch.create({
        data: {
            userId,
            filename,
            status: "REVIEW",
            totalRows: preparedRows.length,

            rows: {
                createMany: {
                    data: preparedRows,
                },
            },
        },
    });

    return {
        batch,
        summary: {
            totalRows: preparedRows.length,

            readyToImport: preparedRows.filter(
                (row) => row.status === "PENDING"
            ).length,

            duplicates: preparedRows.filter(
                (row) => row.status === "DUPLICATE"
            ).length,

            rejected: preparedRows.filter(
                (row) => row.status === "REJECTED"
            ).length,
        },
    };
}

async function getOwnedBatch(
    userId: string,
    batchId: string
) {
    const batch = await prisma.importBatch.findFirst({
        where: {
            id: batchId,
            userId,
        },
    });

    if (!batch) {
        throw new AppError(404, "Import batch not found");
    }

    return batch;
}

export async function getImportPreview(
    userId: string,
    batchId: string,
    filters: {
        page: number;
        limit: number;
        status?: RowStatus;
    }
) {
    const batch = await getOwnedBatch(userId, batchId);

    const where: Prisma.TransactionImportWhereInput = {
        importBatchId: batchId,
        importBatch: { userId },

        ...(filters.status && {
            status: filters.status,
        }),
    };

    const [rows, total, counts] =
        await prisma.$transaction([
            prisma.transactionImport.findMany({
                where,
                skip: (filters.page - 1) * filters.limit,
                take: filters.limit,
                orderBy: { rowNumber: "asc" },
            }),

            prisma.transactionImport.count({
                where,
            }),

            prisma.transactionImport.groupBy({
                by: ["status"],
                where: {
                    importBatchId: batchId,
                    importBatch: { userId },
                },
                _count: { _all: true },
            }),
        ]);

    function countStatus(status: RowStatus) {
        return counts.find(
            (item) => item.status === status
        )?._count._all ?? 0;
    }

    return {
        batch,

        summary: {
            totalRows: batch.totalRows,
            readyToImport: countStatus("PENDING"),
            duplicates: countStatus("DUPLICATE"),
            rejected: countStatus("REJECTED"),
            imported: countStatus("IMPORTED"),
        },

        rows,

        pagination: {
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages: Math.ceil(total / filters.limit),
        },
    };
}

export async function listImports(
    userId: string,
    page: number,
    limit: number
) {
    const where = { userId };

    const [imports, total] =
        await prisma.$transaction([
            prisma.importBatch.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,

                orderBy: [
                    { createdAt: "desc" },
                    { id: "desc" },
                ],
            }),

            prisma.importBatch.count({ where }),
        ]);

    return {
        imports,

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function confirmImport(
    userId: string,
    batchId: string
) {
    return prisma.$transaction(
        async (tx) => {
            const batch = await tx.importBatch.findFirst({
                where: {
                    id: batchId,
                    userId,
                },
            });

            if (!batch) {
                throw new AppError(
                    404,
                    "Import batch not found"
                );
            }

            if (batch.status === "COMPLETED") {
                return {
                    batch,
                    importedRows: batch.importedRows,
                    alreadyCompleted: true,
                };
            }

            // Atomically claim this batch for confirmation.
            const claimed = await tx.importBatch.updateMany({
                where: {
                    id: batchId,
                    userId,
                    status: "REVIEW",
                },

                data: {
                    status: "PROCESSING",
                },
            });

            if (claimed.count === 0) {
                throw new AppError(
                    409,
                    "Import is not available for confirmation"
                );
            }

            const pendingRows =
                await tx.transactionImport.findMany({
                    where: {
                        importBatchId: batchId,
                        status: "PENDING",
                    },
                    orderBy: { rowNumber: "asc" },
                });

            const normalizedRows = pendingRows.map((row) => ({
                row,

                data: normalizedImportRowSchema.parse(
                    row.normalizedData
                ),
            }));

            // Recheck duplicates because transactions may
            // have been created after the preview.
            const existingFingerprints =
                await findExistingFingerprints(
                    tx,
                    userId,
                    normalizedRows.map((item) => item.data)
                );

            const categories = await tx.category.findMany({
                where: {
                    OR: [
                        { userId },
                        { userId: null },
                    ],
                },
                select: {
                    id: true,
                    type: true,
                },
            });

            const categoryMap = new Map(
                categories.map((category) => [
                    category.id,
                    category.type,
                ])
            );

            const duplicateIds: string[] = [];

            const candidates: {
                rowId: string;
                transaction: Prisma.TransactionCreateManyInput;
            }[] = [];

            for (const item of normalizedRows) {
                const { row, data } = item;

                const fingerprint =
                    generateTransactionFingerprint(data);

                if (existingFingerprints.has(fingerprint)) {
                    duplicateIds.push(row.id);
                    continue;
                }

                const categoryId =
                    data.categoryId &&
                        categoryMap.get(data.categoryId) === data.type
                        ? data.categoryId
                        : null;

                candidates.push({
                    rowId: row.id,

                    transaction: {
                        id: randomUUID(),
                        userId,
                        categoryId,
                        amount: data.amount,
                        description: data.description,
                        merchant: data.merchant,
                        type: data.type,
                        currency: data.currency,

                        transactionDate: new Date(
                            `${data.date}T00:00:00.000Z`
                        ),

                        fingerprint,
                    },
                });

                existingFingerprints.add(fingerprint);
            }

            let importedCount = 0;

            if (candidates.length > 0) {
                const result = await tx.transaction.createMany({
                    data: candidates.map(
                        (item) => item.transaction
                    ),

                    skipDuplicates: true,
                });

                importedCount = result.count;

                // Identify exactly which generated IDs
                // were successfully inserted.
                const inserted = await tx.transaction.findMany({
                    where: {
                        userId,

                        id: {
                            in: candidates.map(
                                (item) => item.transaction.id!
                            ),
                        },
                    },

                    select: { id: true },
                });

                const insertedIds = new Set(
                    inserted.map((item) => item.id)
                );

                const importedCandidates = candidates.filter(
                    (item) =>
                        insertedIds.has(item.transaction.id!)
                );

                // Link each successful import row to its
                // actual transaction.
                for (const item of importedCandidates) {
                    await tx.transactionImport.update({
                        where: {
                            id: item.rowId,
                        },

                        data: {
                            status: "IMPORTED",
                            transactionId: item.transaction.id,
                            errorMessage: null,
                        },
                    });
                }

                for (const item of candidates) {
                    if (
                        !insertedIds.has(item.transaction.id!)
                    ) {
                        duplicateIds.push(item.rowId);
                    }
                }
            }

            if (duplicateIds.length > 0) {
                await tx.transactionImport.updateMany({
                    where: {
                        importBatchId: batchId,
                        id: { in: duplicateIds },
                    },

                    data: {
                        status: "DUPLICATE",
                        errorMessage:
                            "Matching transaction exists at confirmation",
                    },
                });
            }

            const completedBatch =
                await tx.importBatch.update({
                    where: {
                        id: batchId,
                        userId,
                    },

                    data: {
                        status: "COMPLETED",
                        importedRows: importedCount,
                    },
                });

            return {
                batch: completedBatch,
                importedRows: importedCount,
                alreadyCompleted: false,
            };
        },

        {
            maxWait: 10000,
            timeout: 60000,
        }
    );
}


export async function cancelImport(
    userId: string,
    batchId: string
) {
    const batch = await getOwnedBatch(
        userId,
        batchId
    );

    if (batch.status !== "REVIEW") {
        throw new AppError(
            409,
            "Only unconfirmed imports can be cancelled"
        );
    }

    const result = await prisma.importBatch.deleteMany({
        where: {
            id: batchId,
            userId,
            status: "REVIEW",
        },
    });

    if (result.count === 0) {
        throw new AppError(
            409,
            "Import is no longer available for cancellation"
        );
    }

    return {
        id: batchId,
    };
}
