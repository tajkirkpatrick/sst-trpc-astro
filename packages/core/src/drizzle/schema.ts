// Schema Delcaration
import { ulid } from "ulid";
import { pgTable, text, bigint, varchar } from "drizzle-orm/pg-core";

const USER_ID_LENGTH = 26; // change this when using custom user ids

export const usersTable = pgTable("users", {
  id: varchar("id", {
    length: USER_ID_LENGTH,
  })
    .primaryKey()
    .$defaultFn(() => ulid()),
  // other user attributes
  fullName: text("full_name"),
});

// Now, you can apply this helper to your type
export type User = typeof usersTable.$inferSelect;
export type NewUser = Omit<typeof usersTable.$inferInsert, "id">;

export const sessionsTable = pgTable("auth_sessions", {
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

export const keysTable = pgTable("auth_keys", {
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
