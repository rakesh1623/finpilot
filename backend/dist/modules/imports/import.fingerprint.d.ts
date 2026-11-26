type FingerprintInput = {
    date: string;
    amount: string;
    description: string;
    merchant?: string | null;
    type: "INCOME" | "EXPENSE";
    currency: string;
};
export declare function generateTransactionFingerprint(input: FingerprintInput): string;
export {};
