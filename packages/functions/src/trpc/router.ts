import { NewUser } from "./../../../core/src/drizzle/schema";
import { TRPCError, initTRPC } from "@trpc/server";
import * as z from "zod";

import {
  type NewUser,
  customUsersTable,
} from "../../../core/src/drizzle/schema";
import { Context } from "./context";

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
      return await ctx.db.select().from(customUsersTable);
    } catch (err) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Something went wrong retrieving records from the users table.",
      });
    }
  }),
  createRecord: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newRecord = await ctx.db
        .insert(customUsersTable)
        .values({ fullName: input.name })
        .returning();

      if (newRecord.length === 0) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong creating your record.",
        });
      }

      return newRecord;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
