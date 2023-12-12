-- CreateTable
CREATE TABLE "MarketOutcomeHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "marketId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MarketOutcomeHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketOutcomeHistory_marketId_optionId_idx" ON "MarketOutcomeHistory"("marketId", "optionId");

-- RenameIndex
ALTER INDEX "marketId" RENAME TO "Post_marketId_idx";
