import { APIGatewayProxyEventV2 } from "aws-lambda";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";

import { db } from "@my-sst-app/core/drizzle/";

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 * Always available in your resolvers.
 */
interface CreateInnerContextOptions
  extends CreateAWSLambdaContextOptions<APIGatewayProxyEventV2> {}

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
  async function getUserFromHeader() {
    if (opts?.event.headers?.authorization) {
      const sessionId = opts.event.headers.authorization.split(" ")[1];
      console.log("sessionId", sessionId);
      return sessionId;
    }
    return null;
  }
  const user = await getUserFromHeader();

  return {
    db,
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
  // if ever you pass something into createContextInner it must have the types defined in CreateInnerContextOptions and it must be returned from createContextInner from the opts parameter
  const contextInner = await createContextInner({ event, context });
  return {
    ...contextInner,
    event,
    context,
  };
}

export type Context = inferAsyncReturnType<typeof createContextInner>;
