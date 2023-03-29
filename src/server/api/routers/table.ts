import { z } from "zod";
import axios from "axios";

/*
getBases -> get bases under user account
editBase{baseId} -> edit a base's settings etc
*/

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import getAccessToken from "~/utils/getAccessToken";
import { FullTableObjectValidator } from "~/models/table";
import getBaseSchema from "~/utils/getBaseSchema";

const TableObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export type TableObject = z.infer<typeof TableObjectValidator>;

export const tableRouter = createTRPCRouter({
  // get tables under a base
  getTables: protectedProcedure
    .input(
      z.object({
        baseId: z.string(),
      })
    )
    .output(
      z.object({
        tables: z.array(TableObjectValidator),
      })
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getAccessToken(ctx);
      const baseId = input.baseId;

      /*
        we have to create new records on the db
        and add the fields as well if the table is new 
        and update the existing ones if it's changed
      */
      const data = await getBaseSchema({ accessToken, baseId });
      const tables = data.map(
        (table: { id: string; name: string; description?: string }) => ({
          id: table.id,
          name: table.name,
          description: table.description,
        })
      );
      return { tables };
    }),

  getTable: protectedProcedure.query(() => {
    return {
      id: "123",
      name: "test",
      description: "test",
      fields: [
        {
          id: "123",
          name: "test",
          type: "text",
          description: "test",
          options: [],
        },
      ],
    };
  }),
  editTable: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        theme: z.string().optional(),
        seoDescription: z.string().optional(),
        seoImage: z.string().optional(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
      })
    )
    .query(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const id = input.id;

      await prisma.base.update({
        where: {
          id,
        },
        data: {
          theme: input.theme != null ? input.theme : undefined,
          seoDescription:
            input.seoDescription != null ? input.seoDescription : undefined,
          seoImage: input.seoImage != null ? input.seoImage : undefined,
        },
      });
      return { success: true };
    }),
});
