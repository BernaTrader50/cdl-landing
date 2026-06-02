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

// Landing app routes — served by React/TanStack
const LANDING_ROUTES = ["/", "/solar-calculator", "/methodology", "/comparisons", "/guides", "/blog"];

function isLandingRoute(pathname: string): boolean {
    if (pathname === "/" || pathname === "") return true;
    return LANDING_ROUTES.some(r => r !== "/" && (pathname === r || pathname === r + "/" || pathname.startsWith(r + "/") || pathname.startsWith(r + "?")));
}

// WordPress routes — proxy to Hostinger
function isWordPressRoute(pathname: string): boolean {
    return pathname.startsWith("/wp-") || pathname.startsWith("/wp-json") || pathname.startsWith("/feed") || pathname.startsWith("/sitemap") || pathname.startsWith("/xmlrpc");
}

const ROBOTS_TXT = `# robots.txt - ClickDecisionLab
User-agent: *
Allow: /
Sitemap: https://clickdecisionlab.com/sitemap.xml
`;

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://clickdecisionlab.com/</loc><lastmod>2026-06-02</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://clickdecisionlab.com/solar-calculator</loc><lastmod>2026-06-02</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://clickdecisionlab.com/methodology</loc><lastmod>2026-06-02</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`;

export default {
    async fetch(request: Request, env: unknown, ctx: unknown) {
        const url = new URL(request.url);

        if (url.pathname === "/robots.txt") {
            return new Response(ROBOTS_TXT, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" } });
        }

        if (url.pathname === "/sitemap.xml") {
            return new Response(SITEMAP_XML, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=86400" } });
        }

        // WordPress routes → proxy to Hostinger
        if (isWordPressRoute(url.pathname)) {
            try {
                const hostingerUrl = new URL(request.url);
                hostingerUrl.hostname = "185.212.71.247";
                const proxyReq = new Request(hostingerUrl.toString(), {
                    method: request.method,
                    headers: {
                        "Host": "clickdecisionlab.com",
                        "User-Agent": request.headers.get("User-Agent") || "",
                        "Accept": request.headers.get("Accept") || "*/*",
                        "Accept-Language": request.headers.get("Accept-Language") || "",
                        "Content-Type": request.headers.get("Content-Type") || "",
                        "Authorization": request.headers.get("Authorization") || "",
                        "X-Forwarded-Proto": "https",
                    },
                    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
                });
                return await fetch(proxyReq);
            } catch (e) {
                console.error("WP proxy error:", e);
                return brandedErrorResponse();
            }
        }

        // Article routes (slugs with hyphens) → proxy to WordPress
        if (!isLandingRoute(url.pathname) && url.pathname.includes("-")) {
            try {
                const hostingerUrl = new URL(request.url);
                hostingerUrl.hostname = "185.212.71.247";
                const proxyReq = new Request(hostingerUrl.toString(), {
                    method: request.method,
                    headers: {
                        "Host": "clickdecisionlab.com",
                        "User-Agent": request.headers.get("User-Agent") || "",
                        "Accept": request.headers.get("Accept") || "text/html",
                        "X-Forwarded-Proto": "https",
                    },
                });
                return await fetch(proxyReq);
            } catch (e) {
                console.error("Article proxy error:", e);
            }
        }

        // Landing app routes → TanStack React
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
