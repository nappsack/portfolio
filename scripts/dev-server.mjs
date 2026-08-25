/**
 * Local dev server for chrisnappi.com.
 *
 * Serves the static site and runs the real chat function in-process, so you
 * can test changes to the prompt or the widget without deploying. This exists
 * instead of the Netlify CLI so there's nothing extra to install.
 *
 *   node scripts/dev-server.mjs
 *   → http://localhost:8888
 *
 * Needs ANTHROPIC_API_KEY, read from .env in the project root (gitignored).
 */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";
import { Readable } from "node:stream";

const ROOT = new URL("..", import.meta.url).pathname;
const PORT = Number(process.env.PORT ?? 8888);

// --- .env -----------------------------------------------------------------

const envPath = join(ROOT, ".env");
if (existsSync(envPath)) {
  for (const line of (await readFile(envPath, "utf-8")).split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "\n  No ANTHROPIC_API_KEY found.\n\n" +
      "  Create a key at console.anthropic.com, then put it in a file\n" +
      `  called .env at ${ROOT}\n\n` +
      "      ANTHROPIC_API_KEY=sk-ant-your-key-here\n\n" +
      "  That file is gitignored and never leaves your machine.\n"
  );
  process.exit(1);
}

// Imported after the key is in the environment, because the Anthropic client
// reads it when the module first loads.
const { default: chat } = await import("../netlify/functions/chat.mjs");

// --- static ---------------------------------------------------------------

const TYPES = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".json": "application/json", ".md": "text/plain",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml", ".gif": "image/gif", ".webp": "image/webp",
  ".ico": "image/x-icon", ".pdf": "application/pdf",
  ".otf": "font/otf", ".ttf": "font/ttf", ".woff": "font/woff",
  ".woff2": "font/woff2", ".mov": "video/quicktime", ".mp4": "video/mp4",
};

async function serveStatic(pathname, res) {
  let rel = decodeURIComponent(pathname);
  if (rel.endsWith("/")) rel += "index.html";

  // Keep path traversal out.
  const file = join(ROOT, normalize(rel).replace(/^(\.\.[/\\])+/, ""));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  if (!existsSync(file) || statSync(file).isDirectory()) {
    // Mirrors the production catch-all.
    const html = await readFile(join(ROOT, "index.html"));
    res.writeHead(200, { "content-type": "text/html" }).end(html);
    return;
  }

  res.writeHead(200, {
    "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  res.end(await readFile(file));
}

// --- server ---------------------------------------------------------------

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/api/chat") {
    const chunks = [];
    for await (const c of req) chunks.push(c);

    const started = Date.now();
    let out;
    try {
      out = await chat(
        new Request(`http://localhost${req.url}`, {
          method: req.method,
          headers: req.headers,
          body: chunks.length ? Buffer.concat(chunks) : undefined,
        })
      );
    } catch (err) {
      console.error("  function threw:", err);
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: String(err?.message ?? err) }));
      return;
    }

    res.writeHead(out.status, Object.fromEntries(out.headers));
    if (out.body) {
      Readable.fromWeb(out.body).pipe(res);
      res.on("finish", () =>
        console.log(`  answered in ${((Date.now() - started) / 1000).toFixed(1)}s`)
      );
    } else {
      res.end();
    }
    return;
  }

  await serveStatic(url.pathname, res);
}).listen(PORT, () => {
  console.log(`\n  chrisnappi.com running locally\n  http://localhost:${PORT}\n`);
  console.log("  The chat box talks to the real Claude API, so questions cost");
  console.log("  a few cents each. Ctrl+C to stop.\n");
});
