/*
  Warnings:

  - The `theme` column on the `Form` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('classic', 'dark', 'monochromatic');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "themeColor" TEXT,
DROP COLUMN "theme",
ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'classic';
