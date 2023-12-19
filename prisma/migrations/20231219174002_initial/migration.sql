-- CreateEnum
CREATE TYPE "BalanceOperation" AS ENUM ('credit', 'debit');

-- CreateEnum
CREATE TYPE "BalanceLogType" AS ENUM ('refferal', 'twitter_activity_daily', 'twitter_getmint_subscription', 'mint', 'bridge');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metamask_wallet_address" TEXT NOT NULL,
    "followed_getmint_twitter" BOOLEAN NOT NULL DEFAULT false,
    "twitter_enabled" BOOLEAN NOT NULL DEFAULT false,
    "twitter_login" TEXT,
    "avatar" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfts" (
    "id" TEXT NOT NULL,
    "pinata_image_hash" TEXT NOT NULL,
    "pinata_json_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenId" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balance_logs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "operation" "BalanceOperation" NOT NULL,
    "type" "BalanceLogType" NOT NULL,
    "description" TEXT,

    CONSTRAINT "balance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mint_logs" (
    "id" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "balance_log_id" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,

    CONSTRAINT "mint_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nft_chain_connection" (
    "id" TEXT NOT NULL,
    "chain_id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,

    CONSTRAINT "nft_chain_connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chains" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "lz_chain" INTEGER NOT NULL,

    CONSTRAINT "chains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_metamask_wallet_address_key" ON "users"("metamask_wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "nfts_pinata_image_hash_key" ON "nfts"("pinata_image_hash");

-- CreateIndex
CREATE UNIQUE INDEX "nfts_pinata_json_hash_key" ON "nfts"("pinata_json_hash");

-- CreateIndex
CREATE UNIQUE INDEX "mint_logs_nft_id_key" ON "mint_logs"("nft_id");

-- CreateIndex
CREATE UNIQUE INDEX "mint_logs_balance_log_id_key" ON "mint_logs"("balance_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "mint_logs_transaction_hash_key" ON "mint_logs"("transaction_hash");

-- CreateIndex
CREATE UNIQUE INDEX "chains_chain_id_key" ON "chains"("chain_id");

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_logs" ADD CONSTRAINT "balance_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mint_logs" ADD CONSTRAINT "mint_logs_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mint_logs" ADD CONSTRAINT "mint_logs_balance_log_id_fkey" FOREIGN KEY ("balance_log_id") REFERENCES "balance_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_chain_connection" ADD CONSTRAINT "nft_chain_connection_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_chain_connection" ADD CONSTRAINT "nft_chain_connection_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
