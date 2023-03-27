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
  getSchemas: protectedProcedure
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
    .query(async ({ ctx, input }) => {
      const accessToken = await getAccessToken(ctx);
      try {
        const res = await axios.get("https://api.airtable.com/v0/meta/bases", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("BASES!!: ", res.data);

        return res.data;
      } catch (e: any) {
        console.log(JSON.stringify(e));
        throw new TRPCError({
          message: "Error fetching bases",
          code: "BAD_REQUEST",
        });
      }
    }),
});
