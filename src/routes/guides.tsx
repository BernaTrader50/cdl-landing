import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
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
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />

      {/* HERO */}
      <section className="relative bg-[#2563eb] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
             style={{ backgroundImage:
               "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
               backgroundSize: "44px 44px" }} />
        <div className="relative max-w-3xl mx-auto px-6 pt-14 pb-24 lg:pb-32">
          <p className="text-[11px] font-mono font-medium uppercase tracking-[0.18em] text-blue-100">GUIDES</p>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight">
            Technical guides, no fluff.
          </h1>
          <p className="mt-4 text-blue-50/90 max-w-2xl">
            In-depth guides covering sizing, surge, chemistry, and real-world tradeoffs.
          </p>
        </div>
      </section>

      <main className="px-6 pb-24 pt-14">
        <div className="mx-auto max-w-3xl">
          <p className="text-[15px] text-neutral-500">More guides coming soon.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
