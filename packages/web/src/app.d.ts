// src/app.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lib/lucia").Auth;
  type DatabaseUserAttributes = {};
  type DatabaseSessionAttributes = {};
}
/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    auth: import("lucia").AuthRequest;
  }
}
