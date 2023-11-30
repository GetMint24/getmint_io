-- CreateEnum
CREATE TYPE "BalanceOperation" AS ENUM ('credit', 'debit');

-- CreateEnum
CREATE TYPE "BalanceLogType" AS ENUM ('refferal', 'twitter_activity_daily', 'twitter_getmint_subscription', 'mint', 'bridge');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metamask_wallet_address" TEXT NOT NULL,
    "followed_getmint_twitter" BOOLEAN NOT NULL DEFAULT false,
    "twitter_enabled" BOOLEAN NOT NULL DEFAULT false,
    "twitter_login" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfts" (
    "id" SERIAL NOT NULL,
    "pinata_image_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balance_logs" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "operation" "BalanceOperation" NOT NULL,
    "type" "BalanceLogType" NOT NULL,
    "description" TEXT,

    CONSTRAINT "balance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mint_logs" (
    "id" SERIAL NOT NULL,
    "nft_id" INTEGER NOT NULL,
    "balance_log_id" INTEGER NOT NULL,

    CONSTRAINT "mint_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_metamask_wallet_address_key" ON "users"("metamask_wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "mint_logs_nft_id_key" ON "mint_logs"("nft_id");

-- CreateIndex
CREATE UNIQUE INDEX "mint_logs_balance_log_id_key" ON "mint_logs"("balance_log_id");

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_logs" ADD CONSTRAINT "balance_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mint_logs" ADD CONSTRAINT "mint_logs_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mint_logs" ADD CONSTRAINT "mint_logs_balance_log_id_fkey" FOREIGN KEY ("balance_log_id") REFERENCES "balance_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
