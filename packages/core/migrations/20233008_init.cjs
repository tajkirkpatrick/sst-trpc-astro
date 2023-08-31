/**
 *
 * @param {Kysely<any>} db
 */
async function up(db) {
  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("fullName", "varchar")
    .execute();
}

/**
 *
 * @param {Kysely<any>} db
 */
async function down(db) {
  await db.schema.dropTable("users").execute();
}

module.exports = { up, down };
