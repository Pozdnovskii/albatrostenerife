// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sanity from "@sanity/astro";

export default defineConfig({
  site: "https://albatrostenerife.com",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "always" },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          cs: "cs-CZ",
          pl: "pl-PL",
          hu: "hu-HU",
          it: "it-IT",
          es: "es-ES",
        },
      },
    }),
    react(),
    sanity({
      projectId: "nr9v3mei",
      dataset: "production",
      apiVersion: "2026-04-10",
      useCdn: false,
      studioBasePath: "/studio",
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@sanity/client"],
      include: ["@sanity/eventsource"],
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "cs", "pl", "hu", "it", "es"],
  },

  experimental: {
    // Rust-based compiler: faster .astro file parsing than the default Go compiler
    // rustCompiler: true,
    // Queue-based rendering instead of recursion: less memory, faster builds
    // Node pooling reuses component nodes across renders (default pool: 1000)
    queuedRendering: { enabled: true },
    // Optimize imported SVG components at build time via SVGO
    svgo: true,
  },

  image: {
    layout: "constrained",

    domains: ["cdn.sanity.io"],

    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        webp: { effort: 6, quality: 75 },
        avif: { effort: 6, quality: 75 },
      },
    },
  },

  adapter: cloudflare({
    // Sharp (image optimization) is a Node.js native module, incompatible with workerd.
    // 'node' runs prerendered pages in Node.js at build time so Sharp works correctly.
    // On-demand rendered pages (e.g. contact form endpoint) still run in workerd.
    prerenderEnvironment: "node",
    // 'compile' uses Sharp at build time for prerendered pages.
    imageService: "custom",
  }),
});
