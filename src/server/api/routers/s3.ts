import { z } from "zod";
import { generatePresignedUrl } from "~/utils/s3";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const s3Router = createTRPCRouter({
  generatePresignedUrl: protectedProcedure.input(
    z.object({
      fileName: z.string(),
      type: z.enum(["cover", "logo", "ogImage"]),
    })
  ).output(z.string()).mutation(async ({ input }) => {
    return await generatePresignedUrl(input.fileName, input.type);
  }),
})