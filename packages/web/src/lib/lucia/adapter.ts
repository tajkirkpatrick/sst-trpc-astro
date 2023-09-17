import type { Adapter, InitializeAdapter } from "lucia";

import { MySqlDatabase } from "drizzle-orm/mysql-core";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { DrizzleError, is } from "drizzle-orm";

import { mySqlDrizzleAdapter } from "./dialects/mysql";
import { pgDrizzleAdapter } from "./dialects/pg";
import { SQLiteDrizzleAdapter } from "./dialects/sqlite";

export type AnyMySqlDatabase = MySqlDatabase<any, any>;
export type AnyPgDatabase = PgDatabase<any, any, any>;
export type AnySQLiteDatabase = BaseSQLiteDatabase<any, any, any, any>;

export type SqlFlavorOptions =
  | AnyMySqlDatabase
  | AnyPgDatabase
  | AnySQLiteDatabase;

export type myDrizzleError = InstanceType<typeof DrizzleError>;

export function customAdapter<SqlFlavor extends SqlFlavorOptions>(
  db: SqlFlavor,
  modelNames?: {
    user: string;
    session: string | null;
    key: string;
    schema: Record<string, unknown>;
  },
): InitializeAdapter<Adapter> {
  const getModelNames = (
    user: string = "auth_users",
    session: string | null = "auth_session",
    key: string = "auth_keys",
    schema: Record<string, unknown> = {},
  ) => {
    return { user, session, key, schema };
  };

  modelNames = modelNames || getModelNames();

  if (is(db, MySqlDatabase)) {
    // ! currently disabled
    // return mySqlDrizzleAdapter(db, table as MySqlTableFn, modelNames);
    return mySqlDrizzleAdapter(db);
  } else if (is(db, PgDatabase)) {
    // * currently enabled
    return pgDrizzleAdapter(db, modelNames);
  } else if (is(db, BaseSQLiteDatabase)) {
    // ! currently disabled
    // return SQLiteDrizzleAdapter(db, table as SQLiteTableFn, modelNames);
    return SQLiteDrizzleAdapter(db);
  }

  throw new Error(
    `Unsupported database type (${typeof db}) in Drizzle adapter.`,
  );
}
