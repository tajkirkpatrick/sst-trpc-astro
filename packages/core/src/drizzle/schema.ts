import { ulid } from "ulid";
import {
  pgTable,
  text,
  bigint,
  varchar,
  timestamp,
  serial,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { USER_ID_LENGTH } from "./constants";

// Lucia Auth tables

/**
 * `users` table of the AWS Aurora database
 */
export const usersTable = pgTable("users", {
  id: varchar("id", {
    length: USER_ID_LENGTH,
  })
    .primaryKey()
    .$defaultFn(() => ulid()),
  // other user attributes
  email: text("email").unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userRelations = relations(usersTable, ({ many, one }) => ({
  sessions: many(sessionsTable),
  keys: many(keysTable),
  userDetails: one(userDetailsTable),
}));

// Now, you can apply this helper to your type
export type User = typeof usersTable.$inferSelect;
export type NewUser = Omit<typeof usersTable.$inferInsert, "id" | "createdAt">;

/**
 * `user_details` table of the AWS Aurora database
 */
export const userDetailsTable = pgTable(
  "user_details",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", {
      length: USER_ID_LENGTH,
    })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    firstName: text("first_name"),
    lastName: text("last_name"),
    displayName: text("display_name"),
    verified: boolean("verified").notNull().default(false),
  },
  (table) => {
    return {
      userIdIdx: uniqueIndex("user_id_idx").on(table.userId),
    };
  }
);

export const userDetailsRelations = relations(userDetailsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userDetailsTable.userId],
    references: [usersTable.id],
  }),
}));

/**
 * `auth_sessions` table of the AWS Aurora database
 */
export const sessionsTable = pgTable("auth_sessions", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: USER_ID_LENGTH,
  })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
});

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export type Session = typeof sessionsTable.$inferSelect;

/**
 * `auth_keys` table of the AWS Aurora database
 */
export const keysTable = pgTable("auth_keys", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: USER_ID_LENGTH,
  })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  // primary: boolean("primary").notNull().default(false),
});

export const keyRelations = relations(keysTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [keysTable.userId],
    references: [usersTable.id],
  }),
}));
