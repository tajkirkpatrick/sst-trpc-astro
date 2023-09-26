import { error } from "console";
import { AuthHandler, LinkAdapter } from "sst/node/auth";

export const handler = AuthHandler({
  providers: {
    link: LinkAdapter({
      onLink: async (link, claims) => {
        console.log("link", link);
        return {
          statusCode: 200,
          body: link,
        };
      },
      onSuccess: async (claims) => {
        return {
          statusCode: 200,
          body: JSON.stringify(claims),
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
