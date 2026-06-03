import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useState } from "react";

export const Route = createFileRoute("/technical-analysis")({
  head: () => ({
    meta: [
      { title: "Technical Analysis — Solar Generator Engineering Reviews | ClickDecisionLab" },
      { name: "description", content: "Independent technical analysis of solar generators. Real specs, surge measurements, UPS validation, and use-case scoring across 10 products from EcoFlow, Bluetti, Jackery, and Anker SOLIX." },
    ],
  }),
  component: TechnicalAnalysisHub,
});

const ANALYSES = [
  {
    brand: "EcoFlow", model: "DELTA Pro",
    slug: "/ecoflow-delta-pro-technical-analysis-2026/",
    price: 2499, wh: 3200, surge: 7200, ups: true,
    verdict: "Best expandable home backup system. 25kWh ceiling.",
    scores: { home_backup: 9, rv: 6, value: 6 },
    badge: "Pro Pick",
  },
  {
    brand: "EcoFlow", model: "DELTA 3 Max",
    slug: "/ecoflow-delta-3-max-technical-analysis-2026/",
    price: 749, wh: 1800, surge: 4800, ups: true,
    verdict: "Best mid-range home backup. Top score under $800.",
    scores: { home_backup: 8, rv: 7, value: 8 },
    badge: "Top Rated",
  },
  {
    brand: "EcoFlow", model: "DELTA 2 Max",
    slug: "/ecoflow-delta-2-max-technical-analysis-2026/",
    price: 999, wh: 1800, surge: 4800, ups: true,
    verdict: "Polished 2kWh platform. Best ecosystem integration.",
    scores: { home_backup: 8, rv: 7, value: 7 },
    badge: null,
  },
  {
    brand: "EcoFlow", model: "DELTA 3 Classic",
    slug: "/ecoflow-delta-3-classic-technical-analysis-2026/",
    price: 449, wh: 900, surge: 3600, ups: true,
    verdict: "Most affordable 1kWh LFP with UPS. Strong value play.",
    scores: { home_backup: 7, rv: 7, value: 9 },
    badge: "Best Value",
  },
  {
    brand: "Jackery", model: "Explorer 2000 Plus",
    slug: "/jackery-explorer-2000-plus-technical-analysis-2026/",
    price: 899, wh: 1800, surge: 6000, ups: false,
    verdict: "Highest surge at this price. Expandable to 24kWh.",
    scores: { home_backup: 9, rv: 7, value: 9 },
    badge: "Best Surge",
  },
  {
    brand: "Jackery", model: "Explorer 2000 v2",
    slug: "/jackery-explorer-2000-v2-technical-analysis-2026/",
    price: 1599, wh: 1800, surge: 4400, ups: false,
    verdict: "Lightest 2kWh in class. 41% lighter than competitors.",
    scores: { home_backup: 8, rv: 7, value: 7 },
    badge: "Lightest",
  },
  {
    brand: "Jackery", model: "Explorer 1000 v2",
    slug: "/jackery-explorer-1000-v2-technical-analysis-2026/",
    price: 449, wh: 940, surge: 3000, ups: false,
    verdict: "Best value 1kWh LFP. Benchmark for compact class.",
    scores: { home_backup: 6, rv: 7, value: 9 },
    badge: null,
  },
  {
    brand: "Bluetti", model: "AC200L",
    slug: "/bluetti-ac200l-technical-analysis-2026/",
    price: 999, wh: 1800, surge: 3600, ups: true,
    verdict: "Best solar input in 2kWh class. 900W solar, UPS.",
    scores: { home_backup: 8, rv: 7, value: 7 },
    badge: "Best Solar",
  },
  {
    brand: "Bluetti", model: "AC300",
    slug: "/bluetti-ac300-technical-analysis-2026/",
    price: 2299, wh: 2750, surge: 6000, ups: true,
    verdict: "Modular home system. Expandable to 12.3kWh.",
    scores: { home_backup: 9, rv: 4, value: 5 },
    badge: null,
  },
  {
    brand: "Anker SOLIX", model: "F3800",
    slug: "/anker-solix-f3800-technical-analysis-2026/",
    price: 2999, wh: 3400, surge: 12000, ups: true,
    verdict: "Highest output portable system. 6000W + 240V.",
    scores: { home_backup: 10, rv: 5, value: 6 },
    badge: "Max Power",
  },
];

const BRANDS = ["All", "EcoFlow", "Jackery", "Bluetti", "Anker SOLIX", "VTOMAN"];

const BADGE_COLORS: Record<string, string> = {
  "Top Rated": "#2563EB",
  "Best Value": "#10B981",
  "Pro Pick": "#8B5CF6",
  "Best Surge": "#F59E0B",
  "Best Solar": "#06B6D4",
  "Lightest": "#6366F1",
  "Max Power": "#EF4444",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 8 ? "#10B981" : value >= 6 ? "#F59E0B" : "#9CA3AF";
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-[3px] bg-neutral-100 rounded-full overflow-hidden">
        <div style={{ width: `${value * 10}%`, background: color, height: "100%", borderRadius: 99 }} />
      </div>
      <span className="font-mono text-[10px] shrink-0" style={{ color }}>{value}/10</span>
    </div>
  );
}

function TechnicalAnalysisHub() {
  const [activeBrand, setActiveBrand] = useState("All");

  const filtered = activeBrand === "All" ? ANALYSES : ANALYSES.filter(a => a.brand === activeBrand);

  return (
    <div className="min-h-screen relative text-neutral-950"
      style={{
        backgroundColor: "#F7F7F5",
        backgroundImage: [
          "linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px)",
          "linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px)",
          "linear-gradient(to right, rgba(15,23,42,0.02) 1px, transparent 1px)",
          "linear-gradient(to bottom, rgba(15,23,42,0.02) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "48px 48px, 48px 48px, 240px 240px, 240px 240px",
      }}>
      <SiteNav />

      <main className="relative z-10 mx-auto max-w-6xl px-5 pt-32 pb-20">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            Technical Analysis
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 mb-4">
            Engineering-grade product analysis.
          </h1>
          <p className="text-[15px] text-neutral-500 max-w-2xl leading-relaxed">
            Every analysis is built from verified manufacturer specifications, real surge measurements,
            UPS mode validation, and use-case scoring across 7 dimensions. No marketing copy. No paid placements.
          </p>

          {/* Authority strip */}
          <div className="mt-5 flex items-center gap-6 flex-wrap">
            {[
              "15 products analyzed",
              "49 products in dataset",
              "7 use-case scores per product",
              "Updated quarterly",
            ].map(t => (
              <span key={t} className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{t}</span>
            ))}
          </div>
        </div>

        {/* Methodology summary */}
        <div className="mb-8 rounded-[12px] border bg-white p-6" style={{ borderColor: "#E2E2E2" }}>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">What we measure</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Capacity", desc: "Real vs rated Wh" },
              { label: "Surge", desc: "Peak W validated" },
              { label: "UPS mode", desc: "Switchover time" },
              { label: "Solar input", desc: "W accepted" },
              { label: "Runtime", desc: "vs requirement" },
              { label: "Value", desc: "Wh per dollar" },
            ].map(m => (
              <div key={m.label} className="rounded-[8px] bg-[#F8F9FF] px-3 py-2.5">
                <p className="font-mono text-[11px] font-semibold text-neutral-800">{m.label}</p>
                <p className="font-mono text-[9.5px] text-neutral-400 mt-0.5">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between flex-wrap gap-3" style={{ borderColor: "#F0F0F0" }}>
            <p className="text-[12.5px] text-neutral-500">Full scoring methodology and weighting explained.</p>
            <a href="/methodology" className="font-mono text-[11px] text-[#2563EB] hover:underline">Read methodology →</a>
          </div>
        </div>

        {/* Brand filter */}
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          {BRANDS.map(brand => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`rounded-[8px] px-3.5 py-1.5 font-mono text-[11px] font-medium transition-colors ${
                activeBrand === brand
                  ? "bg-neutral-950 text-white"
                  : "bg-white border text-neutral-600 hover:border-neutral-400"
              }`}
              style={activeBrand !== brand ? { borderColor: "#E2E2E2" } : {}}
            >
              {brand}
            </button>
          ))}
          <span className="font-mono text-[10px] text-neutral-400 ml-2">{filtered.length} analyses</span>
        </div>

        {/* Analysis grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(a => (
            <a
              key={a.slug}
              href={a.slug}
              className="group rounded-[12px] border bg-white p-5 hover:border-neutral-400 transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              style={{ borderColor: "#E2E2E2" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{a.brand}</p>
                  <h2 className="text-[16px] font-semibold text-neutral-900 group-hover:text-[#2563EB] transition-colors mt-0.5">
                    {a.model}
                  </h2>
                </div>
                {a.badge && (
                  <span
                    className="rounded-full px-2.5 py-0.5 font-mono text-[9.5px] font-semibold shrink-0 ml-2"
                    style={{ background: `${BADGE_COLORS[a.badge]}18`, color: BADGE_COLORS[a.badge] }}
                  >
                    {a.badge}
                  </span>
                )}
              </div>

              {/* Key specs */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="font-mono text-[12px] font-semibold text-neutral-800">${a.price.toLocaleString()}</span>
                <span className="font-mono text-[11px] text-neutral-400">{a.wh.toLocaleString()} Wh</span>
                <span className="font-mono text-[11px] text-neutral-400">{a.surge.toLocaleString()}W surge</span>
                <span className={`font-mono text-[10px] font-medium ${a.ups ? "text-[#10B981]" : "text-neutral-400"}`}>
                  {a.ups ? "✓ UPS" : "✗ No UPS"}
                </span>
              </div>

              {/* Verdict */}
              <p className="text-[12.5px] text-neutral-600 leading-relaxed mb-4">{a.verdict}</p>

              {/* Score bars */}
              <div className="space-y-1.5 pt-3 border-t" style={{ borderColor: "#F0F0F0" }}>
                <ScoreBar label="Home backup" value={a.scores.home_backup} />
                <ScoreBar label="RV / Van" value={a.scores.rv} />
                <ScoreBar label="Value" value={a.scores.value} />
              </div>

              <p className="mt-3 font-mono text-[10.5px] text-neutral-400 group-hover:text-[#2563EB] transition-colors">
                Full technical analysis →
              </p>
            </a>
          ))}
        </div>

        {/* Bidirectional CTAs */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a href="/solar-calculator"
            className="rounded-[12px] border bg-white p-5 hover:border-neutral-400 transition-colors group"
            style={{ borderColor: "#E2E2E2" }}>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-2">Decision Engine</p>
            <p className="text-[14px] font-semibold text-neutral-900 group-hover:text-[#2563EB] transition-colors">
              Find your specific match →
            </p>
            <p className="mt-1 text-[12.5px] text-neutral-500">
              Enter your scenario and we rank all 49 products for your requirements.
            </p>
          </a>
          <a href="/comparisons"
            className="rounded-[12px] border bg-white p-5 hover:border-neutral-400 transition-colors group"
            style={{ borderColor: "#E2E2E2" }}>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-2">Comparisons</p>
            <p className="text-[14px] font-semibold text-neutral-900 group-hover:text-[#2563EB] transition-colors">
              Head-to-head comparisons →
            </p>
            <p className="mt-1 text-[12.5px] text-neutral-500">
              Side-by-side spec analysis for the most-compared models.
            </p>
          </a>
        </div>

      </main>

      <SiteFooter />
    </div>
  );
}
