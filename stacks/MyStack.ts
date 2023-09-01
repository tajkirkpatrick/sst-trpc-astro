import { StackContext, Api, AstroSite, RDS } from "sst/constructs";

export function API({ stack }: StackContext) {
  const pgDb = new RDS(stack, "Database", {
    engine: "postgresql13.9",
    defaultDatabaseName: "myDatabase",
    migrations: "packages/core/migrations",
  });

  const trpc = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [pgDb],
      },
    },
    routes: {
      "GET /api/trpc/{proxy+}": "packages/core/src/trpc/server.handler",
      "POST /api/trpc/{proxy+}": "packages/core/src/trpc/server.handler",
    },
  });

  const site = new AstroSite(stack, "AstroSite", {
    path: "packages/web",
    environment: {
      PUBLIC_TRPC_URL: trpc.url,
      DB_URL: pgDb.clusterEndpoint.socketAddress,
      DB_TABLE: pgDb.defaultDatabaseName,
    },
  });

  stack.addOutputs({
    ApiEndpoint: trpc.url,
    site: site.url,
  });
}
