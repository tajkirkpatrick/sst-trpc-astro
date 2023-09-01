const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" varchar(26) PRIMARY KEY NOT NULL,
      "full_name" text
    );
    --> statement-breakpoint
    CREATE TABLE IF NOT EXISTS "auth_keys" (
      "id" varchar(255) PRIMARY KEY NOT NULL,
      "user_id" varchar(15) NOT NULL,
      "hashed_password" varchar(255)
    );
    --> statement-breakpoint
    CREATE TABLE IF NOT EXISTS "auth_sessions" (
      "id" varchar(128) PRIMARY KEY NOT NULL,
      "user_id" varchar(15) NOT NULL,
      "active_expires" bigint NOT NULL,
      "idle_expires" bigint NOT NULL
    );
    --> statement-breakpoint
    DO $$ BEGIN
    ALTER TABLE "auth_keys" ADD CONSTRAINT "auth_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
    EXCEPTION
    WHEN duplicate_object THEN null;
    END $$;
    --> statement-breakpoint
    DO $$ BEGIN
    ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
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
    -- First, drop the foreign key constraints
    ALTER TABLE IF EXISTS "auth_keys" DROP CONSTRAINT IF EXISTS "auth_keys_user_id_users_id_fk";
    --> statement-breakpoint
    ALTER TABLE IF EXISTS "auth_sessions" DROP CONSTRAINT IF EXISTS "auth_sessions_user_id_users_id_fk";
    --> statement-breakpoint
    
    -- Drop the tables created
    DROP TABLE IF EXISTS "auth_sessions";
    --> statement-breakpoint
    DROP TABLE IF EXISTS "auth_keys";
    --> statement-breakpoint
    DROP TABLE IF EXISTS "users";
  `.execute(db);
}

module.exports = { up, down };
