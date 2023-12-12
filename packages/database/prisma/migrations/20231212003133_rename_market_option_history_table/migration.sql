/*
  Warnings:

  - You are about to drop the `MarketOutcomeHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MarketOutcomeHistory";

-- CreateTable
CREATE TABLE "MarketOptionHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "marketId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MarketOptionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketOptionHistory_marketId_optionId_idx" ON "MarketOptionHistory"("marketId", "optionId");
