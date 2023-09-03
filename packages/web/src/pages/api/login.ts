import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ locals }) => {
  const session = await locals.auth.validateBearerToken();
  if (!session) console.log("no session");
  console.log("in login");

  // add your code here
  return {
    status: 200,
    headers: {
      Authorization: "Bearer 1234",
    },
  };
};
