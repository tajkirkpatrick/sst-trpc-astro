import {
  TRPCError,
  inferRouterInputs,
  inferRouterOutputs,
  initTRPC,
} from "@trpc/server";
import * as z from "zod";
import { toZod } from "tozod";

import { usersTable, type NewUser } from "@my-sst-app/core/drizzle/schema";
import { Context, preparedUserQuery } from "./context";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

type PostCreateInput = RouterInput["createRecord"];
export type PostCreateOutput = RouterOutput["createRecord"];

// @ts-ignore
const insertUserSchema: toZod<NewUser> = z.object({
  username: z.string().min(1),
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

const isAuthed = t.middleware((opts) => {
  const { ctx } = opts;
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      session: ctx.session,
    },
  });
});

const protectedProcedure = t.procedure.use(isAuthed);

export const appRouter = router({
  getRecords: publicProcedure.query(async () => {
    try {
      return await preparedUserQuery.execute();
    } catch (err) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong retrieving records from the database.",
        cause: err,
      });
    }
  }),
  createRecord: publicProcedure
    .input(insertUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // check if input.fullName is null or undefined
        if (!input.username) {
          return new TRPCError({
            code: "BAD_REQUEST",
            cause: new Error("input.username is null or undefined"),
            message: "Please provide a username.",
          });
        }

        const newRecord = await ctx.db
          .insert(usersTable)
          .values({ username: input.username })
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
