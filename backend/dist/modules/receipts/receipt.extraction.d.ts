export declare function extractReceiptData(imageBuffer: Buffer): Promise<{
    isTransactionReceipt: boolean;
    amount: string | null;
    currency: string | null;
    date: string | null;
    merchant: string | null;
    description: string | null;
    type: "EXPENSE" | "INCOME" | null;
    suggestedCategory: string | null;
    paymentMethod: "BANK_TRANSFER" | "CARD" | "CASH" | "OTHER" | "UNKNOWN" | "UPI";
    referenceNumber: string | null;
    warnings: string[];
}>;
