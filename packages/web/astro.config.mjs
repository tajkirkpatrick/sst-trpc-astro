import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import aws from "astro-sst/lambda";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
  output: "server",
  adapters: aws(),
});
