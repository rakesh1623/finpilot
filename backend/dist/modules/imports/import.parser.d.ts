export type ParsedImportRow = {
    rowNumber: number;
    rawData: Record<string, string>;
};
export declare function parseTransactionFile(filename: string, buffer: Buffer): Promise<ParsedImportRow[]>;
