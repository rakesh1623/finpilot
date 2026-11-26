/*
  Warnings:

  - A unique constraint covering the columns `[importBatchId,rowNumber]` on the table `TransactionImport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rowNumber` to the `TransactionImport` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TransactionImport_importBatchId_fingerprint_key";

-- AlterTable
ALTER TABLE "TransactionImport" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "rowNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "TransactionImport_fingerprint_idx" ON "TransactionImport"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionImport_importBatchId_rowNumber_key" ON "TransactionImport"("importBatchId", "rowNumber");
