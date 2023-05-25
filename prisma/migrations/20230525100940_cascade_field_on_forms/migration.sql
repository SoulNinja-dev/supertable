-- DropForeignKey
ALTER TABLE "FieldsOnForms" DROP CONSTRAINT "FieldsOnForms_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "FieldsOnForms" DROP CONSTRAINT "FieldsOnForms_formId_fkey";

-- AddForeignKey
ALTER TABLE "FieldsOnForms" ADD CONSTRAINT "FieldsOnForms_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldsOnForms" ADD CONSTRAINT "FieldsOnForms_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
