const { Kysely, sql } = require("kysely");

/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await sql`
    CREATE USER newuser WITH PASSWORD 'newpassword';
  `.execute(db);
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await sql`
    DROP USER newuser;
  `.execute(db);
}

module.exports = { up, down };
