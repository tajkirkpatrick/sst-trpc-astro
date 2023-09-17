import { APIGatewayProxyEventV2 } from "aws-lambda";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { sql } from "drizzle-orm";

import { db } from "@my-sst-app/core/drizzle/";

export const preparedUserQuery = db.query.usersTable
  .findMany({
    columns: {
      createdAt: false,
      id: false,
    },
  })
  .prepare("preparedUserQuery");

const preparedSessionQuery = db.query.sessionsTable
  .findFirst({
    where: (sessionsTable, { eq }) =>
      eq(sessionsTable.id, sql.placeholder("sessionId")),
    with: {
      user: true,
    },
    columns: {
      userId: false,
    },
  })
  .prepare("preparedSessionAndUserQuery");

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 * Always available in your resolvers.
 */
interface CreateInnerContextOptions
  extends CreateAWSLambdaContextOptions<APIGatewayProxyEventV2> {
  sessionAndUser: SessionAndUserType;
}

async function getSessionFromHeaders(event: APIGatewayProxyEventV2) {
  if (event.headers?.authorization) {
    const authHeader = event.headers?.authorization;
    if (!authHeader) {
      return null;
    }

    const result = preparedSessionQuery.execute({
      sessionId: authHeader.split(" ")[1],
    });

    return result || null;
  }
  return null;
}

type SessionAndUserType = inferAsyncReturnType<typeof getSessionFromHeaders>;

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
    session: opts?.sessionAndUser,
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
  const sessionAndUser = await getSessionFromHeaders(event);

  // console.log("sessionAndUser", sessionAndUser);

  const contextInner = await createContextInner({
    context,
    event,
    sessionAndUser,
  });

  return {
    ...contextInner,
    event,
    context,
  };
}

export type Context = inferAsyncReturnType<typeof createContextInner>;
