-- AlterTable
ALTER TABLE `Product` ADD COLUMN `status` ENUM('NORMAL', 'PREORDER', 'NEW') NOT NULL DEFAULT 'NORMAL';

-- CreateIndex
CREATE INDEX `Product_status_idx` ON `Product`(`status`);
