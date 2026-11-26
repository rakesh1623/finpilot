-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('REVIEW', 'COMPLETED');

-- CreateTable
CREATE TABLE "ReceiptScan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT,
    "filename" TEXT NOT NULL,
    "imageHash" TEXT NOT NULL,
    "status" "ReceiptStatus" NOT NULL DEFAULT 'REVIEW',
    "extractedData" JSONB NOT NULL,
    "reviewedData" JSONB NOT NULL,
    "fingerprint" TEXT,
    "duplicateDetected" BOOLEAN NOT NULL DEFAULT false,
    "duplicateTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReceiptScan_transactionId_key" ON "ReceiptScan"("transactionId");

-- CreateIndex
CREATE INDEX "ReceiptScan_userId_createdAt_idx" ON "ReceiptScan"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ReceiptScan_userId_imageHash_idx" ON "ReceiptScan"("userId", "imageHash");

-- CreateIndex
CREATE INDEX "ReceiptScan_userId_status_idx" ON "ReceiptScan"("userId", "status");

-- AddForeignKey
ALTER TABLE "ReceiptScan" ADD CONSTRAINT "ReceiptScan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptScan" ADD CONSTRAINT "ReceiptScan_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
