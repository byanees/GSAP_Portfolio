import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Stylesheets, in cascade order. These live in src/ (not public/) so the build
// can purge the unused theme rules and minify what is left. The font faces go
// first, and being bundled into the same stylesheet they cost no extra request.
import "@/styles/fonts.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/vendor-carousel-ticker.css";
import "@/styles/vendor-spacing.css";
import "@/styles/theme.css";
import "@/styles/sticky-cards.css";
import "@/styles/custom.css";

import App from "@/App";

const container = document.getElementById("root")!;

const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// The build prerenders every route, so in production the container already
// holds the markup and React only needs to attach to it. The empty-container
// path keeps `vite dev` working, where nothing is prerendered.
if (container.firstChild) hydrateRoot(container, tree);
else createRoot(container).render(tree);

// Loaded after the tree is attached, not at module scope. Bootstrap's bundle
// initialises itself against whatever markup it finds, and against the
// prerendered HTML that runs before hydration and changes the DOM out from
// under it.
void import("bootstrap/dist/js/bootstrap.bundle.min.js");
