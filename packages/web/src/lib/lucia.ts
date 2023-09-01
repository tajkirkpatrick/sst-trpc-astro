// src/lib/lucia.ts
import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { pg } from "@lucia-auth/adapter-postgresql";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: `postgres://newuser:newpassword@${import.meta.env.DB_URL}/${
    import.meta.env.DB_TABLE
  }`,
});

// expect error
export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: astro(),
  adapter: pg(pool, {
    user: "auth_users",
    session: "auth_sessions",
    key: "auth_keys",
  }),
});

export type Auth = typeof auth;
