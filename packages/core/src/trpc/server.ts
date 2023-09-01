import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { appRouter } from "./config/router";
import { createContext } from "./config/context";

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
