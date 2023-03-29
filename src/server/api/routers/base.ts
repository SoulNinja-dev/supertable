import { z } from "zod";

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
      // 2. get existing bases from user's account
      // 3. filter out bases that already exist
      // 4. create new bases
      // 5. update existing bases properties
      // 6. return bases to user

      const accessToken = await getAccessToken(ctx);
      const bases: BaseObject[] = await getBases({ accessToken });
      console.log("BASES 1: ", bases);

      const prisma = ctx.prisma;
      const userId = ctx.session?.user.id;
      console.log("USER ID: ", userId);

      const existingBases = await prisma.base.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          airtable: true,
        },
      });
      console.log("EXISTING BASES: ", existingBases);

      const existingBaseIds = existingBases.map((base) => base.airtable);
      console.log("EXISTING BASE IDS: ", existingBaseIds);

      // filter existing base ids out of bases
      const newBases = bases.filter((base) => {
        return !existingBaseIds.includes(base.id);
      });
      console.log("NEW BASES: ", newBases);

      const baseUpdates = bases
        .filter((base) => existingBaseIds.includes(base.id))
        .map((base) => ({
          where: { airtable: base.id },
          data: {
            name: base.name,
          },
        }));
      console.log("BASE UPDATES: ", baseUpdates);

      const baseCreates = newBases.map((base) => ({
        airtable: base.id,
        name: base.name,
        userId,
      }));
      console.log("BASE CREATES: ", baseCreates);

      await prisma.base.createMany({ data: baseCreates });
      await Promise.all(
        baseUpdates.map((update) =>
          prisma.base.update({
            ...update,
          })
        )
      );

      // return bases to user
      const data = await prisma.base.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          name: true,
        },
      });
      console.log("BASES NEW: ", data);

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
    .query(async ({ ctx, input }) => {
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
            domain: input.domain != null ? input.domain : undefined,
            theme: input.theme != null ? input.theme : undefined,
            seoDescription:
              input.seoDescription != null ? input.seoDescription : undefined,
            seoImage: input.seoImage != null ? input.seoImage : undefined,
          },
        });
        return { success: true };
      } catch (e) {
        console.log(e);
        return { success: false };
      }
    }),
});
