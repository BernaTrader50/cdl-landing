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

// Rutas que pertenecen a la landing React
const LANDING_ROUTES = ["/", "/solar-calculator", "/methodology", "/comparisons", "/guides", "/blog"];

function isLandingRoute(pathname: string): boolean {
    if (pathname === "/" ) return true;
    return LANDING_ROUTES.some(route => route !== "/" && pathname.startsWith(route));
}

// Rutas de WordPress
function isWordPressRoute(pathname: string): boolean {
    return (
        pathname.startsWith("/wp-") ||
        pathname.startsWith("/wp-json") ||
        pathname.startsWith("/feed") ||
        pathname.startsWith("/sitemap") ||
        pathname.startsWith("/solar-generator") ||
        pathname.startsWith("/ecoflow") ||
        pathname.startsWith("/bluetti") ||
        pathname.startsWith("/jackery") ||
        pathname.startsWith("/best-solar") ||
        pathname.startsWith("/can-solar") ||
        pathname.startsWith("/can-the-ecoflow") ||
        pathname.startsWith("/portable") ||
        pathname.startsWith("/lifepo4") ||
        pathname.startsWith("/surge") ||
        pathname.startsWith("/inverter") ||
        pathname.startsWith("/mistakes") ||
        pathname.startsWith("/complete-guide") ||
        pathname.startsWith("/how-long") ||
        pathname.startsWith("/what-can") ||
        pathname.startsWith("/generador") ||
        pathname.startsWith("/mejor") ||
        pathname.startsWith("/vatios") ||
        pathname.startsWith("/anker") ||
        pathname.startsWith("/assets/") === false && pathname.includes("-")
    );
}

const ROBOTS_TXT = `# robots.txt - ClickDecisionLab
User-agent: *
Allow: /
Sitemap: https://clickdecisionlab.com/sitemap.xml
`;

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://clickdecisionlab.com/</loc><lastmod>2026-06-01</lastmod><priority>1.0</priority></url>
  <url><loc>https://clickdecisionlab.com/solar-calculator</loc><lastmod>2026-06-01</lastmod><priority>0.9</priority></url>
</urlset>`;

export default {
    async fetch(request: Request, env: unknown, ctx: unknown) {
        const url = new URL(request.url);

        if (url.pathname === "/robots.txt") {
            return new Response(ROBOTS_TXT, {
                headers: { "content-type": "text/plain; charset=utf-8" },
            });
        }

        if (url.pathname === "/sitemap.xml") {
            return new Response(SITEMAP_XML, {
                headers: { "content-type": "application/xml; charset=utf-8" },
            });
        }

        // Proxy WordPress routes to Hostinger
        if (!isLandingRoute(url.pathname)) {
            const wpOrigin = "https://clickdecisionlab.com";
            const proxyUrl = wpOrigin + url.pathname + url.search;
            const proxyRequest = new Request(proxyUrl, {
                method: request.method,
                headers: request.headers,
                body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
            });
            return fetch(proxyRequest);
        }

        try {
            const handler = await getServerEntry();
            const response = await handler.fetch(request, env, ctx);
            return response;
        } catch (error) {
            console.error(error);
            return brandedErrorResponse();
        }
    },
};
