import type { AppRouter } from "../../../functions/src/trpc/config/router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

let token: string;

export function setToken(newToken: string) {
  token = newToken;
}

// @ts-ignore the AppRouter is imported from another parent folder and I believe causing the TS error
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.PUBLIC_TRPC_URL}/api/trpc`,
      headers() {
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});
