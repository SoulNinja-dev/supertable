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
    .output(
      z.object({
        bases: z.array(BaseObjectValidator),
      })
    )
    .query(async ({ ctx }) => {
      // what the following code does
      // 1. get all bases from airtable
      // 2. add new bases which they sent
      // 3. update existing properties
      // 4. filter bases using airtable ids which they sent
      // 5. then send
      console.log("getBases called")

      const accessToken = await getAccessToken(ctx);
      const bases: BaseObject[] = await getBases({ accessToken });
      console.log("bases from airtable: ", bases);

      const prisma = ctx.prisma;
      const userId = ctx.session?.user.id;

      const existingBases = await prisma.base.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          airtable: true,
        },
      });
      console.log("bases from db: ", existingBases);

      const existingBaseIds = existingBases.map((base) => base.airtable);

      // filter existing base ids out of bases
      const newBases = bases.filter((base) => {
        return !existingBaseIds.includes(base.id);
      });
      console.log("new bases created on airtable: ", newBases);

      const baseCreates = newBases.map((base) => ({
        airtable: base.id,
        name: base.name,
        userId,
      }));
      console.log("proper objects to be added to the db: ", baseCreates);

      await prisma.base.createMany({ data: baseCreates });

      // update properties
      for (const base of existingBases) {
        const airtableBase = bases.find((b) => b.id === base.airtable);
        if (airtableBase) {
          await prisma.base.update({
            where: {
              id: base.id,
            },
            data: {
              name: airtableBase.name,
            },
          });
        }
      }

      const data = await prisma.base.findMany({
        where: {
          userId,
          airtable: {
            in: bases.map((base) => base.id),
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      console.log("updated and filtered bases: ", data);
      return { bases: data };
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
