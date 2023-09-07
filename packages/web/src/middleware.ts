import { auth } from "@/lib/lucia";
import type { MiddlewareResponseHandler } from "astro";

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
  context.locals.auth = auth.handleRequest(context);
  const session = await auth.handleRequest(context).validate();

  if (session) {
    context.request.headers.set("Authorization", `Bearer ${session.sessionId}`);
  }

  return await next();
};
