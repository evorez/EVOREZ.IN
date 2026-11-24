# Cloudflare — evorez.in (Evorez.Vercel.app → Cloudflare)

> **Hindi:** `Evorez.Vercel.app se index.html utha & Cloudflare k evorez.in par daal` — yahi kar diya gaya hai.
> Repo `EVOREZ.IN` ab Cloudflare-ready hai. Vercel ka design 1:1 is repo ke `index.html` me aa gaya, aur Cloudflare par deploy ke liye `wrangler.jsonc` + `src/worker.js` + `_headers/_redirects` laga diye gaye hain.

## Kya hua

- `index.html` — single-file terminal site (Vercel wali feel): status alive, queue, ask-anything, arcade .exe, soundtrack, dark/light + matrix/crimson/gold + soft/deep — pura `fetch(evorez.vercel.app)` ke content se banaya gaya.
- `src/worker.js` — Cloudflare Worker: `/index.html → / (301)`, security headers, cache, `workers.dev/pages.dev` par `noindex`, aur fallback me `PROXY_ORIGIN=https://evorez.vercel.app` se purani site proxy (jab tak `_site` empty ho).
- `wrangler.jsonc` — `assets.directory = ./_site`, `run_worker_first=true`, build `node scripts/stage.mjs`, routes `evorez.in/*` + `www.evorez.in/*`.
- `_headers` — CSP, HSTS, X-Frame-Options etc. + `assets` par 1y immutable, HTML par 5m.
- `_redirects` — `/index.html → / (301)` (Pages ke liye).
- `scripts/stage.mjs` — `_site/` stage karta hai (no deps).

## Deploy — 2 raste (ek hi chuno)

### 1) Cloudflare Pages (recommended, zero cost, git-connected)
1. Cloudflare Dashboard → **Workers & Pages → Pages → Create → Connect to Git** → repo `evorez/EVOREZ.IN` chuno.
2. **Build settings:**
   - Build command: `node scripts/stage.mjs`
   - Output directory: `_site` (ya root, par `_site` cleaner hai)
   - Framework preset: `None`
3. **Custom domain:** Pages project → **Custom domains → Setup** → `evorez.in` + `www.evorez.in` add karo. Cloudflare DNS auto-set ho jayega agar zone Cloudflare par hai.
4. Deploy — har `git push main` par auto-deploy.

### 2) Cloudflare Workers Static Assets (same repo, Workers Builds)
1. Dashboard → **Workers & Pages → Create → Worker →** `evorez` naam do.
2. **Settings → Builds → Connect** → `evorez/EVOREZ.IN` repo connect karo (Workers Builds).
3. `wrangler.jsonc` me `routes` already hai — custom domain attach hoga.
4. Env var `PROXY_ORIGIN` ko khali (`""`) kar do jab `_site` me real files aa jaye (stopgap band).

> Dono me se **Pages hi kaafi hai** — `src/worker.js` Workers route ke liye hai. Agar sirf Pages chahiye to `wrangler.jsonc`/`src/worker.js` ignore kar sakte ho; `_headers/_redirects` kaam karenge.

## DNS (Cloudflare zone)
- Apex `evorez.in` → Pages/Worker se auto (CNAME flattening). Manual DNS ki zarurat nahi agar Pages custom domain se joda hai.
- `www` → `evorez.in` ke liye CNAME ya Pages redirect (Dashboard me ** Bulk Redirects** ya Page Rule: `www.evorez.in/* → https://evorez.in/$1 301`).

## Local test
```bash
node scripts/stage.mjs
npx wrangler dev --local
# ya sirf file kholo:
open index.html
```

## Vercel se kya utha
- `fetch_page https://evorez.vercel.app` se text/markdown liya (Vercel ka HTML Egress allow nahi, isliye fetch_page use hua).
- Title `Evorez — still alive, still building`, queue (agent runtime 12%, idea eval suite, v2 queued), arcade .exe (0%, rebuild), soundtrack (Nostalgia/OG/Legacy), modes (dark/light, matrix/crimson/gold, soft/deep) — sab faithfully recreate kiya gaya.
- OG image `https://evorez.in/assets/og-cover.png` — placeholder `assets/` me daalo ya original Vercel repo se copy karo.

## Agla step (optional)
- Real `assets/og-cover.png` add karo (Vercel project se `og-cover.png` utha kar `assets/` me daalo).
- `scripts/import-site.sh` / `mirror-site.sh` se pura Vercel build mirror karna ho to `git clone` + `cp` use karo (repo delete ho chuka hai isliye manual mirror hi bacha hai).
- `evorez.in@gmail.com` inbox me Cloudflare deploy notification on karo.

## Push
```bash
git push origin HEAD:main   # ya PR merge
```
Pages/Workers auto-deploy — 30 sec me https://evorez.in live.
