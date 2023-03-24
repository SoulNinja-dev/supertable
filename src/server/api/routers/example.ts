import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  sendMessage: publicProcedure.input(z.string()).mutation(({ input }) => {
    console.log(`Client says ${input}`);
    return "thanks for the message";
  }),
});
