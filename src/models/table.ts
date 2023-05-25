import { z } from "zod";
import { FormObjectValidator } from "./form";

const FieldTypeValidator = z.enum([
  "checkbox",
  "currency",
  "multipleAttachments",
  "duration",
  "url",
  "multilineText",
  "singleLineText",
  "phoneNumber",
  "percent",
  "number",
  "multipleSelects",
  "date",
  "rating",
  "email",
  "singleSelect",
  "multipleRecordLinks",
  "multipleLookupValues"
]);

export type FieldType = z.infer<typeof FieldTypeValidator>;

export const FieldValidator = z.object({
  id: z.string(),
  tableId: z.string(),
  type: FieldTypeValidator,
  name: z.string(),
  description: z.string().nullable(),
  options: z.any()
  // options: z.union([
  //   z.undefined(),
  //   z.object({
  //     icon: z.string().optional(),
  //     color: z.string().optional(),
  //   }),
  //   z.object({
  //     choices: z.array(
  //       z.object({
  //         id: z.string(),
  //         color: z.string().optional(),
  //         name: z.string(),
  //       })
  //     ),
  //   }),
  //   z.object({
  //     precision: z.number(),
  //   }),
  //   z.object({
  //     format: z.enum(["friendly", "iso", "isoWithTime"]),
  //   }),
  //   z.object({
  //     resultType: z.enum(["number", "text", "percent", "duration"]),
  //   }),
  //   z.object({
  //     maxValue: z.number().optional(),
  //     minValue: z.number().optional(),
  //   }),
  //   z.object({
  //     maxLength: z.number().optional(),
  //   }),
  //   z.object({
  //     format: z.enum(["phone", "e164"]),
  //   }),
  //   z.object({
  //     format: z.enum(["V1", "V2"]),
  //   }),
  //   z.object({
  //     isReversed: z.boolean(),
  //   }),
  // ]),
});

export type Field = z.infer<typeof FieldValidator>;

export const FullTableObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  airtable: z.string(),

  fields: z.array(FieldValidator),
  forms: z.array(z.object({
    id: z.string(),
    title: z.string().nullable(),
  })),
  customDomain: z.string().nullable(),
});

export type FullTableObject = z.infer<typeof FullTableObjectValidator>;
