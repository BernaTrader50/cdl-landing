import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
    fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
    if (!serverEntryPromise) {
        serverEntryPromise = import("@tanstack/react-start/server-entry").then(
            (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
        );
    }
    return serverEntryPromise;
}

function brandedErrorResponse(): Response {
    return new Response(renderErrorPage(), { status: 500, headers: { "content-type": "text/html; charset=utf-8" } });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
    let payload: unknown;
    try { payload = JSON.parse(body); } catch { return false; }
    if (!payload || Array.isArray(payload) || typeof payload !== "object") return false;
    const fields = payload as Record<string, unknown>;
    const expectedKeys = new Set(["message", "status", "unhandled"]);
    if (!Object.keys(fields).every((key) => expectedKeys.has(key))) return false;
    return fields.unhandled === true && fields.message === "HTTPError" && (fields.status === undefined || fields.status === responseStatus);
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
    if (response.status < 500) return response;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return response;
    const body = await response.clone().text();
    if (!isCatastrophicSsrErrorBody(body, response.status)) return response;
    console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
    return brandedErrorResponse();
}

// Routes handled by the React landing app
function isLandingRoute(pathname: string): boolean {
    if (pathname === "/" || pathname === "") return true;
    const landing = ["/solar-calculator", "/methodology", "/comparisons", "/technical-analysis", "/runtime-database", "/ups-database", "/guides", "/blog", "/ev-chargers", "/home-batteries", "/backup-power", "/solar-generators", "/assets/", "/__manifest", "/_build/", "/favicon"];
    // Match exact, sub-paths (/solar-generators/product-name/), and query strings
    return landing.some(p => pathname === p || pathname.startsWith(p.endsWith("/") ? p : p + "/") || pathname === p + "?");
}

const ROBOTS_TXT = `# robots.txt - ClickDecisionLab
# https://clickdecisionlab.com

User-agent: *
Allow: /
Disallow: /wp-admin/
Disallow: /wp-login.php

# Search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

# AI search engines (explicitly allowed for visibility)
User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: cohere-ai
Allow: /

# Sitemaps
Sitemap: https://clickdecisionlab.com/cdl-sitemap.xml
`;

export default {
    async fetch(request: Request, env: unknown, ctx: unknown) {
        const url = new URL(request.url);

        // ── URL normalization (canonical enforcement) ─────────────────────────
        // 1. Force HTTPS
        // 2. Remove www (canonical is clickdecisionlab.com without www)
        // 3. Add trailing slash to content paths (avoids duplicate /slug vs /slug/)
        const needsHttps = url.protocol !== 'https:';
        const needsNoWww = url.hostname === 'www.clickdecisionlab.com';
        // Add trailing slash to single-segment WP article paths (not to /go/, /sitemap, /robots, assets)
        const isContentPath = url.pathname.length > 1
            && !url.pathname.endsWith('/')
            && !url.pathname.includes('.')
            && !url.pathname.startsWith('/go/')
            && !url.pathname.startsWith('/assets/')
            && !url.pathname.startsWith('/_build/')
            && url.pathname !== '/cdl-sitemap.xml'
            && url.pathname !== '/robots.txt';
        const needsTrailingSlash = isContentPath;

        if (needsHttps || needsNoWww || needsTrailingSlash) {
            const canonical = new URL(request.url);
            canonical.protocol = 'https:';
            canonical.hostname = 'clickdecisionlab.com';
            if (needsTrailingSlash) canonical.pathname = url.pathname + '/';
            return Response.redirect(canonical.toString(), 301);
        }

        if (url.pathname === "/sitemap.xml") {
            return Response.redirect("https://clickdecisionlab.com/cdl-sitemap.xml", 301);
        }

        if (url.pathname === "/cdl-sitemap.xml") {
            return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
    <loc>https://clickdecisionlab.com/</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-calculator</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/technical-analysis</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/comparisons</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/runtime-database</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ups-database</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ev-chargers</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/home-batteries</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/methodology</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/blog</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/backup-power</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/guides</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/goal-zero-yeti-500x-vs-ecoflow-river-3-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/zendure-hyper-2000-vs-ecoflow-delta-3-max-plus-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-eb70-vs-jackery-explorer-1000-plus-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-river-pro-vs-jackery-explorer-500-v2-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-c1000-vs-ecoflow-delta-3-max-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/growatt-infinity-1500-vs-ecoflow-delta-3-plus-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-1000-v2-vs-allpowers-r1500-lite-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/vtoman-flashspeed-1500-vs-ecoflow-delta-3-max-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/allpowers-s2000-pro-vs-ecoflow-delta-3-max-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/oupes-mega-1-vs-ecoflow-delta-3-classic-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-home-office-ups/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-cpap-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-ups-mode-explained/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-a-portable-ac/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-a-microwave/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-starlink/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-a-cpap/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-a-refrigerator/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/what-can-a-solar-generator-run/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/do-you-need-solar-panels-home-battery/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/enphase-vs-tesla-powerwall-home-battery/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/home-battery-vs-generator-backup/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-home-batteries-power-house-outage/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/home-battery-storage-tax-credits-2026/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/hardwired-vs-plugin-level-2-ev-charger/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-long-install-level-2-ev-charger/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ev-charger-apartment-condo-options/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/smart-ev-charger-vs-regular-wifi/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/charge-tesla-level-2-charger-guide/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-sump-pump-flood/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-long-2000wh-solar-generator-run-refrigerator/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-medical-devices-2026/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-run-dehumidifier/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-plus-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac500-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/vtoman-flashspeed-1500-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-c2000-gen2-technical-analysis-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-plus-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-vs-anker-solix-c2000-gen2/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-vs-bluetti-which-brand-better-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-off-grid-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-rv-van-life-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-camping-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/vtoman-flashspeed-1500-vs-ecoflow-delta-3-classic/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/dji-power-1000-vs-ecoflow-delta-3-classic/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-f3800-vs-ecoflow-delta-pro/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-vs-bluetti-ac200l/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-vs-jackery-explorer-2000-plus/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-home-backup/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-under-1000/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-plus-vs-ecoflow-delta-2-max/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac200l-vs-ecoflow-delta-2-max/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-pro-vs-delta-3-max/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/whole-home-backup-solar-battery-guide/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-home-battery-systems-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-much-battery-storage-home/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/lfp-vs-nmc-home-batteries/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/powerwall-alternatives-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ev-charger-installation-cost-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-level-2-ev-chargers-2026/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/nacs-vs-j1772-ev-charger/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-many-amps-ev-charger/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/level-1-vs-level-2-ev-chargers/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-v2-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-2-max-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac300-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-classic-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-f3800-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac200l-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-1000-v2-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-plus-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-pro-technical-analysis-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-power-outages-blackouts-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-garage-workshop/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-vs-jackery-which-brand-better-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-long-ecoflow-delta-pro-charge/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-run-fridge-and-freezer/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-solar-generator-run-chest-freezer/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-solar-generator-run-sump-pump/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-solar-generator-run-window-air-conditioner/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-pro-review-2026/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac200p-review-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-2-review-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/portable-power-station-medical-devices/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-van-life/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-c1000-review/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-rv-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-2-max-review-2026/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-vs-gas-generator-home-backup/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-pro-review-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/complete-guide-solar-power-stations-home/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/mistakes-buying-solar-power-station/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-value-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/inverter-efficiency-solar-generator/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-panels-needed-recharge-power-station/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/surge-wattage-solar-generator-explained/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/lifepo4-vs-nmc-solar-generator/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-power-rural-cabin-off-grid/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-station-beach-day/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-power-station-lifespan/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-overlanding-12v-fridge/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-home-backup-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/what-can-2000wh-solar-generator-run/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-real-usable-capacity/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-cpap-camping/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-runtime-fridge-router-lights/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-sizing-power-outage/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-pro-vs-bluetti-ac300/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-the-ecoflow-delta-pro-run-a-well-pump/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-fridge-24h/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-classic-review-2026-2/</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-1000-v2-review-2026-2/</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-v2-review-2026/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac300-review-2026/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-classic-review-2026/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-f3800-review-2026/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac200l-review-2026/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-1000-v2-review-2026/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-plus-review-2026/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-review-2026/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-long-home-battery-power-outage/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/level-1-vs-level-2-vs-dc-fast-charging/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-much-cost-charge-ev-home/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-vs-powerwall-home/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-whole-home-backup-2026/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-watt-hours-explained/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/goal-zero-yeti-500x-vs-ecoflow-river-3-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/zendure-hyper-2000-vs-ecoflow-delta-3-max-plus-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-eb70-vs-jackery-explorer-1000-plus-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-river-pro-vs-jackery-explorer-500-v2-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-c1000-vs-ecoflow-delta-3-max-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/growatt-infinity-1500-vs-ecoflow-delta-3-plus-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-1000-v2-vs-allpowers-r1500-lite-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/vtoman-flashspeed-1500-vs-ecoflow-delta-3-max-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/allpowers-s2000-pro-vs-ecoflow-delta-3-max-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/oupes-mega-1-vs-ecoflow-delta-3-classic-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-home-office-ups/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-cpap-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-ups-mode-explained/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-a-portable-ac/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-a-microwave/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-starlink/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-a-cpap/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-a-refrigerator/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/what-can-a-solar-generator-run/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/do-you-need-solar-panels-home-battery/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/enphase-vs-tesla-powerwall-home-battery/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/home-battery-vs-generator-backup/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-home-batteries-power-house-outage/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/home-battery-storage-tax-credits-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/hardwired-vs-plugin-level-2-ev-charger/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-long-install-level-2-ev-charger/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ev-charger-apartment-condo-options/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/smart-ev-charger-vs-regular-wifi/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/charge-tesla-level-2-charger-guide/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-sump-pump-flood/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-long-2000wh-solar-generator-run-refrigerator/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-medical-devices-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-run-dehumidifier/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-plus-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac500-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/vtoman-flashspeed-1500-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-c2000-gen2-technical-analysis-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-plus-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-vs-anker-solix-c2000-gen2/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-vs-bluetti-which-brand-better-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-off-grid-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-rv-van-life-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-camping-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/vtoman-flashspeed-1500-vs-ecoflow-delta-3-classic/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/dji-power-1000-vs-ecoflow-delta-3-classic/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-f3800-vs-ecoflow-delta-pro/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-vs-bluetti-ac200l/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-vs-jackery-explorer-2000-plus/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-home-backup/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-under-1000/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-plus-vs-ecoflow-delta-2-max/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac200l-vs-ecoflow-delta-2-max/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-pro-vs-delta-3-max/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/whole-home-backup-solar-battery-guide/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-home-battery-systems-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-much-battery-storage-home/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/lfp-vs-nmc-home-batteries/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/powerwall-alternatives-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ev-charger-installation-cost-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-level-2-ev-chargers-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/nacs-vs-j1772-ev-charger/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-many-amps-ev-charger/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/level-1-vs-level-2-ev-chargers/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-v2-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-2-max-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac300-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-classic-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-f3800-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac200l-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-1000-v2-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-plus-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-pro-technical-analysis-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-power-outages-blackouts-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-garage-workshop/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-vs-jackery-which-brand-better-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-long-ecoflow-delta-pro-charge/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-run-fridge-and-freezer/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-solar-generator-run-chest-freezer/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-solar-generator-run-sump-pump/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-solar-generator-run-window-air-conditioner/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-pro-review-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac200p-review-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-2-review-2026/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/portable-power-station-medical-devices/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-van-life/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-c1000-review/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-rv-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-2-max-review-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-vs-gas-generator-home-backup/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-pro-review-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/complete-guide-solar-power-stations-home/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/mistakes-buying-solar-power-station/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-value-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/inverter-efficiency-solar-generator/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-panels-needed-recharge-power-station/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/surge-wattage-solar-generator-explained/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/lifepo4-vs-nmc-solar-generator/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-power-rural-cabin-off-grid/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-station-beach-day/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-power-station-lifespan/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-overlanding-12v-fridge/</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generator-home-backup-2026/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/what-can-2000wh-solar-generator-run/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-real-usable-capacity/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-cpap-camping/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-runtime-fridge-router-lights/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-sizing-power-outage/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-pro-vs-bluetti-ac300/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-the-ecoflow-delta-pro-run-a-well-pump/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-fridge-24h/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://clickdecisionlab.com/blog/solar-generator-vs-gas-generator-home-backup</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/blog/solar-generator-fridge-24h</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/category/comparisons/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`, {
                headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" }
            });
        }

        if (url.pathname === "/robots.txt") {
            return new Response(ROBOTS_TXT, { headers: { "content-type": "text/plain; charset=utf-8" } });
        }

        // Lab sub-paths → redirigir al lab (ANTES de isLandingRoute)
        // /solar-generators/product-name/ → /solar-generators/
        const labPrefixes = ['/solar-generators/', '/ev-chargers/', '/home-batteries/', '/backup-power/'];
        for (const prefix of labPrefixes) {
            if (url.pathname.startsWith(prefix) && url.pathname !== prefix) {
                return Response.redirect('https://clickdecisionlab.com' + prefix, 301);
            }
        }

        // Landing routes → React app
        if (isLandingRoute(url.pathname)) {
            try {
                const handler = await getServerEntry();
                const response = await handler.fetch(request, env, ctx);
                return await normalizeCatastrophicSsrResponse(response);
            } catch (error) {
                console.error(error);
                return brandedErrorResponse();
            }
        }

        // ── Geo-routing affiliate links: /go/:brand/:product ──────────────────
        // Must be BEFORE singleSegment check to intercept /go/brand/product paths
        if (url.pathname.startsWith('/go/')) {
            const parts = url.pathname.replace('/go/', '').split('/');
            const brand = (parts[0] || '').toLowerCase();
            const country = request.headers.get('CF-IPCountry') || 'US';

            // Amazon tag fallback para marcas sin programa propio
            const amz = (asin: string) => `https://www.amazon.com/dp/${asin}?tag=clickdecision-20`;
            const amzS = (q: string) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=clickdecision-20`;

            // ASIN map: /go/brand/product-slug → Amazon ASIN directo
            const ASIN: Record<string, string> = {
                // EcoFlow
                'ecoflow/river-2':          'B0BL3GS65R',
                'ecoflow/river-3':          'B0CVQR6RHR',
                'ecoflow/delta-3':          'B0D6PGPFJ3',
                'ecoflow/delta-3-max':      'B0D6PGQ847',
                'ecoflow/delta-3-max-plus': 'B0D6PGQ847',
                'ecoflow/delta-pro':        'B099JGHTY3',
                'ecoflow/delta-2':          'B0B95FBNQN',
                'ecoflow/delta-2-max':      'B0BW7B2GX3',
                'ecoflow/delta-pro-ultra':  'B0CHK4GGWK',
                // Jackery
                'jackery/explorer-1000-v2': 'B0CNW2CXNW',
                'jackery/explorer-2000-pro':'B09JZQW7CR',
                'jackery/explorer-2000-v2': 'B0D6X3NF3T',
                'jackery/explorer-500-v2':  'B0CKVBM4T4',
                // Bluetti
                'bluetti/ac200l':           'B0C3XWT42H',
                'bluetti/ac300':            'B09DKNB5KB',
                'bluetti/eb70':             'B093BVBZD5',
                'bluetti/ac200p':           'B08LZX7S4T',
                // Anker SOLIX
                'ankersolix/c1000':         'B0C6JRPVTB',
                'ankersolix/f3800':         'B0CRZS72V5',
                // Goal Zero
                'goalzero/yeti-500x':       'B07PDBNNT8',
                'goalzero/yeti-1000x':      'B07T2BB3F2',
                'goalzero/yeti-1500x':      'B07T1LMWMJ',
                'goalzero/yeti-3000x':      'B08BSXT4WT',
                // OUPES
                'oupes/mega-2':             'B0CCTK9F16',
                'oupes/mega-1':             'B0BDWHPBTT',
                // Growatt
                'growatt/vita-550':         'B0CQTCPZQN',
                'growatt/infinity-1500':    'B0CJRTL7VX',
                'growatt/infinity-2000':    'B0CJRTL7VX',
                // VTOMAN
                'vtoman/flashspeed-1500':   'B0CDRYT31L',
                // Allpowers
                'allpowers/r1500-lite':     'B0CVPVQJY7',
                'allpowers/r2500':          'B0CVPWMFKP',
                'allpowers/prime-day':      'B0CVPVQJY7',
            };

            const GEO: Record<string, Record<string, {network: string, url?: string, mid?: string, base?: string}>> = {
                // ── ECOFLOW — AWIN EU + Impact US/CA ──────────────────────────
                'ecoflow': {
                    'US': { network: 'impact', url: 'https://caecoflowcom.pxf.io/c/7338771/2787516/31964' },
                    'CA': { network: 'impact', url: 'https://caecoflowcom.pxf.io/c/7338771/2787516/31964' },
                    'GB': { network: 'awin', mid: '51797', base: 'https://ecoflow.com/uk' },
                    'DE': { network: 'awin', mid: '51793', base: 'https://ecoflow.com/de' },
                    'FR': { network: 'awin', mid: '51799', base: 'https://ecoflow.com/fr' },
                    'NL': { network: 'awin', mid: '123332', base: 'https://ecoflow.com/nl' },
                    'default': { network: 'impact', url: 'https://caecoflowcom.pxf.io/c/7338771/2787516/31964' },
                },
                // ── JACKERY — AWIN US/UK/DE ────────────────────────────────────
                'jackery': {
                    'US': { network: 'awin', mid: '59183', base: 'https://www.jackery.com' },
                    'GB': { network: 'awin', mid: '30413', base: 'https://www.jackery.com/en-gb' },
                    'DE': { network: 'awin', mid: '30415', base: 'https://www.jackery.com/de' },
                    'default': { network: 'awin', mid: '59183', base: 'https://www.jackery.com' },
                },
                // ── BLUETTI — AWIN US/UK/DE/ES ────────────────────────────────
                'bluetti': {
                    'US': { network: 'awin', mid: '59271', base: 'https://www.bluettipower.com' },
                    'GB': { network: 'awin', mid: '32273', base: 'https://www.bluettipower.com/en-gb' },
                    'DE': { network: 'awin', mid: '32267', base: 'https://www.bluettipower.com/de' },
                    'ES': { network: 'awin', mid: '32263', base: 'https://www.bluettipower.com/es' },
                    'default': { network: 'awin', mid: '59271', base: 'https://www.bluettipower.com' },
                },
                // ── ALLPOWERS — AWIN US/DE/FR/ES/IT/INTL ──────────────────────
                'allpowers': {
                    'US': { network: 'awin', mid: '40342', base: 'https://www.allpowers.com' },
                    'CA': { network: 'awin', mid: '40342', base: 'https://www.allpowers.com' },
                    'DE': { network: 'awin', mid: '67914', base: 'https://www.allpowers.com/de' },
                    'FR': { network: 'awin', mid: '98667', base: 'https://www.allpowers.com/fr' },
                    'ES': { network: 'awin', mid: '107468', base: 'https://www.allpowers.com/es' },
                    'IT': { network: 'awin', mid: '107466', base: 'https://www.allpowers.com/it' },
                    'NL': { network: 'awin', mid: '38934', base: 'https://www.allpowers.com' },
                    'BE': { network: 'awin', mid: '38934', base: 'https://www.allpowers.com' },
                    'default': { network: 'awin', mid: '38934', base: 'https://www.allpowers.com' },
                },
                // ── ZENDURE — AWIN EU ─────────────────────────────────────────
                'zendure': {
                    'PL': { network: 'awin', mid: '68786', base: 'https://pl.zendure.com/' },
                    'default': { network: 'awin', mid: '68786', base: 'https://www.zendure.com/pages/prime-day' },
                },
                // ── ANKER SOLIX — AWIN DE (pendiente aprobación) ─────────────
                'anker': {
                    'DE': { network: 'awin', mid: '32623', base: 'https://www.anker.com/de' },
                    'default': { network: 'awin', mid: '32623', base: 'https://www.anker.com' },
                },
                'ankersolix': {
                    'DE': { network: 'awin', mid: '32623', base: 'https://www.anker.com/de' },
                    'default': { network: 'awin', mid: '32623', base: 'https://www.anker.com' },
                },
                // ── SIN PROGRAMA PROPIO — Amazon fallback ─────────────────────
                'goalzero': {
                    'default': { network: 'amazon', url: amzS('Goal Zero Yeti power station') },
                },
                'oupes': {
                    'default': { network: 'amazon', url: amzS('OUPES portable power station') },
                },
                'growatt': {
                    'default': { network: 'amazon', url: amzS('Growatt VITA portable power station') },
                },
                'mangopower': {
                    'default': { network: 'amazon', url: amzS('Mango Power portable power station') },
                },
                'pecron': {
                    'default': { network: 'amazon', url: amzS('Pecron portable power station') },
                },
                'vtoman': {
                    'default': { network: 'amazon', url: amzS('VTOMAN FlashSpeed power station') },
                },
                'geneverse': {
                    'default': { network: 'amazon', url: amzS('Geneverse solar generator') },
                },
                'renogy': {
                    'default': { network: 'amazon', url: amzS('Renogy portable power station') },
                },
                'djipower': {
                    'default': { network: 'amazon', url: amzS('DJI Power portable station') },
                },
                'lionenergy': {
                    'default': { network: 'amazon', url: amzS('Lion Energy portable power station') },
                },
                'westinghouse': {
                    'default': { network: 'amazon', url: amzS('Westinghouse portable power station') },
                },
                'aferiy': {
                    'default': { network: 'amazon', url: amzS('Aferiy portable power station') },
                },
                'biolite': {
                    'default': { network: 'amazon', url: amzS('BioLite BaseCharge power station') },
                },
                'rockpals': {
                    'default': { network: 'amazon', url: amzS('Rockpals portable power station') },
                },
            };

            const brandMap = GEO[brand];
            if (brandMap) {
                const config = brandMap[country] || brandMap['default'];
                let finalUrl = '';

                // Check ASIN map first — direct product link beats generic search
                const asinKey = `${brand}/${parts[1] || ''}`;
                const asin = ASIN[asinKey];
                if (asin) {
                    finalUrl = amz(asin);
                } else if (config.network === 'impact' && config.url) {
                    finalUrl = config.url;
                } else if (config.network === 'amazon' && config.url) {
                    finalUrl = config.url;
                } else if (config.network === 'awin' && config.mid) {
                    const dest = encodeURIComponent(config.base || 'https://www.google.com');
                    finalUrl = `https://www.awin1.com/cread.php?awinmid=${config.mid}&awinaffid=2929639&ued=${dest}`;
                }
                if (finalUrl) {
                    return new Response(null, {
                        status: 302,
                        headers: {
                            'Location': finalUrl,
                            'Cache-Control': 'no-store',
                            'X-CDL-Country': country,
                            'X-CDL-Network': asin ? 'amazon-direct' : config.network,
                        }
                    });
                }
            }
            return Response.redirect('https://clickdecisionlab.com/', 302);
        }

        // WordPress article URLs (e.g. /some-post-slug/) → render via the React $slug
        // catch-all route instead of passing through to WordPress's own theme.
        // This is what gives WordPress-sourced articles the same site design as
        // every other page. Only matches single-segment paths with no file extension,
        // so it can't accidentally swallow nested/static asset requests.
        const singleSegment = /^\/[a-z0-9][a-z0-9-]*\/?$/i.test(url.pathname) && !url.pathname.includes(".");
        if (singleSegment) {
            try {
                const handler = await getServerEntry();
                const response = await handler.fetch(request, env, ctx);
                if (response.status !== 404) {
                    return await normalizeCatastrophicSsrResponse(response);
                }
                // React's $slug route returned 404 (no matching WP post) — fall through to origin below
            } catch (error) {
                console.error(error);
                // fall through to origin on error too, rather than showing a branded error for a WP page
            }
        }

        // Lab sub-paths que no existen como rutas React → redirigir al lab
        // e.g. /solar-generators/ecoflow-delta-3-max/ → /solar-generators/
        const labRedirects: Record<string, string> = {
            '/solar-generators/': '/solar-generators/',
            '/ev-chargers/': '/ev-chargers/',
            '/home-batteries/': '/home-batteries/',
            '/backup-power/': '/backup-power/',
        };
        for (const [prefix, target] of Object.entries(labRedirects)) {
            if (url.pathname.startsWith(prefix) && url.pathname !== prefix) {
                return Response.redirect('https://clickdecisionlab.com' + target, 301);
            }
        }

        // Everything else → pass through to Cloudflare origin (WordPress on Hostinger)
        // Redirect /blog/:slug → /:slug/ (301 — fixes GSC non-indexed pages)
        if (url.pathname.startsWith('/blog/') && url.pathname.length > 6) {
          const slug = url.pathname.replace('/blog/', '').replace(/\/+$/, '');
          return Response.redirect('https://clickdecisionlab.com/' + slug + '/', 301);
        }

        // Cloudflare will route to the A record (185.212.71.247) directly
        return fetch(request);
    },
};
