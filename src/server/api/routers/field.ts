import { z } from "zod";
import axios from "axios";

/*
getBases -> get bases under user account
editBase{baseId} -> edit a base's settings etc
*/

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import getAccessToken from "~/utils/getAccesstoken";
import { FullTableObjectValidator } from "~/models/table";

const BaseObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
  permissionLevel: z.string(),
});

const TableObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export type BaseObject = z.infer<typeof BaseObjectValidator>;
export type TableObject = z.infer<typeof TableObjectValidator>;

export const baseRouter = createTRPCRouter({
  getBases: protectedProcedure
    .output(
      z.object({
        bases: z.array(BaseObjectValidator),
      })
    )
    .query(async ({ ctx }) => {
      const accessToken = await getAccessToken(ctx);
      try {
        const res = await axios.get("https://api.airtable.com/v0/meta/bases", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return res.data;
      } catch (e: any) {
        console.log(JSON.stringify(e));
        throw new TRPCError({
          message: "Error fetching bases",
          code: "BAD_REQUEST",
        });
      }
    }),

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
      try {
        const res = await axios.get(
          `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const tables = res.data.tables.map(
          (table: { id: string; name: string; description?: string }) => ({
            id: table.id,
            name: table.name,
            description: table.description,
          })
        );
        return { tables };
      } catch (e: any) {
        console.log(JSON.stringify(e));
        throw new TRPCError({
          message: "Error fetching bases",
          code: "BAD_REQUEST",
        });
      }
    }),

  getTable: protectedProcedure
    .input(
      z.object({
        baseId: z.string(),
        tableId: z.string(),
      })
    )
    .output(FullTableObjectValidator)
    .query(async ({ ctx, input }) => {
      const accessToken = await getAccessToken(ctx);

      const baseId = input.baseId;
      try {
        const res = await axios.get<{ tables: any[] }>(
          `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const table = res.data.tables.find(
          (table) => table.id === input.tableId
        );

        if (!table) {
          throw new TRPCError({
            message: "Table not found",
            code: "BAD_REQUEST",
          });
        }

        return table;
      } catch (e: any) {
        console.log(JSON.stringify(e));
        throw new TRPCError({
          message: "Error fetching bases",
          code: "BAD_REQUEST",
        });
      }
    }),
});
