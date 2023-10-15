import { AuthHandler, LinkAdapter, Session } from "sst/node/auth";
import { createKeyId } from "lucia";

import {
  keysTable,
  usersTable,
  userDetailsTable,
} from "@my-sst-app/core/src/drizzle/schema";
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
          const user = await db.query.usersTable.findFirst({
            where: (user, { eq }) => eq(user.email, claims.email),
          });

          if (!user) {
            await db.transaction(async (tx) => {
              const [newUser] = await tx
                .insert(usersTable)
                .values({
                  email: claims.email,
                  username: claims.email,
                })
                .returning();

              await tx.insert(userDetailsTable).values({
                userId: newUser.id,
                firstName: null,
                lastName: null,
                displayName: claims.email,
              });

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

        return Session.parameter({
          redirect: "http://localhost:4321/auth/link/callback",
          type: "public", // you should make your own custom type here
          properties: {
            email: claims.email,
          },
        });
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
