/*
  Warnings:

  - Added the required column `sizeId` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CartItem` ADD COLUMN `sizeId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `CartItem_productId_sizeId_idx` ON `CartItem`(`productId`, `sizeId`);

-- CreateIndex
CREATE INDEX `ProductSize_stock_idx` ON `ProductSize`(`stock`);

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_sizeId_fkey` FOREIGN KEY (`productId`, `sizeId`) REFERENCES `ProductSize`(`productId`, `sizeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
