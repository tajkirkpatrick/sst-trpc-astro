import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { drizzle } from "drizzle-orm/aws-data-api/pg";

export const db = drizzle(new RDSDataClient({}), {
  database: `${import.meta.env.DB_NAME}`,
  secretArn: `${import.meta.env.DB_SECRET_ARN}`,
  resourceArn: `${import.meta.env.DB_ARN}`,
});
