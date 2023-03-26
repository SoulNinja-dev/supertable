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
      const account = await ctx.prisma.account.findFirst({
        where: {
          provider: "airtable",
          userId: ctx.session?.user.id,
        },
      });

      if (!account) {
        throw new Error("Account not found");
      }

      const accessToken = account.access_token;

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const res = await axios.get("https://api.airtable.com/v0/meta/bases", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("BASES:::", res);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return res.data;
    }),
});
