import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
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

