// src/lib/lucia.ts
import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { google } from "@lucia-auth/oauth/providers";

import { customAdapter } from "./adapter";
import { db } from "../drizzle";

import * as schema from "@my-sst-app/core/src/drizzle/schema";

export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  experimental: {
    debugMode: true,
  },
  middleware: astro(),
  adapter: customAdapter(db, {
    user: "usersTable",
    session: "sessionsTable",
    key: "keysTable",
    schema,
  }),
  getUserAttributes(databaseUser) {
    return {
      username: databaseUser.username,
    };
  },
});

export const googleAuth = google(auth, {
  clientId:
    "943546793372-j7psht0e3sb9csropeiidgo1r4hnqm9r.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "http://localhost:4321/auth/google/callback",
  scope: ["email", "profile"],
});

export type Auth = typeof auth;
