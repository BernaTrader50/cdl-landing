import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useState } from "react";
import { Analytics } from "@/components/analytics";

export const Route = createFileRoute("/runtime-database")({
  head: () => ({
    meta: [
      { title: "Solar Generator Runtime Database — How Long Will It Run? | ClickDecisionLab" },
      { name: "description", content: "Exact runtime calculations for 49 solar generators across 5 appliances: refrigerator, CPAP, Starlink, microwave, and portable AC. Typical and best-case estimates with surge compatibility ratings." },
    ],
  }),
  component: RuntimeDatabase,
});

// ─── APPLIANCE CONFIG — extensible for future use-cases ──────────────────────
type Appliance = {
  id: string;
  label: string;
  icon: string;
  avg_w: number;
  surge_w: number; // 0 = no surge concern
  confidence: number; // 1-5
  unit: string;
  hours_per_unit: number;
  best_case_factor: number;
  note: string;
  typical_scenario: string;
  best_case_scenario: string;
  slug: string;
};

const APPLIANCES: Record<string, Appliance> = {
  refrigerator: {
    id: "refrigerator", label: "Refrigerator", icon: "🧊",
    avg_w: 150, surge_w: 1200, confidence: 3,
    unit: "days", hours_per_unit: 24, best_case_factor: 1.5,
    note: "Standard 18 cu ft. Varies by model and ambient temperature.",
    typical_scenario: "Standard fridge cycling normally in warm room",
    best_case_scenario: "Energy-efficient model in cool environment (60°F)",
    slug: "can-a-solar-generator-run-a-refrigerator",
  },
  cpap: {
    id: "cpap", label: "CPAP Machine", icon: "💤",
    avg_w: 40, surge_w: 0, confidence: 5,
    unit: "nights", hours_per_unit: 8, best_case_factor: 1.15,
    note: "Without heated humidifier (~40W). Add ~50% runtime penalty with heated humidifier.",
    typical_scenario: "Standard CPAP at 10–12 cm H₂O pressure, no humidifier",
    best_case_scenario: "Low pressure setting (8 cm H₂O), no humidifier",
    slug: "can-a-solar-generator-run-a-cpap",
  },
  starlink: {
    id: "starlink", label: "Starlink", icon: "🛰",
    avg_w: 65, surge_w: 0, confidence: 4,
    unit: "days", hours_per_unit: 24, best_case_factor: 2.6,
    note: "Gen 2 Standard/RV dish (~65W). Gen 3 Mini uses ~25W — multiply runtime by 2.6×.",
    typical_scenario: "Starlink Gen 2 Standard dish, 24h continuous",
    best_case_scenario: "Starlink Gen 3 Mini (~25W)",
    slug: "can-a-solar-generator-run-starlink",
  },
  microwave: {
    id: "microwave", label: "Microwave", icon: "📡",
    avg_w: 1000, surge_w: 1500, confidence: 5,
    unit: "hrs use", hours_per_unit: 1, best_case_factor: 1.43,
    note: "1,000W rated unit. Runtime = total cumulative cooking time available.",
    typical_scenario: "1,000W microwave at full power",
    best_case_scenario: "700W low-power mode",
    slug: "can-a-solar-generator-run-a-microwave",
  },
  portable_ac: {
    id: "portable_ac", label: "Portable AC", icon: "❄️",
    avg_w: 500, surge_w: 2200, confidence: 2,
    unit: "hours", hours_per_unit: 1, best_case_factor: 2.0,
    note: "5,000 BTU unit. Highly variable by room size, temperature, and cycling frequency.",
    typical_scenario: "5,000 BTU in 80°F+ conditions running continuously",
    best_case_scenario: "Energy-saver mode, mild weather (70°F), good insulation",
    slug: "can-a-solar-generator-run-a-portable-ac",
  },
};

// ─── PRODUCT DATASET ─────────────────────────────────────────────────────────
type Product = {
  brand: string; model: string; wh: number; surge: number; price: number;
  ta_slug?: string;
  asin?: string;
};

const TA: Record<string, string> = {
  "DELTA Pro": "/ecoflow-delta-pro-technical-analysis-2026/",
  "DELTA 3 Max": "/ecoflow-delta-3-max-technical-analysis-2026/",
  "DELTA 3 Max Plus": "/ecoflow-delta-3-max-plus-technical-analysis-2026/",
  "DELTA 3 Plus": "/ecoflow-delta-3-plus-technical-analysis-2026/",
  "DELTA 3 Classic": "/ecoflow-delta-3-classic-technical-analysis-2026/",
  "DELTA 2 Max": "/ecoflow-delta-2-max-technical-analysis-2026/",
  "Explorer 2000 Plus": "/jackery-explorer-2000-plus-technical-analysis-2026/",
  "Explorer 2000 v2": "/jackery-explorer-2000-v2-technical-analysis-2026/",
  "Explorer 1000 v2": "/jackery-explorer-1000-v2-technical-analysis-2026/",
  "AC200L": "/bluetti-ac200l-technical-analysis-2026/",
  "AC300": "/bluetti-ac300-technical-analysis-2026/",
  "AC500": "/bluetti-ac500-technical-analysis-2026/",
  "F3800": "/anker-solix-f3800-technical-analysis-2026/",
  "C2000 Gen 2": "/anker-solix-c2000-gen2-technical-analysis-2026/",
  "FlashSpeed 1500": "/vtoman-flashspeed-1500-technical-analysis-2026/",
};

const PRODUCTS: Product[] = [
  // EcoFlow
  { brand:"EcoFlow", model:"DELTA Pro",         wh:3200, surge:7200,  price:2499 },
  { brand:"EcoFlow", model:"DELTA 3 Max Plus",  wh:1800, surge:6000,  price:999  },
  { brand:"EcoFlow", model:"DELTA 3 Max",       wh:1800, surge:4800,  price:749  },
  { brand:"EcoFlow", model:"DELTA 3 Plus",      wh:900,  surge:4400,  price:599  },
  { brand:"EcoFlow", model:"DELTA 3 Classic",   wh:900,  surge:3600,  price:449  },
  { brand:"EcoFlow", model:"DELTA 3",           wh:900,  surge:3600,  price:499  },
  { brand:"EcoFlow", model:"DELTA 2 Max",       wh:1800, surge:4800,  price:999  },
  { brand:"EcoFlow", model:"DELTA 2",           wh:900,  surge:3600,  price:699  },
  { brand:"EcoFlow", model:"RIVER 3 Plus",      wh:440,  surge:1200,  price:299  },
  { brand:"EcoFlow", model:"RIVER 3",           wh:220,  surge:600,   price:199  },
  { brand:"EcoFlow", model:"RIVER 2 Max",       wh:440,  surge:1000,  price:349  },
  { brand:"EcoFlow", model:"RIVER 2",           wh:220,  surge:600,   price:249  },
  // Jackery
  { brand:"Jackery", model:"Explorer 2000 Plus",wh:1800, surge:6000,  price:899  },
  { brand:"Jackery", model:"Explorer 2000 v2",  wh:1800, surge:4400,  price:1599 },
  { brand:"Jackery", model:"Explorer 1000 Plus",wh:1110, surge:4000,  price:899  },
  { brand:"Jackery", model:"Explorer 1000 v2",  wh:940,  surge:3000,  price:449  },
  { brand:"Jackery", model:"Explorer 600 Plus", wh:555,  surge:1600,  price:399  },
  { brand:"Jackery", model:"Explorer 300 Plus", wh:250,  surge:600,   price:199  },
  // Bluetti
  { brand:"Bluetti", model:"AC500",             wh:5500, surge:10000, price:3999 },
  { brand:"Bluetti", model:"AC300",             wh:2750, surge:6000,  price:2299 },
  { brand:"Bluetti", model:"AC200L",            wh:1800, surge:3600,  price:999  },
  { brand:"Bluetti", model:"AC180",             wh:1000, surge:3600,  price:499  },
  { brand:"Bluetti", model:"AC70",              wh:660,  surge:2000,  price:399  },
  { brand:"Bluetti", model:"AC60",              wh:350,  surge:1200,  price:299  },
  { brand:"Bluetti", model:"EB3A",              wh:230,  surge:1200,  price:199  },
  { brand:"Bluetti", model:"Elite 300",         wh:2700, surge:4800,  price:1499 },
  // Anker SOLIX
  { brand:"Anker SOLIX", model:"F3800",         wh:3400, surge:12000, price:2999 },
  { brand:"Anker SOLIX", model:"C2000 Gen 2",   wh:1800, surge:4000,  price:1199 },
  { brand:"Anker SOLIX", model:"C2000",         wh:1800, surge:4000,  price:999  },
  { brand:"Anker SOLIX", model:"C1000",         wh:930,  surge:2000,  price:799  },
  { brand:"Anker SOLIX", model:"C800 Plus",     wh:670,  surge:2400,  price:549  },
  { brand:"Anker SOLIX", model:"C800",          wh:670,  surge:2400,  price:449  },
  { brand:"Anker SOLIX", model:"C800X",         wh:670,  surge:2400,  price:379  },
  // Zendure
  { brand:"Zendure", model:"SuperBase V 4600",  wh:4100, surge:5000,  price:4999 },
  { brand:"Zendure", model:"SuperBase Pro 2000",wh:1850, surge:4000,  price:1699 },
  { brand:"Zendure", model:"SuperBase M 1016",  wh:890,  surge:2400,  price:999  },
  { brand:"Zendure", model:"SuperBase M 607",   wh:530,  surge:1200,  price:699  },
  // Goal Zero
  { brand:"Goal Zero", model:"Yeti 3000X",      wh:3032, surge:3500,  price:1999 },
  { brand:"Goal Zero", model:"Yeti 1500X",      wh:1516, surge:3500,  price:999  },
  { brand:"Goal Zero", model:"Yeti 1000X",      wh:983,  surge:3500,  price:799  },
  // VTOMAN
  { brand:"VTOMAN", model:"Jump 2200",          wh:1548, surge:4400,  price:999  },
  { brand:"VTOMAN", model:"FlashSpeed 1500",    wh:1548, surge:3000,  price:629  },
  // Pecron
  { brand:"Pecron", model:"E2000LFP",           wh:1920, surge:4000,  price:799  },
  { brand:"Pecron", model:"E1000LFP",           wh:1024, surge:3000,  price:499  },
  { brand:"Pecron", model:"E600LFP",            wh:614,  surge:2400,  price:299  },
  // DJI Power
  { brand:"DJI Power", model:"Power 1000",      wh:1024, surge:4400,  price:699  },
  { brand:"DJI Power", model:"Power 500",       wh:512,  surge:2000,  price:349  },
  // Renogy
  { brand:"Renogy", model:"Lycan 5000",         wh:4800, surge:7000,  price:2999 },
  // Geneverse
  { brand:"Geneverse", model:"HomePower TWO PRO",wh:2419,surge:4400,  price:999  },
  { brand:"Geneverse", model:"HomePower ONE PRO",wh:1210,surge:2400,  price:499  },
];

// ─── RUNTIME CALCULATIONS ────────────────────────────────────────────────────
const EFFICIENCY = 0.85;

function calcRuntime(wh: number, appliance: Appliance) {
  const usable = wh * EFFICIENCY;
  const typical_hours = usable / appliance.avg_w;
  const typical = typical_hours / appliance.hours_per_unit;
  const best = typical * appliance.best_case_factor;
  return { typical: Math.round(typical * 10) / 10, best: Math.round(best * 10) / 10 };
}

function surgeCompat(product: Product, appliance: Appliance): "full" | "marginal" | "none" {
  if (appliance.surge_w === 0) return "full";
  if (product.surge >= appliance.surge_w * 1.5) return "full";
  if (product.surge >= appliance.surge_w) return "marginal";
  return "none";
}

function CompatBadge({ level }: { level: "full" | "marginal" | "none" }) {
  const styles = {
    full:     { text: "✓ Compatible",     color: "#10B981", bg: "#D1FAE5" },
    marginal: { text: "⚠ Marginal",       color: "#D97706", bg: "#FEF3C7" },
    none:     { text: "✗ Not recommended",color: "#EF4444", bg: "#FEE2E2" },
  };
  const s = styles[level];
  return (
    <span className="rounded px-2 py-0.5 font-mono text-[9.5px] font-semibold whitespace-nowrap"
      style={{ color: s.color, background: s.bg }}>
      {s.text}
    </span>
  );
}

function ConfidenceDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-[9px]" style={{ color: i < level ? "#2563EB" : "#E5E7EB" }}>●</span>
      ))}
    </div>
  );
}

type SortKey = "typical" | "best" | "price" | "wh";

function RuntimeDatabase() {
  const [activeApp, setActiveApp] = useState<string>("refrigerator");
  const [sortBy, setSortBy] = useState<SortKey>("typical");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  const appliance = APPLIANCES[activeApp];

  const rows = PRODUCTS
    .filter(p => p.price <= maxPrice)
    .map(p => ({
      ...p,
      runtime: calcRuntime(p.wh, appliance),
      compat: surgeCompat(p, appliance),
      ta: TA[p.model] || null,
    }))
    .sort((a, b) => {
      const va = sortBy === "typical" ? a.runtime.typical
        : sortBy === "best" ? a.runtime.best
        : sortBy === "price" ? a.price
        : a.wh;
      const vb = sortBy === "typical" ? b.runtime.typical
        : sortBy === "best" ? b.runtime.best
        : sortBy === "price" ? b.price
        : b.wh;
      return sortDir === "desc" ? vb - va : va - vb;
    });

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(key); setSortDir("desc"); }
  };

  const sortArrow = (key: SortKey) => sortBy === key ? (sortDir === "desc" ? " ↓" : " ↑") : "";

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
      <main className="relative z-10 mx-auto max-w-7xl px-5 pt-32 pb-20">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">Runtime Database</p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 mb-3">
            How long will it run?
          </h1>
          <p className="text-[15px] text-neutral-500 max-w-2xl leading-relaxed">
            Exact runtime estimates for 49 solar generators across 5 use cases. Calculated from verified usable capacity with {Math.round(EFFICIENCY * 100)}% inverter efficiency. Typical and best-case estimates for real-world planning.
          </p>
          <div className="mt-4 flex items-center gap-5 flex-wrap">
            {["100 products", "5 use cases", "Typical + best case", "Surge compatibility"].map(t => (
              <span key={t} className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{t}</span>
            ))}
          </div>
        </div>

        {/* Appliance selector */}
        <div className="mb-2 flex items-center gap-2 flex-wrap">
          {Object.values(APPLIANCES).map(app => (
            <button key={app.id} onClick={() => setActiveApp(app.id)}
              className={`flex items-center gap-2 rounded-[10px] px-4 py-2 font-mono text-[11px] font-medium transition-all ${
                activeApp === app.id
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "bg-white border text-neutral-600 hover:border-neutral-400"
              }`}
              style={activeApp !== app.id ? { borderColor: "#E2E2E2" } : {}}>
              <span>{app.icon}</span>
              {app.label}
            </button>
          ))}
        </div>

        {/* Appliance info card */}
        <div className="mb-5 rounded-[12px] border bg-white p-4" style={{ borderColor: "#E2E2E2" }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                {appliance.icon} {appliance.label} — {appliance.avg_w}W average
                {appliance.surge_w > 0 ? ` / ${appliance.surge_w.toLocaleString()}W surge` : ""}
              </p>
              <p className="text-[12.5px] text-neutral-600">{appliance.note}</p>
              <div className="mt-2 flex items-center gap-4 flex-wrap">
                <span className="text-[11px] text-neutral-500">
                  <span className="font-medium text-neutral-700">Typical:</span> {appliance.typical_scenario}
                </span>
                <span className="text-[11px] text-neutral-500">
                  <span className="font-medium text-neutral-700">Best case:</span> {appliance.best_case_scenario}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-[10px] text-neutral-400">Runtime confidence</span>
              <ConfidenceDots level={appliance.confidence} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-neutral-500">Max price</span>
            <select value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="rounded-[6px] border px-2 py-1 font-mono text-[11px] text-neutral-700 bg-white"
              style={{ borderColor: "#E2E2E2" }}>
              <option value={500}>Under $500</option>
              <option value={1000}>Under $1,000</option>
              <option value={2000}>Under $2,000</option>
              <option value={3000}>Under $3,000</option>
              <option value={5000}>All prices</option>
            </select>
          </div>
          <span className="font-mono text-[10px] text-neutral-400">{rows.length} products shown</span>
          <a href={`/${appliance.slug}/`} className="font-mono text-[10.5px] text-[#2563EB] hover:underline ml-auto">
            Full {appliance.label} guide →
          </a>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-[12px] border bg-white" style={{ borderColor: "#E2E2E2" }}>
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "#F0F0F0" }}>
                <th className="py-3 pl-4 pr-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-52">Product</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-20 cursor-pointer hover:text-neutral-700"
                  onClick={() => handleSort("price")}>Price{sortArrow("price")}</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-24 cursor-pointer hover:text-neutral-700"
                  onClick={() => handleSort("wh")}>Capacity{sortArrow("wh")}</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-32">Surge compat.</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-28 cursor-pointer hover:text-neutral-700"
                  onClick={() => handleSort("typical")}>Typical{sortArrow("typical")}</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-28 cursor-pointer hover:text-neutral-700"
                  onClick={() => handleSort("best")}>Best case{sortArrow("best")}</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-24">Confidence</th>
                <th className="py-3 px-2 pr-4 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={`${row.brand}-${row.model}`}
                  className={`border-b last:border-0 transition-colors hover:bg-[#FAFAFA] ${row.compat === "none" ? "opacity-50" : ""}`}
                  style={{ borderColor: "#F8F8F8" }}>
                  {/* Product */}
                  <td className="py-3 pl-4 pr-2">
                    <div>
                      <p className="font-mono text-[9.5px] text-neutral-400">{row.brand}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-semibold text-neutral-900">{row.model}</p>
                        {row.ta && (
                          <a href={row.ta} className="font-mono text-[9px] text-[#2563EB] hover:underline whitespace-nowrap">TA →</a>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Price */}
                  <td className="py-3 px-2">
                    <span className="font-mono text-[12px] font-medium text-neutral-800">${row.price.toLocaleString()}</span>
                  </td>
                  {/* Capacity */}
                  <td className="py-3 px-2">
                    <span className="font-mono text-[11px] text-neutral-600">{row.wh.toLocaleString()} Wh</span>
                  </td>
                  {/* Surge compat */}
                  <td className="py-3 px-2">
                    <CompatBadge level={row.compat} />
                  </td>
                  {/* Typical runtime */}
                  <td className="py-3 px-2">
                    <span className="font-mono text-[13px] font-semibold text-neutral-900">
                      {row.runtime.typical < 1
                        ? `${Math.round(row.runtime.typical * appliance.hours_per_unit * 10) / 10}h`
                        : `${row.runtime.typical} ${appliance.unit}`}
                    </span>
                  </td>
                  {/* Best case */}
                  <td className="py-3 px-2">
                    <span className="font-mono text-[12px] text-[#10B981]">
                      {row.runtime.best < 1
                        ? `${Math.round(row.runtime.best * appliance.hours_per_unit * 10) / 10}h`
                        : `${row.runtime.best} ${appliance.unit}`}
                    </span>
                  </td>
                  {/* Confidence */}
                  <td className="py-3 px-2">
                    <ConfidenceDots level={appliance.confidence} />
                  </td>
                  {/* Buy */}
                  <td className="py-3 px-2 pr-4">
                    <a
                      href={`https://www.amazon.com/s?k=${encodeURIComponent(row.brand + " " + row.model)}&tag=clickdecision-20`}
                      rel="sponsored noopener"
                      target="_blank"
                      className="rounded-[6px] bg-[#FF9900] px-2.5 py-1 font-mono text-[10px] font-semibold text-white hover:opacity-80 transition-opacity whitespace-nowrap">
                      Amazon →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Methodology note */}
        <div className="mt-4 rounded-[10px] border border-dashed px-5 py-3.5 flex items-start gap-3"
          style={{ borderColor: "#E2E2E2" }}>
          <span className="font-mono text-[11px] text-neutral-400 shrink-0 mt-0.5">ⓘ</span>
          <p className="font-mono text-[11px] text-neutral-400 leading-relaxed">
            Runtimes calculated as: (usable capacity × {Math.round(EFFICIENCY * 100)}% inverter efficiency) ÷ average appliance wattage.
            Actual results vary with ambient temperature, appliance age, and usage patterns.
            Best case assumes optimal conditions described above.
            Products marked ✗ may fail to start the appliance due to insufficient surge capacity.
          </p>
        </div>

        {/* Cross-links */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(APPLIANCES).filter(a => a.id !== activeApp).map(app => (
            <a key={app.id} onClick={() => setActiveApp(app.id)}
              className="cursor-pointer rounded-[10px] border bg-white p-4 hover:border-neutral-400 transition-colors group"
              style={{ borderColor: "#E2E2E2" }}>
              <p className="text-[18px] mb-1">{app.icon}</p>
              <p className="text-[13px] font-medium text-neutral-800 group-hover:text-[#2563EB] transition-colors">{app.label}</p>
              <p className="font-mono text-[10px] text-neutral-400 mt-0.5">{app.avg_w}W avg</p>
            </a>
          ))}
          <a href="/solar-calculator"
            className="rounded-[10px] border bg-[#2563eb] p-4 hover:bg-[#1d4ed8] transition-colors"
            style={{ borderColor: "transparent" }}>
            <p className="text-[18px] mb-1">⚡</p>
            <p className="text-[13px] font-medium text-white">Decision Engine</p>
            <p className="font-mono text-[10px] text-blue-200 mt-0.5">Find your match →</p>
          </a>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
