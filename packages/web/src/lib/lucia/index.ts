// src/lib/lucia.ts
import { lucia } from "lucia";
import { astro } from "lucia/middleware";

import { customAdapter } from "./adapter";
import { db } from "../drizzle";

export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  experimental: {
    debugMode: true,
  },
  middleware: astro(),
  adapter: customAdapter(db, {
    user: "users",
    session: "auth_sessions",
    key: "auth_keys",
  }),
  getUserAttributes(databaseUser) {
    return {
      username: databaseUser.username,
    };
  },
});

export type Auth = typeof auth;
