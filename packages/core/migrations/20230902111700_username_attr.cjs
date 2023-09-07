const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    ALTER TABLE "users" RENAME COLUMN "full_name" TO "username";
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    ALTER TABLE "users" RENAME COLUMN "username" TO "full_name";
  `.execute(db);
}

module.exports = { up, down };
