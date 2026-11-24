#!/usr/bin/env node
// Stage _site for Cloudflare Workers Static Assets / Pages.
// No dependencies — copies index.html + public assets into ./_site.
import { cpSync, mkdirSync, existsSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const site = join(root, "_site");

function ensureDir(p) { mkdirSync(p, { recursive: true }); }

function clean() {
  if (existsSync(site)) rmSync(site, { recursive: true, force: true });
  ensureDir(site);
}

function copyFile(src, dest) {
  if (!existsSync(src)) return false;
  ensureDir(dirname(dest));
  cpSync(src, dest);
  return true;
}

function copyDir(src, dest) {
  if (!existsSync(src)) return;
  ensureDir(dest);
  cpSync(src, dest, { recursive: true });
}

clean();

// Core site
copyFile(join(root, "index.html"), join(site, "index.html"));
copyFile(join(root, "_headers"), join(site, "_headers"));
copyFile(join(root, "_redirects"), join(site, "_redirects"));

// Assets
copyDir(join(root, "assets"), join(site, "assets"));
copyDir(join(root, "public"), join(site, "public"));

// Workers may serve from _site, Pages serves from repo root — keep both.
// Also emit a tiny _site/robots.txt and sitemap if missing.
if (!existsSync(join(site, "robots.txt"))) {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(join(site, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://evorez.in/sitemap.xml\n", "utf8");
}
if (!existsSync(join(site, "sitemap.xml"))) {
  const { writeFileSync } = await import("node:fs");
  const lastmod = new Date().toISOString().slice(0,10);
  writeFileSync(join(site, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://evorez.in/</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`, "utf8");
}

// Summarize
function list(dir, prefix="") {
  let out=[];
  for (const e of readdirSync(dir, { withFileTypes:true })) {
    const p=join(dir,e.name);
    const rel=prefix ? prefix+"/"+e.name : e.name;
    if (e.isDirectory()) out.push(...list(p, rel));
    else {
      const s=statSync(p).size;
      out.push(`${rel} (${s} B)`);
    }
  }
  return out;
}
console.log("Staged _site:");
for (const f of list(site)) console.log(" -", f);
console.log("Done. Deploy with: wrangler deploy  OR  Cloudflare Pages (build: node scripts/stage.mjs, output: _site)");
