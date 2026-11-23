# EVOREZ.IN — evorez.in

Live: **https://evorez.in** · Mirror: https://evorez.vercel.app · Repo: `evorez/EVOREZ.IN`

> Evorez — still alive, still building. Single-file terminal site with dock, island popovers, arcade, soundtrack.

## Deploy (Cloudflare)

This repo is Cloudflare-ready — from Vercel → Cloudflare migration done.

- `index.html` lifted from **evorez.vercel.app** (fetch + faithful rebuild)
- Served on **evorez.in** via Cloudflare Pages or Workers Static Assets

See **[CLOUDFLARE.md](./CLOUDFLARE.md)** for step-by-step Hindi/English guide.

Quick:
```bash
node scripts/stage.mjs   # builds _site/
npx wrangler deploy      # Workers
# or: connect repo to Cloudflare Pages (build: node scripts/stage.mjs, output: _site)
```

## Structure
```
index.html        # site (single file, no deps)
src/worker.js     # Worker: /index.html→/, headers, cache, proxy fallback
wrangler.jsonc    # assets + routes evorez.in/*
_headers          # Pages headers (CSP, HSTS, cache)
_redirects        # /index.html -> / 301
scripts/stage.mjs # stage _site/
assets/           # og-cover.png etc.
```

## Copy guard
Personal site, not a template. Learning from published HTML is fine; republishing, reusing design/copy/avatar/fonts/audio as your own is not. If you see this hosted anywhere other than https://evorez.in, report to coolex.in@gmail.com.
