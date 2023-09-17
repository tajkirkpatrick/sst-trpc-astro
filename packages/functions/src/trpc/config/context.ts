import { APIGatewayProxyEventV2 } from "aws-lambda";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { eq } from "drizzle-orm";

import { db } from "@my-sst-app/core/drizzle/";
import { sessionsTable, type Session } from "@my-sst-app/core/drizzle/schema";

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 * Always available in your resolvers.
 */
interface CreateInnerContextOptions
  extends CreateAWSLambdaContextOptions<APIGatewayProxyEventV2> {
  session: Session | null;
}

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContextInner(opts?: CreateInnerContextOptions) {
  return {
    db,
    session: opts?.session,
  };
}

/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContext({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) {
  async function getSessionFromHeaders() {
    if (event.headers?.authorization) {
      const userSession = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.id, event.headers.authorization.split(" ")[1]));

      if (userSession.length === 0) return null;

      return userSession[0];
    }
    return null;
  }

  const session = await getSessionFromHeaders();

  const contextInner = await createContextInner({ context, event, session });

  return {
    ...contextInner,
    event,
    context,
  };
}

export type Context = inferAsyncReturnType<typeof createContextInner>;
