// Bootstrap's prebuilt bundle ships no types. It is imported for its side
// effects only (dropdowns, collapses, offcanvas), so an empty module
// declaration is all the dynamic import in main.tsx needs.
declare module "bootstrap/dist/js/bootstrap.bundle.min.js";

/** The year the bundle was built, set by `define` in vite.config.ts. */
declare const __BUILD_YEAR__: number;
