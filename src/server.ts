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
    const landing = ["/solar-calculator", "/methodology", "/comparisons", "/technical-analysis", "/runtime-database", "/ups-database", "/guides", "/blog", "/ev-chargers", "/home-batteries", "/backup-power", "/assets/", "/__manifest", "/_build/", "/favicon"];
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
    <lastmod>2026-06-04</lastmod>
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
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/growatt-infinity-1500-vs-ecoflow-delta-3-plus-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-1000-v2-vs-allpowers-r1500-lite-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/vtoman-flashspeed-1500-vs-ecoflow-delta-3-max-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/allpowers-s2000-pro-vs-ecoflow-delta-3-max-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/oupes-mega-1-vs-ecoflow-delta-3-classic-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-home-office-ups/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-cpap-2026/</loc>
    <lastmod>2026-06-04</lastmod>
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
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-starlink/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-a-solar-generator-run-a-cpap/</loc>
    <lastmod>2026-06-04</lastmod>
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
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-04</lastmod>
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
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-vs-bluetti-which-brand-better-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-off-grid-2026/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-rv-van-life-2026/</loc>
    <lastmod>2026-06-04</lastmod>
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
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/dji-power-1000-vs-ecoflow-delta-3-classic/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/anker-solix-f3800-vs-ecoflow-delta-pro/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-vs-bluetti-ac200l/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-3-max-vs-jackery-explorer-2000-plus/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-home-backup/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-solar-generators-under-1000/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/jackery-explorer-2000-plus-vs-ecoflow-delta-2-max/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/bluetti-ac200l-vs-ecoflow-delta-2-max/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-pro-vs-delta-3-max/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/whole-home-backup-solar-battery-guide/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/best-home-battery-systems-2026/</loc>
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/powerwall-alternatives-2026/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ev-charger-installation-cost-2026/</loc>
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/how-long-ecoflow-delta-pro-charge/</loc>
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-solar-generator-run-sump-pump/</loc>
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/can-solar-generator-run-window-air-conditioner/</loc>
    <lastmod>2026-06-02</lastmod>
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
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/ecoflow-delta-2-review-2026/</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/portable-power-station-medical-devices/</loc>
    <lastmod>2026-06-02</lastmod>
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
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-02</lastmod>
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
    <lastmod>2026-06-02</lastmod>
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
    <lastmod>2026-06-02</lastmod>
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
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
  <url>
    <loc>https://clickdecisionlab.com/solar-generator-real-usable-capacity/</loc>
    <lastmod>2026-06-03</lastmod>
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
    <lastmod>2026-06-04</lastmod>
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
    <lastmod>2026-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>
</urlset>`, {
                headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" }
            });
        }

        if (url.pathname === "/robots.txt") {
            return new Response(ROBOTS_TXT, { headers: { "content-type": "text/plain; charset=utf-8" } });
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
