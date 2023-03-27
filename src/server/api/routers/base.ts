/* eslint-disable @typescript-eslint/restrict-template-expressions */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import axios from "axios";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import getAccessToken from "~/utils/getAccessToken";

export const baseRouter = createTRPCRouter({
  getBases: protectedProcedure
    .output(
      z.object({
        bases: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            permissionLevel: z.string(),
          })
        ),
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
        tables: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
          })
        ),
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
});

// getBases -> get bases from the user
// getTables from baseid -> get all tables from baseid
// getFields from tableid -> get all fields from baseid:tableid
// createFields from tableid
// getForms from tableid
// setForms from tableid

const BaseObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
  permissionLevel: z.string(),
});

export type BaseObject = z.infer<typeof BaseObjectValidator>;

const TableObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
});

export type TableObject = z.infer<typeof TableObjectValidator>;
