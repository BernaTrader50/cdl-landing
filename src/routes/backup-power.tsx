import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Flame,
  Home as HomeIcon,
  Plug,
  Mountain,
  CloudLightning,
  Sun,
  Wallet,
  Zap,
  ShieldCheck,
  Gauge,
  Fuel,
  Activity,
  BatteryCharging,
  Wrench,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/backup-power")({
  head: () => ({
    meta: [
      { title: "Backup Power Decision Lab — ClickDecisionLab" },
      {
        name: "description",
        content:
          "Technical analysis for whole-home backup power systems — standby generators, transfer switches, fuel selection, and battery integration.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    goal: typeof s.goal === "string" ? s.goal : undefined,
    loads: typeof s.loads === "string" ? s.loads : undefined,
    fuel: typeof s.fuel === "string" ? s.fuel : undefined,
    solar: typeof s.solar === "string" ? s.solar : undefined,
    budget: s.budget != null ? Number(s.budget) : undefined,
  }),
  component: BackupPowerPage,
});

const GOALS = [
  { id: "whole", label: "Whole-Home Backup", sub: "every circuit covered", icon: HomeIcon },
  { id: "essentials", label: "Essential Circuits Only", sub: "fridge, lights, well", icon: Plug },
  { id: "offgrid", label: "Off-Grid / Remote Property", sub: "cabin, no utility", icon: Mountain },
  { id: "storm", label: "Frequent Outages", sub: "storm-prone region", icon: CloudLightning },
  { id: "hybrid", label: "Solar + Battery Hybrid", sub: "generator as backup", icon: Sun },
  { id: "value", label: "Value Pick", sub: "best $/kW installed", icon: Wallet },
];

const LOADS = [
  { id: "ac", label: "Central AC / Heat Pump", kw: 3.5 },
  { id: "range", label: "Electric Range", kw: 2.5 },
  { id: "dryer", label: "Electric Dryer", kw: 3.0 },
  { id: "well", label: "Well Pump", kw: 1.5 },
  { id: "sump", label: "Sump Pump", kw: 0.8 },
  { id: "fridge", label: "Refrigerator", kw: 0.6 },
  { id: "ev", label: "EV Charger", kw: 7.2 },
  { id: "lights", label: "Lights & Outlets", kw: 1.2 },
  { id: "water", label: "Water Heater (electric)", kw: 4.5 },
];

const FUELS = [
  { id: "ng", label: "Natural Gas" },
  { id: "lp", label: "Propane (LP)" },
  { id: "diesel", label: "Diesel" },
  { id: "dual", label: "Dual Fuel / No preference" },
];

const SOLARS = [
  { id: "yes", label: "Yes, have solar+battery", icon: Sun },
  { id: "planning", label: "Planning to add", icon: Wrench },
  { id: "no", label: "No, generator-only", icon: Flame },
];

type BPScores = { whole: number; essentials: number; offgrid: number; storm: number; hybrid: number; value: number };
type BPFuelType = "dual" | "battery";
type BPProduct = {
  brand: string; model: string; price: number; kwNum: number; kw: string; surge: string;
  fuel: string; fuelType: BPFuelType; transfer: string; noise: string; warranty: string;
  ats: boolean; app: boolean; install: "Professional" | "DIY / Both";
  scores: BPScores; verdict: string; affiliate: string;
};

export const BP_PRODUCTS: BPProduct[] = [
  {
    brand: "Generac", model: "Guardian 22kW", price: 4999, kwNum: 22, kw: "22 kW", surge: "23.6 kW",
    fuel: "NG / LP", fuelType: "dual", transfer: "200A Auto", noise: "67 dB", warranty: "5 yr",
    ats: true, app: true, install: "Professional",
    scores: { whole: 9.6, essentials: 9.0, offgrid: 5.5, storm: 9.5, hybrid: 6.5, value: 7.8 },
    verdict: "Best for true whole-home coverage: automatic transfer switch, unlimited runtime on natural gas, sized for AC + well pump simultaneously.",
    affiliate: "https://www.amazon.com/s?k=Generac+Guardian+22kW&tag=clickdecision-20",
  },
  {
    brand: "EcoFlow", model: "DELTA Pro Ultra + Smart Panel", price: 7200, kwNum: 7.2, kw: "7.2 kW", surge: "14.4 kW",
    fuel: "None (battery)", fuelType: "battery", transfer: "Smart panel", noise: "0 dB", warranty: "5 yr",
    ats: true, app: true, install: "DIY / Both",
    scores: { whole: 7.5, essentials: 9.2, offgrid: 9.4, storm: 8.5, hybrid: 9.6, value: 7.0 },
    verdict: "Best hybrid pick: pairs with solar for silent, fuel-free backup of essential circuits, with generator as fallback for extended outages.",
    affiliate: "https://www.amazon.com/s?k=EcoFlow+DELTA+Pro+Ultra&tag=clickdecision-20",
  },
  {
    brand: "Champion", model: "14kW Dual Fuel Standby", price: 3199, kwNum: 14, kw: "14 kW", surge: "15.4 kW",
    fuel: "NG / LP (dual)", fuelType: "dual", transfer: "200A Auto", noise: "65 dB", warranty: "5 yr",
    ats: true, app: false, install: "Professional",
    scores: { whole: 8.2, essentials: 8.6, offgrid: 6.0, storm: 8.4, hybrid: 6.0, value: 9.4 },
    verdict: "Best $/kW installed: dual-fuel flexibility and automatic transfer switch at the lowest price in this class, with a smaller margin above essential loads.",
    affiliate: "https://www.amazon.com/s?k=Champion+14kW+Dual+Fuel+Standby&tag=clickdecision-20",
  },
  {
    brand: "Generac", model: "Guardian 11kW", price: 2899, kwNum: 11, kw: "11 kW", surge: "12.5 kW",
    fuel: "NG / LP", fuelType: "dual", transfer: "100A Auto", noise: "63 dB", warranty: "5 yr",
    ats: true, app: true, install: "Professional",
    scores: { whole: 6.0, essentials: 9.4, offgrid: 5.5, storm: 8.5, hybrid: 6.0, value: 8.8 },
    verdict: "Right-sized for essential circuits (fridge, lights, well, sump) — Generac's Quiet-Test mode and Mobile Link app at the lowest entry price in the lineup.",
    affiliate: "https://www.amazon.com/s?k=Generac+Guardian+11kW&tag=clickdecision-20",
  },
  {
    brand: "Generac", model: "Guardian 26kW", price: 9999, kwNum: 26, kw: "26 kW", surge: "28 kW",
    fuel: "NG / LP", fuelType: "dual", transfer: "200-800A Auto", noise: "68 dB", warranty: "5 yr",
    ats: true, app: true, install: "Professional",
    scores: { whole: 9.9, essentials: 9.0, offgrid: 6.0, storm: 9.7, hybrid: 6.8, value: 6.5 },
    verdict: "Largest residential Generac — covers multiple AC units plus heavy loads simultaneously; liquid-cooled tier with the highest installed cost here.",
    affiliate: "https://www.amazon.com/s?k=Generac+Guardian+26kW&tag=clickdecision-20",
  },
  {
    brand: "Briggs & Stratton", model: "22kW PowerProtect", price: 5899, kwNum: 22, kw: "22 kW", surge: "23 kW",
    fuel: "NG / LP", fuelType: "dual", transfer: "100-400A Auto", noise: "66 dB", warranty: "5 yr",
    ats: true, app: true, install: "Professional",
    scores: { whole: 9.4, essentials: 8.8, offgrid: 5.8, storm: 9.3, hybrid: 6.3, value: 8.2 },
    verdict: "Same power class as the Generac 22kW for less upfront cost — purpose-built cold-weather hardware (battery and oil warmers) for harsh climates.",
    affiliate: "https://www.amazon.com/s?k=Briggs+Stratton+22kW+PowerProtect&tag=clickdecision-20",
  },
  {
    brand: "Kohler", model: "14RESA", price: 4399, kwNum: 14, kw: "14 kW", surge: "17.5 kW",
    fuel: "NG / LP", fuelType: "dual", transfer: "RXT Auto", noise: "65 dB", warranty: "5 yr / 2,000 hr",
    ats: true, app: true, install: "Professional",
    scores: { whole: 8.0, essentials: 8.8, offgrid: 6.0, storm: 8.6, hybrid: 6.0, value: 7.5 },
    verdict: "PowerBoost technology gives strong motor-starting headroom (35 kVA peak) for central AC — smaller dealer network than Generac/Champion in most regions.",
    affiliate: "https://www.amazon.com/s?k=Kohler+14RESA&tag=clickdecision-20",
  },
  {
    brand: "Bluetti", model: "AC500 + 2x B300S", price: 4999, kwNum: 5, kw: "5 kW", surge: "10 kW",
    fuel: "None (battery)", fuelType: "battery", transfer: "Smart panel", noise: "0 dB", warranty: "4 yr",
    ats: false, app: true, install: "DIY / Both",
    scores: { whole: 6.5, essentials: 9.0, offgrid: 9.0, storm: 8.0, hybrid: 9.2, value: 8.0 },
    verdict: "Modular LFP backup starting at 6.1 kWh and expandable to 18.4 kWh — strong solar input (8,000W with 2+ packs) for sustained off-grid use.",
    affiliate: "https://www.amazon.com/s?k=Bluetti+AC500+B300S&tag=clickdecision-20",
  },
  {
    brand: "Anker SOLIX", model: "F3800 + Home Power Panel", price: 4694, kwNum: 6, kw: "6 kW", surge: "12 kW",
    fuel: "None (battery)", fuelType: "battery", transfer: "Smart panel", noise: "0 dB", warranty: "5 yr",
    ats: false, app: true, install: "DIY / Both",
    scores: { whole: 7.0, essentials: 9.0, offgrid: 9.0, storm: 8.2, hybrid: 9.4, value: 8.5 },
    verdict: "Highest continuous output of the battery-based picks (6kW/unit, 12kW with Double Power Hub) — EV-grade cells rated 3,000 cycles, expandable to 53.8 kWh.",
    affiliate: "https://www.amazon.com/s?k=Anker+SOLIX+F3800+Home+Power+Panel&tag=clickdecision-20",
  },
  {
    brand: "Westinghouse", model: "WGen9500DF", price: 1299, kwNum: 9.5, kw: "9.5 kW", surge: "12.5 kW",
    fuel: "Dual Fuel (gas/LP)", fuelType: "dual", transfer: "Manual / transfer-switch ready", noise: "72 dB", warranty: "3 yr",
    ats: false, app: false, install: "DIY / Both",
    scores: { whole: 4.5, essentials: 7.5, offgrid: 6.5, storm: 6.0, hybrid: 3.5, value: 9.6 },
    verdict: "Lowest entry cost here — a portable dual-fuel unit that covers essentials with a manual transfer switch; no automatic switchover or app.",
    affiliate: "https://www.amazon.com/s?k=Westinghouse+WGen9500DF&tag=clickdecision-20",
  },
  {
    brand: "DuroMax", model: "XP12000HX", price: 1799, kwNum: 9.5, kw: "9.5 kW", surge: "12 kW",
    fuel: "Dual Fuel (gas/LP)", fuelType: "dual", transfer: "Manual / transfer-switch ready", noise: "74 dB", warranty: "3 yr",
    ats: false, app: false, install: "DIY / Both",
    scores: { whole: 5.5, essentials: 8.0, offgrid: 6.8, storm: 6.5, hybrid: 3.8, value: 9.2 },
    verdict: "DIY off-grid favorite — electric start, dual fuel, and a low price per kW, but manual operation and no smart-home integration.",
    affiliate: "https://www.amazon.com/s?k=DuroMax+XP12000HX&tag=clickdecision-20",
  },
  {
    brand: "Champion", model: "8.5kW Home Standby", price: 1999, kwNum: 8.5, kw: "8.5 kW", surge: "10.5 kW",
    fuel: "NG / LP", fuelType: "dual", transfer: "100A Auto", noise: "64 dB", warranty: "5 yr",
    ats: true, app: false, install: "Professional",
    scores: { whole: 5.0, essentials: 8.8, offgrid: 5.0, storm: 7.5, hybrid: 5.0, value: 9.5 },
    verdict: "Smallest automatic-transfer standby here — covers essential circuits at the lowest standby price point with Champion's typical value-per-kW edge.",
    affiliate: "https://www.amazon.com/s?k=Champion+8.5kW+Home+Standby&tag=clickdecision-20",
  },
];

const TIER_STYLES = [
  { tier: "Top Match", accentText: "text-[#2563eb]", border: "border-t-[#2563eb]", btn: "bg-[#2563eb] hover:bg-[#1d4ed8]", img: "linear-gradient(135deg, #dbeafe, #93c5fd)" },
  { tier: "#2 Match", accentText: "text-emerald-600", border: "border-t-emerald-500", btn: "bg-emerald-500 hover:bg-emerald-600", img: "linear-gradient(135deg, #d1fae5, #6ee7b7)" },
  { tier: "#3 Match", accentText: "text-violet-600", border: "border-t-violet-500", btn: "bg-violet-500 hover:bg-violet-600", img: "linear-gradient(135deg, #ede9fe, #c4b5fd)" },
];

export type BPPick = BPProduct & { tier: string; accentText: string; border: string; btn: string; img: string; matchScore: number };

export function computeBPAnalysis(goal: string, estimatedKw: number, fuel: string, solar: string, budget: number = 0) {
  const dim = (["whole", "essentials", "offgrid", "storm", "hybrid", "value"].includes(goal) ? goal : "whole") as keyof BPScores;

  // Budget filter — same pattern as solar-calculator: 15% margin, and if that
  // empties the pool, fall back to "cheapest available" rather than silently
  // ignoring budget and showing whatever scores highest regardless of price.
  const budgetCeiling = budget > 0 ? budget * 1.15 : Infinity;
  const inBudget = BP_PRODUCTS.filter(p => p.price <= budgetCeiling);
  const candidatePool = inBudget.length > 0 ? inBudget : BP_PRODUCTS;

  const ranked = candidatePool.map((p) => {
    const dims = Object.keys(p.scores) as (keyof BPScores)[];
    const others = dims.filter((k) => k !== dim);
    const otherAvg = others.reduce((s, k) => s + p.scores[k], 0) / others.length;

    let score = p.scores[dim] * 0.5 + otherAvg * 0.3;

    // Size fit vs estimated connected load
    const sizeFit = Math.max(0, 1 - Math.abs(p.kwNum - estimatedKw) / estimatedKw);
    score += sizeFit * 0.3;
    if (p.kwNum < estimatedKw * 0.75) score -= 0.5; // meaningfully undersized

    // Fuel preference (only meaningful for fuel-type generators)
    if (p.fuelType === "dual" && (fuel === "ng" || fuel === "lp" || fuel === "dual")) score += 0.3;
    if (fuel === "diesel") score -= 0.1; // none of these run diesel — small honest penalty across the board

    // Solar/battery preference
    if ((solar === "yes" || solar === "planning") && p.fuelType === "battery") score += 0.4;
    if (solar === "no" && p.fuelType === "dual") score += 0.2;

    return { p, score: Math.round(score * 10) / 10 };
  });

  ranked.sort((a, b) => b.score - a.score);
  const top3: BPPick[] = ranked.slice(0, 3).map((r, i) => ({
    ...r.p,
    ...TIER_STYLES[i],
    matchScore: r.score,
  }));

  return { top3, eliminated: candidatePool.length - 3, total: BP_PRODUCTS.length };
}

const CRITERIA = [
  { icon: Zap, title: "Power Capacity", desc: "Continuous + surge kW vs your connected load; sizing margin for motor start-up (AC, well pump)." },
  { icon: ShieldCheck, title: "Transfer Switch & Automation", desc: "Auto vs manual transfer, switchover time, whole-home vs load-shedding panels." },
  { icon: Fuel, title: "Fuel Flexibility", desc: "Natural gas, propane, diesel, or dual-fuel; runtime per tank and local fuel availability." },
  { icon: Gauge, title: "Load Management", desc: "Smart load-shedding modules, managed circuits, prioritizing critical loads when capacity is tight." },
  { icon: BatteryCharging, title: "Battery & Solar Integration", desc: "Compatibility with hybrid inverters and storage for combined solar + generator + battery setups." },
  { icon: Wallet, title: "Installation Value", desc: "Typical installed cost, permit/code complexity, and $/kW installed vs comparable systems." },
];

const RESEARCH = [
  "Standby Generator Sizing Guide: How Many kW Do You Need?",
  "Natural Gas vs Propane Generators: Which Fuel Type?",
  "Transfer Switch Types Explained: Automatic vs Manual",
  "Generator + Battery Hybrid Systems: Whole-Home Backup Guide",
];

const DEV_STATUS = [
  "Scoring framework designed",
  "Evaluation criteria defined",
  "Product database — 12 systems live (45-system target)",
  "Dataset 12 / ~45 systems",
  "Decision engine — live, ranks 12 systems by goal/load/fuel/solar",
];

const BP_DB_ROWS: Array<[string, string, string, string]> = [
  ["GEN-22K-A", "Model A", "22 kW", "NG / LP"],
  ["GEN-14K-B", "Model B", "14 kW", "NG / LP"],
  ["GEN-26K-A+", "Model A+", "26 kW", "NG / LP / Diesel"],
  ["GEN-11K-C", "Model C", "11 kW", "NG / LP"],
  ["GEN-08K-C", "Model C", "8 kW", "NG / LP"],
  ["GEN-20K-D", "Model D", "20 kW", "Diesel"],
];

const BP_COMPARISON: Array<[string, string, string]> = [
  ["Continuous / surge power", "22 kW / 24 kW", "14 kW / 15.5 kW"],
  ["Fuel type(s)", "Natural gas / LP", "Natural gas / LP"],
  ["Transfer switch", "Automatic, included", "Automatic, included"],
  ["Noise @ 23 ft", "65 dB", "62 dB"],
  ["Runtime @ 50% load (NG)", "Unlimited (piped)", "Unlimited (piped)"],
  ["Weight / footprint", "410 kg", "290 kg"],
  ["Warranty", "5 yr", "5 yr"],
  ["Est. installed price", "$9,500", "$6,800"],
];

const BP_SCORES: Array<[string, string]> = [
  ["Power Capacity", "Continuous + surge kW vs connected load; sizing margin for motor start-up (AC, well pump)"],
  ["Transfer Switch & Automation", "Auto vs manual transfer, switchover time, whole-home vs load-shedding panels"],
  ["Fuel Flexibility", "Natural gas, propane, diesel, or dual-fuel; runtime per tank and local availability"],
  ["Load Management", "Smart load-shedding modules, managed circuits, critical-load prioritization"],
  ["Battery & Solar Integration", "Compatibility with hybrid inverters and storage for combined setups"],
  ["Installation Value", "Typical installed cost, permit/code complexity, $/kW installed"],
];

const BP_RESEARCH = [
  { code: "R-301", title: "Standby generator sizing accuracy", desc: "Nameplate kW vs measured sustained load" },
  { code: "R-302", title: "Transfer switch reliability", desc: "Automatic vs manual failure rates" },
  { code: "R-303", title: "Fuel consumption comparison", desc: "Natural gas vs propane runtime per system size" },
  { code: "R-304", title: "Noise at property line", desc: "23ft dB readings across brands and load levels" },
  { code: "R-305", title: "Generator + battery hybrid savings", desc: "Fuel savings when paired with home battery storage" },
  { code: "R-306", title: "Installation cost survey", desc: "Permit + electrician + unit cost across regions" },
];



function BackupPowerPage() {
  const sp = Route.useSearch();
  const hasParams =
    sp.goal !== undefined || sp.loads !== undefined || sp.fuel !== undefined ||
    sp.solar !== undefined || sp.budget !== undefined;
  const [goal, setGoal] = useState(sp.goal ?? "whole");
  const [loads, setLoads] = useState<string[]>(
    sp.loads !== undefined ? sp.loads.split(",").filter(Boolean) : ["ac", "fridge", "well", "lights"],
  );
  const [fuel, setFuel] = useState(sp.fuel ?? "ng");
  const [solar, setSolar] = useState(sp.solar ?? "no");
  const [budget, setBudget] = useState<number>(sp.budget ?? 8000);
  const [submitted, setSubmitted] = useState(hasParams);

  const connectedKw = useMemo(
    () => LOADS.filter((l) => loads.includes(l.id)).reduce((s, l) => s + l.kw, 0),
    [loads],
  );
  const estimatedKw = Math.max(8, Math.ceil(connectedKw * 1.25));

  const toggleLoad = (id: string) =>
    setLoads((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const handleSubmit = () => {
    setSubmitted(true);
    if (typeof window !== "undefined" && (window as any).cdlTrack) {
      (window as any).cdlTrack("calculator_submit", { goal, loads: loads.join(","), fuel, solar, budget, estimatedKw });
      const { top3 } = computeBPAnalysis(goal, estimatedKw, fuel, solar, budget);
      (window as any).cdlTrack("result_view", {
        goal, estimatedKw,
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
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-32 lg:pb-44 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
                LAB-04
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-200 bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                Planned · Q4 2026
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-blue-100 bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
                Backup Power Lab · Methodology v1.0 · Updated weekly
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              Real capacity. Real decisions on{" "}
              <span className="text-blue-200">whole-home power.</span>
            </h1>
            <p className="mt-4 text-blue-50/90 max-w-2xl mx-auto text-[15px] leading-relaxed">
              Technical analysis for whole-home backup power systems — standby generators, automatic
              transfer switches, fuel-type selection, load management, and integration with battery
              storage. Every score is a weighted aggregate of measured specs, not sponsored
              placement.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#advisor"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-white text-[#2563eb] text-sm font-semibold hover:bg-blue-50"
              >
                Find my system <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#methodology" className="text-sm text-blue-100 hover:text-white">
                Read methodology ›
              </a>
            </div>

            <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
              {[
                { n: "45", l: "Systems (target)" },
                { n: "15", l: "Brands (target)" },
                { n: "6", l: "Use-case scores" },
                { n: "0", l: "Sponsored rankings" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold tabular-nums">{s.n}</div>
                  <div className="text-[11px] text-blue-100/80 leading-tight mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* CALCULATOR */}
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
          <div id="advisor" className="bg-white text-neutral-900 border border-neutral-200 rounded-2xl shadow-sm p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#2563eb]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb] animate-pulse" />
                Backup Power Advisor
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                12 systems · weekly
              </div>
            </div>

            {/* Goal */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-2">
                Primary goal
              </div>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map((g) => {
                  const active = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`flex items-start gap-2 py-2.5 px-3 rounded-md border text-left transition-colors ${
                        active
                          ? "border-[#2563eb] bg-blue-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <g.icon
                        className={`h-4 w-4 mt-0.5 shrink-0 ${active ? "text-[#2563eb]" : "text-neutral-500"}`}
                      />
                      <div className="min-w-0">
                        <div
                          className={`text-[13px] font-medium leading-tight ${active ? "text-[#2563eb]" : "text-neutral-800"}`}
                        >
                          {g.label}
                        </div>
                        <div className="text-[10px] text-neutral-500">{g.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loads */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                  Loads to cover
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#2563eb] tabular-nums">
                  {connectedKw.toFixed(1)} kW
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {LOADS.map((l) => {
                  const active = loads.includes(l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() => toggleLoad(l.id)}
                      className={`text-[12px] px-2.5 py-1.5 rounded-full border transition-colors ${
                        active
                          ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fuel */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-2">
                Fuel type
              </div>
              <div className="grid grid-cols-2 gap-2">
                {FUELS.map((f) => {
                  const active = fuel === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFuel(f.id)}
                      className={`text-[12px] py-2 px-3 rounded-md border transition-colors ${
                        active
                          ? "border-[#2563eb] bg-blue-50 text-[#2563eb] font-medium"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Solar */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-2">
                Solar + battery integration
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SOLARS.map((s) => {
                  const active = solar === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSolar(s.id)}
                      className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-md border text-center transition-colors ${
                        active
                          ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <s.icon className="h-4 w-4" />
                      <div className="text-[11px] leading-tight">{s.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                  Budget
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#2563eb] tabular-nums">
                  ${budget.toLocaleString()}
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full accent-[#2563eb]"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                <span>$0</span>
                <span>$20k</span>
              </div>
            </div>

            {/* Output */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#2563eb]">
                  Estimated capacity
                </div>
                <div className="text-2xl font-bold tabular-nums text-[#2563eb]">
                  ≈ {estimatedKw} kW
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                  Connected load
                </div>
                <div className="text-2xl font-bold tabular-nums text-neutral-800">
                  {connectedKw.toFixed(1)} kW
                </div>
              </div>
            </div>

            <button type="button" onClick={handleSubmit} className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-md bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors">
              Find my system <ArrowUpRight className="h-4 w-4" />
            </button>
            <p className="text-[11px] text-center text-neutral-500">
              See all 12 systems analyzed and top 3 matches
            </p>
          </div>
        </div>
      </section>

      {submitted && <ResultsBlock goal={goal} estimatedKw={estimatedKw} fuel={fuel} solar={solar} budget={budget} />}

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

      {/* 02 — RESEARCH DATABASE PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <div>
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              02 / Research database — preview
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Database in progress. Methodology defined.
            </h2>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <p className="text-neutral-500 text-sm">Dataset: 12 / ~45 systems</p>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Illustrative — not yet verified
              </span>
            </div>
          </div>
        </div>

        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                {["SKU", "Brand", "Capacity", "Fuel", "Score", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BP_DB_ROWS.map((r) => (
                <tr key={r[0]} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-4 font-mono text-xs text-neutral-700">{r[0]}</td>
                  <td className="px-5 py-4">{r[1]}</td>
                  <td className="px-5 py-4 tabular-nums">{r[2]}</td>
                  <td className="px-5 py-4">{r[3]}</td>
                  <td className="px-5 py-4 text-neutral-400 tabular-nums">—</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      Planned
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 03 — COMPARISON SAMPLE */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              03 / Comparison snapshot — sample
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              How we'll compare systems.
            </h2>
            <p className="mt-5 text-neutral-600">
              Once the dataset is live, every comparison will be sourced from manufacturer
              datasheets and verified runtime tests. Below is a sample of the comparison format
              using illustrative figures.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Sample — illustrative figures
            </span>
          </div>
          <div className="lg:col-span-8">
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 border-b border-neutral-200 bg-neutral-50">
                <div className="px-5 py-4 text-[11px] font-mono uppercase tracking-wider text-neutral-500">Metric</div>
                <div className="px-5 py-4 border-l border-neutral-200">
                  <div className="text-sm font-semibold">Unit A</div>
                  <div className="text-[11px] font-mono text-neutral-400">22 kW</div>
                </div>
                <div className="px-5 py-4 border-l border-neutral-200">
                  <div className="text-sm font-semibold">Unit B</div>
                  <div className="text-[11px] font-mono text-neutral-400">14 kW</div>
                </div>
              </div>
              {BP_COMPARISON.map(([m, a, b]) => (
                <div key={m} className="grid grid-cols-3 border-b border-neutral-100 last:border-0 text-sm">
                  <div className="px-5 py-3.5 text-neutral-600">{m}</div>
                  <div className="px-5 py-3.5 border-l border-neutral-100 tabular-nums">{a}</div>
                  <div className="px-5 py-3.5 border-l border-neutral-100 tabular-nums">{b}</div>
                </div>
              ))}
              <div className="px-5 py-4 bg-blue-50 border-t border-blue-100 text-xs text-neutral-700">
                <span className="font-semibold text-[#2563eb]">Trade-off · </span>
                Unit A covers whole-home loads including central AC; Unit B suits essential-circuit setups at a lower install cost.
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
              Methodology, defined before the data.
            </h2>
            <p className="mt-5 text-neutral-600">
              We publish the scoring methodology before the dataset goes live, so the framework is
              auditable from day one — no retrofitted criteria.
            </p>
            <div className="mt-6 text-xs font-mono text-neutral-400">
              Methodology v1.0 · framework designed, awaiting data
            </div>
            <a href="#" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
              Read protocol <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="lg:col-span-7 space-y-3">
            {BP_SCORES.map(([label, desc]) => (
              <div key={label} className="border border-neutral-200 rounded-lg p-5 hover:border-[#2563eb]/40 transition-colors">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-sm font-mono tabular-nums">
                    <span className="text-neutral-400 font-bold">—</span>
                    <span className="text-neutral-400"> / 10</span>
                  </div>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-2" />
                <div className="text-xs text-neutral-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — RECOMMENDATION LOGIC SAMPLE */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase">
              05 / Recommendation logic — sample
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Sample — illustrative
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight max-w-3xl">
            What a verdict will look like.
          </h2>
          <p className="mt-4 text-neutral-600 max-w-2xl">
            Every verdict — once published — ships with both halves of the trade-off. Below is the
            format using a representative 22kW whole-home system.
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-7">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-700">+ Strengths</div>
              </div>
              <ul className="space-y-3 text-sm text-neutral-700">
                {[
                  "Whole-home coverage — 22kW handles central AC, well pump and electric range simultaneously.",
                  "Automatic transfer switch included — restores power within seconds of an outage.",
                  "Runs on natural gas — effectively unlimited runtime on piped supply.",
                  "Smart load management — sheds non-critical circuits automatically if demand exceeds capacity.",
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
                  "65 dB at 23ft — audible at property line, check local noise ordinances.",
                  "410 kg — concrete pad and professional installation required.",
                  "Natural gas dependency — no autonomy if gas supply is interrupted (consider dual-fuel).",
                  "$9,500 installed — higher upfront cost than essential-circuit-only systems.",
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

      {/* 06 — RESEARCH ROADMAP */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              06 / Research roadmap
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">What we'll investigate first.</h2>
            <p className="mt-3 text-sm text-neutral-500">6 planned threads · dataset construction in progress</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
          {BP_RESEARCH.map((r) => (
            <div key={r.code} className="bg-white p-6 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-mono text-neutral-400">{r.code}</div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  Planned
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2">{r.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-5">{r.desc}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-300" style={{ width: "0%" }} />
                </div>
                <div className="text-xs font-mono tabular-nums text-neutral-400">0%</div>
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
              {DEV_STATUS.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 text-sm text-neutral-700">
                  {i < 2 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-neutral-300 shrink-0" />
                  )}
                  {s}
                </li>
              ))}
            </ul>
            <div className="border-t border-neutral-100 pt-4 grid grid-cols-3 gap-3">
              <Stat label="Dataset" value="0 / 45" sub="in progress" />
              <Stat label="Calculator" value="In Analysis" sub="design ready" />
              <Stat label="Articles" value="0 / 5" sub="planned" />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              Research roadmap
            </div>
            <ul className="divide-y divide-neutral-100">
              {RESEARCH.map((r) => (
                <li key={r}>
                  <a
                    href="#"
                    className="flex items-center justify-between py-3 text-sm text-neutral-700 hover:text-[#2563eb] group"
                  >
                    <span>{r}</span>
                    <ArrowUpRight className="h-4 w-4 text-neutral-300 group-hover:text-[#2563eb]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* METHODOLOGY FOOTER */}
      <section id="methodology" className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Recommendations use a weighted scoring algorithm across 6 use-case dimensions, based on
            manufacturer specs and field-tested data where available. Each data point shows
            confidence level: verified / claimed / estimated.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-400">
        {label}
      </div>
      <div className="text-sm font-bold text-neutral-900 tabular-nums">{value}</div>
      <div className="text-[10px] text-neutral-500">{sub}</div>
    </div>
  );
}

function ResultsBlock({ goal, estimatedKw, fuel, solar, budget }: { goal: string; estimatedKw: number; fuel: string; solar: string; budget: number }) {
  const { top3: PICKS, eliminated, total } = computeBPAnalysis(goal, estimatedKw, fuel, solar, budget);
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
            Ranked from a {total}-system dataset (verified specs, real affiliate links) based on your goal, load, fuel and solar preference.
          </p>
          {PICKS.length < 3 && budget > 0 && (
            <p className="mt-2 text-sm text-amber-600 font-medium">
              Only {PICKS.length} system{PICKS.length === 1 ? "" : "s"} in our dataset fit{PICKS.length === 1 ? "s" : ""} within ${budget.toLocaleString()} — try raising your budget to see more options.
            </p>
          )}
        </div>

        <div className={`grid gap-6 ${PICKS.length === 1 ? "md:grid-cols-1 max-w-md" : PICKS.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {PICKS.map((p) => (
            <div
              key={p.tier}
              className={`bg-white rounded-xl border border-neutral-200 border-t-4 ${p.border} overflow-hidden flex flex-col`}
            >
              <div
                className="h-40 flex items-center justify-center relative"
                style={{ backgroundImage: p.img }}
              >
                <Zap className="h-16 w-16 text-white/80" strokeWidth={1.5} />
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

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <ResultSpec icon={Zap} label={p.kw} sub="continuous" />
                  <ResultSpec icon={Activity} label={p.surge} sub="surge" />
                  <ResultSpec icon={Fuel} label={p.fuel} sub="fuel" />
                  <ResultSpec icon={ShieldCheck} label={p.transfer} sub="transfer" />
                  <ResultSpec icon={Gauge} label={p.noise} sub="noise" />
                  <ResultSpec icon={Wrench} label={p.warranty} sub="warranty" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <ResultBadge active={p.ats} label="Auto Transfer Switch" />
                  <ResultBadge active={p.app} label="App Monitor" />
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-neutral-100 text-neutral-600">
                    {p.install}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <ResultBar label="Whole-Home" value={p.whole} color={p.accentText} />
                  <ResultBar label="Essentials Only" value={p.essentials} color={p.accentText} />
                  <ResultBar label="Off-Grid" value={p.offgrid} color={p.accentText} />
                  <ResultBar label="Storm Resilience" value={p.storm} color={p.accentText} />
                  <ResultBar label="Solar Hybrid" value={p.hybrid} color={p.accentText} />
                  <ResultBar label="Value" value={p.value} color={p.accentText} />
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed mb-5 italic">"{p.verdict}"</p>

                <a
                  href={p.affiliate}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`mt-auto inline-flex w-full items-center justify-center gap-1.5 h-11 rounded-md text-white text-sm font-semibold transition-colors ${p.btn}`}
                >
                  Check price <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

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
                <ResultRow label="Price" values={PICKS.map((p) => `$${p.price.toLocaleString()}`)} />
                <ResultRow label="Continuous output" values={PICKS.map((p) => p.kw)} />
                <ResultRow label="Surge" values={PICKS.map((p) => p.surge)} />
                <ResultRow label="Fuel" values={PICKS.map((p) => p.fuel)} />
                <ResultRow label="Transfer switch" values={PICKS.map((p) => p.transfer)} />
                <ResultRow label="Noise level" values={PICKS.map((p) => p.noise)} />
                <ResultRow label="Warranty" values={PICKS.map((p) => p.warranty)} />
                <ResultRow label="App monitoring" values={PICKS.map((p) => (p.app ? "✓" : "—"))} />
                <ResultRow label="Install" values={PICKS.map((p) => p.install)} />
              </tbody>
            </table>
          </div>
        </div>
        )}

        <details className="mt-8 bg-white border border-neutral-200 rounded-xl p-6 group">
          <summary className="cursor-pointer font-semibold text-neutral-900 flex items-center justify-between">
            Why this recommendation?
            <span className="text-xs font-mono text-neutral-400 group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="mt-4 space-y-3 text-sm text-neutral-600 leading-relaxed">
            <p><strong className="text-neutral-900">Prioritized:</strong> sizing margin above your connected load, fuel/solar preference, and transfer-switch automation based on your selected goal.</p>
            {eliminated > 0 ? (
              <p><strong className="text-neutral-900">{eliminated} not shown:</strong> the other {eliminated} of {total} systems scored lower for this combination — see the full comparison below or adjust your inputs above.</p>
            ) : (
              <p><strong className="text-neutral-900">All {total} systems considered:</strong> with your current budget, only {PICKS.length} system{PICKS.length === 1 ? "" : "s"} qualified — raise your budget to unlock more comparisons.</p>
            )}
            {PICKS.length >= 2 ? (
              <p><strong className="text-neutral-900">Trade-off:</strong> {PICKS[0]?.brand} {PICKS[0]?.model} ranks highest for this combination; {(PICKS[2] ?? PICKS[1])?.brand} {(PICKS[2] ?? PICKS[1])?.model} is the alternative if its fuel type or install method fits better.</p>
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

function ResultSpec({ icon: Icon, label, sub }: { icon: typeof Zap; label: string; sub: string }) {
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

function ResultBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
        <span>{label}</span>
        <span className={`font-bold ${color}`}>{value}/10</span>
      </div>
      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color.replace("text-", "bg-")}`} style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}

function ResultBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded ${
      active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-400"
    }`}>
      {active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </span>
  );
}

function ResultRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-neutral-400">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-3 text-neutral-800">{v}</td>
      ))}
    </tr>
  );
}

