import { eq } from "drizzle-orm";
import { AuthHandler, LinkAdapter } from "sst/node/auth";
import { createKeyId } from "lucia";

import { keysTable, usersTable } from "@my-sst-app/core/src/drizzle/schema";
import { db } from "@my-sst-app/core/drizzle";

export const handler = AuthHandler({
  providers: {
    link: LinkAdapter({
      onLink: async (link, claims) => {
        console.log("sending email link to", claims.email, "with link", link);
        return {
          statusCode: 200,
          body: link,
        };
      },
      onSuccess: async (claims) => {
        console.log("user signed in via magic link", claims);

        try {
          const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, claims.email));

          if (!user) {
            await db.transaction(async (tx) => {
              await tx.insert(usersTable).values({
                email: claims.email,
                username: claims.email,
              });

              const [newUser] = await tx
                .select({ id: usersTable.id })
                .from(usersTable)
                .where(eq(usersTable.email, claims.email));

              await tx.insert(keysTable).values({
                id: createKeyId("email", claims.email),
                userId: newUser.id,
                hashedPassword: null,
              });
            });
          }
        } catch (e) {
          console.log(e);
        }

        return {
          statusCode: 301,
          headers: {
            Location: "http://localhost:4321/auth/logged-in",
          },
        };
      },
      onError: async () => {
        return {
          statusCode: 500,
          body: "Error",
        };
      },
    }),
  },
});
