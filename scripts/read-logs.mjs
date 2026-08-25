/**
 * Read the chat log.
 *
 *   npm run logs            last 7 days
 *   npm run logs -- 30      last 30 days
 *   npm run logs -- 7 raw   full question and answer text
 *
 * Needs a Netlify personal access token so it can reach the site's storage:
 *
 *   NETLIFY_SITE_ID=...  NETLIFY_AUTH_TOKEN=...
 *
 * Put both in .env next to this project (gitignored). The site ID is on the
 * Netlify site's General settings page; make a token under User settings →
 * Applications → Personal access tokens.
 *
 * If you'd rather not bother: every entry is also printed to Netlify's own
 * function log, readable in the UI under Logs → Functions → chat.
 */

import { getStore } from "@netlify/blobs";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const envPath = join(ROOT, ".env");
if (existsSync(envPath)) {
  for (const line of (await readFile(envPath, "utf-8")).split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

const DAYS = Number(process.argv[2] ?? 7);
const RAW = process.argv[3] === "raw";

if (!process.env.NETLIFY_SITE_ID || !process.env.NETLIFY_AUTH_TOKEN) {
  console.error(
    "\n  Missing NETLIFY_SITE_ID or NETLIFY_AUTH_TOKEN.\n\n" +
      "  Add both to .env in the project root. See the notes at the top of\n" +
      "  this file. Or just read the log in the Netlify UI:\n" +
      "  Logs → Functions → chat\n"
  );
  process.exit(1);
}

const store = getStore({
  name: "chat-log",
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_AUTH_TOKEN,
});

const days = [];
for (let i = 0; i < DAYS; i++) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  days.push(d.toISOString().slice(0, 10));
}

let all = [];
for (const day of days.reverse()) {
  const rows = await store.get(day, { type: "json" }).catch(() => null);
  if (rows) all = all.concat(rows);
}

if (!all.length) {
  console.log(`\n  Nothing logged in the last ${DAYS} days.\n`);
  process.exit(0);
}

// Priced per entry by the model it recorded, so a log spanning a model
// switch still totals correctly. Cache writes bill at 1.25x input, reads
// at 0.1x. $/million tokens.
const RATES = {
  "claude-opus-5": [5, 25],
  "claude-sonnet-5": [3, 15],
  "claude-haiku-4-5": [1, 5],
};
const cost = (e) => {
  const [i, o] = RATES[e.model] ?? RATES["claude-sonnet-5"];
  return (
    ((e.tok_in ?? 0) / 1e6) * i +
    ((e.tok_cache_write ?? 0) / 1e6) * i * 1.25 +
    ((e.tok_cache_read ?? 0) / 1e6) * i * 0.1 +
    ((e.tok_out ?? 0) / 1e6) * o
  );
};
const spend = all.reduce((n, e) => n + cost(e), 0);
const visitors = new Set(all.map((e) => e.ip)).size;
const blocked = all.filter((e) => e.blocked).length;
const errors = all.filter((e) => e.error).length;

console.log(`\n  ${all.length} questions · ${visitors} visitors · ~$${spend.toFixed(2)}`);
if (blocked) console.log(`  ${blocked} blocked by the rate limit`);
if (errors) console.log(`  ${errors} errored`);
console.log();

for (const e of all) {
  const when = e.t.slice(5, 16).replace("T", " ");
  const tag = e.blocked ? "BLOCKED" : e.error ? "ERROR" : e.stop === "refusal" ? "REFUSED" : "";
  console.log(`  ${when}  ${e.ip}${tag ? "  [" + tag + "]" : ""}`);
  console.log(`    Q: ${RAW ? e.q : (e.q ?? "").slice(0, 100)}`);
  if (e.a) console.log(`    A: ${RAW ? e.a : e.a.slice(0, 100)}`);
  if (e.error) console.log(`    ! ${e.error}`);
  console.log();
}

// Repeat visitors are the ones worth a second look.
const byIp = {};
all.forEach((e) => (byIp[e.ip] = (byIp[e.ip] ?? 0) + 1));
const heavy = Object.entries(byIp).filter(([, n]) => n >= 10).sort((a, b) => b[1] - a[1]);
if (heavy.length) {
  console.log("  Heaviest users:");
  heavy.forEach(([ip, n]) => console.log(`    ${ip}  ${n} questions`));
  console.log();
}
