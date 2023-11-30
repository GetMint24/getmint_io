/*
  Warnings:

  - A unique constraint covering the columns `[pinata_image_hash]` on the table `nfts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "nfts_pinata_image_hash_key" ON "nfts"("pinata_image_hash");
