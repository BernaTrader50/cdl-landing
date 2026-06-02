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

// Routes handled by the React landing app
const LANDING_PREFIXES = [
  "/solar-calculator",
  "/methodology",
  "/comparisons",
  "/guides",
  "/blog",
  "/assets/",
  "/_build/",
  "/__manifest",
];

function isLandingRoute(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return true;
  return LANDING_PREFIXES.some(prefix =>
    pathname === prefix ||
    pathname === prefix + "/" ||
    pathname.startsWith(prefix + "/") ||
    pathname.startsWith(prefix + "?")
  );
}

const ROBOTS_TXT = `# robots.txt - ClickDecisionLab
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

    // Serve landing app routes
    if (isLandingRoute(url.pathname)) {
      try {
        const handler = await getServerEntry();
        const response = await handler.fetch(request, env, ctx);
        return response;
      } catch (error) {
        console.error(error);
        return brandedErrorResponse();
      }
    }

    // Everything else → proxy to WordPress on Hostinger
    try {
      const hostingerUrl = new URL(request.url);
      hostingerUrl.hostname = "185.212.71.247";

      const hostingerRequest = new Request(hostingerUrl.toString(), {
        method: request.method,
        headers: {
          "Host": "clickdecisionlab.com",
          "User-Agent": request.headers.get("User-Agent") || "",
          "Accept": request.headers.get("Accept") || "*/*",
          "Accept-Language": request.headers.get("Accept-Language") || "",
          "Accept-Encoding": "gzip, deflate",
          "X-Forwarded-Proto": "https",
          "X-Forwarded-For": request.headers.get("CF-Connecting-IP") || "",
        },
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
      });

      return await fetch(hostingerRequest);
    } catch (error) {
      console.error("WordPress proxy error:", error);
      return brandedErrorResponse();
    }
  },
};
