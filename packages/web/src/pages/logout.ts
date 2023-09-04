// src/pages/logout.ts
import { auth } from "../lib/lucia";

import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
  const session = await context.locals.auth.validate();
  if (!session) {
    return context.redirect("/", 302);
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);
  // delete session cookie
  context.locals.auth.setSession(null);
  return context.redirect("/", 302);
};
