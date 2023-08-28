import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import * as z from "zod";

import * as schema from "../../../core/src/drizzle/schema";

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
  getRecords: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.select().from(schema.usersTable);
    } catch (err) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: JSON.stringify(err),
      });
    }
  }),
  createRecord: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newRecord = await ctx.db
        .insert(schema.usersTable)
        .values({ fullName: input.name })
        .returning();

      if (newRecord.length === 0) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }

      return newRecord;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
