import { Prisma } from "../../../generated/prisma/index.js";
import { type UpdateReceipt } from "./receipt.validation.js";
export declare function scanReceipt(userId: string, filename: string, buffer: Buffer): Promise<{
    receipt: {
        id: string;
        userId: string;
        transactionId: string | null;
        filename: string;
        imageHash: string;
        status: import("../../../generated/prisma/index.js").$Enums.ReceiptStatus;
        extractedData: Prisma.JsonValue;
        reviewedData: Prisma.JsonValue;
        fingerprint: string | null;
        duplicateDetected: boolean;
        duplicateTransactionId: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    alreadyScanned: boolean;
}>;
export declare function getReceipt(userId: string, receiptId: string): Promise<{
    id: string;
    userId: string;
    transactionId: string | null;
    filename: string;
    imageHash: string;
    status: import("../../../generated/prisma/index.js").$Enums.ReceiptStatus;
    extractedData: Prisma.JsonValue;
    reviewedData: Prisma.JsonValue;
    fingerprint: string | null;
    duplicateDetected: boolean;
    duplicateTransactionId: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function listReceipts(userId: string, filters: {
    page: number;
    limit: number;
    status?: "REVIEW" | "COMPLETED";
}): Promise<{
    receipts: {
        createdAt: Date;
        duplicateDetected: boolean;
        filename: string;
        id: string;
        reviewedData: Prisma.JsonValue;
        status: import("../../../generated/prisma/index.js").$Enums.ReceiptStatus;
        transactionId: string | null;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function updateReceipt(userId: string, receiptId: string, updates: UpdateReceipt): Promise<{
    id: string;
    userId: string;
    transactionId: string | null;
    filename: string;
    imageHash: string;
    status: import("../../../generated/prisma/index.js").$Enums.ReceiptStatus;
    extractedData: Prisma.JsonValue;
    reviewedData: Prisma.JsonValue;
    fingerprint: string | null;
    duplicateDetected: boolean;
    duplicateTransactionId: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function confirmReceipt(userId: string, receiptId: string): Promise<{
    receipt: {
        id: string;
        userId: string;
        transactionId: string | null;
        filename: string;
        imageHash: string;
        status: import("../../../generated/prisma/index.js").$Enums.ReceiptStatus;
        extractedData: Prisma.JsonValue;
        reviewedData: Prisma.JsonValue;
        fingerprint: string | null;
        duplicateDetected: boolean;
        duplicateTransactionId: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    transactionId: string | null;
    alreadyCompleted: boolean;
}>;
export declare function cancelReceipt(userId: string, receiptId: string): Promise<{
    id: string;
}>;
