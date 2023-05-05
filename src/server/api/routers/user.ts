import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  verifyAirtable: protectedProcedure
    .output(z.boolean())
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      console.log("userId:", userId);
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          airtablePersonalAccessToken: true,
        },
      });

      if (!user) {
        return false;
      }

      if (!user.airtablePersonalAccessToken) {
        return false;
      }

      try {
        await getAirtableUser(user.airtablePersonalAccessToken);
        return true;
      } catch (err: any) {
        const message: string | undefined = err?.response?.data?.error?.message;
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: message || "Could not verify Airtable access token",
        });
      }
    }),

  updateAirtableAccessToken: protectedProcedure
    .input(z.string())
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      console.log("userId:", userId);

      try {
        await getAirtableUser(input);
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not verify Airtable access token",
        });
      }
      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          airtablePersonalAccessToken: input,
        },
      });
      return true;
    }),
});

const getAirtableUser = async (accessToken: string) => {
  const res = await axios.get<{ id: string }>(
    "https://api.airtable.com/v0/meta/whoami",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("Whoami:", res.data);
  return res.data;
};
