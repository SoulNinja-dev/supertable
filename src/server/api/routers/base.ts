import { z } from "zod";
import axios from "axios";

/*
getBases -> get bases under user account
editBase{baseId} -> edit a base's settings etc
*/

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import getAccessToken from "~/utils/getAccessToken";
import getBases from "~/utils/getBases";

const BaseObjectValidator = z.object({
  id: z.string(),
  name: z.string(),
  permissionLevel: z.string().optional(),
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
      // what the following code does
      // 1. get all bases from airtable
      // 2. get existing bases from user's account
      // 3. filter out bases that already exist
      // 4. create new bases
      // 5. update existing bases properties
      // 6. return bases to user

      const accessToken = await getAccessToken(ctx);
      const bases: BaseObject[] = await getBases({ accessToken });

      const prisma = ctx.prisma;
      const userId = ctx.session?.user.id;

      const existingBases = await prisma.base.findMany({
        where: {
          user_id: userId,
        },
        select: {
          id: true,
          airtable: true,
        },
      });

      const existingBaseIds = existingBases.map((base) => base.airtable);
      const newBases = bases.filter(
        (base) => !existingBaseIds.includes(base.id)
      );

      const baseUpdates = bases
        .filter((base) => existingBaseIds.includes(base.id))
        .map((base) => ({
          where: { airtable: base.id },
          data: {
            name: base.name,
          },
        }));

      const baseCreates = newBases.map((base) => ({
        airtable: base.id,
        name: base.name,
        user_id: userId,
      }));

      await prisma.base.createMany({ data: baseCreates });
      await Promise.all(
        baseUpdates.map((update) =>
          prisma.base.update({
            ...update,
            select: { id: true },
          })
        )
      );

      // return bases to user
      const data = await prisma.base.findMany({
        where: {
          user_id: userId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return { bases: data };
    }),

  editBase: protectedProcedure
    .input(
      z.object({
        baseId: z.string(),
        domain: z.string().optional(),
        theme: z.string().optional(),
        seoDescription: z.string().optional(),
        seoImage: z.string().optional(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // get base from baseid
      // update properties from input

      const prisma = ctx.prisma;
      const baseId = input.baseId;

      try {
        await prisma.base.update({
          where: {
            id: baseId,
          },
          data: {
            domain: input.domain,
            theme: input.theme,
            seoDescription: input.seoDescription,
            seoImage: input.seoImage,
          },
        });
        return { success: true };
      } catch (e) {
        console.log(e);
        return { success: false };
      }
    }),
});
