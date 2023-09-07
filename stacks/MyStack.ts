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
      "GET /api/trpc/{proxy+}": "packages/core/src/trpc/server.handler",
      "POST /api/trpc/{proxy+}": "packages/core/src/trpc/server.handler",
    },
  });

  const site = new AstroSite(stack, "AstroSite", {
    path: "packages/web",
    bind: [pgDb],
    environment: {
      PUBLIC_TRPC_URL: api.url,
      DB_NAME: pgDb.defaultDatabaseName,
      DB_SECRET_ARN: pgDb.secretArn,
      DB_ARN: pgDb.clusterArn,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    site: site.url,
  });
}
