const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    ALTER TABLE "auth_keys" ALTER COLUMN "user_id" SET DATA TYPE varchar(26);
    --> statement-breakpoint
    ALTER TABLE "auth_sessions" ALTER COLUMN "user_id" SET DATA TYPE varchar(26);
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    ALTER TABLE "auth_keys" ALTER COLUMN "user_id" SET DATA TYPE varchar(15);
    ALTER TABLE "auth_sessions" ALTER COLUMN "user_id" SET DATA TYPE varchar(15);
  `.execute(db);
}

module.exports = { up, down };
