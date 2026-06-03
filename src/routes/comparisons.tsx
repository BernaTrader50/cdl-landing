import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/comparisons")({
  head: () => ({
    meta: [
      { title: "Solar Generator Comparisons — ClickDecisionLab" },
      { name: "description", content: "Technical side-by-side comparisons for solar generators. Verified specs, decision scores, and clear verdicts — EcoFlow vs Bluetti, Jackery vs EcoFlow, and more." },
    ],
  }),
  component: ComparisonsPage,
});

const TA_LINKS: Record<string, string[]> = {
  "ecoflow-delta-pro-vs-delta-3-max": [
    "/ecoflow-delta-pro-technical-analysis-2026/",
    "/ecoflow-delta-3-max-technical-analysis-2026/",
  ],
  "bluetti-ac200l-vs-ecoflow-delta-2-max": [
    "/bluetti-ac200l-technical-analysis-2026/",
    "/ecoflow-delta-2-max-technical-analysis-2026/",
  ],
  "jackery-explorer-2000-plus-vs-ecoflow-delta-2-max": [
    "/jackery-explorer-2000-plus-technical-analysis-2026/",
    "/ecoflow-delta-2-max-technical-analysis-2026/",
  ],
  "best-solar-generators-under-1000": [],
  "best-solar-generators-home-backup": [],
};

const LIVE_COMPARISONS = [
  {
    title: "EcoFlow DELTA Pro vs DELTA 3 Max",
    slug: "ecoflow-delta-pro-vs-delta-3-max",
    desc: "Pro-grade vs new-gen: 3.2kWh legacy powerhouse against the efficient 1.8kWh modern platform. Which justifies the price gap?",
    tags: ["Home Backup", "Off-Grid"],
    verdict: "DELTA 3 Max wins for most users",
  },
  {
    title: "Bluetti AC200L vs EcoFlow DELTA 2 Max",
    slug: "bluetti-ac200l-vs-ecoflow-delta-2-max",
    desc: "Two 2kWh LFP workhorses at similar price points. Different strengths across UPS, solar input, and expandability.",
    tags: ["Home Backup", "RV"],
    verdict: "Depends on UPS priority",
  },
  {
    title: "Jackery Explorer 2000 Plus vs EcoFlow DELTA 2 Max",
    slug: "jackery-explorer-2000-plus-vs-ecoflow-delta-2-max",
    desc: "Jackery's expandable giant at $899 vs EcoFlow's polished 2kWh at $999. The price difference is significant.",
    tags: ["Value", "Off-Grid"],
    verdict: "Jackery wins on value",
  },
  {
    title: "Best Solar Generators Under $1,000",
    slug: "best-solar-generators-under-1000",
    desc: "Every product in our dataset under $1,000 ranked by use-case score. The best options across home backup, camping, and RV.",
    tags: ["Budget", "Value"],
    verdict: "3 clear winners by scenario",
  },
  {
    title: "Best Solar Generators for Home Backup",
    slug: "best-solar-generators-home-backup",
    desc: "UPS mode, surge capacity, and runtime analyzed specifically for home backup. Ranked by our home backup score across 49 products.",
    tags: ["Home Backup", "UPS"],
    verdict: "Top 5 by home backup score",
  },
];

const COMING_COMPARISONS = [
  { title: "Anker SOLIX F3800 vs EcoFlow DELTA Pro", tags: ["High Power"] },
  { title: "EcoFlow DELTA 3 Max vs Bluetti AC200L", tags: ["2kWh Class"] },
  { title: "Best Solar Generators for RV / Van Life", tags: ["RV"] },
  { title: "DJI Power 1000 vs EcoFlow DELTA 3 Classic", tags: ["Compact"] },
  { title: "Best Budget Solar Generators Under $500", tags: ["Budget"] },
];

function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="rounded bg-[#EFF6FF] px-2 py-0.5 font-mono text-[10px] font-medium text-[#2563EB]">
      {tag}
    </span>
  );
}

function ComparisonsPage() {
  return (
    <div className="min-h-screen relative" style={{
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
      <div className="mx-auto max-w-5xl px-5 pt-32 pb-16">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">Comparisons Lab</p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 mb-4">
            Spec vs spec. No filler.
          </h1>
          <p className="text-[15px] text-neutral-500 max-w-xl leading-relaxed">
            Technical side-by-side comparisons built from verified specifications and decision scores. Every verdict is derived from real numbers.
          </p>

          {/* Authority strip */}
          <div className="mt-5 flex items-center gap-5 flex-wrap">
            {["68 research articles", "50 products tracked", "10 brands analyzed"].map(t => (
              <span key={t} className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{t}</span>
            ))}
          </div>
        </div>

        {/* Live comparisons */}
        <div className="mb-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">Featured comparisons</p>
          <div className="space-y-3">
            {LIVE_COMPARISONS.map((c) => (
              <a
                key={c.slug}
                href={`/${c.slug}/`}
                className="flex items-start justify-between gap-4 rounded-[12px] border bg-white p-5 hover:border-neutral-400 transition-colors group"
                style={{borderColor:"#E2E2E2"}}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {c.tags.map(t => <TagBadge key={t} tag={t} />)}
                  </div>
                  <h2 className="text-[15px] font-semibold text-neutral-900 group-hover:text-[#2563EB] transition-colors">
                    {c.title}
                  </h2>
                  <p className="mt-1.5 text-[13px] text-neutral-500 leading-relaxed">{c.desc}</p>
                  <p className="mt-2 font-mono text-[11px] text-[#10B981]">Verdict: {c.verdict}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors">→</span>
                  {(TA_LINKS[c.slug] || []).length > 0 && (
                    <div className="flex gap-1 flex-wrap justify-end">
                      {(TA_LINKS[c.slug] || []).map((ta, i) => (
                        <a key={i} href={ta} onClick={e => e.stopPropagation()}
                          className="font-mono text-[9px] text-[#2563EB] hover:underline">
                          TA {i + 1} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Coming soon */}
        <div className="mt-8">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">In the pipeline</p>
          <div className="space-y-2">
            {COMING_COMPARISONS.map((c) => (
              <div
                key={c.title}
                className="flex items-center justify-between rounded-[8px] border border-dashed px-4 py-3"
                style={{borderColor:"#E2E2E2"}}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-neutral-300">○</span>
                  <span className="text-[13px] text-neutral-500">{c.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {c.tags.map(t => <TagBadge key={t} tag={t} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to calculator */}
        <div className="mt-10 rounded-[12px] border bg-white p-6 text-center" style={{borderColor:"#E2E2E2"}}>
          <p className="text-[14px] text-neutral-600 mb-3">Need a recommendation now? Use the decision engine.</p>
          <a href="/solar-calculator" className="inline-flex items-center gap-2 rounded-[10px] bg-neutral-950 px-5 py-3 text-[13px] font-medium text-white hover:opacity-80 transition-opacity">
            Solar Generator Decision Engine →
          </a>
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}
