import { TRPCError } from "@trpc/server";
import { Context } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import axios from "axios";

export default async (ctx: Context) => {
  const account = await ctx.prisma.account.findFirst({
    where: {
      provider: "airtable",
      userId: ctx.session?.user.id,
    },
  });
  account?.expires_at

  if (!account) {
    throw new TRPCError({
      message: "Account not found",
      code: "BAD_REQUEST",
    });
  }

  const accessToken = account.access_token;
  const refreshToken = account.refresh_token;

  if (!accessToken || !refreshToken) {
    throw new TRPCError({
      message: "Access token not found",
      code: "BAD_REQUEST",
    });
  }

  try {
    await axios.get<{ id: string }>("https://api.airtable.com/v0/meta/whoami", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return accessToken;
  } catch (e: any) {
    // console.log(e);

    const credentials = Buffer.from(
      `${env.AIRTABLE_CLIENT_ID}:${env.AIRTABLE_SECRET}`
    ).toString("base64");

    try {
      console.log("REFRESH TOKEN");
      const res = await axios.post(
        `https://airtable.com/oauth2/v1/token`,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: env.AIRTABLE_CLIENT_ID,
          scope: "data.records:write schema.bases:read",
        }),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const { access_token, refresh_token, expires_in, refresh_expires_in } =
        res.data;

      console.log("NEW TOKENS: ", res.data);

      await ctx.prisma.account
        .updateMany({
          where: {
            provider: "airtable",
            userId: ctx.session?.user.id,
          },
          data: {
            access_token,
            refresh_token,
            expires_at: expires_in,
            refresh_expires_in,
          },
        })
        .catch((e) => {
          // console.log(e);
          throw new TRPCError({
            message: "Could not update account",
            code: "INTERNAL_SERVER_ERROR",
          });
        });

      return access_token;
    } catch (e: any) {
      console.log(e.message);
      console.log(e.response.data);
      throw new TRPCError({
        message: "Unauthorized, Relogin",
        code: "BAD_REQUEST",
      });
    }
  }
};
