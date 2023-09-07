import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDS } from "sst/node/rds";
import { RDSDataClient } from "@aws-sdk/client-rds-data";

// Init Drizzle ORM
/**
 * Drizzle ORM instance for the AWS Aurora database
 * @tables see `schema.ts`
 */
export const db = drizzle(new RDSDataClient({}), {
  database: RDS.Database.defaultDatabaseName,
  secretArn: RDS.Database.secretArn,
  resourceArn: RDS.Database.clusterArn,
});
