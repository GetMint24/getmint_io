-- CreateEnum
CREATE TYPE "BalanceOperation" AS ENUM ('ARRIVAL', 'EXPENSE');

-- CreateEnum
CREATE TYPE "BalanceLogType" AS ENUM ('REFFERAL', 'TWITTER_ACTIVITY_DAILY', 'TWITTER_GETMINT_SUBSCRIPTION', 'MINT', 'BRIDGE');

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
    "cost" INTEGER NOT NULL,
    "operation" "BalanceOperation" NOT NULL,
    "type" "BalanceLogType" NOT NULL,
    "description" TEXT,

    CONSTRAINT "balance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_metamask_wallet_address_key" ON "users"("metamask_wallet_address");

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_logs" ADD CONSTRAINT "balance_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
