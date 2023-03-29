/*
  Warnings:

  - You are about to drop the column `user_id` on the `Base` table. All the data in the column will be lost.
  - You are about to drop the column `options_id` on the `Choice` table. All the data in the column will be lost.
  - You are about to drop the column `form_id` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `table_id` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `table_id` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `field_id` on the `Options` table. All the data in the column will be lost.
  - You are about to drop the column `base_id` on the `Table` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Base` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionsId` to the `Choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableId` to the `Field` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieldId` to the `Options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseId` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Base" DROP CONSTRAINT "Base_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_options_id_fkey";

-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_form_id_fkey";

-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_table_id_fkey";

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_table_id_fkey";

-- DropForeignKey
ALTER TABLE "Options" DROP CONSTRAINT "Options_field_id_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_base_id_fkey";

-- AlterTable
ALTER TABLE "Base" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Choice" DROP COLUMN "options_id",
ADD COLUMN     "optionsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Field" DROP COLUMN "form_id",
DROP COLUMN "table_id",
ADD COLUMN     "formId" TEXT,
ADD COLUMN     "tableId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "table_id",
ADD COLUMN     "tableId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Options" DROP COLUMN "field_id",
ADD COLUMN     "fieldId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "base_id",
ADD COLUMN     "baseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Base" ADD CONSTRAINT "Base_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "Base"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Options" ADD CONSTRAINT "Options_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_optionsId_fkey" FOREIGN KEY ("optionsId") REFERENCES "Options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
