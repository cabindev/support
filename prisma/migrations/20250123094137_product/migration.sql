/*
  Warnings:

  - You are about to drop the column `isNewArrival` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isPreorder` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `newUntil` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `preorderDate` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Product_isNewArrival_idx` ON `Product`;

-- DropIndex
DROP INDEX `Product_isPreorder_idx` ON `Product`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `isNewArrival`,
    DROP COLUMN `isPreorder`,
    DROP COLUMN `newUntil`,
    DROP COLUMN `preorderDate`;

-- CreateTable
CREATE TABLE `Size` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Size_name_key`(`name`),
    INDEX `Size_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSize` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `sizeId` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `preorders` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductSize_productId_idx`(`productId`),
    INDEX `ProductSize_sizeId_idx`(`sizeId`),
    INDEX `ProductSize_stock_idx`(`stock`),
    UNIQUE INDEX `ProductSize_productId_sizeId_key`(`productId`, `sizeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
