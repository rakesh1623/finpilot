import path from "node:path";
import { parse } from "csv-parse/sync";
import ExcelJS from "exceljs";
import { AppError } from "../../utils/AppError.js";
const MAX_ROWS = 1000;
const MAX_COLUMNS = 30;
const REQUIRED_HEADERS = [
    "date",
    "description",
    "amount",
    "type",
];
function normalizeHeader(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
}
function validateHeaders(headers) {
    if (headers.length > MAX_COLUMNS) {
        throw new AppError(400, "Too many columns");
    }
    const nonEmpty = headers.filter(Boolean);
    if (new Set(nonEmpty).size !== nonEmpty.length) {
        throw new AppError(400, "Duplicate column headers");
    }
    const missing = REQUIRED_HEADERS.filter((header) => !headers.includes(header));
    if (missing.length > 0) {
        throw new AppError(400, `Missing required columns: ${missing.join(", ")}`);
    }
}
function validateRowCount(rows) {
    if (rows.length === 0) {
        throw new AppError(400, "File contains no transactions");
    }
    if (rows.length > MAX_ROWS) {
        throw new AppError(400, `Maximum ${MAX_ROWS} transactions are allowed`);
    }
}
function parseCSV(buffer) {
    const records = parse(buffer, {
        bom: true,
        columns: (headers) => {
            const normalized = headers.map(normalizeHeader);
            validateHeaders(normalized);
            return normalized;
        },
        skip_empty_lines: true,
        trim: true,
        max_record_size: 16384,
    });
    return records.map((record, index) => ({
        rowNumber: index + 2,
        rawData: record,
    }));
}
function excelCellValue(cell) {
    const value = cell.value;
    if (value === null || value === undefined) {
        return "";
    }
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }
    if (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean") {
        return String(value);
    }
    if (typeof value === "object" &&
        ("formula" in value || "sharedFormula" in value)) {
        // Do not evaluate or trust cached formula results.
        return "[UNSUPPORTED_FORMULA]";
    }
    return cell.text;
}
async function parseExcel(buffer) {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = new ArrayBuffer(buffer.byteLength);
    new Uint8Array(arrayBuffer).set(buffer);
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
        throw new AppError(400, "Excel file has no worksheets");
    }
    if (worksheet.columnCount > MAX_COLUMNS) {
        throw new AppError(400, "Too many Excel columns");
    }
    const headers = [];
    for (let column = 1; column <= worksheet.columnCount; column++) {
        headers.push(normalizeHeader(excelCellValue(worksheet.getRow(1).getCell(column))));
    }
    validateHeaders(headers);
    const rows = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1)
            return;
        if (rows.length >= MAX_ROWS) {
            throw new AppError(400, `Maximum ${MAX_ROWS} transactions are allowed`);
        }
        const rawData = Object.create(null);
        headers.forEach((header, index) => {
            if (header) {
                rawData[header] = excelCellValue(row.getCell(index + 1)).trim();
            }
        });
        if (Object.values(rawData).every((value) => value === "")) {
            return;
        }
        rows.push({
            rowNumber,
            rawData,
        });
    });
    return rows;
}
export async function parseTransactionFile(filename, buffer) {
    const extension = path.extname(filename).toLowerCase();
    try {
        let rows;
        if (extension === ".csv") {
            rows = parseCSV(buffer);
        }
        else if (extension === ".xlsx") {
            rows = await parseExcel(buffer);
        }
        else {
            throw new AppError(400, "Unsupported file format");
        }
        validateRowCount(rows);
        return rows;
    }
    catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(400, "Unable to parse file. Check the file format and column structure.");
    }
}
//# sourceMappingURL=import.parser.js.map