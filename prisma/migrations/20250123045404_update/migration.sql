-- AlterTable
ALTER TABLE `Product` ADD COLUMN `isNewArrival` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isPreorder` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `newUntil` DATETIME(3) NULL,
    ADD COLUMN `preorderDate` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `Product_isPreorder_idx` ON `Product`(`isPreorder`);

-- CreateIndex
CREATE INDEX `Product_isNewArrival_idx` ON `Product`(`isNewArrival`);
