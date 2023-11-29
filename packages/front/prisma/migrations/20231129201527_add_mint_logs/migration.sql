-- CreateTable
CREATE TABLE "mint_logs" (
    "id" SERIAL NOT NULL,
    "nft_id" INTEGER NOT NULL,
    "balance_log_id" INTEGER NOT NULL,

    CONSTRAINT "mint_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mint_logs_nft_id_key" ON "mint_logs"("nft_id");

-- CreateIndex
CREATE UNIQUE INDEX "mint_logs_balance_log_id_key" ON "mint_logs"("balance_log_id");

-- AddForeignKey
ALTER TABLE "mint_logs" ADD CONSTRAINT "mint_logs_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mint_logs" ADD CONSTRAINT "mint_logs_balance_log_id_fkey" FOREIGN KEY ("balance_log_id") REFERENCES "balance_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
