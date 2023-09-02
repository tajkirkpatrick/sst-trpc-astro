import {
  sqliteTable as defaultSqliteTableFn,
  text,
  BaseSQLiteDatabase,
  SQLiteTableFn,
  blob,
} from "drizzle-orm/sqlite-core";

import type { Adapter, InitializeAdapter, LuciaError } from "lucia";

export function createTables(sqliteTable: SQLiteTableFn) {
  const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    // other user attributes
  });

  const session = sqliteTable("user_session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    activeExpires: blob("active_expires", {
      mode: "bigint",
    }).notNull(),
    idleExpires: blob("idle_expires", {
      mode: "bigint",
    }).notNull(),
  });

  const key = sqliteTable("user_key", {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    hashedPassword: text("hashed_password"),
  });

  return { session, user, key };
}

export function SQLiteDrizzleAdapter(
  client: InstanceType<typeof BaseSQLiteDatabase>,
  tableFn = defaultSqliteTableFn
): InitializeAdapter<Adapter> {
  const { user, key, session } = createTables(tableFn);

  return (luciaError: typeof LuciaError) => {
    return {};
  };
}
