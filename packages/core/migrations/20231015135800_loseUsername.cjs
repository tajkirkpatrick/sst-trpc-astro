const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "username";
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    ALTER TABLE "users" ADD COLUMN "username" text;
  `.execute(db);
}

module.exports = { up, down };
