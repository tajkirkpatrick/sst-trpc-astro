const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    ALTER TABLE "auth_keys" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;
    --> statement-breakpoint
    ALTER TABLE "auth_keys" ALTER COLUMN "createdAt" SET DEFAULT now();
    --> statement-breakpoint
    ALTER TABLE "users" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;
    --> statement-breakpoint
    ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now();
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    ALTER TABLE "users" ALTER COLUMN "createdAt" DROP DEFAULT;
    ALTER TABLE "users" ALTER COLUMN "createdAt" SET DATA TYPE timestamp without time zone;
    ALTER TABLE "auth_keys" ALTER COLUMN "createdAt" DROP DEFAULT;
    ALTER TABLE "auth_keys" ALTER COLUMN "createdAt" SET DATA TYPE timestamp without time zone;
  `.execute(db);
}

module.exports = { up, down };
