import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import { SiteFooter } from "@/components/site-footer";
import { SolarCalculator } from "@/components/solar-calculator";

export const Route = createFileRoute("/solar-calculator")({
  head: () => ({
    meta: [
      { title: "Solar Generator Calculator — ClickDecisionLab" },
      {
        name: "description",
        content:
          "Answer a few questions about your power needs. We match you to the right solar generator using engineering-grade scoring across 100 products.",
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
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-32 lg:pb-44 text-center">
          <div className="text-xs font-mono text-blue-100 tracking-[0.18em] uppercase mb-3">
            Decision engine · v2.3
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Solar Generator Calculator
          </h1>
          <p className="mt-4 text-blue-50/90 max-w-2xl mx-auto">
            Answer a few questions about your power needs. We match you to the right solar generator
            using engineering-grade scoring across 100 products.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-blue-50 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            100 products · 20 brands · Updated weekly
          </div>
        </div>
      </section>

      {/* CALCULATOR — real engine, 100 products */}
      <section className="relative bg-[#2563eb] pb-16">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 -mt-24 lg:-mt-36">
          <SolarCalculator />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
