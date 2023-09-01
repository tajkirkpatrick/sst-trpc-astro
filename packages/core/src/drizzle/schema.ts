// Schema Delcaration
import { ulid } from "ulid";
import { pgTable, text, bigint, varchar } from "drizzle-orm/pg-core";

export const customUsersTable = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  fullName: text("fullName"),
});

export type User = typeof customUsersTable.$inferSelect;
export type NewUser = typeof customUsersTable.$inferInsert;

export const usersTable = pgTable("auth_user", {
  id: varchar("id", {
    length: 15, // change this when using custom user ids
  })
    .primaryKey()
    .$defaultFn(() => ulid()),
  // other user attributes
  fullName: text("full_name"),
});

export const sessionsTable = pgTable("user_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => usersTable.id),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
});

export const keysTable = pgTable("user_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => usersTable.id),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});
