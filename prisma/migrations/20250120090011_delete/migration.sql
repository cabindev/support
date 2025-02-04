/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `StoreCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_categoryId_fkey`;

-- DropTable
DROP TABLE `Book`;

-- DropTable
DROP TABLE `Category`;

-- CreateIndex
CREATE INDEX `Product_name_idx` ON `Product`(`name`);

-- CreateIndex
CREATE INDEX `Product_stock_idx` ON `Product`(`stock`);

-- CreateIndex
CREATE UNIQUE INDEX `StoreCategory_name_key` ON `StoreCategory`(`name`);

-- RenameIndex
ALTER TABLE `Product` RENAME INDEX `Product_categoryId_fkey` TO `Product_categoryId_idx`;
