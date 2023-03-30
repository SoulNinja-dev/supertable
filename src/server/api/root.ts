import { createTRPCRouter } from "~/server/api/trpc";
import { baseRouter } from "~/server/api/routers";
import { tableRouter } from "~/server/api/routers";
import { formRouter } from "~/server/api/routers";

export const appRouter = createTRPCRouter({
  base: baseRouter,
  table: tableRouter,
  form: formRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
