import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/out",
  driver: "pg",
  dbCredentials: {
    connectionString: `postgres://tkirk-dev-my-sst-app-database.cluster-cdk7hqadeo0u.us-east-1.rds.amazonaws.com:5432/myDatabase`,
  },
} satisfies Config;
