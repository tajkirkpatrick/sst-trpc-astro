import {
  pgTable as defaultPgTableFn,
  PgTableFn,
  PgDatabase,
  varchar,
  bigint,
} from "drizzle-orm/pg-core";

import type { Adapter, InitializeAdapter, LuciaError } from "lucia";

export function createTables(pgTable: PgTableFn) {
  const user = pgTable("auth_user", {
    id: varchar("id", {
      length: 15, // change this when using custom user ids
    }).primaryKey(),
    // other user attributes
  });

  const session = pgTable("user_session", {
    id: varchar("id", {
      length: 128,
    }).primaryKey(),
    userId: varchar("user_id", {
      length: 15,
    })
      .notNull()
      .references(() => user.id),
    activeExpires: bigint("active_expires", {
      mode: "number",
    }).notNull(),
    idleExpires: bigint("idle_expires", {
      mode: "number",
    }).notNull(),
  });

  const key = pgTable("user_key", {
    id: varchar("id", {
      length: 255,
    }).primaryKey(),
    userId: varchar("user_id", {
      length: 15,
    })
      .notNull()
      .references(() => user.id),
    hashedPassword: varchar("hashed_password", {
      length: 255,
    }),
  });

  return { session, user, key };
}

export function pgDrizzleAdapter(
  client: InstanceType<typeof PgDatabase>,
  tableFn = defaultPgTableFn
): InitializeAdapter<Adapter> {
  const { user, key, session } = createTables(tableFn);

  return (luciaError: typeof LuciaError) => {
    return {};
  };
}
