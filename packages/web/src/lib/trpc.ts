import type { AppRouter } from "@my-sst-app/functions/src/trpc/config/router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

function getTokenFromCookie() {
  // get cookies from the browser
  const cookies = document.cookie.split(";");

  console.log("cookies", cookies);

  // find the cookie that starts with "auth_session"
  const authCookie = cookies.find((cookie) =>
    cookie.startsWith("auth_session")
  );
  // if there is no cookie, return null
  if (!authCookie) return "Bearer Anonymous";
  // if there is a cookie, return the value after the equals sign with the prefix "Bearer "
  return `Bearer ${authCookie.split("=")[1]}`;
}

// @ts-ignore the AppRouter is imported from another parent folder and I believe causing the TS error
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.PUBLIC_TRPC_URL}/api/trpc`,
      headers() {
        return {
          Authorization: getTokenFromCookie(),
        };
      },
    }),
  ],
});
