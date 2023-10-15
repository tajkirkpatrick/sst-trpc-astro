// src/lib/lucia.ts
import { eq } from "drizzle-orm";
import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { google } from "@lucia-auth/oauth/providers";
import { __experimental_joinAdapters as joinAdapters } from "lucia/utils";

import { customAdapter } from "./adapter";
import { db } from "../drizzle";

import * as schema from "@my-sst-app/core/src/drizzle/schema";

export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  experimental: {
    debugMode: true,
  },
  middleware: astro(),
  adapter: joinAdapters(
    customAdapter(db, {
      user: "usersTable",
      session: "sessionsTable",
      key: "keysTable",
      schema,
    }),
    {
      getSessionAndUser: async (sessionId) => {
        if (!sessionId) return [null, null];

        const session = await db
          .select()
          .from(schema.sessionsTable)
          .where(eq(schema.sessionsTable.id, sessionId))
          .then((res) => res[0] ?? null);
        if (!session) return [null, null];

        const user = await db
          .select({
            email: schema.usersTable.email,
            createdAt: schema.usersTable.createdAt,
            displayName: schema.userDetailsTable.displayName,
            verified: schema.userDetailsTable.verified,
          })
          .from(schema.usersTable)
          .where(eq(schema.usersTable.id, session.userId))
          .leftJoin(
            schema.userDetailsTable,
            eq(schema.userDetailsTable.userId, schema.usersTable.id),
          )
          .then((res) => res[0] ?? null);
        if (!user) return [null, null];

        return [session, user];
      },
    },
  ),
  getUserAttributes(databaseUser) {
    return {
      email: databaseUser.email,
      createdAt: databaseUser.createdAt,
      displayName: databaseUser.displayName,
      verified: databaseUser.verified,
    };
  },
});

export const googleAuth = google(auth, {
  clientId: import.meta.env.GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:4321/auth/google/callback",
  scope: ["https://www.googleapis.com/auth/userinfo.email"],
});

export type Auth = typeof auth;
