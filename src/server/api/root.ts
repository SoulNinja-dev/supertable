import { createTRPCRouter } from "~/server/api/trpc";
import { baseRouter, s3Router, tableRouter, formRouter, userRouter } from "~/server/api/routers";

export const appRouter = createTRPCRouter({
  base: baseRouter,
  table: tableRouter,
  form: formRouter,
  s3: s3Router,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
