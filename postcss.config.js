import purgecss from "@fullhuman/postcss-purgecss";
import cssnano from "cssnano";

const isProd = process.env.NODE_ENV === "production";

/**
 * The Orisa theme stylesheet carries rules for ~15 header, footer and homepage
 * variants this site never renders. Purging against the actual source keeps the
 * shipped CSS to what these five pages use.
 *
 * Anything applied at runtime rather than written in JSX has to be safelisted,
 * or it will be stripped: Bootstrap's JS state classes, the classes our own
 * effects toggle, and the nodes MenuClone builds imperatively.
 */
const safelist = {
  standard: [
    "html", "body", "root", "active", "show", "showing", "hide", "hiding",
    "collapse", "collapsing", "collapsed", "fade", "modal-open", "modal-backdrop",
    "offcanvas-backdrop", "header-sticky", "is-menu-open", "is-active",
    "is-visible", "is-current", "at-menu-close", "at-magic-cursor",
    "dropdown-menu", "swiper-slide", "odometer",
  ],
  deep: [
    /^at-/, /^odometer/, /^carouselTicker/, /^swiper/, /^offcanvas/,
    /^terminal/, /^arch/, /^xp-/, /^reco-/, /^code-card/, /^web-card/,
    /^post-/, /^contact-/, /^engage-/, /^expertise-/, /^dev-/, /^stack-/,
    /^blog-cta/, /^case-/, /^site-logo/, /^skip-link/, /^ticker-/,
    /^stat-figure/, /^section-lead/, /^footer-email/,
  ],
  greedy: [/^is-/, /^has-/, /^js-/, /^data-/],
};

export default {
  plugins: isProd
    ? [
        purgecss({
          content: ["./index.html", "./src/**/*.{ts,tsx}", "./public/scripts/*.js"],
          defaultExtractor: (content) => content.match(/[\w-/:%.]+(?<!:)/g) || [],
          safelist,
          variables: true,
          keyframes: true,
          fontFace: true,
        }),
        cssnano({ preset: "default" }),
      ]
    : [],
};
