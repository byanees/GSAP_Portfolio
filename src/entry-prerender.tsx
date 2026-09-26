/* eslint-disable react-refresh/only-export-components -- build-time entry, never hot-reloaded */

// Build-time entry. Renders a route to a static HTML string so crawlers that
// run no JavaScript still get the page. Deliberately does not import main.tsx,
// which pulls in Bootstrap's browser bundle.

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "@/App";

export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}

/** Every address the site answers on, built from the same data the router uses
 *  so a new post or case study can never be left out of the prerender. */
export { ROUTES } from "@/seo/routes";

// Re-exported so scripts/generate-seo-assets.mjs can read the content without
// needing its own TypeScript pipeline.
export { SITE_URL, INDEXNOW_KEY } from "@/seo/siteConfig";
export { PROFILE, EXPERIENCE, EDUCATION, CERTIFICATIONS, EXPERTISE } from "@/data/profile";
export { POSTS } from "@/data/posts";
export { CASE_STUDIES } from "@/data/caseStudies";
