import { inferAsyncReturnType } from "@trpc/server";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({
  event,
}); // simple context

export type Context = inferAsyncReturnType<typeof createContext>;
