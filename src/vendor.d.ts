// Bootstrap's prebuilt bundle ships no types. It is imported for its side
// effects only (dropdowns, collapses, offcanvas), so an empty module
// declaration is all the dynamic import in main.tsx needs.
declare module "bootstrap/dist/js/bootstrap.bundle.min.js";
