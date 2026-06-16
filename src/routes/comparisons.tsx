import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
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
    desc: "UPS mode, surge capacity, and runtime analyzed specifically for home backup. Ranked by our home backup score across 104 products.",
    tags: ["Home Backup", "UPS"],
    verdict: "Top 5 by home backup score",
  },
  {
    title: "EcoFlow DELTA 3 Max vs Jackery Explorer 2000 Plus",
    slug: "ecoflow-delta-3-max-vs-jackery-explorer-2000-plus",
    desc: "The two most popular 2kWh generators head to head. Surge, UPS, expandability, and weight compared.",
    tags: ["2kWh Class", "Popular"],
    verdict: "Jackery on surge, EcoFlow on UPS",
  },
  {
    title: "EcoFlow DELTA 3 Max vs Bluetti AC200L",
    slug: "ecoflow-delta-3-max-vs-bluetti-ac200l",
    desc: "Same capacity, same price class, different strengths. Surge vs solar input — which 2kWh LFP wins for your scenario?",
    tags: ["2kWh Class", "LFP"],
    verdict: "EcoFlow on surge, Bluetti on solar",
  },
  {
    title: "Anker SOLIX F3800 vs EcoFlow DELTA Pro",
    slug: "anker-solix-f3800-vs-ecoflow-delta-pro",
    desc: "High-power home backup showdown. 240V, 6,000W continuous, and 12,000W surge vs the established DELTA Pro.",
    tags: ["High Power", "Home Backup"],
    verdict: "F3800 for 240V loads",
  },
  {
    title: "Best Solar Generators for Camping 2026",
    slug: "best-solar-generators-camping-2026",
    desc: "Ranked by weight, portability, and camping-specific scores across 104 products. Weekend to extended off-grid.",
    tags: ["Camping", "Outdoor"],
    verdict: "Jackery 1000 v2 for most",
  },
  {
    title: "Best Solar Generators for RV and Van Life 2026",
    slug: "best-solar-generators-rv-van-life-2026",
    desc: "Real RV loads, surge requirements, and expandability for extended dry camping. Sized for actual use.",
    tags: ["RV", "Van Life"],
    verdict: "Jackery 2000 Plus for RV",
  },
  {
    title: "Jackery vs Bluetti: Which Brand?",
    slug: "jackery-vs-bluetti-which-brand-better-2026",
    desc: "Brand comparison across portable generators. Portability, UPS, solar input, value, and ecosystem.",
    tags: ["Brand", "Value"],
    verdict: "Jackery for camping, Bluetti for home",
  },
  {
    title: "EcoFlow vs Jackery: Which Brand Is Better?",
    slug: "ecoflow-vs-jackery-which-brand-better-2026",
    desc: "EcoFlow leads on UPS, recharge speed, and surge. Jackery leads on solar input and brand reliability track record.",
    tags: ["Brand", "Value"],
    verdict: "EcoFlow for home backup, Jackery for off-grid solar",
  },
  {
    title: "Allpowers S2000 Pro vs EcoFlow DELTA 3 Max",
    slug: "allpowers-s2000-pro-vs-ecoflow-delta-3-max-2026",
    desc: "$499 budget pick with UPS under 15ms vs the $749 ecosystem-proven platform with more capacity.",
    tags: ["Value", "UPS"],
    verdict: "Allpowers on value, EcoFlow on ecosystem",
  },
  {
    title: "Anker SOLIX C1000 vs EcoFlow DELTA 3 Max",
    slug: "anker-solix-c1000-vs-ecoflow-delta-3-max-2026",
    desc: "Near-identical $750-class pricing. Anker wins on charge speed and noise; EcoFlow wins on capacity and price.",
    tags: ["2kWh Class", "Popular"],
    verdict: "Depends on charge speed vs capacity priority",
  },
  {
    title: "Bluetti EB70 vs Jackery Explorer 1000 Plus",
    slug: "bluetti-eb70-vs-jackery-explorer-1000-plus-2026",
    desc: "Mid-range camping showdown: Jackery's higher surge and UPS mode vs Bluetti's $350 lower price.",
    tags: ["Camping", "Budget"],
    verdict: "Jackery for power, Bluetti for price",
  },
  {
    title: "DJI Power 1000 vs EcoFlow DELTA 3 Classic",
    slug: "dji-power-1000-vs-ecoflow-delta-3-classic",
    desc: "Compact 1kWh battle: DJI's drone charging and higher surge vs EcoFlow's $250 lower price and UPS mode.",
    tags: ["Compact", "Value"],
    verdict: "DJI for drone users, EcoFlow on price",
  },
  {
    title: "EcoFlow DELTA 3 Max vs Anker SOLIX C2000 Gen 2",
    slug: "ecoflow-delta-3-max-vs-anker-solix-c2000-gen2",
    desc: "Same 1,800Wh capacity, $450 price gap. The Gen 2 adds UPS but EcoFlow remains the better value.",
    tags: ["2kWh Class", "UPS"],
    verdict: "EcoFlow wins on price for comparable specs",
  },
  {
    title: "EcoFlow RIVER Pro vs Jackery Explorer 500 v2",
    slug: "ecoflow-river-pro-vs-jackery-explorer-500-v2-2026",
    desc: "Compact UPS comparison: Jackery's lighter build and longer cycle life vs EcoFlow's higher capacity and X-Boost.",
    tags: ["Compact", "Travel"],
    verdict: "Jackery for ultralight travel",
  },
  {
    title: "Goal Zero Yeti 500X vs EcoFlow RIVER 3",
    slug: "goal-zero-yeti-500x-vs-ecoflow-river-3-2026",
    desc: "Premium overlanding build quality vs EcoFlow's better value — double the capacity at half the price.",
    tags: ["Compact", "Outdoor"],
    verdict: "EcoFlow wins on value, Goal Zero on build",
  },
  {
    title: "Growatt Infinity 1500 vs EcoFlow DELTA 3 Plus",
    slug: "growatt-infinity-1500-vs-ecoflow-delta-3-plus-2026",
    desc: "Same price, different strengths: Growatt's chainable expansion vs EcoFlow's verified UPS and ecosystem.",
    tags: ["Expandable", "Value"],
    verdict: "Depends on expansion vs ecosystem priority",
  },
  {
    title: "Jackery Explorer 1000 v2 vs Allpowers R1500 LITE",
    slug: "jackery-explorer-1000-v2-vs-allpowers-r1500-lite-2026",
    desc: "Budget 1kWh showdown: Allpowers wins on price by $150, Jackery wins on brand trust and surge.",
    tags: ["Budget", "Value"],
    verdict: "Allpowers on value, Jackery on reliability",
  },
  {
    title: "OUPES Mega 1 vs EcoFlow DELTA 3 Classic",
    slug: "oupes-mega-1-vs-ecoflow-delta-3-classic-2026",
    desc: "Budget UPS showdown: OUPES wins on raw specs per dollar, EcoFlow wins on brand trust and warranty.",
    tags: ["Budget", "UPS"],
    verdict: "OUPES for specs, EcoFlow for ecosystem",
  },
  {
    title: "VTOMAN FlashSpeed 1500 vs EcoFlow DELTA 3 Classic",
    slug: "vtoman-flashspeed-1500-vs-ecoflow-delta-3-classic",
    desc: "72% more capacity for $180 more, plus faster 1-hour recharge and expandability to 3,096Wh.",
    tags: ["Value", "Home Backup"],
    verdict: "VTOMAN wins on runtime value",
  },
  {
    title: "VTOMAN FlashSpeed 1500 vs EcoFlow DELTA 3 Max",
    slug: "vtoman-flashspeed-1500-vs-ecoflow-delta-3-max-2026",
    desc: "UPS speed test: VTOMAN's verified under-20ms switchover vs EcoFlow's larger capacity and ecosystem.",
    tags: ["UPS", "Medical"],
    verdict: "VTOMAN for UPS-critical use, EcoFlow for capacity",
  },
  {
    title: "Zendure Hyper 2000 vs EcoFlow DELTA 3 Max Plus",
    slug: "zendure-hyper-2000-vs-ecoflow-delta-3-max-plus-2026",
    desc: "Both expandable 2kWh-class with UPS. Zendure's faster claimed switchover vs EcoFlow's proven ecosystem.",
    tags: ["Expandable", "2kWh Class"],
    verdict: "EcoFlow wins for most users",
  },
];

const COMING_COMPARISONS = [
  { title: "Best Solar Generators Under $500", tags: ["Budget"] },
  { title: "EcoFlow vs Anker SOLIX: Which Brand?", tags: ["Brand"] },
  { title: "Best Solar Generators for Medical Devices", tags: ["Medical"] },
  { title: "Goal Zero vs EcoFlow: Premium vs Value", tags: ["Premium"] },
  { title: "Best Solar Generators for Apartments", tags: ["Apartment"] },
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
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />

      {/* HERO */}
      <section className="relative bg-[#2563eb] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
             style={{ backgroundImage:
               "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
               backgroundSize: "44px 44px" }} />
        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-32 lg:pb-44 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
              Comparisons Lab
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-200 bg-emerald-500/15 border border-emerald-300/30 rounded-full px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Live
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Spec vs spec. No filler.
          </h1>
          <p className="mt-4 text-blue-50/90 max-w-2xl mx-auto">
            Technical side-by-side comparisons built from verified specifications and decision scores. Every verdict is derived from real numbers.
          </p>

          {/* Authority strip */}
          <div className="mt-5 flex items-center justify-center gap-5 flex-wrap">
            {["125 research articles", "104 products tracked", "20 brands analyzed"].map(t => (
              <span key={t} className="font-mono text-[10px] text-blue-100 uppercase tracking-wider">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 -mt-24 lg:-mt-32 pb-16 relative">

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
          <a href="/solar-calculator" className="inline-flex items-center gap-2 rounded-[10px] bg-[#2563eb] px-5 py-3 text-[13px] font-medium text-white hover:bg-[#1d4ed8] transition-colors">
            Solar Generator Decision Engine →
          </a>
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}
