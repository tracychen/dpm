-- AlterTable
ALTER TABLE "User" ADD COLUMN     "custodialAddress" TEXT,
ADD COLUMN     "erc20TokenAirdropHash" TEXT,
ADD COLUMN     "nativeTokenAirdropHash" TEXT,
ADD COLUMN     "privateKey" TEXT;
