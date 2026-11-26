
import { createHash } from "node:crypto";
import { Prisma } from "../../../generated/prisma/index.js";

type FingerprintInput = {
    date: string;
    amount: string;
    description: string;
    merchant?: string | null;
    type: "INCOME" | "EXPENSE";
    currency: string;
};

function normalizeText(value?: string | null) {
    return (value ?? "")
        .normalize("NFKC")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export function generateTransactionFingerprint(
    input: FingerprintInput
) {
    const canonicalData = JSON.stringify([
        input.date,
        new Prisma.Decimal(input.amount).toFixed(2),
        normalizeText(input.description),
        normalizeText(input.merchant),
        input.type.toUpperCase(),
        input.currency.toUpperCase(),
    ]);

    return createHash("sha256")
        .update(canonicalData, "utf8")
        .digest("hex");
}
