import { z } from 'zod';

export const FormObjectValidator = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  tableId: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  slug: z.string().nullable(),
  seoDescription: z.string().nullable(),
  seoImage: z.string().nullable(),
  headerImage: z.string().nullable(),
  connectWallet: z.boolean(),
  theme: z.enum(["classic", "dark", "monochromatic"]),
  themeColor: z.string().nullable(),
  submitMsg: z.string().nullable(),
  contraints: z.string().nullable(),
  coverImage: z.string().nullable(),
  logo: z.string().nullable(),
})

export type FormObject = z.infer<typeof FormObjectValidator>;

export const FullFormObjectValidator = FormObjectValidator.and(z.object({
  fields: z.array(z.object({
    fieldId: z.string(),
    index: z.number(),
    required: z.boolean(),
    helpText: z.string().nullable(),
  }))
}))

export type FullFormObject = z.infer<typeof FullFormObjectValidator>;