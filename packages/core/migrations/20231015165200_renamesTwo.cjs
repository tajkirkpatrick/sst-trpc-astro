const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    ALTER TABLE "auth_keys" RENAME COLUMN "createdAt" TO "created_at";
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    ALTER TABLE "auth_keys" RENAME COLUMN "created_at" TO "createdAt";
  `.execute(db);
}

module.exports = { up, down };
