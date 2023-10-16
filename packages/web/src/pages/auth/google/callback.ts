import { auth, googleAuth } from "@/lib/server/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import type { APIRoute } from "astro";
import { db } from "@/lib/server/drizzle";
import { userDetailsTable } from "@my-sst-app/core/src/drizzle/schema";
import * as z from "zod";

const googleAuthSchema = z.object({
  storedState: z.string(),
  state: z.string(),
  code: z.string(),
});

export const GET: APIRoute = async (context) => {
  const storedState = context.cookies.get("google_oauth_state")?.value;

  if (!storedState) {
    context.redirect("/auth/login", 302);
  }

  const state = context.url.searchParams.get("state");
  const code = context.url.searchParams.get("code");

  const result = googleAuthSchema.safeParse({
    storedState,
    state,
    code,
  });

  if (!result.success || result.data.storedState !== result.data.state) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const { createUser, googleUser, getExistingUser, createKey } =
      await googleAuth.validateCallback(result.data.code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      if (!googleUser.email_verified) {
        throw new Error("Email not verified");
      }

      const existingDatabaseUserWithEmail = await db.query.usersTable.findFirst(
        {
          where: (users, { eq }) => eq(users.email, googleUser.email as string),
        },
      );

      if (existingDatabaseUserWithEmail) {
        const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail);

        await db
          .insert(userDetailsTable)
          .values({
            userId: user.userId,
            displayName: googleUser.name as string,
            firstName: null,
            lastName: null,
            verified: true,
          })
          .onConflictDoUpdate({
            target: userDetailsTable.userId,
            set: {
              userId: user.userId,
              displayName: googleUser.name as string,
              firstName: null,
              lastName: null,
              verified: true,
            },
          });

        await createKey(user.userId);

        return user;
      }

      const user = await createUser({
        attributes: {
          email: googleUser.email as string,
        },
      });

      await db.insert(userDetailsTable).values({
        userId: user.userId,
        displayName: googleUser.name as string,
        firstName: null,
        lastName: null,
        // do you trust the user has a verified email just because they used oauth to login?
        // verified: true,
      });

      return user;
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
      console.error(e);
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
