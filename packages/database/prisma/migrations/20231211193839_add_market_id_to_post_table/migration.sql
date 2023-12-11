-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "marketId" TEXT;

-- CreateIndex
CREATE INDEX "marketId" ON "Post"("marketId");
