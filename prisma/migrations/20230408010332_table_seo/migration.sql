/*
  Warnings:

  - You are about to drop the column `domain` on the `Base` table. All the data in the column will be lost.
  - You are about to drop the column `seoDescription` on the `Base` table. All the data in the column will be lost.
  - You are about to drop the column `seoImage` on the `Base` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `Base` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Base" DROP COLUMN "domain",
DROP COLUMN "seoDescription",
DROP COLUMN "seoImage",
DROP COLUMN "theme";

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "customDomain" TEXT;
