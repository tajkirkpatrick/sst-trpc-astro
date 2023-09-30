// import { RDSDataClient } from "@aws-sdk/client-rds-data";
// import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@my-sst-app/core/src/drizzle/schema";

// export const db = drizzle(new RDSDataClient({}), {
//   database: `${import.meta.env.DB_NAME}`,
//   secretArn: `${import.meta.env.DB_SECRET_ARN}`,
//   resourceArn: `${import.meta.env.DB_ARN}`,
//   schema,
// });

const pool = new Pool({
  host: "127.0.0.1",
  port: 32768,
  user: "postgres",
  password: "postgres",
  database: "serverless",
});

export const db = drizzle(pool, { schema, logger: true });
