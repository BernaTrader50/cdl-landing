import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides — ClickDecisionLab" },
      {
        name: "description",
        content:
          "Technical guides for high-ticket buying decisions. Written for real scenarios, not affiliate copy.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <SiteNav />
      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#2563EB]">
            GUIDES
          </p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.15] tracking-[-0.025em]">
            Technical guides, no fluff.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-neutral-600">
            In-depth guides covering sizing, surge, chemistry, and real-world tradeoffs.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
