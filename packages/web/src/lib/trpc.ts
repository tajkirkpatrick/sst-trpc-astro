import type { AppRouter } from "../../../functions/src/trpc/config/router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

function getToken() {
  const sessionID = localStorage.getItem("auth_session");

  return `Bearer ${sessionID}`;
}

// @ts-ignore the AppRouter is imported from another parent folder and I believe causing the TS error
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.PUBLIC_TRPC_URL}/api/trpc`,
      headers() {
        return {
          Authorization: getToken(),
        };
      },
    }),
  ],
});
