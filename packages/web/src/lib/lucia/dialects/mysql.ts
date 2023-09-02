import { eq, DrizzleError } from "drizzle-orm";
import {
  mysqlTable as defaultMySqlTableFn,
  varchar,
  MySqlTableFn,
  MySqlDatabase,
  bigint,
} from "drizzle-orm/mysql-core";

import type {
  Adapter,
  InitializeAdapter,
  KeySchema,
  LuciaError,
  UserSchema,
} from "lucia";

type myDrizzleError = InstanceType<typeof DrizzleError>;

export function createTables(
  mySqlTable: MySqlTableFn,
  modelNames: {
    user: string;
    session: string | null;
    key: string;
  }
) {
  const user = mySqlTable(modelNames.user, {
    id: varchar("id", {
      length: 15, // change this when using custom user ids
    }).primaryKey(),
    // other user attributes
  });

  const key = mySqlTable(modelNames.key, {
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

  const session = mySqlTable(modelNames.session ?? "auth_session", {
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

  return { session, user, key };
}

export function mySqlDrizzleAdapter(
  client: InstanceType<typeof MySqlDatabase>,
  tableFn = defaultMySqlTableFn,
  modelNames: {
    user: string;
    session: string | null;
    key: string;
  }
): InitializeAdapter<Adapter> {
  const { user, key, session } = createTables(tableFn, modelNames);

  const $transaction = <_Query extends () => any>(query: _Query): void => {
    client.transaction(async (trx) => {
      try {
        const result = await query();
        return result;
      } catch (e) {
        trx.rollback();
        throw e;
      }
    });
  };

  return (luciaError: typeof LuciaError) => {
    return {
      getUser: async (userId: string) => {
        const record =
          (await client
            .select()
            .from(user)
            .where(eq(user.id, userId))
            .then((res) => res[0])) ?? null;

        return record;
      },
      setUser: async (userData: UserSchema, keyData: KeySchema | null) => {
        if (!keyData) {
          await client.insert(user).values({ ...userData, id: userData.id });
          return;
        }
        try {
          $transaction(async () => {
            await client.insert(user).values({ ...userData, id: userData.id });

            const { hashed_password, user_id, ...restKeyData } = keyData;

            await client.insert(key).values({
              ...restKeyData,
              hashedPassword: hashed_password,
              userId: user_id,
            });
          });
        } catch (e) {
          const error = e as Partial<myDrizzleError>;
          if (error.message?.includes("`id`"))
            throw new luciaError("AUTH_DUPLICATE_KEY_ID");
          throw error;
        }
      },
    };
  };
}
