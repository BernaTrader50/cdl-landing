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
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }
  if (!payload || Array.isArray(payload) || typeof payload !== "object") return false;
  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) return false;
  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
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

const ROBOTS_TXT = `# robots.txt — ClickDecisionLab
User-agent: *
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

Sitemap: https://www.clickdecisionlab.com/sitemap.xml
`;

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.clickdecisionlab.com/</loc><lastmod>2026-05-30</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog</loc><lastmod>2026-05-30</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.clickdecisionlab.com/solar-calculator</loc><lastmod>2026-05-30</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/best-solar-generator-power-outages-blackouts-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-garage-workshop</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/ecoflow-vs-jackery-which-brand-better-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/how-long-ecoflow-delta-pro-charge</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-run-fridge-and-freezer</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-fridge-24h</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/can-the-ecoflow-delta-pro-run-a-well-pump</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/ecoflow-delta-pro-vs-bluetti-ac300</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-sizing-power-outage</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-runtime-fridge-router-lights</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-cpap-camping</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-real-usable-capacity</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/what-can-2000wh-solar-generator-run</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/best-solar-generator-home-backup-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-overlanding-12v-fridge</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-power-station-lifespan</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-station-beach-day</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-power-rural-cabin-off-grid</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/lifepo4-vs-nmc-solar-generator</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/surge-wattage-solar-generator-explained</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-panels-needed-recharge-power-station</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/inverter-efficiency-solar-generator</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/best-solar-generator-value-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/mistakes-buying-solar-power-station</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/complete-guide-solar-power-stations-home</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/ecoflow-delta-pro-review-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-vs-gas-generator-home-backup</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/best-solar-generator-rv-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/ecoflow-delta-2-max-review-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/anker-solix-c1000-review</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/solar-generator-van-life</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/portable-power-station-medical-devices</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/ecoflow-delta-2-review-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/bluetti-ac200p-review-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/jackery-explorer-2000-pro-review-2026</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/can-solar-generator-run-window-air-conditioner</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/can-solar-generator-run-sump-pump</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.clickdecisionlab.com/blog/can-solar-generator-run-chest-freezer</loc><lastmod>2026-05-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`;

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    if (url.pathname === "/robots.txt") {
      return new Response(ROBOTS_TXT, {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=86400",
        },
      });
    }

    if (url.pathname === "/sitemap.xml") {
      return new Response(SITEMAP_XML, {
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": "public, max-age=86400",
        },
      });
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
