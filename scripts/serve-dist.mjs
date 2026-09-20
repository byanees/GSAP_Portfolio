// Static server that mirrors how Vercel serves this project: filesystem first,
// cleanUrls, gzip on text responses, and 404.html with a real 404 status. Used
// to verify a build the way it will actually be served, which `vite preview`
// cannot do because it falls back to index.html for every path.

import { createServer } from "node:http";
import { gzipSync } from "node:zlib";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.argv[2] ?? 4180);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

const COMPRESSIBLE = /^(text\/|image\/svg|application\/(javascript|json|xml))/;

/** Vercel resolves /about to about.html or about/index.html. Mirror that. */
async function resolveFile(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/+$/, "") || "/";
  const candidates =
    clean === "/"
      ? ["index.html"]
      : [clean.slice(1), `${clean.slice(1)}.html`, path.join(clean.slice(1), "index.html")];

  for (const candidate of candidates) {
    const abs = path.join(dist, candidate);
    if (!abs.startsWith(dist)) continue;
    try {
      if ((await stat(abs)).isFile()) return abs;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

function send(req, res, status, type, body) {
  const headers = { "content-type": type };
  const accepts = String(req.headers["accept-encoding"] ?? "").includes("gzip");

  if (accepts && COMPRESSIBLE.test(type)) {
    body = gzipSync(body);
    headers["content-encoding"] = "gzip";
    headers["vary"] = "accept-encoding";
  }

  headers["content-length"] = Buffer.byteLength(body);
  res.writeHead(status, headers);
  res.end(body);
}

createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, "http://localhost");
    const file = await resolveFile(pathname);

    if (!file) {
      let body = Buffer.from("Not found");
      try {
        body = await readFile(path.join(dist, "404.html"));
      } catch {
        /* a build without a prerendered 404 still gets the right status */
      }
      return send(req, res, 404, TYPES[".html"], body);
    }

    const type = TYPES[path.extname(file)] ?? "application/octet-stream";
    return send(req, res, 200, type, await readFile(file));
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end(String(err));
  }
}).listen(port, () => console.log(`serving ${dist} on http://localhost:${port}`));
