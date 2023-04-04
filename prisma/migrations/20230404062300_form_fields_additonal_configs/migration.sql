-- AlterTable
ALTER TABLE "FieldsOnForms" ADD COLUMN     "helpText" TEXT,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false;
