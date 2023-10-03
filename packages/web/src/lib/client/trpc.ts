import type { AppRouter } from "@my-sst-app/functions/src/trpc/config/router";
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";

function getTokenFromHTML() {
  // get hidden element with unique id from the browser
  const sessionTokenElement = document.getElementById("sid");
  const sessionId = sessionTokenElement?.dataset.session;

  if (!sessionId) {
    return "Bearer Anonymous";
  }
  return `Bearer ${sessionId}`;
}

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (import.meta.env.DEV && typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${import.meta.env.PUBLIC_SST_API_URL}/api/trpc`,
      headers() {
        return {
          Authorization: getTokenFromHTML(),
        };
      },
    }),
  ],
});
