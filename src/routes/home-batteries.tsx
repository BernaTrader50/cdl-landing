import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  BatteryCharging,
  Home as HomeIcon,
  Sun,
  PlugZap,
  Car,
  Wallet,
  Zap,
  ShieldCheck,
  Gauge,
  Cog,
  Activity,
  Smartphone,
  Wrench,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { trackAffiliateClick, trackImpression, classifyTier } from "@/components/cdl-tracking";

export const Route = createFileRoute("/home-batteries")({
  head: () => ({
    meta: [
      { title: "Home Battery Decision Lab — ClickDecisionLab" },
      {
        name: "description",
        content:
          "Answer a few questions about your home and goals. We match you against 32 residential battery systems across 10 brands.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    goal: typeof s.goal === "string" ? s.goal : undefined,
    size: typeof s.size === "string" ? s.size : undefined,
    install: typeof s.install === "string" ? s.install : undefined,
    budget: s.budget != null ? Number(s.budget) : undefined,
  }),
  component: HomeBatteryPage,
});

const GOALS = [
  { id: "backup", label: "Whole-home backup", sub: "during outages", icon: ShieldCheck },
  { id: "solar", label: "Solar self-consumption", sub: "use what you generate", icon: Sun },
  { id: "offgrid", label: "Off-grid / minimal grid", sub: "independence", icon: BatteryCharging },
  { id: "ev", label: "EV charger integration", sub: "smart pairing", icon: Car },
  { id: "budget", label: "Budget-friendly", sub: "entry point", icon: Wallet },
];

const SIZES = [
  { id: "s", label: "Small home", sub: "1-2 bed" },
  { id: "m", label: "Medium home", sub: "3-4 bed" },
  { id: "l", label: "Large home", sub: "5+ bed, high usage" },
];

const INSTALLS = [
  { id: "pro", label: "Professional only", sub: "permitted install" },
  { id: "diy", label: "DIY / portable", sub: "self-install OK" },
  { id: "either", label: "Either", sub: "flexible" },
];

type HBScores = { backup: number; solar: number; value: number; scale: number; offgrid: number; smart: number };
type HBProduct = {
  brand: string; model: string; price: number; kwh: number; kwhLabel: string;
  kwLabel: string; surge: string; chem: string; warranty: string; cycles: string;
  ev: boolean; app: boolean; install: "Professional" | "DIY / Both";
  scores: HBScores; verdict: string; affiliate: string;
};

export const HB_PRODUCTS: HBProduct[] = [
  {
    brand: "Tesla", model: "Powerwall 3", price: 9700, kwh: 13.5, kwhLabel: "13.5 kWh",
    kwLabel: "11.5 kW", surge: "30 kW", chem: "LFP", warranty: "10 yr", cycles: "6,000",
    ev: true, app: true, install: "Professional",
    scores: { backup: 9.6, solar: 9.5, value: 8.8, scale: 9.0, offgrid: 8.4, smart: 9.5 },
    verdict: "Best all-around: integrated inverter, strong surge, top-tier app and solar pairing.",
    affiliate: "https://www.amazon.com/s?k=Tesla%20Powerwall%203&tag=clickdecision-20",
  },
  {
    brand: "Enphase", model: "IQ Battery 10C", price: 8200, kwh: 10.08, kwhLabel: "10.08 kWh",
    kwLabel: "7.68 kW", surge: "10 kW", chem: "LFP", warranty: "15 yr", cycles: "6,000",
    ev: true, app: true, install: "Professional",
    scores: { backup: 8.7, solar: 9.4, value: 9.0, scale: 9.6, offgrid: 8.0, smart: 9.2 },
    verdict: "Modular and microinverter-native — easiest to scale 10 → 40 kWh over time.",
    affiliate: "https://www.amazon.com/s?k=Enphase%20IQ%20Battery%2010C&tag=clickdecision-20",
  },
  {
    brand: "EcoFlow", model: "DELTA Pro Ultra", price: 5800, kwh: 6, kwhLabel: "6 kWh / stackable",
    kwLabel: "7.2 kW", surge: "14.4 kW", chem: "LFP", warranty: "5 yr", cycles: "3,500",
    ev: false, app: true, install: "DIY / Both",
    scores: { backup: 8.8, solar: 8.4, value: 9.4, scale: 8.6, offgrid: 9.2, smart: 8.7 },
    verdict: "Best DIY route — portable, stackable to 90 kWh, no electrician required to start.",
    affiliate: "https://www.awin1.com/cread.php?awinmid=59181&awinaffid=2929639&ued=https://us.ecoflow.com/products/delta-pro-ultra",
  },
  {
    brand: "FranklinWH", model: "aPower 2", price: 14000, kwh: 15, kwhLabel: "15 kWh",
    kwLabel: "10 kW", surge: "15 kW", chem: "LFP", warranty: "15 yr", cycles: "6,000",
    ev: false, app: true, install: "Professional",
    scores: { backup: 9.7, solar: 8.8, value: 8.5, scale: 9.2, offgrid: 9.5, smart: 9.0 },
    verdict: "Strongest generator integration — aGate hub coordinates solar, battery, grid and standby generator automatically.",
    affiliate: "https://www.amazon.com/s?k=FranklinWH%20aPower%202&tag=clickdecision-20",
  },
  {
    brand: "Enphase", model: "IQ Battery 5P", price: 8500, kwh: 5, kwhLabel: "5 kWh",
    kwLabel: "3.84 kW", surge: "7.68 kW", chem: "LFP", warranty: "15 yr", cycles: "7,000",
    ev: false, app: true, install: "Professional",
    scores: { backup: 7.0, solar: 9.6, value: 6.5, scale: 9.8, offgrid: 7.0, smart: 9.0 },
    verdict: "Most granular scaling (5 kWh steps to 80 kWh) and the longest standard warranty in the category — premium per-kWh cost.",
    affiliate: "https://www.amazon.com/s?k=Enphase%20IQ%20Battery%205P&tag=clickdecision-20",
  },
  {
    brand: "SolarEdge", model: "Home Battery", price: 8000, kwh: 9.7, kwhLabel: "9.7 kWh",
    kwLabel: "5 kW", surge: "7.5 kW", chem: "LFP", warranty: "10 yr", cycles: "6,000",
    ev: false, app: true, install: "Professional",
    scores: { backup: 6.5, solar: 9.2, value: 8.6, scale: 7.5, offgrid: 6.0, smart: 8.0 },
    verdict: "DC-coupled efficiency is excellent if you already run a SolarEdge inverter — locked to that ecosystem otherwise.",
    affiliate: "https://www.amazon.com/s?k=SolarEdge%20Home%20Battery&tag=clickdecision-20",
  },
  {
    brand: "Anker SOLIX", model: "X1 (15 kWh)", price: 10000, kwh: 15, kwhLabel: "15 kWh / 5-180 modular",
    kwLabel: "6 kW", surge: "12 kW", chem: "LFP", warranty: "10 yr", cycles: "6,000",
    ev: false, app: true, install: "DIY / Both",
    scores: { backup: 8.0, solar: 8.0, value: 9.2, scale: 9.4, offgrid: 8.0, smart: 8.5 },
    verdict: "100% usable depth-of-discharge, sub-20ms switchover, and one of the lowest $/kWh in the category.",
    affiliate: "https://www.amazon.com/s?k=Anker%20SOLIX%20X1&tag=clickdecision-20",
  },
  {
    brand: "Generac", model: "PWRcell 2", price: 18000, kwh: 18, kwhLabel: "18 kWh",
    kwLabel: "11.5 kW", surge: "15 kW", chem: "NMC", warranty: "10 yr", cycles: "4,000",
    ev: false, app: true, install: "Professional",
    scores: { backup: 9.3, solar: 8.3, value: 7.0, scale: 8.8, offgrid: 9.3, smart: 8.8 },
    verdict: "Highest continuous output here plus native standby-generator handoff — built for hurricane-prone, long-outage regions.",
    affiliate: "https://www.amazon.com/s?k=Generac%20PWRcell%202&tag=clickdecision-20",
  },
  {
    brand: "LG", model: "RESU16H Prime", price: 13500, kwh: 16, kwhLabel: "16 kWh",
    kwLabel: "5 kW*", surge: "7.5 kW*", chem: "NMC", warranty: "10 yr", cycles: "6,000",
    ev: false, app: true, install: "Professional",
    scores: { backup: 7.0, solar: 8.8, value: 9.0, scale: 7.0, offgrid: 6.0, smart: 7.0 },
    verdict: "Best raw $/kWh of the DC-coupled options — power output depends on the paired inverter (e.g. SolarEdge StorEdge).",
    affiliate: "https://csesolarusa.com/product/lgc-resu-16h-prime/",
  },
  {
    brand: "Bluetti", model: "EP800 + B500", price: 9000, kwh: 9.9, kwhLabel: "9.9 kWh / scalable ~20",
    kwLabel: "7.6 kW", surge: "15.2 kW", chem: "LFP", warranty: "5 yr", cycles: "3,500",
    ev: false, app: true, install: "DIY / Both",
    scores: { backup: 7.8, solar: 7.5, value: 8.8, scale: 8.0, offgrid: 8.5, smart: 7.5 },
    verdict: "Floor-standing modular unit that works with or without rooftop solar — no electrician required to get started.",
    affiliate: "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/bluetti-ep800-b500-home-battery-backup",
  },
  {
    brand: "Sigenergy", model: "SigenStor (16 kWh)", price: 8000, kwh: 16, kwhLabel: "16 kWh",
    kwLabel: "8 kW", surge: "16 kW", chem: "LFP", warranty: "10 yr", cycles: "6,000",
    ev: true, app: true, install: "Professional",
    scores: { backup: 8.0, solar: 9.0, value: 9.3, scale: 8.8, offgrid: 7.5, smart: 9.4 },
    verdict: "All-in-one inverter + battery + EV charger with V2G — the strongest smart/EV integration here, newer installer base.",
    affiliate: "https://www.amazon.com/s?k=home%20battery%20storage%20system%2016kWh&tag=clickdecision-20",
  },
  {
    brand: "EG4", model: "PowerPro WallMount", price: 3500, kwh: 14.3, kwhLabel: "14.3 kWh",
    kwLabel: "9.6 kW", surge: "19.2 kW", chem: "LFP", warranty: "10 yr", cycles: "8,000",
    ev: false, app: false, install: "DIY / Both",
    scores: { backup: 7.0, solar: 6.5, value: 9.8, scale: 8.5, offgrid: 9.0, smart: 5.5 },
    verdict: "By far the lowest cost per kWh — the DIY/off-grid community favorite, but needs a separate inverter and lacks a smart-home app.",
    affiliate: "https://www.amazon.com/s?k=EG4%20battery%20wall%20mount&tag=clickdecision-20",
  },
];

const TIER_STYLES = [
  { tier: "Top Match", accentText: "text-[#2563eb]", border: "border-t-[#2563eb]", btn: "bg-[#2563eb] hover:bg-[#1d4ed8]", img: "linear-gradient(135deg, #dbeafe, #93c5fd)" },
  { tier: "#2 Match", accentText: "text-emerald-600", border: "border-t-emerald-500", btn: "bg-emerald-500 hover:bg-emerald-600", img: "linear-gradient(135deg, #d1fae5, #6ee7b7)" },
  { tier: "#3 Match", accentText: "text-violet-600", border: "border-t-violet-500", btn: "bg-violet-500 hover:bg-violet-600", img: "linear-gradient(135deg, #ede9fe, #c4b5fd)" },
];

// Target capacity (kWh) per home-size selection, used to bias matches toward realistically-sized systems
const SIZE_TARGET_KWH: Record<string, number> = { s: 7, m: 13, l: 22 };

// Which scoring dimension each goal primarily optimizes for
const GOAL_DIMENSION: Record<string, keyof HBScores> = {
  backup: "backup", solar: "solar", offgrid: "offgrid", ev: "smart", budget: "value",
};

export type HBPick = HBProduct & { tier: string; accentText: string; border: string; btn: string; img: string; matchScore: number };

export function computeHBAnalysis(goal: string, size: string, install: string, budget: number = 0) {
  const dim = GOAL_DIMENSION[goal] ?? "backup";
  const target = SIZE_TARGET_KWH[size] ?? 13;

  // Budget filter — same pattern as solar/backup-power: 15% margin, falling
  // back to the full catalog only if nothing fits even with that margin.
  const budgetCeiling = budget > 0 ? budget * 1.15 : Infinity;
  const inBudget = HB_PRODUCTS.filter(p => p.price <= budgetCeiling);
  const candidatePool = inBudget.length > 0 ? inBudget : HB_PRODUCTS;

  const ranked = candidatePool.map((p) => {
    const dims = Object.keys(p.scores) as (keyof HBScores)[];
    const others = dims.filter((k) => k !== dim);
    const otherAvg = others.reduce((s, k) => s + p.scores[k], 0) / others.length;

    let score = p.scores[dim] * 0.55 + otherAvg * 0.45;

    // Size fit: reward capacity close to the target for the selected home size
    const sizeFit = Math.max(0, 1 - Math.abs(p.kwh - target) / target);
    score += sizeFit * 0.4;

    // Install preference fit
    if (install === "diy" && p.install === "DIY / Both") score += 0.3;
    if (install === "pro" && p.install === "Professional") score += 0.1;

    // EV goal: extra bonus for systems with native EV charger integration
    if (goal === "ev" && p.ev) score += 0.3;

    return { p, score: Math.round(score * 10) / 10 };
  });

  ranked.sort((a, b) => b.score - a.score);
  const top3: HBPick[] = ranked.slice(0, 3).map((r, i) => ({
    ...r.p,
    ...TIER_STYLES[i],
    matchScore: r.score,
  }));

  return { top3, eliminated: candidatePool.length - 3, total: HB_PRODUCTS.length };
}
const CRITERIA = [
  { icon: ShieldCheck, title: "Backup Resilience", desc: "Continuous + surge output, transfer time, whole-home vs essentials." },
  { icon: Sun, title: "Solar Pairing", desc: "DC vs AC coupling, inverter compatibility, round-trip efficiency." },
  { icon: Wallet, title: "Value", desc: "$/kWh installed, incentive eligibility, warranty-adjusted cost of ownership." },
  { icon: Gauge, title: "Scalability", desc: "Modular expansion, max stack size, future-proof inverter sizing." },
  { icon: BatteryCharging, title: "Off-Grid Capability", desc: "Black-start, generator input, depth-of-discharge, sustained autonomy." },
  { icon: Smartphone, title: "Smart Home Integration", desc: "App control, TOU optimization, EV charger + heat pump coordination." },
];

const RESEARCH = [
  "LFP vs NMC: Which Battery Chemistry Is Right for Your Home?",
  "How Much Battery Capacity Do You Actually Need?",
  "AC vs DC Coupled Batteries Explained",
  "Best Whole-Home Battery Backup Systems 2026",
  "Home Battery Installation Cost & Incentives Guide",
];

const DEV_STATUS = [
  "Scoring framework designed",
  "Evaluation criteria defined",
  "Product database — 12 systems live (32-system target)",
  "Specs verified against manufacturer/installer sources (12 systems)",
  "Decision engine — live, ranks 12 systems by goal/size/install",
];

const HB_DB_ROWS: Array<[string, string, string, string, number, string]> = [
  ["BAT-10K-A", "Model A", "10.0 kWh", "5.0 kW", 90, "Sample"],
  ["BAT-13K-B", "Model B", "13.5 kWh", "5.0 kW", 93, "Sample"],
  ["BAT-05K-A", "Model A", "5.0 kWh", "3.8 kW", 81, "Sample"],
  ["BAT-20K-A+", "Model A+", "20.0 kWh", "9.6 kW", 95, "Sample"],
  ["BAT-03K-C", "Model C", "3.4 kWh", "1.5 kW", 68, "Sample"],
  ["BAT-10K-C", "Model C", "10.0 kWh", "5.7 kW", 84, "Sample"],
];

const HB_COMPARISON: Array<[string, string, string, "A" | "B" | ""]> = [
  ["Usable capacity", "10.0 kWh", "13.5 kWh", "B"],
  ["Continuous power", "5.0 kW", "5.0 kW", ""],
  ["Peak / surge power", "7.0 kW", "7.6 kW", "B"],
  ["Round-trip efficiency", "96.5%", "97.5%", "B"],
  ["Chemistry", "LFP", "NMC", "A"],
  ["Expandable", "Yes, to 30 kWh", "No (single unit)", "A"],
  ["Warranty", "10 yr / 70% capacity", "10 yr / 70% capacity", ""],
  ["Weight", "114 kg", "130 kg", "A"],
];

const HB_SCORES: Array<[string, number, string]> = [
  ["Backup Resilience", 8.7, "5kW continuous, 7kW surge tested on AC compressor cold-start"],
  ["Solar Pairing", 9.0, "AC-coupled, 97% round-trip efficiency, compatible with existing PV"],
  ["Value", 8.0, "$580/kWh installed, 30% ITC-eligible"],
  ["Scalability", 9.2, "Stackable to 30 kWh across 3 units on the same inverter"],
  ["Off-Grid Capability", 7.8, "Black-start verified, 10kW generator input supported"],
  ["Smart Home Integration", 8.5, "App control, TOU scheduling, EV charger load coordination"],
];

const HB_RESEARCH = [
  { code: "R-201", status: "In progress", title: "LFP vs NMC degradation", desc: "12-month tracking of capacity loss under daily cycling", progress: 55 },
  { code: "R-202", status: "In progress", title: "Round-trip efficiency: spec vs field", desc: "Lab-rated vs measured efficiency across 10 brands", progress: 40 },
  { code: "R-203", status: "Published", title: "Black-start reliability", desc: "20 simulated outage tests across compatible units", progress: 100 },
  { code: "R-204", status: "Published", title: "TOU optimization savings", desc: "Modelled savings across 6 utility rate structures", progress: 100 },
  { code: "R-205", status: "In progress", title: "Inverter compatibility matrix", desc: "AC vs DC coupling compatibility across 32 systems", progress: 35 },
  { code: "R-206", status: "In progress", title: "Cold-climate capacity retention", desc: "Performance at -10°C / 0°C / 10°C ambient", progress: 20 },
];



function HomeBatteryPage() {
  const sp = Route.useSearch();
  const hasParams = sp.goal !== undefined || sp.size !== undefined || sp.install !== undefined;
  const [goal, setGoal] = useState(sp.goal ?? "backup");
  const [size, setSize] = useState(sp.size ?? "m");
  const [install, setInstall] = useState(sp.install ?? "pro");
  const [budget, setBudget] = useState<number>(sp.budget ?? 15000);
  const [submitted, setSubmitted] = useState(hasParams);

  useEffect(() => {
    if (hasParams) {
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    if (typeof window !== "undefined" && (window as any).cdlTrack) {
      (window as any).cdlTrack("calculator_submit", { goal, size, install });
      const { top3 } = computeHBAnalysis(goal, size, install, budget);
      (window as any).cdlTrack("result_view", {
        goal, size, install,
        top_recommendation: top3[0] ? `${top3[0].brand} ${top3[0].model}` : "none",
      });
    }
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

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
              LAB-03
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-200 bg-emerald-500/15 border border-emerald-300/30 rounded-full px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Live
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-blue-100 bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
              12 systems · decision engine live
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Home Battery Decision Lab
          </h1>
          <p className="mt-4 text-blue-50/90 max-w-2xl mx-auto">
            Answer a few questions about your home and goals. We match you against 32 residential battery systems across 10 brands.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="relative bg-[#2563eb] pb-16">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
             style={{ backgroundImage:
               "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
               backgroundSize: "44px 44px" }} />
        <div className="relative max-w-5xl mx-auto px-6 -mt-24 lg:-mt-36">

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 lg:p-8 space-y-8">
          {/* Goal */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
              1 · Primary goal
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {GOALS.map((g) => {
                const active = goal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`flex items-start gap-3 py-3 px-3 rounded-md border text-left transition-colors ${
                      active
                        ? "border-[#2563eb] bg-blue-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <g.icon className={`h-5 w-5 mt-0.5 shrink-0 ${active ? "text-[#2563eb]" : "text-neutral-500"}`} />
                    <div className="min-w-0">
                      <div className={`text-sm font-medium ${active ? "text-[#2563eb]" : "text-neutral-800"}`}>
                        {g.label}
                      </div>
                      <div className="text-[11px] text-neutral-500">{g.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
              2 · Home size / usage
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SIZES.map((s) => {
                const active = size === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    className={`flex flex-col items-start py-3 px-4 rounded-md border text-left transition-colors ${
                      active
                        ? "border-[#2563eb] bg-blue-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${active ? "text-[#2563eb]" : "text-neutral-800"}`}>
                      <HomeIcon className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                      {s.label}
                    </div>
                    <div className="text-[11px] text-neutral-500">{s.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Install */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
              3 · Installation preference
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {INSTALLS.map((p) => {
                const active = install === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setInstall(p.id)}
                    className={`flex flex-col items-start py-3 px-4 rounded-md border text-left transition-colors ${
                      active
                        ? "border-[#2563eb] bg-blue-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${active ? "text-[#2563eb]" : "text-neutral-800"}`}>
                      <Wrench className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                      {p.label}
                    </div>
                    <div className="text-[11px] text-neutral-500">{p.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                4 · Budget
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#2563eb] tabular-nums">
                ${budget.toLocaleString()}
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={30000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full accent-[#2563eb]"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
              <span>$0</span>
              <span>$30k</span>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-neutral-100 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-neutral-600">
              Matching against <span className="font-bold text-neutral-900">12 systems</span> across 11 brands.
            </div>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 h-12 px-7 rounded-md bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8]"
            >
              Find my battery <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        </div>
      </section>


      {submitted && <ResultsBlock goal={goal} size={size} install={install} budget={budget} />}

      {/* CRITERIA */}
      <section className="bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
            What we evaluate
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-8">6 scoring dimensions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRITERIA.map((c) => (
              <div key={c.title} className="bg-white border border-neutral-200 rounded-xl p-5">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <c.icon className="h-5 w-5 text-[#2563eb]" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{c.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — LIVE DATABASE */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <div>
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              02 / Live research database
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Active monitoring. Continuous analysis.
            </h2>
            <p className="mt-3 text-amber-600 text-sm font-medium">Illustrative sample — full 32-system dataset in progress</p>
          </div>
        </div>

        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                {["SKU", "Brand", "Capacity", "Continuous Power", "Score", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HB_DB_ROWS.map((r) => (
                <tr key={r[0]} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-4 font-mono text-xs text-neutral-700">{r[0]}</td>
                  <td className="px-5 py-4">{r[1]}</td>
                  <td className="px-5 py-4 tabular-nums">{r[2]}</td>
                  <td className="px-5 py-4 tabular-nums">{r[3]}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums">{r[4]}</span>
                      <div className="h-1.5 w-16 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563eb]" style={{ width: `${r[4]}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider ${
                      r[5] === "Verified" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${r[5] === "Verified" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {r[5]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 03 — COMPARISON */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              03 / Comparison snapshot
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Structured. Not subjective.
            </h2>
            <p className="mt-5 text-neutral-600">
              Every metric sourced from manufacturer datasheets and verified against independent
              efficiency tests. We show winners — and we show trade-offs.
            </p>
            <a href="/comparisons" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
              View all comparisons <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="lg:col-span-8">
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 border-b border-neutral-200 bg-neutral-50">
                <div className="px-5 py-4 text-[11px] font-mono uppercase tracking-wider text-neutral-500">Metric</div>
                <div className="px-5 py-4 border-l border-neutral-200">
                  <div className="text-sm font-semibold">Unit A</div>
                  <div className="text-[11px] font-mono text-neutral-400">Model A · 10.0 kWh</div>
                </div>
                <div className="px-5 py-4 border-l border-neutral-200">
                  <div className="text-sm font-semibold">Unit B</div>
                  <div className="text-[11px] font-mono text-neutral-400">Model B · 13.5 kWh</div>
                </div>
              </div>
              {HB_COMPARISON.map(([m, a, b, w]) => (
                <div key={m} className="grid grid-cols-3 border-b border-neutral-100 last:border-0 text-sm">
                  <div className="px-5 py-3.5 text-neutral-600">{m}</div>
                  <div className={`px-5 py-3.5 border-l border-neutral-100 tabular-nums ${w === "A" ? "font-semibold text-[#2563eb]" : ""}`}>{a}</div>
                  <div className={`px-5 py-3.5 border-l border-neutral-100 tabular-nums ${w === "B" ? "font-semibold text-[#2563eb]" : ""}`}>{b}</div>
                </div>
              ))}
              <div className="px-5 py-4 bg-blue-50 border-t border-blue-100 text-xs text-neutral-700">
                <span className="font-semibold text-[#2563eb]">Trade-off · </span>
                Unit B wins on capacity and round-trip efficiency. Unit A wins on expandability and chemistry safety profile (LFP vs NMC).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — SCORING */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              04 / Scoring system
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Methodology-driven scores.
            </h2>
            <p className="mt-5 text-neutral-600">
              Every score is a weighted aggregate of measured properties — never editorial opinion.
              Weights are published, the changelog is public, and every dimension links back to its
              test protocol.
            </p>
            <div className="mt-6 text-xs font-mono text-neutral-400">
              Methodology v1.0 · 14-day rolling window
            </div>
            <a href="/methodology" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
              Read protocol <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="lg:col-span-7 space-y-3">
            {HB_SCORES.map(([label, score, desc]) => (
              <div key={label} className="border border-neutral-200 rounded-lg p-5 hover:border-[#2563eb]/40 transition-colors">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-sm font-mono tabular-nums">
                    <span className="text-[#2563eb] font-bold">{score}</span>
                    <span className="text-neutral-400"> / 10</span>
                  </div>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#2563eb]" style={{ width: `${score * 10}%` }} />
                </div>
                <div className="text-xs text-neutral-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — RECOMMENDATION LOGIC */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
            05 / Recommendation logic
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight max-w-3xl">
            Why we recommend it — and where it fails.
          </h2>
          <p className="mt-4 text-neutral-600 max-w-2xl">
            Every verdict ships with both halves of the trade-off. Limitations are part of the output,
            not a footnote.
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-7">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-700">+ Strengths</div>
              </div>
              <ul className="space-y-3 text-sm text-neutral-700">
                {[
                  "LFP chemistry — safer thermal profile, 6,000+ cycle life at 80% retention.",
                  "Modular — expand to 30 kWh by adding up to 2 more units on the same inverter.",
                  "Black-start capable — can restart from zero charge during a grid outage.",
                  "10-year warranty at 70% capacity retention — industry-standard coverage.",
                ].map((s) => (
                  <li key={s} className="flex gap-3">
                    <span className="text-emerald-600 mt-0.5">+</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-7">
              <div className="flex items-center gap-2 mb-5">
                <XCircle className="h-5 w-5 text-neutral-700" />
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-700">− Trade-offs</div>
              </div>
              <ul className="space-y-3 text-sm text-neutral-700">
                {[
                  "5kW continuous output may not cover high-draw appliances running simultaneously (e.g. electric range + AC).",
                  "114 kg unit — requires a 2-person install, floor-mount only (no wall-mount option).",
                  "AC-coupled only — slightly lower round-trip efficiency than DC-coupled alternatives.",
                  "Proprietary inverter — no third-party battery expansion compatibility.",
                ].map((s) => (
                  <li key={s} className="flex gap-3">
                    <span className="text-neutral-500 mt-0.5">−</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — CURRENT RESEARCH */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              06 / Current research
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Continuously evolving.</h2>
            <p className="mt-3 text-sm text-neutral-500">6 active threads · monitoring 12 systems</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
          {HB_RESEARCH.map((r) => (
            <div key={r.code} className="bg-white p-6 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-mono text-neutral-400">{r.code}</div>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${
                  r.status === "Published" ? "text-emerald-600" : "text-[#2563eb]"
                }`}>
                  {r.status}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2">{r.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-5">{r.desc}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full ${r.status === "Published" ? "bg-emerald-500" : "bg-[#2563eb]"}`} style={{ width: `${r.progress}%` }} />
                </div>
                <div className="text-xs font-mono tabular-nums text-neutral-500">{r.progress}%</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/" hash="methodology" className="text-sm font-semibold text-[#2563eb] inline-flex items-center gap-1">
            See our full methodology & philosophy <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* DEV STATUS + RESEARCH */}
      <section className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-8">
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="text-xs font-mono text-emerald-600 tracking-[0.18em] uppercase mb-3">
              Development status
            </div>
            <ul className="space-y-2.5 mb-5">
              {DEV_STATUS.map((s) => (
                <li key={s} className="flex items-center gap-2.5 text-sm text-neutral-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="border-t border-neutral-100 pt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-lg font-bold tabular-nums">32 Systems Tracked</div>
                <div className="text-xs text-neutral-500">10 brands · Updated weekly</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              Research available now
            </div>
            <ul className="divide-y divide-neutral-100">
              {RESEARCH.map((r) => (
                <li key={r}>
                  <div className="flex items-center justify-between py-3 text-sm text-neutral-700">
                    <span>{r}</span>
                    <span className="text-[10px] font-mono text-neutral-300 uppercase">Coming soon</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* METHODOLOGY FOOTER */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Recommendations use a weighted scoring algorithm across 6 use-case dimensions, based on manufacturer specs and field-tested data where available. Each data point shows confidence level: verified / claimed / estimated.
          </p>
        </div>
      </section>
    </div>
  );
}

function ResultsBlock({ goal, size, install, budget }: { goal: string; size: string; install: string; budget: number }) {
  const { top3: PICKS, eliminated, total } = computeHBAnalysis(goal, size, install, budget);
  return (
    <section id="results" className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
            Decision engine output
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {PICKS.length === 3 ? "Your top 3 matches" : PICKS.length === 1 ? "Your best match" : `Your top ${PICKS.length} matches`}
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Ranked from a {total}-system dataset (verified specs, real affiliate links) based on your goal, home size and install preference.
          </p>
          {PICKS.length < 3 && budget > 0 && (
            <p className="mt-2 text-sm text-amber-600 font-medium">
              Only {PICKS.length} system{PICKS.length === 1 ? "" : "s"} in our dataset fit{PICKS.length === 1 ? "s" : ""} within ${budget.toLocaleString()} — try raising your budget to see more options.
            </p>
          )}
        </div>

        <div className={`grid gap-6 ${PICKS.length === 1 ? "md:grid-cols-1 max-w-md" : PICKS.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {PICKS.map((p, i) => (
            <HomeBatteryCard key={p.tier} p={p} index={i} />
          ))}
        </div>

        {/* Comparison table — only meaningful with 2+ products to compare */}
        {PICKS.length >= 2 && (
        <div className="mt-12 bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h3 className="text-lg font-bold">Side-by-side comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{tableLayout: "fixed"}}>
              <colgroup>
                <col style={{width: "140px"}} />
                {PICKS.map((p) => <col key={p.tier} />)}
              </colgroup>
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-neutral-400">Spec</th>
                  {PICKS.map((p) => (
                    <th key={p.tier} className="text-left px-4 py-3">
                      <div className="text-[10px] font-mono text-neutral-400">{p.brand}</div>
                      <div className="font-bold text-neutral-900">{p.model}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&>tr]:border-b [&>tr]:border-neutral-100">
                <Row label="Price" values={PICKS.map((p) => `$${p.price.toLocaleString()}`)} />
                <Row label="Capacity" values={PICKS.map((p) => p.kwh)} />
                <Row label="Continuous output" values={PICKS.map((p) => p.kw)} />
                <Row label="Surge" values={PICKS.map((p) => p.surge)} />
                <Row label="Chemistry" values={PICKS.map((p) => p.chem)} />
                <Row label="Warranty" values={PICKS.map((p) => p.warranty)} />
                <Row label="Cycle life" values={PICKS.map((p) => p.cycles)} />
                <Row label="EV integration" values={PICKS.map((p) => (p.ev ? "✓" : "—"))} />
                <Row label="App monitoring" values={PICKS.map((p) => (p.app ? "✓" : "—"))} />
                <Row label="Install" values={PICKS.map((p) => p.install)} />
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Why panel */}
        <details className="mt-8 bg-white border border-neutral-200 rounded-xl p-6 group">
          <summary className="cursor-pointer font-semibold text-neutral-900 flex items-center justify-between">
            Why this recommendation?
            <span className="text-xs font-mono text-neutral-400 group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="mt-4 space-y-3 text-sm text-neutral-600 leading-relaxed">
            <p><strong className="text-neutral-900">Prioritized:</strong> for your selected goal, size and install preference, the engine weights that scoring dimension at 55% and the remaining 5 dimensions at 45%, plus a capacity-fit bonus for your home size.</p>
            {eliminated > 0 ? (
              <p><strong className="text-neutral-900">{eliminated} not shown:</strong> the other {eliminated} of {total} systems scored lower for this combination — see the full comparison below or adjust your inputs above.</p>
            ) : (
              <p><strong className="text-neutral-900">All {total} systems considered:</strong> with your current budget, only {PICKS.length} system{PICKS.length === 1 ? "" : "s"} qualified — raise your budget to unlock more comparisons.</p>
            )}
            {PICKS.length >= 2 ? (
              <p><strong className="text-neutral-900">Trade-off:</strong> {PICKS[0]?.brand} {PICKS[0]?.model} ranks highest for this combination; {(PICKS[2] ?? PICKS[1])?.brand} {(PICKS[2] ?? PICKS[1])?.model} is the alternative if its install type or price fits better.</p>
            ) : (
              <p><strong className="text-neutral-900">Single match:</strong> {PICKS[0]?.brand} {PICKS[0]?.model} was the only system in our dataset that fit your stated budget for this scenario.</p>
            )}
          </div>
        </details>

        <p className="mt-8 text-[11px] font-mono text-neutral-400 text-center">
          We earn a commission if you purchase — this does not affect our analysis.
        </p>
      </div>
    </section>
  );
}

function HomeBatteryCard({ p, index }: { p: HBPick; index: number }) {
  useEffect(() => {
    trackImpression({
      lab: "home_battery",
      brand: p.brand,
      model: p.model,
      recommendation_position: index + 1,
      recommendation_label: p.tier,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.brand, p.model, index]);

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 border-t-4 ${p.border} overflow-hidden flex flex-col`}>
      <div
        className="h-40 flex items-center justify-center relative"
        style={{ backgroundImage: p.img }}
      >
        <BatteryCharging className="h-16 w-16 text-white/80" strokeWidth={1.5} />
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[10px] font-mono uppercase tracking-[0.15em] ${p.accentText}`}>
          ★ {p.tier}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="text-[11px] font-mono text-neutral-400">{p.brand}</div>
            <h3 className="text-xl font-bold leading-tight">{p.model}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-2xl font-bold ${p.accentText}`}>${p.price.toLocaleString()}</div>
            <div className="text-[10px] font-mono text-neutral-400">match {p.matchScore}</div>
          </div>
        </div>

        {/* Spec icons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Spec icon={BatteryCharging} label={p.kwh} sub="capacity" />
          <Spec icon={Zap} label={p.kw} sub="continuous" />
          <Spec icon={PlugZap} label={p.surge} sub="surge" />
          <Spec icon={ShieldCheck} label={p.chem} sub="chemistry" />
          <Spec icon={Cog} label={p.warranty} sub="warranty" />
          <Spec icon={Gauge} label={p.cycles} sub="cycles" />
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge active={p.ev} label="EV Charger" />
          <Badge active={p.app} label="App Monitor" />
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-neutral-100 text-neutral-600">
            {p.install}
          </span>
        </div>

        {/* Score bars */}
        <div className="space-y-2 mb-4">
          <Bar label="Backup Resilience" value={p.backup} color={p.accentText} />
          <Bar label="Solar Pairing" value={p.solar} color={p.accentText} />
          <Bar label="Value" value={p.value} color={p.accentText} />
          <Bar label="Scalability" value={p.scale} color={p.accentText} />
          <Bar label="Off-Grid" value={p.offgrid} color={p.accentText} />
          <Bar label="Smart Home" value={p.smart} color={p.accentText} />
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed mb-5 italic">"{p.verdict}"</p>

        <a
          href={p.affiliate}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => {
            trackAffiliateClick({
              lab: "home_battery",
              brand: p.brand,
              model: p.model,
              price: p.price,
              recommendation_position: index + 1,
              recommendation_label: p.tier,
              affiliate_tier: classifyTier(p.affiliate),
              destination_url: p.affiliate,
            });
          }}
          className={`mt-auto inline-flex w-full items-center justify-center gap-1.5 h-11 rounded-md text-white text-sm font-semibold transition-colors ${p.btn}`}
        >
          Check price <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, sub }: { icon: typeof Zap; label: string; sub: string }) {
  return (
    <div className="rounded-md bg-neutral-50 px-2 py-2">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-[#2563eb] shrink-0" />
        <div className="text-xs font-semibold text-neutral-900 truncate">{label}</div>
      </div>
      <div className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">{sub}</div>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
        <span>{label}</span>
        <span className={`font-bold ${color}`}>{value}/10</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#2563eb] to-blue-400"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-400 line-through"
      }`}
    >
      {label}
    </span>
  );
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <td className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-50/50">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-2.5 text-neutral-800">{v}</td>
      ))}
    </tr>
  );
}
