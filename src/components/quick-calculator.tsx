import { Link } from "@tanstack/react-router";
import { useState } from "react";

type Product = {
  name: string;
  wh: number;
  surge: number;
  weight: number;
  ups: boolean;
  price: number;
  originalPrice: number;
  reasons: Partial<Record<string, string>>;
  limitation: string;
  affiliate: string;
  brand: "EcoFlow" | "Bluetti" | "Jackery";
};

const products: Record<string, Product> = {
  river2: {
    name: "EcoFlow River 2",
    wh: 256, surge: 600, weight: 3.5, ups: false,
    price: 199, originalPrice: 299, brand: "EcoFlow",
    reasons: {
      home: "Covers phones, small devices and lights for a short outage.",
      camping: "Lightest option for a beach day or short trip.",
      beach: "Lightest option for a beach day or short trip.",
    },
    limitation: "Cannot run a refrigerator for more than 2-3 hours.",
    affiliate: "#",
  },
  river2pro: {
    name: "EcoFlow River 2 Pro",
    wh: 768, surge: 1600, weight: 7.8, ups: false,
    price: 349, originalPrice: 599, brand: "EcoFlow",
    reasons: {
      camping: "Best power-to-weight ratio for camping with basic loads.",
      beach: "Covers a full beach day — fan, speaker, phones, tablet.",
    },
    limitation: "Cannot run a standard refrigerator reliably.",
    affiliate: "#",
  },
  delta2: {
    name: "EcoFlow Delta 2",
    wh: 1024, surge: 2700, weight: 12, ups: true,
    price: 699, originalPrice: 999, brand: "EcoFlow",
    reasons: {
      home: "Covers fridge, router and lights for 12-16 hours with UPS.",
      camping: "Best all-round camping unit with 12V output for cooler.",
      overlanding: "12V output + 500W solar input — ideal overlanding setup.",
    },
    limitation: "Not enough for 24h full coverage. Step up to Delta 2 Max for all-day backup.",
    affiliate: "#",
  },
  delta2max: {
    name: "EcoFlow Delta 2 Max",
    wh: 2048, surge: 2400, weight: 23, ups: true,
    price: 899, originalPrice: 1699, brand: "EcoFlow",
    reasons: {
      home: "Covers fridge + router + lights + laptop for 20-24 hours. UPS ensures seamless switchover.",
      cpap: "UPS critical for CPAP — 30ms switchover means your machine never detects the outage.",
      medical: "UPS critical for CPAP — 30ms switchover means your machine never detects the outage.",
      rv: "2,048 Wh + 1,000W solar input — sustainable daily coverage for most RV setups.",
      cabin: "Covers fridge + essentials in a cabin for a full day with UPS protection.",
      overlanding: "Enough capacity for multi-appliance overlanding without compromising weight too much.",
    },
    limitation: "2,400W surge won't start well pumps. Not suitable for 48h+ without extra battery.",
    affiliate: "#",
  },
  delta_pro: {
    name: "EcoFlow Delta Pro",
    wh: 3600, surge: 7200, weight: 45, ups: true,
    price: 1799, originalPrice: 3299, brand: "EcoFlow",
    reasons: {
      home: "7,200W surge handles well pumps. UPS + 3,600 Wh covers 30-36h of essential loads.",
      cabin: "Multi-day cabin coverage. Pair with 400W solar for sustainable off-grid living.",
      medical: "Only portable unit combining UPS + enough capacity for oxygen concentrators.",
      rv: "3,600 Wh covers extended van life with multiple appliances over several days.",
    },
    limitation: "45kg — this is a stationary installation, not portable. Cannot expand beyond 7,200 Wh.",
    affiliate: "#",
  },
  bluetti_eb70s: {
    name: "Bluetti EB70S",
    wh: 716, surge: 1400, weight: 9.7, ups: false,
    price: 549, originalPrice: 549, brand: "Bluetti",
    reasons: {
      home: "Best value under $600 for basic backup — fridge for 12h alone.",
      camping: "Good all-round camping unit at competitive price.",
    },
    limitation: "No UPS. Brief power interruption when grid fails.",
    affiliate: "#",
  },
  bluetti_ac200p: {
    name: "Bluetti AC200P",
    wh: 2000, surge: 4800, weight: 27.5, ups: false,
    price: 1299, originalPrice: 1299, brand: "Bluetti",
    reasons: {
      home: "Best surge output (4,800W) for homes with well pumps or large motor loads.",
    },
    limitation: "No UPS. Not suitable for computers or medical devices requiring seamless power.",
    affiliate: "#",
  },
};

const scenarios = [
  { v: "home", label: "Home backup / Power outage" },
  { v: "camping", label: "Camping (weekend)" },
  { v: "overlanding", label: "Overlanding / Extended trips" },
  { v: "cabin", label: "Rural cabin / Off-grid" },
  { v: "beach", label: "Beach / Day trip" },
  { v: "medical", label: "Medical device at home" },
  { v: "rv", label: "RV / Van life" },
];

const appliances = [
  { v: "fridge", label: "Refrigerator" },
  { v: "cpap", label: "CPAP machine" },
  { v: "lights", label: "Lights + devices" },
  { v: "pump", label: "Well pump (½ HP)" },
  { v: "cooler", label: "12V cooler" },
  { v: "multiple", label: "Multiple appliances" },
];

const daysOptions = [
  { v: "1", label: "1 night" },
  { v: "2", label: "2 days" },
  { v: "3", label: "3 days" },
  { v: "5", label: "5+ days" },
];

function pickProduct(scenario: string, appliance: string, budget: number, days: string): string {
  if (budget > 0) {
    if (budget < 300) return "river2";
    if (budget < 500) return "river2pro";
    if (budget < 800) return "delta2";
    if (budget < 1200) return "delta2";
  }
  if (scenario === "home") {
    if (appliance === "pump" || (appliance === "fridge" && days === "5")) return "delta_pro";
    if (appliance === "fridge") return "delta2max";
    if (appliance === "cpap") return "delta2max";
    if (appliance === "lights") return "delta2";
    if (appliance === "multiple" && (days === "3" || days === "5")) return "delta_pro";
    return "delta2max";
  }
  if (scenario === "camping") {
    if (appliance === "lights") return "river2pro";
    return "delta2";
  }
  if (scenario === "overlanding") {
    if (appliance === "multiple") return "delta2max";
    return "delta2";
  }
  if (scenario === "beach") return "river2pro";
  if (scenario === "cabin") {
    if (appliance === "pump" || appliance === "multiple") return "delta_pro";
    return "delta2max";
  }
  if (scenario === "rv") {
    if (appliance === "multiple" && days === "5") return "delta_pro";
    return "delta2max";
  }
  if (scenario === "medical") {
    if (appliance === "pump") return "delta_pro";
    return "delta2max";
  }
  return "delta2";
}

function pickAlternatives(mainKey: string): string[] {
  const order = ["river2", "river2pro", "bluetti_eb70s", "delta2", "bluetti_ac200p", "delta2max", "delta_pro"];
  return order.filter((k) => k !== mainKey).slice(0, 2);
}

export function QuickCalculator() {
  const [scenario, setScenario] = useState("home");
  const [appliance, setAppliance] = useState("fridge");
  const [budget, setBudget] = useState<string>("1500");
  const [days, setDays] = useState("2");
  const [resultKey, setResultKey] = useState<string | null>(null);

  const calculate = () => {
    const b = parseInt(budget || "0", 10) || 0;
    setResultKey(pickProduct(scenario, appliance, b, days));
  };

  const fieldCls =
    "h-11 w-full rounded-[10px] border bg-white px-[11px] text-[13px] text-[#111111] outline-none transition-colors focus:border-[#2563EB]";
  const borderStyle = { borderColor: "#E0E0E0" };
  const labelCls = "mb-2 block text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-medium";

  const result = resultKey ? products[resultKey] : null;
  const reason = result
    ? result.reasons[appliance] || result.reasons[scenario] || Object.values(result.reasons)[0] || ""
    : "";
  const alternatives = resultKey ? pickAlternatives(resultKey).map((k) => products[k]) : [];

  return (
    <div className="rounded-[12px] border bg-white p-6 md:p-8" style={{ borderColor: "#E5E7EB" }}>
      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
        <div>
          <label className={labelCls}>Scenario</label>
          <select className={fieldCls} style={borderStyle} value={scenario} onChange={(e) => setScenario(e.target.value)}>
            {scenarios.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Key appliance</label>
          <select className={fieldCls} style={borderStyle} value={appliance} onChange={(e) => setAppliance(e.target.value)}>
            {appliances.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Budget (USD)</label>
          <input
            type="number" min={200} max={15000} placeholder="e.g. 1500"
            value={budget} onChange={(e) => setBudget(e.target.value)}
            className={fieldCls} style={borderStyle}
          />
        </div>
        <div>
          <label className={labelCls}>Days of coverage</label>
          <select className={fieldCls} style={borderStyle} value={days} onChange={(e) => setDays(e.target.value)}>
            {daysOptions.map((d) => <option key={d.v} value={d.v}>{d.label}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#1a1a1a] text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#2563EB]"
      >
        Calculate my recommendation →
      </button>

      {result && (
        <div
          key={`${scenario}-${appliance}-${budget}-${days}`}
          className="mt-5 animate-fade-in rounded-[12px] bg-white px-6 py-5"
          style={{ borderLeft: "3px solid #2563EB", border: "1px solid #E5E7EB", borderLeftWidth: "3px", borderLeftColor: "#2563EB" }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6B7280]">
            Your recommendation
          </p>
          <h3 className="mt-1.5 text-[20px] font-semibold leading-tight text-[#111111]">{result.name}</h3>
          <p className="mt-1.5 text-[13px] text-[#6B7280]">
            {result.wh.toLocaleString()} Wh · {result.surge.toLocaleString()}W surge · {result.weight}kg ·{" "}
            {result.ups ? "✓ UPS 30ms" : "✗ No UPS"}
          </p>
          <p className="mt-2.5 text-[14px] leading-[1.6] text-[#374151]">{reason}</p>

          <div className="mt-3 flex items-baseline gap-2.5">
            {result.originalPrice > result.price && (
              <span className="text-[15px] text-[#9CA3AF] line-through">
                ${result.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[24px] font-semibold text-[#2563EB]">
              ${result.price.toLocaleString()}
            </span>
          </div>

          <p className="mt-2.5 text-[12px] text-[#9CA3AF]">
            <span className="font-medium">⚠️ What it won't do:</span> {result.limitation}
          </p>

          <a
            href={result.affiliate}
            className="mt-4 inline-flex w-full items-center justify-center rounded-[8px] bg-[#2563EB] px-4 py-[11px] text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#1d4ed8]"
          >
            Check current price on {result.brand} →
          </a>

          {alternatives.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6B7280]">
                Also consider
              </p>
              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {alternatives.map((alt) => (
                  <div key={alt.name} className="rounded-[10px] border bg-[#F9FAFB] p-3" style={{ borderColor: "#E5E7EB" }}>
                    <p className="text-[13px] text-[#111111]">{alt.name}</p>
                    <p className="mt-0.5 text-[11px] text-[#6B7280]">{alt.wh.toLocaleString()} Wh</p>
                    <p className="mt-1 text-[13px] font-semibold text-[#2563EB]">
                      ${alt.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link
              to="/solar-calculator"
              className="text-[12px] text-[#2563EB] transition-colors hover:text-[#1d4ed8]"
            >
              Get the full technical analysis with all alternatives →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
