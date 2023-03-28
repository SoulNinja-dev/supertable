import { z } from "zod";

export const FieldValidator = z.object({
  id: z.string(),
  type: z.enum([
    "singleLineText",
    "email",
    "url",
    "multilineText",
    "number",
    "percent",
    "currency",
    "singleSelect",
    "multipleSelects",
    "singleCollaborator",
    "multipleCollaborators",
    "multipleRecordLinks",
    "date",
    "dateTime",
    "phoneNumber",
    "multipleAttachments",
    "checkbox",
    "formula",
    "createdTime",
    "rollup",
    "count",
    "lookup",
    "multipleLookupValues",
    "autoNumber",
    "barcode",
    "rating",
    "richText",
    "duration",
    "lastModifiedTime",
    "button",
    "createdBy",
    "lastModifiedBy",
    "externalSyncSource",
    "attachment",
  ]),
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
