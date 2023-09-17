import { eq } from "drizzle-orm";
import {
  PgDatabase,
  type AnyPgTable,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import type { Adapter, InitializeAdapter, KeySchema, UserSchema } from "lucia";

import type { myDrizzleError } from "../adapter";

interface UserTable extends AnyPgTable {
  id: AnyPgColumn;
}

interface KeyTable extends AnyPgTable {
  id: AnyPgColumn;
  userId: AnyPgColumn;
  hashedPassword: AnyPgColumn;
}

interface SessionTable extends AnyPgTable {
  id: AnyPgColumn;
  userId: AnyPgColumn;
  activeExpires: AnyPgColumn;
  idleExpires: AnyPgColumn;
}

export function createTables(model: {
  schema: Record<string, unknown>;
  user: string;
  session: string | null;
  key: string;
}) {
  const user = model.schema[model.user] as UserTable;
  const session = model.schema[model.session ?? ""] as SessionTable | undefined;
  const key = model.schema[model.key] as KeyTable;
  return { session, user, key };
}

export function pgDrizzleAdapter(
  client: InstanceType<typeof PgDatabase>,
  model: {
    user: string;
    session: string | null;
    key: string;
    schema?: Record<string, unknown> | undefined;
  },
): InitializeAdapter<Adapter> {
  const { user, key, session } = createTables({
    ...model,
    schema: model.schema || {},
  });

  return (luciaError) => {
    return {
      getSessionAndUser: async (sessionId: string) => {
        if (!session) {
          return [null, null];
        }

        const sessionRecord = await client
          .select()
          .from(session)
          .where(eq(session.id, sessionId))
          .then((res) => res[0] ?? null);

        if (!sessionRecord) {
          return [null, null];
        }

        const userRecord = await client
          .select()
          .from(user)
          .where(eq(user.id, sessionRecord.userId))
          .then((res) => (res[0] as UserSchema) ?? null);

        return [
          {
            id: sessionRecord.id as string,
            active_expires: Number(sessionRecord.activeExpires),
            idle_expires: Number(sessionRecord.idleExpires),
            user_id: sessionRecord.userId as string,
          },
          userRecord,
        ];
      },
      getUser: async (userId: string) => {
        const record =
          (await client
            .select()
            .from(user)
            .where(eq(user.id, userId))
            .then((res) => res[0])) ?? null;

        if (!record) return null;

        return {
          id: record.id as string,
          username: record.username! as string,
        };
      },
      setUser: async (userData: UserSchema, keyData: KeySchema | null) => {
        if (!keyData) {
          await client
            .insert(user)
            .values({ username: userData.username, id: userData.id });
          return;
        }
        try {
          await client.transaction(async (trx) => {
            try {
              await trx
                .insert(user)
                .values({ username: userData.username, id: userData.id });
              await trx.insert(key).values({
                id: keyData.id,
                hashedPassword: keyData.hashed_password,
                userId: keyData.user_id,
              });
              return;
            } catch {
              trx.rollback();
              throw new Error("Failed to create user, transaction failed.");
            }
          });
          return;
        } catch (e) {
          const error = e as Partial<myDrizzleError>;
          if (error.message?.includes("`id`"))
            throw new luciaError("AUTH_DUPLICATE_KEY_ID");
          throw error;
        }
      },
      deleteUser: async (userId) => {
        await client.delete(user).where(eq(user.id, userId));
      },
      updateUser: async (userId, partialUser) => {
        try {
          await client
            .update(user)
            .set({ ...partialUser })
            .where(eq(user.id, userId));
        } catch (e) {
          const error = e as Partial<myDrizzleError>;
          if (error.message?.includes("`id`"))
            throw new luciaError("AUTH_INVALID_USER_ID");
          throw error;
        }
      },
      getSession: async (sessionId) => {
        if (!session) {
          throw new Error("Session table is not defined");
        }

        const record = await client
          .select()
          .from(session)
          .where(eq(session.id, sessionId))
          .then((res) => res[0] ?? null);

        return {
          id: record?.id! as string,
          active_expires: Number(record?.activeExpires!),
          idle_expires: Number(record?.idleExpires!),
          user_id: record?.userId! as string,
        };
      },
      getSessionsByUserId: async (userId) => {
        if (!session) {
          throw new Error("Session table is not defined");
        }

        const records = await client
          .select()
          .from(session)
          .where(eq(session.userId, userId))
          .then((res) => res ?? []);

        const resultRecords = records.map((record) => ({
          id: record.id! as string,
          active_expires: Number(record.activeExpires!),
          idle_expires: Number(record.idleExpires!),
          user_id: record.userId! as string,
        }));

        return resultRecords;
      },
      setSession: async (sessionData) => {
        if (!session) {
          throw new Error("Session table is not defined");
        }

        try {
          const { active_expires, idle_expires, user_id, ...restSessionData } =
            sessionData;

          await client.insert(session).values({
            ...restSessionData,
            activeExpires: active_expires,
            idleExpires: idle_expires,
            userId: user_id,
          });
        } catch (e) {
          const error = e as Partial<myDrizzleError>;
          if (error.message?.includes("`id`"))
            throw new luciaError("AUTH_INVALID_USER_ID");
          throw error;
        }
      },
      deleteSession: async (sessionId) => {
        if (!session) {
          throw new Error("Session table is not defined");
        }

        await client.delete(session).where(eq(session.id, sessionId));
      },
      deleteSessionsByUserId: async (userId) => {
        if (!session) {
          throw new Error("Session table is not defined");
        }

        await client.delete(session).where(eq(session.userId, userId));
      },
      updateSession: async (sessionId, partialSession) => {
        if (!session) {
          throw new Error("Session table is not defined");
        }

        try {
          await client
            .update(session)
            .set({ ...partialSession })
            .where(eq(session.id, sessionId));
        } catch (e) {
          const error = e as Partial<myDrizzleError>;
          if (error.message?.includes("`id`"))
            throw new luciaError("AUTH_INVALID_SESSION_ID");
          throw error;
        }
      },
      getKey: async (keyId) => {
        const record = await client
          .select()
          .from(key)
          .where(eq(key.id, keyId))
          .then((res) => res[0] ?? null);

        return {
          id: record?.id! as string,
          hashed_password: record?.hashedPassword! as string,
          user_id: record?.userId! as string,
        };
      },
      getKeysByUserId: async (userId) => {
        const records = await client
          .select()
          .from(key)
          .where(eq(key.userId, userId))
          .then((res) => res ?? []);

        const resultRecords = records.map((record) => ({
          id: record.id! as string,
          hashed_password: record.hashedPassword! as string,
          user_id: record.userId! as string,
        }));

        return resultRecords;
      },
      setKey: async (keyData) => {
        try {
          await client.insert(key).values({
            id: keyData.id,
            hashedPassword: keyData.hashed_password,
            userId: keyData.user_id,
          });
        } catch (e) {
          const error = e as Partial<myDrizzleError>;
          if (error.message?.includes("`id`"))
            throw new luciaError("AUTH_INVALID_USER_ID");
          throw error;
        }
      },
      deleteKey: async (keyId) => {
        await client.delete(key).where(eq(key.id, keyId));
      },
      deleteKeysByUserId: async (userId) => {
        await client.delete(key).where(eq(key.userId, userId));
      },
      updateKey: async (keyId, partialKey) => {
        try {
          const { hashed_password, user_id, ...restPartialKey } = partialKey;

          if (hashed_password === undefined || user_id === undefined) {
            throw new Error("Missing updateKey data");
          }

          await client
            .update(key)
            .set({
              hashedPassword: hashed_password,
              userId: user_id,
              ...restPartialKey,
            })
            .where(eq(key.id, keyId));
        } catch (e) {
          const error = e as Partial<myDrizzleError>;
          if (error.message?.includes("`id`"))
            throw new luciaError("AUTH_INVALID_KEY_ID");
          throw error;
        }
      },
    };
  };
}
