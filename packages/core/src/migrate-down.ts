import { ApiHandler } from "sst/node/api";
import { sql } from "drizzle-orm";

import { db } from "./drizzle";

export const handler = ApiHandler(async () => {
  try {
    await db.execute(
      sql`DO $$ 
      BEGIN 
          EXECUTE (SELECT 'TRUNCATE TABLE drizzle.__drizzle_migrations; ' || string_agg('DROP TABLE IF EXISTS public."' || table_name || '" CASCADE;', ' ') FROM information_schema.tables WHERE table_schema = 'public'); 
      END $$;
      `
    );
    console.log("Migrations Drop Complete");
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "Migrations Drop Failed: " + JSON.stringify(err),
    };
  }
  return {
    statusCode: 200,
    body: "Migrations Drop Complete",
  };
});
