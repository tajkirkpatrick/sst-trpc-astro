import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDS } from "sst/node/rds";
import { RDSDataClient } from "@aws-sdk/client-rds-data";

// Init Drizzle ORM
export const db = drizzle(new RDSDataClient({ region: "us-east-1" }), {
  database: RDS.Database.defaultDatabaseName,
  secretArn: RDS.Database.secretArn,
  resourceArn: RDS.Database.clusterArn,
});
