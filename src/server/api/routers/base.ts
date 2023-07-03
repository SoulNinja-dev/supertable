import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import getAccessToken from "~/utils/getAccesstoken";
import getBases from "~/utils/getBases";

const BaseObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
  permissionLevel: z.string().optional(),
});

export type BaseObject = z.infer<typeof BaseObjectValidator>;

export const baseRouter = createTRPCRouter({
  getBases: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .output(
      z.object({
        bases: z.array(BaseObjectValidator),
      })
    )
    .query(async ({ ctx, input }) => {
      // what the following code does
      // 1. get all bases from airtable
      // 2. add new bases which they sent
      // 3. update existing properties
      // 4. filter bases using airtable ids which they sent
      // 5. then send
      console.log("getBases called");

      const data = await ctx.prisma.base.findMany({
        where: {
          userId: ctx.session?.user.id,
        },
        take: input.limit,
        skip: input.offset,
        orderBy: {
          createdAt: "desc",
        },
      });

      return { bases: data };
    }),

  reloadBases: protectedProcedure.mutation(async ({ ctx }) => {
    const accessToken = await getAccessToken(ctx);
    const bases: BaseObject[] = await getBases({ accessToken });
    console.log("bases from airtable: ", bases);

    const prisma = ctx.prisma;
    const userId = ctx.session?.user.id;

    await prisma.base.createMany({
      data: bases.map((base) => ({
        name: base.name,
        airtable: base.id,
        userId: userId,
      })),
      skipDuplicates: true,
    });

    await prisma.$transaction(
      bases.map((base) => {
        return prisma.base.update({
          where: {
            airtable: base.id,
          },
          data: {
            name: base.name,
            airtable: base.id,
            userId: userId,
          },
        });
      })
    );
  }),

  listBases: protectedProcedure
    .output(
      z.object({
        bases: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        ),
      })
    )
    .query(async ({ ctx }) => {
      const prisma = ctx.prisma;
      const userId = ctx.session?.user.id;

      const data = await prisma.base.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return { bases: data };
    }),

  getBase: protectedProcedure
    .input(z.string())
    .output(BaseObjectValidator)
    .query(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.session?.user.id;

      const data = await prisma.base.findUnique({
        where: {
          id: input,
        },
      });

      if (data?.userId !== userId) {
        throw new TRPCError({ message: "Cannot find base", code: "NOT_FOUND" });
      }

      return data;
    }),
});
