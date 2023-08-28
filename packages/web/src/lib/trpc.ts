import type { AppRouter } from "../../../functions/src/trpc/router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.PUBLIC_TRPC_URL}/api/trpc`,
    }),
  ],
});
