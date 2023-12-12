/*
  Warnings:

  - You are about to drop the `UserShares` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserShares" DROP CONSTRAINT "UserShares_marketId_fkey";

-- DropForeignKey
ALTER TABLE "UserShares" DROP CONSTRAINT "UserShares_optionId_fkey";

-- DropForeignKey
ALTER TABLE "UserShares" DROP CONSTRAINT "UserShares_userId_fkey";

-- DropTable
DROP TABLE "UserShares";

-- CreateTable
CREATE TABLE "UserShare" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "outcome" "Outcome" NOT NULL,
    "shares" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserShare_userId_idx" ON "UserShare"("userId");

-- AddForeignKey
ALTER TABLE "UserShare" ADD CONSTRAINT "UserShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserShare" ADD CONSTRAINT "UserShare_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserShare" ADD CONSTRAINT "UserShare_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
