import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Sun,
  XCircle,
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
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { SiteFooter } from "@/components/site-footer";
import {
  PRODUCTS,
  LABEL_COLORS,
  computeAnalysis,
  AnalysisHeader,
  EliminatedPanel,
  ComparisonTable,
  ResultCard,
  type AnalysisResult,
} from "@/components/solar-calculator";

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
  validateSearch: (s: Record<string, unknown>) => ({
    scenario: typeof s.scenario === "string" ? s.scenario : undefined,
    appliances: typeof s.appliances === "string" ? s.appliances : undefined,
    runtime: typeof s.runtime === "string" ? s.runtime : undefined,
    solar: typeof s.solar === "string" ? s.solar : undefined,
    budget: s.budget != null ? Number(s.budget) : undefined,
  }),
  component: SolarCalculatorPage,
});

const SCENARIOS = [
  { id: "home", label: "Home Backup", icon: HomeIcon },
  { id: "rv", label: "RV & Camping", icon: Caravan },
  { id: "offgrid", label: "Off-Grid Living", icon: Tent },
  { id: "apt", label: "Apartment", icon: Building2 },
  { id: "med", label: "Medical Backup", icon: HeartPulse },
  { id: "value", label: "Value Pick", icon: Wallet },
];

// scoreKey in PRODUCTS[].scores + human label used in verdict copy
const SCENARIO_MAP: Record<string, { scoreKey: "home_backup" | "rv" | "camping" | "off_grid" | "apartment" | "medical" | "value"; label: string }> = {
  home:    { scoreKey: "home_backup", label: "home backup" },
  rv:      { scoreKey: "rv",          label: "RV & camping" },
  offgrid: { scoreKey: "off_grid",    label: "off-grid living" },
  apt:     { scoreKey: "apartment",   label: "apartment use" },
  med:     { scoreKey: "medical",     label: "medical backup" },
  value:   { scoreKey: "value",       label: "value-focused use" },
};

// wattage (continuous) + surge (startup) per appliance
const APPLIANCES = [
  { id: "fridge", label: "Refrigerator", icon: Refrigerator, w: 150,  surge: 1200 },
  { id: "cpap",   label: "CPAP",         icon: HeartPulse,   w: 60,   surge: 300  },
  { id: "laptop", label: "Laptop",       icon: Laptop,       w: 65,   surge: 100  },
  { id: "lights", label: "Lights",       icon: Lightbulb,    w: 40,   surge: 200  },
  { id: "tv",     label: "TV",           icon: Tv,           w: 110,  surge: 200  },
  { id: "micro",  label: "Microwave",    icon: Microwave,    w: 1000, surge: 1200 },
  { id: "heater", label: "Space Heater", icon: Thermometer,  w: 1500, surge: 1500 },
  { id: "well",   label: "Well Pump",    icon: Droplet,      w: 800,  surge: 2600 },
  { id: "ac",     label: "Window AC",    icon: Wind,         w: 1200, surge: 3600 },
];
const NEEDS_UPS_APPLIANCES = new Set(["cpap"]);

const RUNTIMES = [
  { id: "2h", label: "2 hours", h: 2 },
  { id: "8h", label: "8 hours", h: 8 },
  { id: "24h", label: "24 hours", h: 24 },
  { id: "multi", label: "Multi-day", h: 72 },
];

function SolarCalculatorPage() {
  const sp = Route.useSearch();
  const hasParams =
    sp.scenario !== undefined ||
    sp.appliances !== undefined ||
    sp.runtime !== undefined ||
    sp.solar !== undefined ||
    sp.budget !== undefined;

  const [scenario, setScenario] = useState(sp.scenario ?? "home");
  const [appliances, setAppliances] = useState<string[]>(
    sp.appliances !== undefined ? sp.appliances.split(",").filter(Boolean) : ["fridge", "lights", "laptop"],
  );
  const [runtime, setRuntime] = useState(sp.runtime ?? "8h");
  const [budget, setBudget] = useState<number>(sp.budget ?? 2000);
  const [solar, setSolar] = useState<boolean>(sp.solar !== undefined ? sp.solar !== "0" : true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const totalWatts = useMemo(
    () => APPLIANCES.filter((a) => appliances.includes(a.id)).reduce((s, a) => s + a.w, 0),
    [appliances],
  );
  const rt = RUNTIMES.find((r) => r.id === runtime)!;
  const whNeeded = totalWatts * rt.h;

  const toggle = (id: string) =>
    setAppliances((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const runAnalysis = React.useCallback(() => {
    const sc = SCENARIO_MAP[scenario] ?? SCENARIO_MAP.home;
    const selected = APPLIANCES.filter((a) => appliances.includes(a.id));
    const requiredWh = Math.max(1, Math.round(totalWatts * rt.h * 1.25));
    const requiredSurge = Math.max(0, ...selected.map((a) => a.surge));
    const needsUps = selected.some((a) => NEEDS_UPS_APPLIANCES.has(a.id)) || scenario === "med";
    const applianceLabel =
      selected.length === 0
        ? "your essential loads"
        : selected.length === 1
        ? selected[0].label.toLowerCase()
        : selected.slice(0, -1).map((a) => a.label.toLowerCase()).join(", ") + " and " + selected[selected.length - 1].label.toLowerCase();

    if (typeof window !== "undefined" && (window as any).cdlTrack) {
      (window as any).cdlTrack("calculator_submit", { scenario, appliances: appliances.join(","), runtime, budget, solar });
    }

    return computeAnalysis(sc.scoreKey, sc.label, requiredWh, requiredSurge, needsUps, budget, applianceLabel, solar);
  }, [scenario, appliances, totalWatts, rt, budget, solar]);

  React.useEffect(() => {
    if (hasParams) {
      const analysis = runAnalysis();
      setResult(analysis);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const analysis = runAnalysis();
      setResult(analysis);
      setAnalyzing(false);
      if (typeof window !== "undefined" && (window as any).cdlTrack) {
        (window as any).cdlTrack("result_view", {
          scenario,
          products_matched: analysis.picks.length,
          products_eliminated: analysis.eliminations.reduce((s, e) => s + e.count, 0),
          top_recommendation: analysis.picks[0] ? `${analysis.picks[0].product.brand} ${analysis.picks[0].product.model}` : "none",
        });
      }
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }, 480);
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
          <div className="text-xs font-mono text-blue-100 tracking-[0.18em] uppercase mb-3">
            Decision engine · v2.3
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Solar Generator Calculator
          </h1>
          <p className="mt-4 text-blue-50/90 max-w-2xl mx-auto">
            Answer a few questions about your power needs. We match you to the right solar generator
            using engineering-grade scoring across {PRODUCTS.length} products.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-blue-50 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            {PRODUCTS.length} products · 20 brands · Updated weekly
          </div>
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
          {/* Scenario */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
              1 · Your scenario
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCENARIOS.map((s) => {
                const active = scenario === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setScenario(s.id)}
                    className={`flex items-center gap-2 py-3 px-3 rounded-md border text-sm font-medium transition-colors ${
                      active
                        ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <s.icon className="h-4 w-4" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appliances */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                2 · Appliances
              </div>
              <div className="text-xs font-mono text-neutral-600">Total: {totalWatts} W</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {APPLIANCES.map((a) => {
                const active = appliances.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggle(a.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm transition-colors ${
                      active
                        ? "border-[#2563eb] bg-[#2563eb] text-white"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <a.icon className="h-3.5 w-3.5" />
                    {a.label}
                    <span className={`text-[10px] font-mono ${active ? "text-blue-100" : "text-neutral-400"}`}>
                      {a.w}W
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Runtime + Solar */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
                3 · Runtime required
              </div>
              <div className="grid grid-cols-2 gap-2">
                {RUNTIMES.map((r) => {
                  const active = runtime === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRuntime(r.id)}
                      className={`py-2.5 rounded-md text-sm font-medium border transition-colors ${
                        active
                          ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
                4 · Solar recharging
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: true, label: "Yes", icon: Sun },
                  { id: false, label: "No", icon: XCircle },
                ].map((o) => {
                  const active = solar === o.id;
                  return (
                    <button
                      key={String(o.id)}
                      onClick={() => setSolar(o.id)}
                      className={`inline-flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-medium border transition-colors ${
                        active
                          ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <o.icon className="h-4 w-4" />
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                5 · Budget
              </div>
              <div className="text-sm font-bold text-[#2563eb]">${budget.toLocaleString()}</div>
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
          <div className="border-t border-neutral-100 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-neutral-600">
              Estimated energy needed: <span className="font-bold text-neutral-900 tabular-nums">{whNeeded.toLocaleString()} Wh</span>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={analyzing}
              className="group inline-flex items-center gap-2 h-12 px-7 rounded-md bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors disabled:opacity-70"
            >
              {analyzing ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing {PRODUCTS.length} products…
                </>
              ) : (
                <>
                  Find my system <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
        </div>
      </section>

      {result && (
        <section id="results" className="bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="mb-8">
              <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
                Decision engine output
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Your matched systems</h2>
            </div>

            <AnalysisHeader result={result} />

            {result.outOfBudget && (
              <p className="mb-4 text-[12.5px] text-neutral-500 text-center">
                No products matched all criteria within budget — showing closest alternatives.
              </p>
            )}

            <EliminatedPanel eliminated={result.eliminatedProducts} />

            <ComparisonTable
              picks={result.picks}
              requiredWh={result.requiredWh}
              requiredSurge={result.requiredSurge}
              needsUps={result.needsUps}
              scoreKey={result.scoreKey}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {result.picks.map((pick, i) => (
                <div key={pick.product.model + i} style={{ animationDelay: `${i * 120}ms` }}>
                  <ResultCard
                    pick={pick}
                    accentColor={LABEL_COLORS[pick.label] || "#2563EB"}
                    scoreKey={result.scoreKey}
                  />
                </div>
              ))}
            </div>

            <p className="mt-8 text-[11px] font-mono text-neutral-400 text-center leading-relaxed">
              {PRODUCTS.length} products analyzed · {result.eliminations.reduce((s, e) => s + e.count, 0)} eliminated · {result.picks.length} matched ·{" "}
              <a href="/methodology" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">Methodology</a>
              {" · "}
              <a href="/technical-analysis" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">Technical Analysis</a>
              {" · "}
              <a href="/comparisons" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">Comparisons</a>
              {" "}· We earn a commission if you purchase — this does not affect our analysis.
            </p>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
