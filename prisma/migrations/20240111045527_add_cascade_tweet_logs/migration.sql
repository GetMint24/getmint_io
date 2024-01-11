-- DropForeignKey
ALTER TABLE "tweet_logs" DROP CONSTRAINT "tweet_logs_balance_log_id_fkey";

-- AddForeignKey
ALTER TABLE "tweet_logs" ADD CONSTRAINT "tweet_logs_balance_log_id_fkey" FOREIGN KEY ("balance_log_id") REFERENCES "balance_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
