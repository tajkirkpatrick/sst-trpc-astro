const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    ALTER TABLE "user_details" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    ALTER TABLE "user_details" DROP COLUMN IF EXISTS "verified";
  `.execute(db);
}

module.exports = { up, down };
