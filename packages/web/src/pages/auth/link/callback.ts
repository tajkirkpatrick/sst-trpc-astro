import type { APIRoute } from "astro";
import queryString from "query-string";
import jwt_decode from "jwt-decode";

import { auth } from "@/lib/server/lucia";

interface DecodedToken {
  type: string;
  properties: {
    email: string;
  };
  iat: number;
}

export const GET: APIRoute = async (ctx) => {
  try {
    const { token } = queryString.parse(new URL(ctx.request.url).search);

    if (!token) {
      return new Response("Token Not Found", { status: 400 });
    }

    const decoded = jwt_decode<DecodedToken>(token.toString());
    const email = decoded.properties.email;

    const key = await auth.useKey("email", email, null);

    if (!key) {
      return new Response("Error creating session", { status: 500 });
    }

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    ctx.locals.auth.setSession(session);

    return ctx.redirect("/");
  } catch (e) {
    console.error(e);

    return new Response("Error", { status: 500 });
  }
};
