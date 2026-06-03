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
    const landing = ["/solar-calculator", "/methodology", "/comparisons", "/guides", "/assets/", "/__manifest", "/_build/", "/favicon"];
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
Sitemap: https://clickdecisionlab.com/sitemap_index.xml
Sitemap: https://clickdecisionlab.com/post-sitemap.xml
Sitemap: https://clickdecisionlab.com/page-sitemap.xml
`;

export default {
    async fetch(request: Request, env: unknown, ctx: unknown) {
        const url = new URL(request.url);

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

        // Everything else → pass through to Cloudflare origin (WordPress on Hostinger)
        // Cloudflare will route to the A record (185.212.71.247) directly
        return fetch(request);
    },
};
