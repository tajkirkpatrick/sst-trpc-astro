import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/context";

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
