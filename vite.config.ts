import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { PROFILE } from "./src/data/profile";
import { APP_DESCRIPTION, APP_NAME } from "./src/seo/siteConfig";

/**
 * Fills the parts of the site that live outside React from src/data, so a
 * name or link changed there changes here too:
 * - the {{placeholders}} in index.html (title, rel="me" links, loader)
 * - /site.webmanifest, served in dev and written into dist/ by the build
 */
function siteData(): Plugin {
  const tokens: Record<string, string> = {
    name: PROFILE.name,
    initials: PROFILE.initials,
    linkedin: PROFILE.linkedin,
    github: PROFILE.github,
  };

  const manifest = JSON.stringify(
    {
      name: APP_NAME,
      short_name: PROFILE.shortName,
      description: APP_DESCRIPTION,
      start_url: "/",
      scope: "/",
      display: "browser",
      background_color: "#0f0f0f",
      theme_color: "#0f0f0f",
      lang: "en",
      icons: [
        { src: "/assets/imgs/logo/ma-mark.svg", sizes: "any", type: "image/svg+xml" },
        { src: "/assets/imgs/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
        { src: "/assets/imgs/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      ],
    },
    null,
    2,
  );

  let ssr = false;

  return {
    name: "site-data",
    configResolved(config) {
      ssr = Boolean(config.build.ssr);
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
          if (!(key in tokens)) throw new Error(`index.html: unknown placeholder ${match}`);
          return tokens[key];
        });
      },
    },
    configureServer(server) {
      server.middlewares.use("/site.webmanifest", (_req, res) => {
        res.setHeader("Content-Type", "application/manifest+json");
        res.end(manifest);
      });
    },
    generateBundle() {
      if (ssr) return;
      this.emitFile({ type: "asset", fileName: "site.webmanifest", source: `${manifest}\n` });
    },
  };
}

export default defineConfig({
  plugins: [react(), siteData()],
  define: {
    // Baked into the client and prerender bundles alike, so the footer's
    // copyright year always matches between the HTML and the hydrated page,
    // and moves on with the first deploy of each year.
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  ssr: {
    // The prerender build externalises dependencies by default, which leaves
    // this CommonJS package resolving to a module namespace object instead of
    // the component. Bundling it lets Rollup handle the interop.
    noExternal: ["react-fast-marquee"],
  },
});
