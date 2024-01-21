-- CreateTable
CREATE TABLE "refferal_logs" (
    "id" TEXT NOT NULL,
    "balance_log_id" TEXT NOT NULL,
    "refferer_id" TEXT NOT NULL,
    "refferal_id" TEXT NOT NULL,

    CONSTRAINT "refferal_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refferal_logs_balance_log_id_key" ON "refferal_logs"("balance_log_id");

-- AddForeignKey
ALTER TABLE "refferal_logs" ADD CONSTRAINT "refferal_logs_balance_log_id_fkey" FOREIGN KEY ("balance_log_id") REFERENCES "balance_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
