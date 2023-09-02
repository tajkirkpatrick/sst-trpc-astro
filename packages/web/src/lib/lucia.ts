// src/lib/lucia.ts
import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { db } from "../../../core/src/drizzle";

import { customAdapter } from "./lucia/adapter";

export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: astro(),
  adapter: customAdapter(db),
});

export type Auth = typeof auth;
