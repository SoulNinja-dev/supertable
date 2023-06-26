-- DropForeignKey
ALTER TABLE "Base" DROP CONSTRAINT "Base_userId_fkey";

-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_baseId_fkey";

-- AddForeignKey
ALTER TABLE "Base" ADD CONSTRAINT "Base_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "Base"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;
