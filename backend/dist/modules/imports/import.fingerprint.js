import { createHash } from "node:crypto";
import { Prisma } from "../../../generated/prisma/index.js";
function normalizeText(value) {
    return (value ?? "")
        .normalize("NFKC")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}
export function generateTransactionFingerprint(input) {
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
//# sourceMappingURL=import.fingerprint.js.map