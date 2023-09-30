import type { APIRoute } from "astro";
import * as z from "zod";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { googleAuth, auth } from "@/lib/server/lucia";

const googleAuthSchema = z.object({
  storedState: z.string(),
  state: z.string(),
  code: z.string(),
});

export const GET: APIRoute = async (context) => {
  const storedState = context.cookies.get("google_oauth_state")?.value;
  const state = context.url.searchParams.get("state");
  const code = context.url.searchParams.get("code");

  const result = googleAuthSchema.safeParse({
    storedState,
    state,
    code,
  });

  if (!result.success) {
    return new Response(null, { status: 400 });
  }

  if (result.data.storedState !== result.data.state) {
    return new Response(null, { status: 400 });
  }

  try {
    const { createUser, googleUser, getExistingUser } =
      await googleAuth.validateCallback(result.data.code);

    const getUser = async () => {
      try {
        const existingUser = await getExistingUser();
        if (existingUser) return existingUser;
        const user = await createUser({
          attributes: {
            username: googleUser.name as string,
            email: googleUser.email as string,
          },
        });
        return user;
      } catch {
        const user = await createUser({
          attributes: {
            username: googleUser.name as string,
            email: googleUser.email as string,
          },
        });
        return user;
      }
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    context.locals.auth.setSession(session);
    return context.redirect("/", 302); // redirect to profile page
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    console.error(e);
    return new Response(null, {
      status: 500,
    });
  }
};
