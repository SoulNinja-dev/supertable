import { TRPCError } from "@trpc/server";
import { Context } from "~/server/api/trpc";


export default async function getAccessToken(ctx: Context) {
  if (!ctx.session?.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }

  const user = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.session?.user.id,
    },
    select: {
      airtablePersonalAccessToken: true,
    },
  });

  if (!user?.airtablePersonalAccessToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in and have airtable access token to access this resource",
    })
  }

  return user.airtablePersonalAccessToken;
}