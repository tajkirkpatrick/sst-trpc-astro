// import { drizzle } from "drizzle-orm/aws-data-api/pg";
// import { RDS } from "sst/node/rds";
// import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Init Drizzle ORM
/**
 * Drizzle ORM instance for the AWS Aurora database
 * @tables see `schema.ts`
 */
// export const db = drizzle(new RDSDataClient({}), {
//   database: RDS.Database.defaultDatabaseName,
//   secretArn: RDS.Database.secretArn,
//   resourceArn: RDS.Database.clusterArn,
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
