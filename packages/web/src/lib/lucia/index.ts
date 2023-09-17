// src/lib/lucia.ts
import { lucia } from "lucia";
import { astro } from "lucia/middleware";

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

export type Auth = typeof auth;
