-- AlterTable
ALTER TABLE "chains" ADD COLUMN     "available_bridge_types" "NetworkType"[] DEFAULT ARRAY[]::"NetworkType"[];
