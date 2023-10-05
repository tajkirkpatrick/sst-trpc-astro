/// <reference types="astro/client" />
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lib/server/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string;
    email: string;
  };
  type DatabaseSessionAttributes = {};
}
declare namespace App {
  interface Locals {
    auth: import("lucia").AuthRequest;
  }
}
