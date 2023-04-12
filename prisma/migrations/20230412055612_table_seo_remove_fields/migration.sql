/*
  Warnings:

  - You are about to drop the column `seoDescription` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `seoImage` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `Table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Table" DROP COLUMN "seoDescription",
DROP COLUMN "seoImage",
DROP COLUMN "theme";
