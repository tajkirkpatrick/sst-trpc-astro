const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL;
    --> statement-breakpoint
    ALTER TABLE "auth_keys" ADD COLUMN "createdAt" date NOT NULL;
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    ALTER TABLE "users" ALTER COLUMN "createdAt" DROP NOT NULL;
    --> statement-breakpoint
    ALTER TABLE "auth_keys" DROP COLUMN "createdAt";
  `.execute(db);
}

module.exports = { up, down };
