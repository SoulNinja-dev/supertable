/*
  Warnings:

  - You are about to drop the column `airtable_id` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `seoCover` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the `Setting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `table_id` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FieldTypeEnum" AS ENUM ('singleLineText', 'email', 'url', 'multilineText', 'number', 'percent', 'currency', 'singleSelect', 'multipleSelects', 'singleCollaborator', 'multipleCollaborators', 'multipleRecordLinks', 'date', 'dateTime', 'phoneNumber', 'multipleAttachments', 'checkbox', 'formula', 'createdTime', 'rollup', 'count', 'lookup', 'multipleLookupValues', 'autoNumber', 'barcode', 'rating', 'richText', 'duration', 'lastModifiedTime', 'button', 'createdBy', 'lastModifiedBy', 'externalSyncSource', 'attachment');

-- CreateEnum
CREATE TYPE "PrecisionEnum" AS ENUM ('second', 'minute', 'hour');

-- CreateEnum
CREATE TYPE "FormatEnum" AS ENUM ('friendly', 'iso', 'isoWithTime');

-- CreateEnum
CREATE TYPE "ResultTypeEnum" AS ENUM ('number', 'text', 'percent', 'duration');

-- CreateEnum
CREATE TYPE "PhoneFormatEnum" AS ENUM ('V1', 'V2');

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Setting" DROP CONSTRAINT "Setting_user_id_fkey";

-- DropIndex
DROP INDEX "Form_airtable_id_key";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "airtable_id",
DROP COLUMN "seoCover",
DROP COLUMN "user_id",
ADD COLUMN     "contraints" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "seoImage" TEXT,
ADD COLUMN     "submitMsg" TEXT,
ADD COLUMN     "table_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Setting";

-- CreateTable
CREATE TABLE "Base" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "airtable" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "theme" TEXT,
    "seoDescription" TEXT,
    "seoImage" TEXT,

    CONSTRAINT "Base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "airtable" TEXT NOT NULL,
    "base_id" TEXT NOT NULL,
    "theme" TEXT,
    "seoDescription" TEXT,
    "seoImage" TEXT,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "table_id" TEXT NOT NULL,
    "form_id" TEXT,
    "type" "FieldTypeEnum" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Options" (
    "id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "precision" "PrecisionEnum",
    "dateFormat" "FormatEnum",
    "resultType" "ResultTypeEnum",
    "maxValue" DOUBLE PRECISION,
    "minValue" DOUBLE PRECISION,
    "maxLength" INTEGER,
    "phoneFormat" "PhoneFormatEnum",
    "isReversed" BOOLEAN,

    CONSTRAINT "Options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Choice" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "options_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Base_airtable_key" ON "Base"("airtable");

-- CreateIndex
CREATE UNIQUE INDEX "Table_airtable_key" ON "Table"("airtable");

-- AddForeignKey
ALTER TABLE "Base" ADD CONSTRAINT "Base_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "Base"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Options" ADD CONSTRAINT "Options_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_options_id_fkey" FOREIGN KEY ("options_id") REFERENCES "Options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
