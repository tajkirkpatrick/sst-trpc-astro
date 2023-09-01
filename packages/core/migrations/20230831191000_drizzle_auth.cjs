const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
  CREATE TABLE IF NOT EXISTS "users" (
    "id" varchar(26) PRIMARY KEY NOT NULL,
    "fullName" text
  );

  CREATE TABLE IF NOT EXISTS "user_key" (
    "id" varchar(255) PRIMARY KEY NOT NULL,
    "user_id" varchar(15) NOT NULL,
    "hashed_password" varchar(255)
  );

  CREATE TABLE IF NOT EXISTS "user_session" (
    "id" varchar(128) PRIMARY KEY NOT NULL,
    "user_id" varchar(15) NOT NULL,
    "active_expires" bigint NOT NULL,
    "idle_expires" bigint NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "auth_user" (
    "id" varchar(15) PRIMARY KEY NOT NULL,
    "full_name" text
  );

  DO $$ BEGIN
   ALTER TABLE "user_key" ADD CONSTRAINT "user_key_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
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
    ALTER TABLE "user_key" DROP CONSTRAINT IF EXISTS "user_key_user_id_auth_user_id_fk";
    ALTER TABLE "user_session" DROP CONSTRAINT IF EXISTS "user_session_user_id_auth_user_id_fk";
    DROP TABLE IF EXISTS "user_key";
    DROP TABLE IF EXISTS "user_session";
    DROP TABLE IF EXISTS "auth_user";
    DROP TABLE IF EXISTS "users";`.execute(db);
}

module.exports = { up, down };
