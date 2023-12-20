/*
  Warnings:

  - You are about to drop the `nft_chain_connection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chain_id` to the `nfts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "nft_chain_connection" DROP CONSTRAINT "nft_chain_connection_chain_id_fkey";

-- DropForeignKey
ALTER TABLE "nft_chain_connection" DROP CONSTRAINT "nft_chain_connection_nftId_fkey";

-- AlterTable
ALTER TABLE "nfts" ADD COLUMN     "chain_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "nft_chain_connection";

-- CreateTable
CREATE TABLE "bridge_logs" (
    "id" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "balance_log_id" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "previousChain" TEXT NOT NULL,
    "nextChain" TEXT NOT NULL,

    CONSTRAINT "bridge_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bridge_logs_nft_id_key" ON "bridge_logs"("nft_id");

-- CreateIndex
CREATE UNIQUE INDEX "bridge_logs_balance_log_id_key" ON "bridge_logs"("balance_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "bridge_logs_transaction_hash_key" ON "bridge_logs"("transaction_hash");

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bridge_logs" ADD CONSTRAINT "bridge_logs_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bridge_logs" ADD CONSTRAINT "bridge_logs_balance_log_id_fkey" FOREIGN KEY ("balance_log_id") REFERENCES "balance_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
