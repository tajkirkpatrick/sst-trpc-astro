import { TRPCError, initTRPC } from "@trpc/server";
import * as z from "zod";
import { toZod } from "tozod";

import { usersTable, type NewUser } from "@/drizzle/schema";
import { Context } from "./context";

const insertUserSchema: toZod<NewUser> = z.object({
  fullName: z.string().min(1).optional(),
});

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
      return await ctx.db.select().from(usersTable);
    } catch (err) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong retrieving records from the database.",
      });
    }
  }),
  createRecord: publicProcedure
    .input(insertUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // check if input.fullName is null or undefined
        if (!input.fullName) {
          return new TRPCError({
            code: "BAD_REQUEST",
            cause: new Error("input.fullName is null or undefined"),
            message: "Please provide a name.",
          });
        }

        const newRecord = await ctx.db
          .insert(usersTable)
          .values({ fullName: input.fullName })
          .returning();

        if (newRecord.length === 0) {
          return new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return newRecord;
      } catch (err) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong creating your record.",
          cause: err,
        });
      }
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;