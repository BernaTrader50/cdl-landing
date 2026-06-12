import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ClickDecisionLab" },
      { name: "description", content: "ClickDecisionLab is a technical buying lab that provides data-driven verdicts for high-ticket purchases." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "ClickDecisionLab" },
      { property: "og:description", content: "ClickDecisionLab is a technical buying lab that provides data-driven verdicts for high-ticket purchases." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "ClickDecisionLab" },
      { name: "twitter:description", content: "ClickDecisionLab is a technical buying lab that provides data-driven verdicts for high-ticket purchases." },
      { property: "og:image", content: "https://clickdecisionlab.com/og-image.png" },
      { name: "twitter:image", content: "https://clickdecisionlab.com/og-image.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="ClickDecisionLab" />
        <link rel="canonical" href="https://clickdecisionlab.com" />

        {/* Open Graph */}
        <meta property="og:site_name" content="ClickDecisionLab" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://clickdecisionlab.com/assets/power-station-B0e88LCQ.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@clickdecisionlab" />

        {/* Schema.org — WebSite with SearchAction (Google Sitelinks Searchbox) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ClickDecisionLab",
          "description": "Technical decision platform for solar generators and portable power stations. 100 products analyzed.",
          "url": "https://clickdecisionlab.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://clickdecisionlab.com/solar-calculator?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        }) }} />

        {/* Schema.org — Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ClickDecisionLab",
          "url": "https://clickdecisionlab.com",
          "logo": "https://clickdecisionlab.com/favicon.ico",
          "description": "Independent technical analysis platform for solar generators. We analyze products using real specs, not marketing claims.",
          "sameAs": []
        }) }} />

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RM0BQMSLBV" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RM0BQMSLBV', {
            page_title: document.title,
            page_location: window.location.href
          });
          // CDL Event tracking helper
          window.cdlTrack = function(event, params) {
            if (typeof gtag !== 'undefined') {
              gtag('event', event, params || {});
            }
          };
        ` }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
