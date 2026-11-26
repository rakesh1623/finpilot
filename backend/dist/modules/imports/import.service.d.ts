import { Prisma } from "../../../generated/prisma/index.js";
type RowStatus = "PENDING" | "IMPORTED" | "DUPLICATE" | "REJECTED";
export declare function prepareImport(userId: string, filename: string, buffer: Buffer): Promise<{
    batch: {
        id: string;
        userId: string;
        filename: string;
        status: import("../../../generated/prisma/index.js").$Enums.ImportStatus;
        totalRows: number;
        importedRows: number;
        createdAt: Date;
    };
    summary: {
        totalRows: number;
        readyToImport: number;
        duplicates: number;
        rejected: number;
    };
}>;
export declare function getImportPreview(userId: string, batchId: string, filters: {
    page: number;
    limit: number;
    status?: RowStatus;
}): Promise<{
    batch: {
        id: string;
        userId: string;
        filename: string;
        status: import("../../../generated/prisma/index.js").$Enums.ImportStatus;
        totalRows: number;
        importedRows: number;
        createdAt: Date;
    };
    summary: {
        totalRows: number;
        readyToImport: number;
        duplicates: number;
        rejected: number;
        imported: number;
    };
    rows: {
        id: string;
        importBatchId: string;
        rowNumber: number;
        transactionId: string | null;
        rawData: Prisma.JsonValue;
        normalizedData: Prisma.JsonValue;
        fingerprint: string;
        status: import("../../../generated/prisma/index.js").$Enums.ImportRowStatus;
        errorMessage: string | null;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function listImports(userId: string, page: number, limit: number): Promise<{
    imports: {
        id: string;
        userId: string;
        filename: string;
        status: import("../../../generated/prisma/index.js").$Enums.ImportStatus;
        totalRows: number;
        importedRows: number;
        createdAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function confirmImport(userId: string, batchId: string): Promise<{
    batch: {
        id: string;
        userId: string;
        filename: string;
        status: import("../../../generated/prisma/index.js").$Enums.ImportStatus;
        totalRows: number;
        importedRows: number;
        createdAt: Date;
    };
    importedRows: number;
    alreadyCompleted: boolean;
}>;
export declare function cancelImport(userId: string, batchId: string): Promise<{
    id: string;
}>;
export {};
