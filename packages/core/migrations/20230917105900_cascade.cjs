const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    ALTER TABLE "auth_keys" DROP CONSTRAINT "auth_keys_user_id_users_id_fk";
    --> statement-breakpoint
    ALTER TABLE "auth_sessions" DROP CONSTRAINT "auth_sessions_user_id_users_id_fk";
    --> statement-breakpoint
    DO $$ BEGIN
    ALTER TABLE "auth_keys" ADD CONSTRAINT "auth_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
    WHEN duplicate_object THEN null;
    END $$;
    --> statement-breakpoint
    DO $$ BEGIN
    ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
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
    DO $$ BEGIN
    ALTER TABLE "auth_sessions" DROP CONSTRAINT IF EXISTS "auth_sessions_user_id_users_id_fk";
  EXCEPTION
    WHEN undefined_object THEN null;
  END $$;
  --> statement-breakpoint
  DO $$ BEGIN
    ALTER TABLE "auth_keys" DROP CONSTRAINT IF EXISTS "auth_keys_user_id_users_id_fk";
  EXCEPTION
    WHEN undefined_object THEN null;
  END $$;
  --> statement-breakpoint
  ALTER TABLE "auth_keys" ADD CONSTRAINT "auth_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
  --> statement-breakpoint
  ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
  `.execute(db);
}

module.exports = { up, down };
