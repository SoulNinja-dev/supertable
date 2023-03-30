import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const formRouter = createTRPCRouter({
  getForms: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
      })
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
      console.log("GET FORMS:", forms);
      return { forms };
    }),

  getForm: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const formId = input.formId;

      const form: any = await ctx.prisma.form.findUnique({
        where: {
          id: formId,
        },
      });
      if (!form) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }
      return { form };
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
      })
    )
    .query(async ({ ctx, input }) => {
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
        },
      });
      console.log("CREATED FORM: ", form);

      return { form };
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
      })
    )
    .query(async ({ ctx, input }) => {
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
          },
        });

        console.log("EDITED FORM: ", form);
        return { success: true };
      } catch (e) {
        console.log("EDIT FORM ERROR: ", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error editing form",
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
