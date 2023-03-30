import { z } from "zod";

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
      // 2. add new bases which they sent
      // 3. update existing properties
      // 4. filter bases using airtable ids which they sent
      // 5. then send

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
