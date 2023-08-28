import { ApiHandler } from "sst/node/api";
import { migrate } from "drizzle-orm/aws-data-api/pg/migrator";

import { db } from "./drizzle";

export const handler = ApiHandler(async () => {
  try {
    await migrate(db, { migrationsFolder: "packages/core/src/drizzle/out" });
    console.log("Migrations Installed complete");

    return {
      statusCode: 200,
      body: "Migrations Installed Successful!",
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: "Migrations Installed Failed - See Logs",
    };
  }
});
