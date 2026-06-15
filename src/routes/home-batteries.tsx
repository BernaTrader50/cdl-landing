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

const PICKS = [
  {
    tier: "Top Match",
    accentText: "text-[#2563eb]",
    border: "border-t-[#2563eb]",
    btn: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    img: "linear-gradient(135deg, #dbeafe, #93c5fd)",
    brand: "Tesla",
    model: "Powerwall 3",
    price: 9700,
    score: 9.5,
    kwh: "13.5 kWh",
    kw: "11.5 kW",
    surge: "30 kW",
    chem: "LFP",
    warranty: "10 yr",
    cycles: "6,000",
    backup: 9.6,
    solar: 9.5,
    value: 8.8,
    scale: 9.0,
    offgrid: 8.4,
    smart: 9.5,
    ev: true,
    app: true,
    install: "Professional",
    verdict: "Best all-around: integrated inverter, strong surge, top-tier app and solar pairing.",
    affiliate: "https://www.amazon.com/s?k=Tesla%20Powerwall%203&tag=clickdecision-20",
  },
  {
    tier: "#2 Match",
    accentText: "text-emerald-600",
    border: "border-t-emerald-500",
    btn: "bg-emerald-500 hover:bg-emerald-600",
    img: "linear-gradient(135deg, #d1fae5, #6ee7b7)",
    brand: "Enphase",
    model: "IQ Battery 10C",
    price: 8200,
    score: 9.1,
    kwh: "10.08 kWh",
    kw: "7.68 kW",
    surge: "10 kW",
    chem: "LFP",
    warranty: "15 yr",
    cycles: "6,000",
    backup: 8.7,
    solar: 9.4,
    value: 9.0,
    scale: 9.6,
    offgrid: 8.0,
    smart: 9.2,
    ev: true,
    app: true,
    install: "Professional",
    verdict: "Modular and microinverter-native — easiest to scale 10 → 40 kWh over time.",
    affiliate: "https://www.amazon.com/s?k=Enphase%20IQ%20Battery%2010C&tag=clickdecision-20",
  },
  {
    tier: "#3 Match",
    accentText: "text-violet-600",
    border: "border-t-violet-500",
    btn: "bg-violet-500 hover:bg-violet-600",
    img: "linear-gradient(135deg, #ede9fe, #c4b5fd)",
    brand: "EcoFlow",
    model: "DELTA Pro Ultra",
    price: 5800,
    score: 8.6,
    kwh: "6 kWh / stackable",
    kw: "7.2 kW",
    surge: "14.4 kW",
    chem: "LFP",
    warranty: "5 yr",
    cycles: "3,500",
    backup: 8.8,
    solar: 8.4,
    value: 9.4,
    scale: 8.6,
    offgrid: 9.2,
    smart: 8.7,
    ev: false,
    app: true,
    install: "DIY / Both",
    verdict: "Best DIY route — portable, stackable to 90 kWh, no electrician required to start.",
    affiliate: "https://www.amazon.com/s?k=EcoFlow%20DELTA%20Pro%20Ultra&tag=clickdecision-20",
  },
];

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
  "Product database — 32 systems in research",
  "Specs verification in progress (32 systems)",
  "Decision engine — illustrative preview live",
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
  const [submitted, setSubmitted] = useState(hasParams);

  useEffect(() => {
    if (hasParams) {
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
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
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-amber-200 bg-amber-500/15 border border-amber-300/30 rounded-full px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
              In Analysis
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-blue-100 bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
              32 systems · dataset in progress
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

          {/* CTA */}
          <div className="border-t border-neutral-100 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-neutral-600">
              Matching against <span className="font-bold text-neutral-900">32 systems</span> across 10 brands.
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


      {submitted && <ResultsBlock />}

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
          <a href="#" className="text-sm font-semibold text-[#2563eb] inline-flex items-center gap-1">
            View full database <ArrowUpRight className="h-4 w-4" />
          </a>
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
            <a href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
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
            <a href="#" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
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
            <p className="mt-3 text-sm text-neutral-500">6 active threads · monitoring 32 systems</p>
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
                  <a href="#" className="flex items-center justify-between py-3 text-sm text-neutral-700 hover:text-[#2563eb] group">
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

function ResultsBlock() {
  return (
    <section id="results" className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
            Decision engine output
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Your top 3 matches</h2>
          <p className="mt-2 text-sm text-amber-600 font-medium">
            Illustrative example based on publicly available specs — our 32-system verified scoring engine is in progress
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PICKS.map((p) => (
            <div
              key={p.tier}
              className={`bg-white rounded-xl border border-neutral-200 border-t-4 ${p.border} overflow-hidden flex flex-col`}
            >
              {/* Product image placeholder */}
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
                    <div className="text-[10px] font-mono text-neutral-400">match {p.score}</div>
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
                  className={`mt-auto inline-flex w-full items-center justify-center gap-1.5 h-11 rounded-md text-white text-sm font-semibold transition-colors ${p.btn}`}
                >
                  Check price <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-12 bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h3 className="text-lg font-bold">Side-by-side comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
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

        {/* Why panel */}
        <details className="mt-8 bg-white border border-neutral-200 rounded-xl p-6 group">
          <summary className="cursor-pointer font-semibold text-neutral-900 flex items-center justify-between">
            Why this recommendation?
            <span className="text-xs font-mono text-neutral-400 group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="mt-4 space-y-3 text-sm text-neutral-600 leading-relaxed">
            <p><strong className="text-neutral-900">Prioritized:</strong> backup resilience, solar pairing, and smart-home integration based on your selected goal.</p>
            <p><strong className="text-neutral-900">8 eliminated:</strong> capacity below your home's typical daily usage; 4 more excluded for incompatible inverter pairing.</p>
            <p><strong className="text-neutral-900">Trade-off:</strong> Powerwall 3 scores highest overall but the DELTA Pro Ultra wins on value if DIY is acceptable.</p>
          </div>
        </details>

        <p className="mt-8 text-[11px] font-mono text-neutral-400 text-center">
          We earn a commission if you purchase — this does not affect our analysis.
        </p>
      </div>
    </section>
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
