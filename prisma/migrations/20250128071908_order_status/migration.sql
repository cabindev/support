/*
  Warnings:

  - The values [SHIPPING,COMPLETED] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `compressedUrl` on the `PaymentSlip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'PAID', 'VERIFIED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `PaymentSlip` DROP COLUMN `compressedUrl`;
