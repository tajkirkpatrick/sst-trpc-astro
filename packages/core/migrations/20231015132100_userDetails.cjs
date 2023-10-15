const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    CREATE TABLE IF NOT EXISTS "user_details" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_id" varchar(26) NOT NULL,
      "first_name" text,
      "last_name" text,
      "display_name" text
    );
    --> statement-breakpoint
    CREATE UNIQUE INDEX IF NOT EXISTS "user_id_idx" ON "user_details" ("user_id");--> statement-breakpoint
    DO $$ BEGIN
    ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
    WHEN duplicate_object THEN null;
    END $$;
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    ALTER TABLE "user_details" DROP CONSTRAINT IF EXISTS "user_details_user_id_users_id_fk";
    DROP INDEX IF EXISTS "user_id_idx";
    DROP TABLE IF EXISTS "user_details";
  `.execute(db);
}

module.exports = { up, down };
