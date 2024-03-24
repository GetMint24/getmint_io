-- CreateEnum
CREATE TYPE "NetworkType" AS ENUM ('layer_zero', 'hyperlane');

-- AlterTable
ALTER TABLE "nfts" ADD COLUMN     "network_type" "NetworkType" DEFAULT 'layer_zero';
