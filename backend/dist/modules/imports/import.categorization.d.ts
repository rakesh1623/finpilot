import type { ValidImportRow } from "./import.validation.js";
type AvailableCategory = {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
};
export declare function suggestCategory(row: ValidImportRow, categories: AvailableCategory[]): AvailableCategory | null;
export {};
