import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/out",
  driver: "pg",
  dbCredentials: {
    connectionString:
      "postgresql://postgres:postgres@localhost:32768/serverless",
  },
} satisfies Config;
