import { existsSync } from "node:fs";

/** The suite tests the built site; fail fast with a clear message if there is none. */
export default function globalSetup() {
  if (!existsSync("dist/index.html") || !existsSync("dist/sitemap.xml")) {
    throw new Error("No production build in dist/. Run `npm run build` first, or `npm run test:e2e:full`.");
  }
}
