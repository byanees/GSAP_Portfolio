import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Stylesheets, in cascade order. These live in src/ (not public/) so the build
// can purge the unused theme rules and minify what is left.
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/vendor-carousel-ticker.css";
import "@/styles/vendor-spacing.css";
import "@/styles/theme.css";
import "@/styles/sticky-cards.css";
import "@/styles/custom.css";

import App from "@/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
