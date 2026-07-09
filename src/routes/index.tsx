import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Sun,
  Plug,
  BatteryCharging,
  Flame,
  FlaskConical,
  Database,
  GitCompare,
  
  CheckCircle2,
  XCircle,
  Search,
  ChevronRight,
  Home as HomeIcon,
  Tent,
  Building2,
  HeartPulse,
  Wallet,
  Caravan,
  Refrigerator,
  Wind,
  Tv,
  Microwave,
  Lightbulb,
  Laptop,
  Droplet,
  Thermometer,
  Wifi,
} from "lucide-react";
import logo from "@/assets/logo.png";
import SiteHeader from "@/components/SiteHeader";
import { EvCalcCard, BatteryCalcCard, BackupCalcCard } from "@/components/calculators/MiniCalculators";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClickDecisionLab — Real Specs. Real Decisions." },
      {
        name: "description",
        content:
          "Engineering-grade research, proprietary datasets and decision engines for solar generators, EV chargers, home batteries and backup power.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    calc: (["solar", "ev", "battery", "backup"].includes(s.calc as string)
      ? (s.calc as "solar" | "ev" | "battery" | "backup")
      : undefined),
  }),
  component: Home,
});


const BLUE = "#2563eb";

const NAV = ["Solar Lab", "Calculator", "Comparisons", "Database", "Methodology", "Research", "Blog"];

const SCENARIOS = [
  { id: "home", label: "Home Backup", icon: HomeIcon },
  { id: "rv", label: "RV & Camping", icon: Caravan },
  { id: "offgrid", label: "Off-Grid Living", icon: Tent },
  { id: "apt", label: "Apartment", icon: Building2 },
  { id: "med", label: "Medical Backup", icon: HeartPulse },
  { id: "value", label: "Value Pick", icon: Wallet },
];

const APPLIANCES = [
  { id: "fridge", label: "Refrigerator", icon: Refrigerator, w: 150 },
  { id: "cpap", label: "CPAP", icon: HeartPulse, w: 60 },
  { id: "laptop", label: "Laptop", icon: Laptop, w: 65 },
  { id: "lights", label: "Lights", icon: Lightbulb, w: 40 },
  { id: "tv", label: "TV", icon: Tv, w: 110 },
  { id: "micro", label: "Microwave", icon: Microwave, w: 1000 },
  { id: "heater", label: "Space Heater", icon: Thermometer, w: 1500 },
  { id: "well", label: "Well Pump", icon: Droplet, w: 800 },
  { id: "ac", label: "Window AC", icon: Wind, w: 1200 },
];

const RUNTIMES = [
  { id: "2h", label: "2 hours", h: 2 },
  { id: "8h", label: "8 hours", h: 8 },
  { id: "24h", label: "24 hours", h: 24 },
  { id: "multi", label: "Multi-day", h: 72 },
];


const LABS = [
  {
    icon: Sun,
    code: "LAB-01",
    title: "Solar Generators",
    desc: "Portable power stations scored for home backup, RV, off-grid & camping.",
    status: "Live",
    statusTone: "live",
    stat: "100",
    statLabel: "products",
    href: "/solar-calculator",
  },
  {
    icon: Plug,
    code: "LAB-02",
    title: "EV Chargers",
    desc: "Level 2 home chargers compared on speed, connector type & smart features.",
    status: "Live",
    statusTone: "live",
    stat: "49",
    statLabel: "chargers",
    href: "/ev-chargers",
  },
  {
    icon: BatteryCharging,
    code: "LAB-03",
    title: "Home Batteries",
    desc: "Whole-home battery storage — capacity, chemistry, inverter compatibility.",
    status: "In Analysis",
    statusTone: "analysis",
    stat: "32",
    statLabel: "systems",
    href: "/home-batteries",
  },
  {
    icon: Flame,
    code: "LAB-04",
    title: "Backup Power",
    desc: "Standby generators, transfer switches, fuel types & load management.",
    status: "Planned",
    statusTone: "planned",
    stat: "Q4",
    statLabel: "2026",
    href: "/backup-power",
  },
];


const DB_ROWS = [
  ["EcoFlow", "DELTA 3 Max Plus", "1,800 Wh", "6,000 W", 90, "Verified"],
  ["Bluetti", "AC500", "5,500 Wh", "10,000 W", 100, "Verified"],
  ["Jackery", "Explorer 1000 v2", "940 Wh", "3,000 W", 60, "Verified"],
  ["Anker SOLIX", "F3800", "3,400 Wh", "12,000 W", 100, "Verified"],
  ["Zendure", "SuperBase Pro 2000", "1,850 Wh", "4,000 W", 70, "Verified"],
  ["EcoFlow", "RIVER 3 Plus", "440 Wh", "1,200 W", 50, "Verified"],
] as const;

const COMPARISON = [
  ["Capacity", "2,048 Wh", "2,000 Wh"],
  ["Surge power", "4,800 W", "4,800 W"],
  ["Runtime (215 W load)", "13.4 h", "11.1 h"],
  ["Recharge to 80%", "65 min", "180 min"],
  ["UPS switchover", "20 ms", "—"],
  ["Cycle life @ 80%", "3,000", "3,500"],
  ["Weight", "23 kg", "27.5 kg"],
  ["Noise @ 1 m", "52 dB", "48 dB"],
];

const RESEARCH = [
  { code: "R-014", status: "In progress", title: "Real-world battery degradation", desc: "12-month tracking of LiFePO4 capacity loss under daily backup cycling.", progress: 72 },
  { code: "R-015", status: "Published", title: "Apartment backup simulations", desc: "215 W baseline × 6 unit sizes × 3 climate zones.", progress: 100 },
  { code: "R-016", status: "In progress", title: "240 V split-phase testing", desc: "Whole-home transfer switch behaviour under inductive surge.", progress: 38 },
  { code: "R-017", status: "Published", title: "Runtime consistency analysis", desc: "Variance of advertised vs measured runtime across 14 stations.", progress: 100 },
  { code: "R-018", status: "In progress", title: "Noise performance benchmarking", desc: "1 m dB readings under 200 / 600 / 1k / 1.5k W continuous load.", progress: 54 },
  { code: "R-019", status: "In progress", title: "Cold-temperature derating", desc: "Capacity behaviour at −10 °C / 0 °C / 10 °C ambient.", progress: 18 },
];

const SCORES = [
  ["Surge handling", 9.3, "Cold-start of 4 kW inductive loads"],
  ["Backup reliability", 8.9, "20 ms UPS · 0 dropouts in 96 h test"],
  ["Efficiency (round-trip)", 8.4, "94.1% AC-AC · inverter losses modelled"],
  ["Expandability", 8.2, "Stackable to 6,144 Wh · +400 W solar"],
  ["Portability", 6.8, "23 kg · single-handle carry"],
  ["Acoustic profile", 7.4, "52 dB @ 1 m under 1 kW load"],
] as const;

function Home() {
  const { calc } = Route.useSearch();
  const navigate = Route.useNavigate();
  const CALC_TABS = [
    { id: "solar" as const, label: "Solar", icon: Sun },
    { id: "ev" as const, label: "EV Charger", icon: Plug },
    { id: "battery" as const, label: "Battery", icon: BatteryCharging },
    { id: "backup" as const, label: "Backup", icon: Flame },
  ];
  return (

    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />

      {/* HERO */}
      <section className="relative bg-[#2563eb] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
             style={{ backgroundImage:
               "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
               backgroundSize: "44px 44px" }} />
        <div className="relative max-w-[1400px] mx-auto pl-4 pr-6 pt-8 pb-44 lg:pb-56 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-blue-100/90 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
              Solar Lab · Methodology v2.3 · Updated weekly
            </div>
            <h1 className="text-5xl lg:text-[64px] font-bold leading-[1.02] tracking-tight">
              Real specs.
              <br />
              Real decisions on{" "}
              <span className="text-blue-200">power hardware.</span>
            </h1>
            <p className="mt-6 text-lg text-blue-50/90 max-w-xl leading-relaxed">
              Engineering-grade research, proprietary runtime datasets and decision engines.
              No sponsored rankings. No editorial opinions. Every score is a weighted aggregate
              of measured properties.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="/solar-calculator"
                 className="inline-flex items-center gap-2 h-12 px-6 rounded-md bg-white text-[#2563eb] text-sm font-semibold hover:bg-blue-50">
                Find my system <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#methodology"
                 className="inline-flex items-center gap-2 h-12 px-5 text-sm font-semibold text-white/90 hover:text-white">
                Read methodology <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {[
                ["177", "Products tracked"],
                ["4", "Labs"],
                ["125", "Articles published"],
                ["0", "Sponsored rankings"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold tracking-tight">{n}</div>
                  <div className="text-xs text-blue-100/80 mt-1">{l}</div>
                </div>
              ))}
            </div>

          </div>

          {/* Hero calculator */}
          <div className="lg:col-span-5 lg:mt-3">
            <div className="grid grid-cols-4 gap-1 p-1 mb-3 rounded-lg bg-white/10 border border-white/15">
              {CALC_TABS.map((t) => {
                const active = calc === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => navigate({ search: { calc: t.id }, replace: true })}
                    className={`inline-flex items-center justify-center gap-1.5 py-2 rounded-md text-[11px] font-semibold transition-colors ${
                      active
                        ? "bg-white text-[#2563eb]"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
            {calc === "solar" && <HeroCalculator />}
            {calc === "ev" && <EvCalcCard />}
            {calc === "battery" && <BatteryCalcCard />}
            {calc === "backup" && <BackupCalcCard />}
          </div>
        </div>
      </section>



      {/* LAB SELECTOR */}
      <section className="relative bg-[#2563eb]">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
             style={{ backgroundImage:
               "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
               backgroundSize: "44px 44px" }} />
        <div className="max-w-7xl mx-auto px-6 -mt-24 lg:-mt-32 pb-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 lg:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#2563eb] mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
                  Explore our labs
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900">
                  4 decision engines. Same methodology.{" "}
                  <span className="text-[#2563eb]">Updated weekly.</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {LABS.map((l) => {
                const pill =
                  l.statusTone === "live"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : l.statusTone === "analysis"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-neutral-100 text-neutral-500 border-neutral-200";
                return (
                  <a
                    key={l.code}
                    href={l.href}
                    className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 hover:border-[#2563eb]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
                        <l.icon className="h-5 w-5 text-[#2563eb]" />
                      </div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border ${pill}`}>
                        {l.status}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono tracking-wider text-neutral-400 mb-1">{l.code}</div>
                    <h3 className="text-base font-bold text-neutral-900">{l.title}</h3>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold font-mono tabular-nums text-neutral-900">{l.stat}</span>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">{l.statLabel}</span>
                    </div>
                    <p className="mt-3 text-xs text-neutral-500 leading-relaxed flex-1">{l.desc}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2563eb]">
                      Open Lab
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>






      {/* TRUST BAR */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-y-3 gap-x-8 text-xs font-mono uppercase tracking-wider text-neutral-500">
          {["Real Data", "Surge Tested", "Updated Weekly", "No Sponsored Rankings", "Transparent Methodology"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2563eb]" />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* LIVE DATABASE */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <div>
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              02 / Live research database
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Active monitoring. Continuous analysis.
            </h2>
            <p className="mt-3 text-neutral-500 text-sm">Last sync: 2 hours ago</p>
          </div>
          <a href="/runtime-database" className="text-sm font-semibold text-[#2563eb] inline-flex items-center gap-1">
            View full database <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                {["Brand", "Model", "Capacity", "Surge", "Score", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DB_ROWS.map((r) => (
                <tr key={r[0] as string} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
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

      {/* COMPARISON */}
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
              runtime tests. We show winners — and we show trade-offs.
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
                  <div className="text-[11px] font-mono text-neutral-400">Reference · 2,048 Wh</div>
                </div>
                <div className="px-5 py-4 border-l border-neutral-200">
                  <div className="text-sm font-semibold">Unit B</div>
                  <div className="text-[11px] font-mono text-neutral-400">Reference · 2,000 Wh</div>
                </div>
              </div>
              {COMPARISON.map(([m, a, b], i) => {
                const winA = i === 2 || i === 3 || i === 4 || i === 6;
                const winB = i === 5 || i === 7;
                return (
                  <div key={m} className="grid grid-cols-3 border-b border-neutral-100 last:border-0 text-sm">
                    <div className="px-5 py-3.5 text-neutral-600">{m}</div>
                    <div className={`px-5 py-3.5 border-l border-neutral-100 tabular-nums ${winA ? "font-semibold text-[#2563eb]" : ""}`}>{a}</div>
                    <div className={`px-5 py-3.5 border-l border-neutral-100 tabular-nums ${winB ? "font-semibold text-[#2563eb]" : ""}`}>{b}</div>
                  </div>
                );
              })}
              <div className="px-5 py-4 bg-blue-50 border-t border-blue-100 text-xs text-neutral-700">
                <span className="font-semibold text-[#2563eb]">Trade-off · </span>
                Unit A wins on runtime, surge response and recharge. Unit B wins on cycle life and acoustic profile.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCORING */}
      <section id="methodology" className="max-w-7xl mx-auto px-6 py-24">
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
              Methodology v2.3 · 14-day rolling window
            </div>
            <a href="/methodology" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
              Read protocol <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="lg:col-span-7 space-y-3">
            {SCORES.map(([label, score, desc]) => (
              <div key={label} className="border border-neutral-200 rounded-lg p-5 hover:border-[#2563eb]/40 transition-colors">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-sm font-mono tabular-nums">
                    <span className="text-[#2563eb] font-bold">{score}</span>
                    <span className="text-neutral-400"> / 10</span>
                  </div>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#2563eb]" style={{ width: `${(score as number) * 10}%` }} />
                </div>
                <div className="text-xs text-neutral-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY / LIMITATIONS */}
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
                  "Strong surge handling — handles 4,800 W inductive cold-start.",
                  "Stable UPS performance — 20 ms switchover, zero dropouts in 96 h test.",
                  "Modular expansion path — stacks to 6,144 Wh with a second battery.",
                  "Fast recharge — 65 min to 80% from AC.",
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
                  "Oversized for studio apartments under 35 m².",
                  "Acoustically noticeable above 1 kW sustained load (52 dB).",
                  "Locked into single-vendor ecosystem — no third-party battery compatibility.",
                  "23 kg — not a true grab-and-go unit.",
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

      {/* CURRENT RESEARCH */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
              06 / Current research
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Continuously evolving.</h2>
            <p className="mt-3 text-sm text-neutral-500">6 active threads · monitoring 104 products</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
          {RESEARCH.map((r) => (
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
      </section>

      {/* METHODOLOGY STEPS */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="text-xs font-mono text-blue-300 tracking-[0.18em] uppercase mb-3">
                07 / Methodology
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                How recommendations are made.
              </h2>
              <p className="mt-5 text-neutral-400">
                We publish our scoring weights and testing methodology so every verdict is auditable.
                No paid rankings. No hidden criteria.
              </p>
              <div className="mt-6 text-xs font-mono text-neutral-500">
                Methodology v2.3 · Changelog public
              </div>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
              {[
                ["M.01", "Spec extraction", "Verified manufacturer datasheets cross-referenced with third-party teardowns and independent runtime tests."],
                ["M.02", "Weighted scoring", "Each metric carries a transparent weight based on scenario — runtime, surge, expandability, efficiency, noise, UPS."],
                ["M.03", "Trade-off analysis", "Every recommendation states what the product does NOT do well, and who should not buy it."],
                ["M.04", "Real-world conditions", "Cold temperatures, inverter losses, real appliance draw — modelled, not assumed."],
              ].map(([n, t, d]) => (
                <div key={n} className="border border-white/10 rounded-lg p-6">
                  <div className="text-xs font-mono text-blue-300 mb-3">{n}</div>
                  <h4 className="font-semibold mb-2">{t}</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
          08 / Philosophy
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight max-w-3xl">
          Built to reduce buying mistakes.
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            ["P.01", "We publish limitations", "Every recommendation explains who should not buy the product. No exceptions."],
            ["P.02", "Trade-offs over hype", "There is no universal best. We show the scenarios each product wins — and loses."],
            ["P.03", "Advisory, not transactional", "We earn only when you buy. Brands cannot pay to rank. CTAs respect your autonomy."],
          ].map(([n, t, d]) => (
            <div key={n}>
              <div className="text-xs font-mono text-neutral-400 mb-3">{n}</div>
              <h3 className="text-lg font-semibold mb-2">{t}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <div className="text-xs font-mono text-blue-200 tracking-[0.18em] uppercase mb-3">
              09 · Start here
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl">
              Engineering-grade recommendations. Open the lab.
            </h2>
            <p className="mt-4 text-blue-50/90 max-w-xl">
              Solar Lab is live. Battery, EV Charger and Backup Power labs are in active research.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/solar-calculator"
               className="inline-flex items-center gap-2 h-12 px-6 rounded-md bg-white text-[#2563eb] text-sm font-semibold hover:bg-blue-50">
              Open Solar Lab <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="#methodology"
               className="inline-flex items-center gap-2 h-12 px-6 rounded-md border border-white/30 text-sm font-semibold hover:bg-white/10">
              Read methodology
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-1">
            <img src={logo} alt="ClickDecisionLab" className="h-12 w-auto mb-4" />
            <p className="text-xs text-neutral-500 leading-relaxed">
              Independent technical research platform. Real specs. Real decisions.
            </p>
          </div>
          {[
            ["Labs", [["Solar Generators","/solar-calculator"], ["Home Batteries","/home-batteries"], ["EV Chargers","/ev-chargers"], ["Backup Power","/backup-power"]]],
            ["Research", [["Live database","/runtime-database"], ["Comparisons","/comparisons"], ["Technical Analysis","/technical-analysis"], ["Methodology","/methodology"]]],
            ["Platform", [["Blog","/blog"], ["Contact","mailto:hello@clickdecisionlab.com"]]],
          ].map(([h, items]) => (
            <div key={h as string}>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">{h}</div>
              <ul className="space-y-2">
                {(items as [string, string][]).map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-neutral-600 hover:text-[#2563eb]">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-neutral-500">
            <span>© {new Date().getFullYear()} ClickDecisionLab</span>
            <span className="font-mono">Methodology v2.3 · Updated weekly</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroCalculator() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState("home");
  const [appliances, setAppliances] = useState<string[]>(["fridge", "lights", "laptop"]);
  const [runtime, setRuntime] = useState("8h");
  const [budget, setBudget] = useState(2000);
  const [solar, setSolar] = useState(true);

  const totalWatts = useMemo(
    () => APPLIANCES.filter((a) => appliances.includes(a.id)).reduce((s, a) => s + a.w, 0),
    [appliances],
  );
  const rt = RUNTIMES.find((r) => r.id === runtime)!;
  const whNeeded = totalWatts * rt.h;

  const toggle = (id: string) =>
    setAppliances((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const goToLab = () =>
    navigate({
      to: "/solar-calculator",
      search: {
        scenario,
        appliances: appliances.join(","),
        runtime,
        solar: solar ? "1" : "0",
        budget,
      },
    });



  return (
    <div className="bg-white text-neutral-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 bg-neutral-50">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Solar Generator Calculator
        </div>
        <span className="text-[11px] font-mono text-neutral-400">104 products · weekly</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Scenario */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
            Scenario
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {SCENARIOS.map((s) => {
              const active = scenario === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md border text-[10px] font-medium transition-colors ${
                    active
                      ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                  <span className="leading-tight text-center">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Appliances */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Appliances · {totalWatts} W
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {APPLIANCES.map((a) => {
              const active = appliances.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] transition-colors ${
                    active
                      ? "border-[#2563eb] bg-[#2563eb] text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <a.icon className="h-3 w-3" />
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Runtime + Solar */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
              Runtime
            </div>
            <div className="grid grid-cols-2 gap-1">
              {RUNTIMES.map((r) => {
                const active = runtime === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRuntime(r.id)}
                    className={`py-1.5 rounded-md text-[11px] font-medium border transition-colors ${
                      active
                        ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
              Solar recharging
            </div>
            <div className="flex gap-1">
              {[
                { id: true, label: "Yes" },
                { id: false, label: "No" },
              ].map((o) => {
                const active = solar === o.id;
                return (
                  <button
                    key={String(o.id)}
                    onClick={() => setSolar(o.id)}
                    className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md text-[11px] font-medium border transition-colors ${
                      active
                        ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    {o.id ? <Sun className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Budget */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Budget
            </div>
            <div className="text-xs font-semibold text-neutral-900">${budget.toLocaleString()}</div>
          </div>
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-[#2563eb]"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
            <span>$0</span><span>$2.5k</span><span>$5k</span>
          </div>
        </div>

        {/* Summary + CTA */}
        <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Estimated need
              </div>
              <div className="text-lg font-bold tabular-nums text-neutral-900">
                ≈ {whNeeded.toLocaleString()} <span className="text-xs font-mono text-neutral-500">Wh</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Load
              </div>
              <div className="text-lg font-bold tabular-nums text-neutral-900">
                {totalWatts} <span className="text-xs font-mono text-neutral-500">W</span>
              </div>
            </div>
          </div>
          <button
            onClick={goToLab}
            className="inline-flex w-full items-center justify-center gap-1.5 h-11 rounded-md bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8]"
          >
            Find my system <ArrowUpRight className="h-4 w-4" />
          </button>
          <p className="mt-2 text-[10px] text-center text-neutral-500">
            See all 104 products analyzed and top 3 matches
          </p>
        </div>
      </div>
    </div>
  );
}

