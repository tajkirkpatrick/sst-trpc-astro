/// <reference types="astro/client" />
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lib/server/lucia").Auth;
  type DatabaseUserAttributes = {
    email: string;
    createdAt: Date;
    displayName: string;
    verified: boolean;
  };
  type DatabaseSessionAttributes = {};
}
declare namespace App {
  interface Locals {
    auth: import("lucia").AuthRequest;
  }
}
