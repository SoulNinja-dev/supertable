import { FieldTypeEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { FullTableObjectValidator, type FullTableObject } from "~/models/table";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import getAccessToken from "~/utils/getAccesstoken";
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
      console.log(data);
      // cleaning airtable output
      const tables = data.map(({ id, name, description, fields }) => ({
        id,
        name,
        description,
        fields,
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

      const tableIds = tables.map((table) => table.id);
      const removedTableIds = existingTableIds.filter(
        (id) => !tableIds.includes(id)
      );

      // delete removed tables
      await prisma.table.deleteMany({
        where: {
          baseId,
          airtable: {
            in: removedTableIds,
          },
        },
      });

      // filter existing table ids out of tables
      const newTables = tables.filter((table) => {
        return !existingTableIds.includes(table.id);
      });

      // create new tables in db
      const tableCreates = newTables.map((table) => ({
        airtable: table.id,
        name: table.name,
        description: table.description,
        baseId,
        fields: table.fields,
      }));

      await prisma.table.createMany({
        data: tableCreates.map(
          ({ baseId, airtable, name, fields, description }) => ({
            baseId,
            airtable,
            name,
            description: description || "",
          })
        ),
      });

      // update properties
      for (const table of existingTables) {
        const airtableTable = tables.find((t) => t.id === table.airtable);
        if (airtableTable) {
          await prisma.field.deleteMany({
            where: {
              tableId: table.id,
              AND: {
                NOT: {
                  id: {
                    in: airtableTable.fields.map((field) => field.id),
                  },
                },
              },
            },
          });

          await prisma.table.update({
            where: {
              id: table.id,
            },
            data: {
              name: airtableTable.name,
              description: airtableTable.description || "",
              fields: {
                upsert: airtableTable.fields.map(
                  ({ id, name, type, description, options }) => ({
                    create: {
                      id,
                      name,
                      type: type as FieldTypeEnum,
                      description: description || "",
                      options: options || undefined,
                    },
                    where: {
                      id,
                    },
                    update: {
                      name,
                      type: type as FieldTypeEnum,
                      description,
                      options: options || undefined,
                    },
                  })
                ),
              },
            },
          });

          // await prisma.field.createMany({
          //   data: airtableTable.fields.map(({id, name, type, description, options}) => ({
          //     id,
          //     name,
          //     type: type as FieldTypeEnum,
          //     description: description || "",
          //     options: options || undefined,
          //     tableId: airtableTable.id,
          //   })),
          //   skipDuplicates: true,
          // });

          // await prisma.field.deleteMany({
          //   where: {
          //     tableId: airtableTable.id,
          //     AND: {
          //       NOT: {
          //         id: {
          //           in: airtableTable.fields.map((field) => field.id),
          //         },
          //       },
          //     }
          //   },
          // });

          // await prisma.field.updateMany({
          //   where: {
          //     tableId: airtableTable.id,
          //   }
          // })
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

  getAllTableInfos: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      )
    )
    .query(async ({ ctx }) => {
      const tables = await ctx.prisma.table.findMany({
        where: {
          base: {
            userId: ctx.session.user.id,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return tables;
    }),

  getTable: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
      })
    )
    .output(FullTableObjectValidator)
    .query(async ({ ctx, input }) => {
      const table = await ctx.prisma.table.findUnique({
        where: {
          id: input.tableId,
        },
        include: {
          fields: true,
          forms: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!table || table == null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "table not found",
        });
      }

      return table;
    }),

  editTable: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        customDomain: z.string().optional(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const id = input.id;

      await prisma.table.update({
        where: {
          id,
        },
        data: {
          customDomain:
            input.customDomain != null ? input.customDomain : undefined,
        },
      });
      return { success: true };
    }),
});
