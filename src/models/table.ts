import { z } from "zod";

const FieldTypeValidator = z.enum([
  "checkbox",
  "currency",
  "attachment",
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
]);

export type FieldType = z.infer<typeof FieldTypeValidator>;

export const FieldValidator = z.object({
  id: z.string(),
  type: FieldTypeValidator,
  name: z.string(),
  description: z.string().optional(),
  options: z.union([
    z.undefined(),
    z.object({
      choices: z.array(
        z.object({
          id: z.string(),
          color: z.string().optional(),
          name: z.string(),
        })
      ),
    }),
    z.object({
      precision: z.enum(["second", "minute", "hour"]),
    }),
    z.object({
      format: z.enum(["friendly", "iso", "isoWithTime"]),
    }),
    z.object({
      resultType: z.enum(["number", "text", "percent", "duration"]),
    }),
    z.object({
      maxValue: z.number().optional(),
      minValue: z.number().optional(),
    }),
    z.object({
      maxLength: z.number().optional(),
    }),
    z.object({
      format: z.enum(["phone", "e164"]),
    }),
    z.object({
      format: z.enum(["V1", "V2"]),
    }),
    z.object({
      isReversed: z.boolean(),
    }),
  ]),
});

export const FullTableObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  fields: z.array(FieldValidator),
});

export type TableObject = z.infer<typeof FullTableObjectValidator>;
