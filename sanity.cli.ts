import { defineCliConfig } from "sanity/cli";
import path from "path";

export default defineCliConfig({
  api: {
    projectId: "nr9v3mei",
    dataset: "production",
  },
  deployment: {
    appId: "o7xvpfo5pgvda4grkkdo1dzo",
  },
  vite: {
    resolve: {
      alias: {
        "@studio": path.resolve("./studio"),
        "@i18n": path.resolve("./src/i18n"),
      },
    },
  },
});
