import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import * as z from "zod";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
const router = t.router;
const publicProcedure = t.procedure;

export const appRouter = router({
  getHello: publicProcedure.query(() => {
    return "Hello World!";
  }),
  sayHello: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      return `Hello ${input.name.toUpperCase()}!`;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
