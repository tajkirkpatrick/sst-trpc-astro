const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
    ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
    ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";
    ALTER TABLE "users" DROP COLUMN "email";
    ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdAt";
  `.execute(db);
}

module.exports = { up, down };
