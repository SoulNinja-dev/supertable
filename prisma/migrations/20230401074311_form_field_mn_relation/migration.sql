/*
  Warnings:

  - The values [singleCollaborator,multipleCollaborators,multipleRecordLinks,dateTime,formula,createdTime,rollup,count,lookup,multipleLookupValues,autoNumber,barcode,richText,lastModifiedTime,button,createdBy,lastModifiedBy,externalSyncSource,attachment] on the enum `FieldTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `formId` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the `Choice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Options` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `connectWallet` on table `Form` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FieldTypeEnum_new" AS ENUM ('checkbox', 'currency', 'multipleAttachments', 'duration', 'url', 'multilineText', 'singleLineText', 'phoneNumber', 'percent', 'number', 'multipleSelects', 'date', 'rating', 'email', 'singleSelect');
ALTER TABLE "Field" ALTER COLUMN "type" TYPE "FieldTypeEnum_new" USING ("type"::text::"FieldTypeEnum_new");
ALTER TYPE "FieldTypeEnum" RENAME TO "FieldTypeEnum_old";
ALTER TYPE "FieldTypeEnum_new" RENAME TO "FieldTypeEnum";
DROP TYPE "FieldTypeEnum_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_optionsId_fkey";

-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_formId_fkey";

-- DropForeignKey
ALTER TABLE "Options" DROP CONSTRAINT "Options_fieldId_fkey";

-- AlterTable
ALTER TABLE "Field" DROP COLUMN "createdAt",
DROP COLUMN "formId",
DROP COLUMN "updatedAt",
ADD COLUMN     "options" JSONB[];

-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "connectWallet" SET NOT NULL,
ALTER COLUMN "connectWallet" SET DEFAULT false;

-- DropTable
DROP TABLE "Choice";

-- DropTable
DROP TABLE "Options";

-- DropEnum
DROP TYPE "FormatEnum";

-- DropEnum
DROP TYPE "PhoneFormatEnum";

-- DropEnum
DROP TYPE "PrecisionEnum";

-- DropEnum
DROP TYPE "ResultTypeEnum";

-- CreateTable
CREATE TABLE "FieldsOnForms" (
    "fieldId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "FieldsOnForms_pkey" PRIMARY KEY ("fieldId","formId")
);

-- AddForeignKey
ALTER TABLE "FieldsOnForms" ADD CONSTRAINT "FieldsOnForms_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldsOnForms" ADD CONSTRAINT "FieldsOnForms_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
