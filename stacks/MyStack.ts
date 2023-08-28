import { StackContext, Api, AstroSite } from "sst/constructs";

export function API({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "GET /api/trpc/{proxy+}": "packages/functions/src/trpc.handler",
      "POST /api/trpc/{proxy+}": "packages/functions/src/trpc.handler",
    },
  });

  const site = new AstroSite(stack, "AstroSite", {
    path: "packages/web",
    environment: {
      PUBLIC_TRPC_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    site: site.url,
  });
}
