import { StackContext, Api, AstroSite, RDS, Auth } from "sst/constructs";

export function API({ stack }: StackContext) {
  // const pgDb = new RDS(stack, "Database", {
  //   engine: "postgresql13.9",
  //   defaultDatabaseName: "myDatabase",
  //   migrations: "packages/core/migrations",
  //   scaling: {
  //     autoPause: true,
  //     minCapacity: "ACU_2",
  //     maxCapacity: "ACU_2"
  //   }
  // });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        // bind: [pgDb],
      },
    },
    routes: {
      "GET /api/trpc/{proxy+}": "packages/functions/src/trpc/server.handler",
      "POST /api/trpc/{proxy+}": "packages/functions/src/trpc/server.handler",
    },
  });

  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/auth.handler",
    },
  });

  auth.attach(stack, {
    api,
    prefix: "/auth", // optional
  });

  const site = new AstroSite(stack, "AstroSite", {
    path: "packages/web",
    // bind: [pgDb],
    environment: {
      PUBLIC_SST_API_URL: api.url,
      // DB_NAME: pgDb.defaultDatabaseName,
      // DB_SECRET_ARN: pgDb.secretArn,
      // DB_ARN: pgDb.clusterArn,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    site: site.url,
  });
}
