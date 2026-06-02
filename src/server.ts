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

// These paths are served by the React landing app (TanStack)
const LANDING_PREFIXES = ["/solar-calculator", "/methodology", "/comparisons", "/guides", "/blog", "/assets/", "/__manifest", "/_build/"];

function isAssetOrLanding(pathname: string): boolean {
    if (pathname === "/" || pathname === "") return true;
    return LANDING_PREFIXES.some(p => pathname === p || pathname === p.replace(/\/$/, "") || pathname.startsWith(p.endsWith("/") ? p : p + "/") || pathname.startsWith(p + "?"));
}

// WordPress API and admin routes
function isWordPressAPI(pathname: string): boolean {
    return pathname.startsWith("/wp-json") || pathname.startsWith("/wp-admin") || pathname.startsWith("/wp-login") || pathname.startsWith("/wp-content") || pathname.startsWith("/xmlrpc");
}

const ROBOTS_TXT = `# robots.txt - ClickDecisionLab
User-agent: *
Allow: /
Sitemap: https://clickdecisionlab.com/sitemap.xml
`;

export default {
    async fetch(request: Request, env: unknown, ctx: unknown) {
        const url = new URL(request.url);

        if (url.pathname === "/robots.txt") {
            return new Response(ROBOTS_TXT, { headers: { "content-type": "text/plain; charset=utf-8" } });
        }

        // WordPress API → proxy directly to Hostinger with auth headers intact
        if (isWordPressAPI(url.pathname)) {
            const hostingerUrl = new URL(request.url);
            hostingerUrl.hostname = "185.212.71.247";
            const proxyReq = new Request(hostingerUrl.toString(), {
                method: request.method,
                headers: {
                    "Host": "clickdecisionlab.com",
                    "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
                    "Accept": request.headers.get("Accept") || "*/*",
                    "Content-Type": request.headers.get("Content-Type") || "application/json",
                    "Authorization": request.headers.get("Authorization") || "",
                    "X-Forwarded-Proto": "https",
                },
                body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
            });
            return await fetch(proxyReq);
        }

        // Static assets and landing routes → TanStack React app
        if (isAssetOrLanding(url.pathname)) {
            try {
                const handler = await getServerEntry();
                const response = await handler.fetch(request, env, ctx);
                return await normalizeCatastrophicSsrResponse(response);
            } catch (error) {
                console.error(error);
                return brandedErrorResponse();
            }
        }

        // Everything else (WordPress articles) → proxy to Hostinger
        const hostingerUrl = new URL(request.url);
        hostingerUrl.hostname = "185.212.71.247";
        const proxyReq = new Request(hostingerUrl.toString(), {
            method: request.method,
            headers: {
                "Host": "clickdecisionlab.com",
                "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
                "Accept": request.headers.get("Accept") || "text/html",
                "Accept-Language": request.headers.get("Accept-Language") || "",
                "X-Forwarded-Proto": "https",
            },
        });
        return await fetch(proxyReq);
    },
};
