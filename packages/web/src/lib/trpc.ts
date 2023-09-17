import type { AppRouter } from "@my-sst-app/functions/src/trpc/config/router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

function getTokenFromHTML() {
  // get element with id session_token from the browser
  const sessionTokenElement = document.getElementById("sid");
  const sessionId = sessionTokenElement?.dataset.session;

  if (!sessionId) {
    return "Bearer Anonymous";
  }
  return `Bearer ${sessionId}`;
}

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.PUBLIC_TRPC_URL}/api/trpc`,
      headers() {
        return {
          Authorization: getTokenFromHTML(),
        };
      },
    }),
  ],
});
