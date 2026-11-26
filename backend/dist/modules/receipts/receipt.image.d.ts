export declare function prepareReceiptImage(buffer: Buffer): Promise<{
    buffer: Buffer<ArrayBuffer>;
    imageHash: string;
    mimeType: string;
}>;
