/**
 * Evorez — Cloudflare Worker (Static Assets + headers/redirect layer)
 * - Serves ./_site via Cloudflare Static Assets (ASSETS binding)
 * - Redirects /index.html -> / (301)
 * - Adds security headers, cache headers, noindex for workers.dev/pages.dev
 * - Fallback: if ASSETS missing and PROXY_ORIGIN set, proxies origin (Vercel)
 *
 * Docs: https://developers.cloudflare.com/workers/static-assets/binding/
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // 1) Redirect /index.html -> /
    if (url.pathname === "/index.html") {
      url.pathname = "/";
      return Response.redirect(url.toString(), 301);
    }

    // 2) Try static assets first (ASSETS binding from wrangler.jsonc)
    // When run_worker_first=true, env.ASSETS is available.
    let res;
    try {
      if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
        // Forward request to assets; Assets handles SPA fallback per config.
        res = await env.ASSETS.fetch(request);
        // If assets returned 404 and we have a proxy origin, try proxy.
        if (res.status === 404 && env.PROXY_ORIGIN) {
          const proxied = await proxyOrigin(request, env.PROXY_ORIGIN);
          if (proxied) return withHeaders(proxied, hostname);
        }
      } else if (env.PROXY_ORIGIN) {
        // No ASSETS binding (e.g. local dev without _site) -> proxy
        const proxied = await proxyOrigin(request, env.PROXY_ORIGIN);
        if (proxied) return withHeaders(proxied, hostname);
        // fallback
        return withHeaders(new Response("Not found — add _site/index.html or set PROXY_ORIGIN", { status: 404 }), hostname);
      }
    } catch (e) {
      // If assets threw, try proxy as fallback
      if (env.PROXY_ORIGIN) {
        const proxied = await proxyOrigin(request, env.PROXY_ORIGIN);
        if (proxied) return withHeaders(proxied, hostname);
      }
      return withHeaders(new Response("Worker error: " + (e && e.message ? e.message : e), { status: 500 }), hostname);
    }

    if (!res) {
      return withHeaders(new Response("Not found", { status: 404 }), hostname);
    }

    return withHeaders(res, hostname);
  },
};

async function proxyOrigin(request, origin) {
  try {
    const url = new URL(request.url);
    const target = new URL(url.pathname + url.search, origin);
    const headers = new Headers(request.headers);
    headers.set("host", new URL(origin).host);
    headers.set("x-forwarded-host", url.hostname);
    headers.set("x-real-ip", request.headers.get("cf-connecting-ip") || "");
    // Strip headers that break origin fetch
    headers.delete("cf-ray");
    const proxiedReq = new Request(target.toString(), {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual",
    });
    const res = await fetch(proxiedReq);
    // Avoid caching redirects loops
    return res;
  } catch {
    return null;
  }
}

function withHeaders(res, hostname) {
  const h = new Headers(res.headers);

  // Security headers (mirror _headers)
  if (!h.has("X-Frame-Options")) h.set("X-Frame-Options", "DENY");
  if (!h.has("X-Content-Type-Options")) h.set("X-Content-Type-Options", "nosniff");
  if (!h.has("Referrer-Policy")) h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (!h.has("Permissions-Policy")) h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (!h.has("Cross-Origin-Opener-Policy")) h.set("Cross-Origin-Opener-Policy", "same-origin");
  if (!h.has("Cross-Origin-Resource-Policy")) h.set("Cross-Origin-Resource-Policy", "same-origin");
  if (!h.has("Strict-Transport-Security")) h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  if (!h.has("Content-Security-Policy")) {
    h.set(
      "Content-Security-Policy",
      "default-src 'self' 'unsafe-inline' data: blob:; img-src 'self' data: https:; media-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
    );
  }

  // Cache control: respect existing, otherwise set sensible defaults
  const ct = (h.get("Content-Type") || "").toLowerCase();
  const path = ""; // we don't have path here, use content-type heuristics
  if (!h.has("Cache-Control")) {
    if (ct.includes("text/html")) h.set("Cache-Control", "public, max-age=300, must-revalidate");
    else if (ct.includes("image/") || ct.includes("font/") || ct.includes("audio/")) h.set("Cache-Control", "public, max-age=31536000, immutable");
    else h.set("Cache-Control", "public, max-age=3600");
  }

  // Noindex for preview hosts
  if (hostname.endsWith(".pages.dev") || hostname.endsWith(".workers.dev")) {
    h.set("X-Robots-Tag", "noindex");
  }

  // Canonical hint
  h.set("X-Served-By", "cloudflare-workers-evorez");

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: h,
  });
}
