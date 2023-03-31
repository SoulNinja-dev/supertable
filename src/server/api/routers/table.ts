import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import getAccessToken from "~/utils/getAccessToken";
import getBaseSchema from "~/utils/getBaseSchema";

const TableObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
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
      const accessToken: string = await getAccessToken(ctx);
      const { baseId } = input;
      const airtable = await ctx.prisma.base
        .findUnique({
          where: {
            id: baseId,
          },
          select: {
            airtable: true,
          },
        })
        .then((base) => {
          if (!base)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "base not found - wrong baseId",
            });
          return base.airtable;
        });

      const data = await getBaseSchema({ accessToken, baseId: airtable });

      // cleaning airtable output
      const tables: TableObject[] = data.map((table: TableObject) => ({
        id: table.id,
        name: table.name,
        description: table.description != null ? table.description : "",
      }));

      // get current tables stored in db under the base
      const prisma = ctx.prisma;

      const existingTables = await prisma.table.findMany({
        where: {
          baseId,
        },
        select: {
          id: true,
          airtable: true,
        },
      });

      const existingTableIds = existingTables.map((table) => table.airtable);

      // filter existing table ids out of tables
      const newTables = tables.filter((table: TableObject) => {
        return !existingTableIds.includes(table.id);
      });

      // create new tables in db
      const tableCreates = newTables.map((table: TableObject) => ({
        airtable: table.id,
        name: table.name,
        description: table.description != null ? table.description : "",
        baseId,
      }));

      await prisma.table.createMany({
        data: tableCreates,
      });

      // update properties
      for (const table of existingTables) {
        const airtableTable = tables.find((t) => t.id === table.airtable);
        if (airtableTable) {
          await prisma.table.update({
            where: {
              id: table.id,
            },
            data: {
              name: airtableTable.name,
            },
          });
        }
      }

      const filtered: TableObject[] = await prisma.table.findMany({
        where: {
          baseId,
          airtable: {
            in: tables.map((table) => table.id),
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      return { tables: filtered };
    }),

  getTable: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const table = await ctx.prisma.table.findUnique({
        where: {
          id: input.tableId,
        },
        include: {
          fields: true,
          forms: true,
        },
      });
      if (!table) {
        return null;
      }
      return { table };
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

      await prisma.table.update({
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
