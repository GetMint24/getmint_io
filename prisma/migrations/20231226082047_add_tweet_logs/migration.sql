-- AlterEnum
ALTER TYPE "BalanceLogType" ADD VALUE 'create_tweet';

-- CreateTable
CREATE TABLE "tweet_logs" (
    "id" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "balance_log_id" TEXT NOT NULL,
    "tweet_id" TEXT NOT NULL,

    CONSTRAINT "tweet_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tweet_logs_nft_id_key" ON "tweet_logs"("nft_id");

-- CreateIndex
CREATE UNIQUE INDEX "tweet_logs_balance_log_id_key" ON "tweet_logs"("balance_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "tweet_logs_tweet_id_key" ON "tweet_logs"("tweet_id");

-- AddForeignKey
ALTER TABLE "tweet_logs" ADD CONSTRAINT "tweet_logs_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tweet_logs" ADD CONSTRAINT "tweet_logs_balance_log_id_fkey" FOREIGN KEY ("balance_log_id") REFERENCES "balance_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
