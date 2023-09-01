import { StackContext, Api, AstroSite, RDS } from "sst/constructs";

export function API({ stack }: StackContext) {
  const pgDb = new RDS(stack, "Database", {
    engine: "postgresql13.9",
    defaultDatabaseName: "myDatabase",
    migrations: "packages/core/migrations",
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [pgDb],
      },
    },
    routes: {
      "GET /api/trpc/{proxy+}": "packages/functions/src/trpc.handler",
      "POST /api/trpc/{proxy+}": "packages/functions/src/trpc.handler",
    },
  });

  const site = new AstroSite(stack, "AstroSite", {
    path: "packages/web",
    environment: {
      PUBLIC_TRPC_URL: api.url,
      DB_URL: pgDb.clusterEndpoint.socketAddress,
      DB_TABLE: pgDb.defaultDatabaseName,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    site: site.url,
  });
}
