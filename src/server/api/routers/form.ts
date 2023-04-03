import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { FormObjectValidator, FullFormObjectValidator } from "~/models/form";

export const formRouter = createTRPCRouter({
  getForms: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
      })
    )
    .output(
      z.array(
        z.object({
          id: z.string(),
          slug: z.string().nullable(),
          title: z.string().nullable(),
          description: z.string().nullable(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const forms: {
        id: string;
        slug: string | null;
        title: string | null;
        description: string | null;
      }[] = await ctx.prisma.form.findMany({
        where: {
          tableId: input.tableId,
        },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
        },
      });
      
      return forms;
    }),

  getForm: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      })
    )
    .output(
      FullFormObjectValidator
    )
    .mutation(async ({ ctx, input }) => {
      const formId = input.formId;

      const form: any = await ctx.prisma.form.findUnique({
        where: {
          id: formId,
        },
        include: {
          fields: {
            select: {
              fieldId: true,
              index: true
            }
          },
        }
      });
      if (!form) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }
      return form;
    }),

  createForm: protectedProcedure
    .input(
      z.object({
        baseId: z.string(),
        tableId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        slug: z.string().optional(),
        seoDescription: z.string().optional(),
        seoImage: z.string().optional(),
        headerImage: z.string().optional(),
        connectWallet: z.boolean().optional(),
        submitMsg: z.string().optional(),
        contraints: z.string().optional(),
        coverImage: z.string().optional(),
        
      })
    )
    .output(
      FormObjectValidator
    )
    .mutation(async ({ ctx, input }) => {
      const userId = await ctx.prisma.base.findUnique({
        where: {
          id: input.baseId,
        },
        select: {
          userId: true,
        },
      });

      if (!userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Base not found",
        });
      }

      if (userId.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "naughty behavior",
        });
      }
      const form = await ctx.prisma.form.create({
        data: {
          tableId: input.tableId,
          title: input.title,
          description: input.description,
          slug: input.slug,
          seoDescription: input.seoDescription,
          seoImage: input.seoImage,
          headerImage: input.headerImage,
          connectWallet: input.connectWallet,
          submitMsg: input.submitMsg,
          contraints: input.contraints,
          coverImage: input.coverImage,
        },
      });
      console.log("CREATED FORM: ", form);

      return form;
    }),

  editForm: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        slug: z.string().optional(),
        seoDescription: z.string().optional(),
        seoImage: z.string().optional(),
        headerImage: z.string().optional(),
        connectWallet: z.boolean().optional(),
        submitMsg: z.string().optional(),
        contraints: z.string().optional(),
        coverImage: z.string().optional(),
        theme: z.enum(["classic", "dark", "monochromatic"]).optional(),
        themeColor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const form = await ctx.prisma.form.update({
          where: {
            id: input.formId,
          },
          data: {
            title: input.title,
            description: input.description,
            slug: input.slug,
            seoDescription: input.seoDescription,
            seoImage: input.seoImage,
            headerImage: input.headerImage,
            connectWallet: input.connectWallet,
            submitMsg: input.submitMsg,
            contraints: input.contraints,
            coverImage: input.coverImage,
            theme: input.theme,
            themeColor: input.themeColor,
          },
        });
        
        
        return { success: true };
      } catch (e) {
        console.log("EDIT FORM ERROR: ", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error editing form",
        });
      }
    }),

  editFormFields: protectedProcedure.input(z.object({
    formId: z.string(),
    fields: z.array(z.string())
  })).mutation(async ({ ctx, input }) => {
    try {
      console.log(input)
      await ctx.prisma.fieldsOnForms.deleteMany({
        where: {
          formId: input.formId
        }
      })
      await ctx.prisma.fieldsOnForms.createMany({
        data: input.fields.map((fieldId, index) => ({
          fieldId,
          formId: input.formId,
          index
        }))
      })
      return { success: true }
    } catch (e) {
      console.log("EDIT FORM FIELDS ERROR: ", e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error editing form fields",
      });
    }
  }),

  deleteForm: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
        baseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // check if user owns form
      // get base id from user
      // get user id and match with session.user.id

      const userId = await ctx.prisma.base.findUnique({
        where: {
          id: input.baseId,
        },
        select: {
          userId: true,
        },
      });

      if (!userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Base not found",
        });
      }

      if (userId.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "naughty behavior",
        });
      }

      try {
        await ctx.prisma.form.delete({
          where: {
            id: input.formId,
          },
        });
        return { success: true };
      } catch (e) {
        console.log("DELETE FORM ERROR: ", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting form",
        });
      }
    }),
});
