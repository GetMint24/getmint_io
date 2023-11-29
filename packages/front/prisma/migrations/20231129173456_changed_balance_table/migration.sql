/*
  Warnings:

  - The values [REFFERAL,TWITTER_ACTIVITY_DAILY,TWITTER_GETMINT_SUBSCRIPTION,MINT,BRIDGE] on the enum `BalanceLogType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ARRIVAL,EXPENSE] on the enum `BalanceOperation` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cost` on the `balance_logs` table. All the data in the column will be lost.
  - Added the required column `amount` to the `balance_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance` to the `balance_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BalanceLogType_new" AS ENUM ('refferal', 'twitter_activity_daily', 'twitter_getmint_subscription', 'mint', 'bridge');
ALTER TABLE "balance_logs" ALTER COLUMN "type" TYPE "BalanceLogType_new" USING ("type"::text::"BalanceLogType_new");
ALTER TYPE "BalanceLogType" RENAME TO "BalanceLogType_old";
ALTER TYPE "BalanceLogType_new" RENAME TO "BalanceLogType";
DROP TYPE "BalanceLogType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "BalanceOperation_new" AS ENUM ('credit', 'debit');
ALTER TABLE "balance_logs" ALTER COLUMN "operation" TYPE "BalanceOperation_new" USING ("operation"::text::"BalanceOperation_new");
ALTER TYPE "BalanceOperation" RENAME TO "BalanceOperation_old";
ALTER TYPE "BalanceOperation_new" RENAME TO "BalanceOperation";
DROP TYPE "BalanceOperation_old";
COMMIT;

-- AlterTable
ALTER TABLE "balance_logs" DROP COLUMN "cost",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "balance" INTEGER NOT NULL;
