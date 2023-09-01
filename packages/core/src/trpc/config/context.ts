import { APIGatewayProxyEventV2 } from "aws-lambda";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";

import { db } from "@/drizzle";

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 * Always available in your resolvers.
 */
interface CreateInnerContextOptions
  extends Partial<CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>> {
  db: typeof db | null;
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
  const contextInner = await createContextInner();
  return {
    ...contextInner,
    event,
    context,
  };
}

export type Context = inferAsyncReturnType<typeof createContextInner>;
