import { useState } from "react";

// ─── DATASET (39 products from CDL Google Sheets) ────────────────────────────
const PRODUCTS = [
  { brand:"EcoFlow", model:"RIVER 3", price:199, wh:220, surge:600, solar:110, ups:false, expandable:false, weight:6.6, warranty:5, scores:{home_backup:4,rv:6,camping:8,off_grid:3,apartment:7,medical:4,value:9}, notes:"Entry-level. Ideal for small devices & travel." },
  { brand:"EcoFlow", model:"RIVER 3 Plus", price:299, wh:440, surge:1200, solar:220, ups:false, expandable:false, weight:10.8, warranty:5, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Best compact for camping & apartment emergencies." },
  { brand:"EcoFlow", model:"DELTA 3 Classic", price:449, wh:900, surge:3600, solar:500, ups:true, expandable:false, weight:22, warranty:5, scores:{home_backup:7,rv:7,camping:7,off_grid:5,apartment:7,medical:7,value:9}, notes:"Most affordable 1kWh LFP with UPS. Strong value." },
  { brand:"EcoFlow", model:"DELTA 3 Plus", price:599, wh:900, surge:4400, solar:500, ups:true, expandable:true, weight:22, warranty:5, scores:{home_backup:8,rv:7,camping:7,off_grid:6,apartment:7,medical:7,value:8}, notes:"X-Boost enables 2,200W. Best mid-range pick." },
  { brand:"EcoFlow", model:"DELTA 3 Max", price:749, wh:1800, surge:4800, solar:800, ups:true, expandable:true, weight:28, warranty:5, scores:{home_backup:8,rv:7,camping:6,off_grid:7,apartment:6,medical:7,value:8}, notes:"2kWh sweet spot for home backup & RV." },
  { brand:"EcoFlow", model:"DELTA 3 Max Plus", price:999, wh:1800, surge:6000, solar:800, ups:true, expandable:true, weight:30, warranty:5, scores:{home_backup:9,rv:7,camping:5,off_grid:7,apartment:5,medical:7,value:7}, notes:"3000W output for larger appliances." },
  { brand:"EcoFlow", model:"DELTA 2", price:699, wh:900, surge:3600, solar:500, ups:true, expandable:true, weight:27, warranty:5, scores:{home_backup:7,rv:6,camping:6,off_grid:5,apartment:7,medical:6,value:7}, notes:"Best-seller. Widely available. Solid UPS." },
  { brand:"EcoFlow", model:"DELTA 2 Max", price:999, wh:1800, surge:4800, solar:800, ups:true, expandable:true, weight:28, warranty:5, scores:{home_backup:8,rv:7,camping:6,off_grid:7,apartment:6,medical:7,value:7}, notes:"Popular 2kWh with solid expandability." },
  { brand:"EcoFlow", model:"DELTA Pro", price:2499, wh:3200, surge:7200, solar:1600, ups:true, expandable:true, weight:45, warranty:5, scores:{home_backup:9,rv:6,camping:4,off_grid:8,apartment:4,medical:8,value:6}, notes:"Pro home backup. Expandable to 25kWh. Heavy." },
  { brand:"EcoFlow", model:"RIVER 2", price:249, wh:220, surge:600, solar:110, ups:false, expandable:false, weight:7.7, warranty:5, scores:{home_backup:3,rv:5,camping:7,off_grid:3,apartment:7,medical:4,value:8}, notes:"Legacy entry model. Still widely sold." },
  { brand:"EcoFlow", model:"RIVER 2 Max", price:349, wh:440, surge:1000, solar:220, ups:false, expandable:false, weight:11, warranty:5, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Mid compact. Good for camping." },
  { brand:"Bluetti", model:"EB3A", price:199, wh:230, surge:1200, solar:200, ups:false, expandable:false, weight:10.1, warranty:2, scores:{home_backup:4,rv:5,camping:7,off_grid:3,apartment:7,medical:5,value:8}, notes:"Budget Bluetti entry. Good for charging devices." },
  { brand:"Bluetti", model:"AC60", price:299, wh:350, surge:1200, solar:200, ups:false, expandable:false, weight:13, warranty:2, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Compact foldable solar panels compatible." },
  { brand:"Bluetti", model:"AC70", price:399, wh:660, surge:2000, solar:200, ups:false, expandable:false, weight:21.4, warranty:2, scores:{home_backup:6,rv:6,camping:7,off_grid:5,apartment:7,medical:6,value:8}, notes:"1kWh compact with 1000W. Good value." },
  { brand:"Bluetti", model:"AC180", price:499, wh:1000, surge:3600, solar:200, ups:false, expandable:false, weight:29.4, warranty:2, scores:{home_backup:7,rv:6,camping:6,off_grid:5,apartment:6,medical:6,value:8}, notes:"1.1kWh at $499. Solid mid-range." },
  { brand:"Bluetti", model:"AC200L", price:999, wh:1800, surge:3600, solar:900, ups:true, expandable:true, weight:31, warranty:5, scores:{home_backup:8,rv:7,camping:5,off_grid:7,apartment:6,medical:8,value:7}, notes:"2kWh expandable with strong AC input. UPS." },
  { brand:"Bluetti", model:"AC300", price:2299, wh:2750, surge:6000, solar:2400, ups:true, expandable:true, weight:60, warranty:5, scores:{home_backup:9,rv:4,camping:2,off_grid:9,apartment:2,medical:8,value:5}, notes:"Modular home system. Requires B300 battery." },
  { brand:"Bluetti", model:"AC500", price:3999, wh:5500, surge:10000, solar:3000, ups:true, expandable:true, weight:60, warranty:5, scores:{home_backup:10,rv:3,camping:1,off_grid:10,apartment:2,medical:9,value:4}, notes:"Highest output portable system. Near-home grade." },
  { brand:"Bluetti", model:"Elite 300", price:1499, wh:2700, surge:4800, solar:1200, ups:true, expandable:false, weight:55, warranty:5, scores:{home_backup:8,rv:5,camping:3,off_grid:7,apartment:4,medical:8,value:6}, notes:"3kWh in compact body. Good home backup." },
  { brand:"Jackery", model:"Explorer 300 Plus", price:199, wh:250, surge:600, solar:80, ups:false, expandable:false, weight:7.3, warranty:3, scores:{home_backup:3,rv:5,camping:8,off_grid:3,apartment:8,medical:4,value:8}, notes:"Ultra-portable. Camping & travel focus." },
  { brand:"Jackery", model:"Explorer 1000 v2", price:449, wh:940, surge:3000, solar:400, ups:false, expandable:false, weight:23.4, warranty:3, scores:{home_backup:6,rv:7,camping:7,off_grid:5,apartment:7,medical:6,value:9}, notes:"Best value 1kWh LFP. Lightweight for class." },
  { brand:"Jackery", model:"Explorer 1000 Plus", price:899, wh:1110, surge:4000, solar:800, ups:false, expandable:true, weight:25.5, warranty:3, scores:{home_backup:7,rv:7,camping:6,off_grid:6,apartment:6,medical:6,value:7}, notes:"Expandable 1kWh+ with 2000W output." },
  { brand:"Jackery", model:"Explorer 2000 v2", price:1599, wh:1800, surge:4400, solar:800, ups:false, expandable:false, weight:39.5, warranty:3, scores:{home_backup:8,rv:7,camping:5,off_grid:7,apartment:5,medical:7,value:7}, notes:"Lightweight 2kWh. 41% lighter than competitors." },
  { brand:"Jackery", model:"Explorer 2000 Plus", price:899, wh:1800, surge:6000, solar:1000, ups:false, expandable:true, weight:48, warranty:3, scores:{home_backup:9,rv:7,camping:5,off_grid:8,apartment:4,medical:7,value:9}, notes:"Exceptional value. Expandable to 24kWh." },
  { brand:"Jackery", model:"Explorer 600 Plus", price:399, wh:555, surge:1600, solar:200, ups:false, expandable:false, weight:14.6, warranty:3, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Mid compact. Good for camping & weekend use." },
  { brand:"Anker SOLIX", model:"C800", price:449, wh:670, surge:2400, solar:200, ups:false, expandable:false, weight:15.2, warranty:5, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Compact with car roof tent lights built-in." },
  { brand:"Anker SOLIX", model:"C800 Plus", price:549, wh:670, surge:2400, solar:200, ups:true, expandable:false, weight:16.3, warranty:5, scores:{home_backup:6,rv:6,camping:8,off_grid:4,apartment:8,medical:6,value:7}, notes:"C800 with integrated light bar. UPS mode." },
  { brand:"Anker SOLIX", model:"C800X", price:379, wh:670, surge:2400, solar:200, ups:false, expandable:false, weight:14.8, warranty:5, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:9}, notes:"Budget C800. Best $/Wh in compact class." },
  { brand:"Anker SOLIX", model:"C1000", price:799, wh:930, surge:2000, solar:400, ups:false, expandable:false, weight:23.4, warranty:5, scores:{home_backup:6,rv:7,camping:7,off_grid:5,apartment:7,medical:6,value:7}, notes:"1kWh with fast recharge. 1hr to full." },
  { brand:"Anker SOLIX", model:"C2000", price:999, wh:1800, surge:4000, solar:800, ups:false, expandable:false, weight:40.5, warranty:5, scores:{home_backup:7,rv:7,camping:5,off_grid:7,apartment:5,medical:7,value:7}, notes:"2kWh solid performer. Competitive pricing." },
  { brand:"Anker SOLIX", model:"C2000 Gen 2", price:1199, wh:1800, surge:4000, solar:1000, ups:true, expandable:false, weight:38, warranty:5, scores:{home_backup:8,rv:7,camping:5,off_grid:7,apartment:5,medical:8,value:7}, notes:"Gen 2 adds UPS. Better solar input. Lighter." },
  { brand:"Anker SOLIX", model:"F3800", price:2999, wh:3400, surge:12000, solar:2400, ups:true, expandable:true, weight:84.1, warranty:5, scores:{home_backup:10,rv:5,camping:3,off_grid:9,apartment:3,medical:9,value:6}, notes:"6000W/120V+240V. Best-in-class output." },
  { brand:"Zendure", model:"SuperBase M 607", price:699, wh:530, surge:1200, solar:200, ups:false, expandable:false, weight:17.6, warranty:2, scores:{home_backup:5,rv:5,camping:7,off_grid:4,apartment:7,medical:5,value:5}, notes:"Premium compact. App-controlled." },
  { brand:"Zendure", model:"SuperBase M 1016", price:999, wh:890, surge:2400, solar:200, ups:false, expandable:false, weight:26, warranty:2, scores:{home_backup:6,rv:6,camping:6,off_grid:5,apartment:6,medical:5,value:5}, notes:"Mid-range Zendure. App integration strong." },
  { brand:"Zendure", model:"SuperBase Pro 2000", price:1699, wh:1850, surge:4000, solar:800, ups:true, expandable:false, weight:46, warranty:5, scores:{home_backup:7,rv:6,camping:4,off_grid:7,apartment:5,medical:8,value:5}, notes:"UPS 13ms. AmpUp to 3000W. App-driven energy." },
  { brand:"Zendure", model:"SuperBase V 4600", price:4999, wh:4100, surge:5000, solar:1200, ups:true, expandable:true, weight:97, warranty:5, scores:{home_backup:9,rv:3,camping:1,off_grid:10,apartment:2,medical:8,value:4}, notes:"Expandable to 64kWh. Off-grid powerhouse." },
];

// ─── SCENARIO → SCORE KEY MAPPING ───────────────────────────────────────────
const SCENARIO_SCORE_MAP: Record<string, keyof typeof PRODUCTS[0]["scores"]> = {
  "Home backup / Power outage": "home_backup",
  "Camping (weekend)": "camping",
  "Overlanding / Extended trips": "camping",
  "Rural cabin / Off-grid": "off_grid",
  "Beach / Day trip": "camping",
  "Medical device at home": "medical",
  "RV / Van life": "rv",
};

const SCENARIOS = Object.keys(SCENARIO_SCORE_MAP);

// ─── APPLIANCE DATA ──────────────────────────────────────────────────────────
const APPLIANCE_DATA: Record<string, { whPerDay: number; surgeW: number; needsUps: boolean }> = {
  "Refrigerator":          { whPerDay: 150, surgeW: 1200, needsUps: false },
  "Well pump (½ HP)":      { whPerDay: 500, surgeW: 2600, needsUps: false },
  "CPAP machine":          { whPerDay: 40,  surgeW: 300,  needsUps: true  },
  "Lights + devices":      { whPerDay: 50,  surgeW: 200,  needsUps: false },
  "Multiple appliances":   { whPerDay: 300, surgeW: 2000, needsUps: false },
  "12V cooler":            { whPerDay: 100, surgeW: 400,  needsUps: false },
  "Medical device":        { whPerDay: 80,  surgeW: 300,  needsUps: true  },
  "Home office":           { whPerDay: 200, surgeW: 500,  needsUps: true  },
};

const APPLIANCE_KEYS = Object.keys(APPLIANCE_DATA);

const DAYS_MAP: Record<string, number> = {
  "1 night": 1,
  "2 days":  2,
  "3 days":  3,
  "5+ days": 5,
};

const DAYS_KEYS = Object.keys(DAYS_MAP);

// ─── LIMITATION GENERATOR ────────────────────────────────────────────────────
function getLimitation(p: typeof PRODUCTS[0], appliance: string): string {
  const app = APPLIANCE_DATA[appliance];
  if (app?.surgeW > p.surge)
    return `Cannot start ${appliance.toLowerCase()} — ${app.surgeW.toLocaleString()}W surge required, unit has ${p.surge.toLocaleString()}W`;
  if (app?.needsUps && !p.ups)
    return "No UPS mode — brief power interruption when grid fails";
  if (p.weight > 50)
    return "Heavy unit — stationary installation, not truly portable";
  if (!p.expandable && p.wh < 1500)
    return "Cannot expand capacity — limited to single-charge coverage";
  if (p.wh < 500)
    return "Not enough for home backup — designed for small devices only";
  return "No major limitations for this scenario";
}

// ─── COMPUTE PICKS ───────────────────────────────────────────────────────────
type Product = typeof PRODUCTS[0];
type Pick = { product: Product; label: "Best Match" | "Best Value" | "Premium Pick"; reason: string; limitation: string };

function computePicks(
  scenario: string,
  appliance: string,
  days: string,
  budget: number,
): { picks: Pick[]; requiredWh: number; requiredSurge: number; outOfBudget: boolean } {
  const app = APPLIANCE_DATA[appliance];
  const d = DAYS_MAP[days] || 2;
  const scoreKey = SCENARIO_SCORE_MAP[scenario] || "home_backup";
  const requiredWh = Math.round(app.whPerDay * d * 1.25);
  const requiredSurge = app.surgeW;

  // Filter: surge + UPS requirements (hard constraints)
  const surgeOk = PRODUCTS.filter(p =>
    p.surge >= requiredSurge &&
    (!app.needsUps || p.ups)
  );

  const inBudget = budget > 0
    ? surgeOk.filter(p => p.price <= budget)
    : surgeOk;

  // Score by use-case
  const scored = [...inBudget].sort((a, b) => b.scores[scoreKey] - a.scores[scoreKey]);

  // Best Match: highest use-case score within budget
  const bestMatch = scored[0];

  // Best Value: best Wh per dollar (different from bestMatch)
  const bestValue = [...inBudget]
    .filter(p => p !== bestMatch)
    .sort((a, b) => (b.wh / b.price) - (a.wh / a.price))[0];

  // Premium Pick: highest score regardless of budget (if different)
  const premiumPool = [...surgeOk]
    .filter(p => p !== bestMatch && p !== bestValue)
    .sort((a, b) => b.scores[scoreKey] - a.scores[scoreKey]);
  const premiumPick = premiumPool[0];

  const outOfBudget = inBudget.length === 0;

  const raw: Array<{ p: Product | undefined; label: Pick["label"] }> = [
    { p: bestMatch,   label: "Best Match"    },
    { p: bestValue,   label: "Best Value"    },
    { p: premiumPick, label: "Premium Pick"  },
  ];

  // Fallback if budget too tight
  if (outOfBudget) {
    const fallback = [...surgeOk].sort((a, b) => b.scores[scoreKey] - a.scores[scoreKey]);
    raw[0].p = fallback[0];
    raw[1].p = fallback[1];
    raw[2].p = fallback[2];
  }

  const picks: Pick[] = raw
    .filter((r): r is { p: Product; label: Pick["label"] } => !!r.p)
    .map(({ p, label }) => {
      let reason = p.notes;
      if (label === "Best Value")
        reason = `Best capacity-per-dollar: ${(p.wh / p.price).toFixed(2)} Wh/$. ${p.notes}`;
      if (label === "Premium Pick")
        reason = `Highest ${scoreKey.replace("_", " ")} score (${p.scores[scoreKey]}/10). ${p.notes}`;
      return { product: p, label, reason, limitation: getLimitation(p, appliance) };
    });

  return { picks, requiredWh, requiredSurge, outOfBudget };
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
function FieldIcon({ kind }: { kind: "home" | "fridge" | "dollar" | "calendar" }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-[18px] w-[18px] text-neutral-500",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "home") return <svg {...common}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>;
  if (kind === "fridge") return <svg {...common}><rect x="5" y="2.5" width="14" height="19" rx="2" /><path d="M5 10h14M8 6v2M8 14v3" /></svg>;
  if (kind === "dollar") return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M15 9c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2M12 6v12" /></svg>;
  return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
}

function Field({ label, icon, children }: { label: string; icon: "home" | "fridge" | "dollar" | "calendar"; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </label>
      <div
        className="mt-2 flex h-12 items-center gap-3 rounded-[8px] border bg-white px-3.5 transition-colors focus-within:border-neutral-500 hover:border-neutral-400"
        style={{ borderColor: "#E2E2E2" }}
      >
        <FieldIcon kind={icon} />
        {children}
      </div>
    </div>
  );
}

// ─── SCORE BAR ───────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score >= 8 ? "#10B981" : score >= 6 ? "#F59E0B" : "#9CA3AF";
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
        <div style={{ width: `${score * 10}%`, background: color, height: "100%", borderRadius: 99 }} />
      </div>
      <span className="font-mono text-[11px]" style={{ color }}>{score}/10</span>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export function SolarCalculator() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [appliance, setAppliance] = useState("Refrigerator");
  const [budget, setBudget] = useState("1500");
  const [days, setDays] = useState("2 days");
  const [result, setResult] = useState<ReturnType<typeof computePicks> | null>(null);

  const scoreKey = SCENARIO_SCORE_MAP[scenario] || "home_backup";

  const onSubmit = (e: React.FormEvent | React.MouseEvent) => {
    // Track calculator use
    if (typeof window !== 'undefined' && (window as any).cdlTrack) {
      (window as any).cdlTrack('calculator_submit', {
        scenario: scenario,
        appliance: appliance,
        budget: budget || 'unset',
        days: days
      });
    }
    e.preventDefault();
    const b = parseInt(budget || "0", 10) || 0;
    setResult(computePicks(scenario, appliance, days, b));
  };

  const selectCls = "w-full appearance-none bg-transparent text-[14px] text-neutral-900 outline-none cursor-pointer";

  const LABEL_COLORS: Record<string, string> = {
    "Best Match":    "#2563EB",
    "Best Value":    "#10B981",
    "Premium Pick":  "#8B5CF6",
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[16px] bg-white p-7 md:p-9"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
    >
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field label="SCENARIO" icon="home">
          <select className={selectCls} value={scenario} onChange={e => setScenario(e.target.value)}>
            {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="KEY APPLIANCE" icon="fridge">
          <select className={selectCls} value={appliance} onChange={e => setAppliance(e.target.value)}>
            {APPLIANCE_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="BUDGET (USD)" icon="dollar">
          <input
            type="number"
            min={200}
            max={15000}
            value={budget}
            onChange={e => setBudget(e.target.value)}
            className={selectCls}
          />
        </Field>
        <Field label="DAYS OF COVERAGE" icon="calendar">
          <select className={selectCls} value={days} onChange={e => setDays(e.target.value)}>
            {DAYS_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-neutral-950 px-5 py-4 text-[14.5px] font-medium text-white transition-all duration-200 hover:-translate-y-[2px] hover:opacity-[0.85]"
      >
        Calculate my recommendation
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </button>

      {result && (
        <div className="mt-7">
          {result.outOfBudget && (
            <p className="mb-3 text-[12.5px] text-neutral-500">
              No exact matches within budget — showing closest options:
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {result.picks.map((p, i) => {
              const accentColor = LABEL_COLORS[p.label] || "#2563EB";
              const score = p.product.scores[scoreKey];
              return (
                <div
                  key={p.product.model + i}
                  className="rounded-[12px] border bg-white p-4 opacity-0 animate-fade-in"
                  style={{
                    borderColor: "#E2E2E2",
                    borderTop: `3px solid ${accentColor}`,
                    animationDelay: `${i * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]" style={{ color: accentColor }}>
                    {p.label}
                  </p>
                  <h3 className="mt-1 text-[14px] font-semibold leading-tight text-neutral-950">
                    {p.product.brand} {p.product.model}
                  </h3>

                  <div className="mt-3 grid grid-cols-2 gap-y-1 text-[12px] tabular-nums text-neutral-700">
                    <span className="text-neutral-500">Capacity</span>
                    <span className="text-right">{p.product.wh.toLocaleString()} Wh</span>
                    <span className="text-neutral-500">Surge</span>
                    <span className="text-right">{p.product.surge.toLocaleString()} W</span>
                    <span className="text-neutral-500">UPS</span>
                    <span className="text-right">{p.product.ups ? "✓ Yes" : "✗ No"}</span>
                    <span className="text-neutral-500">Price</span>
                    <span className="text-right font-semibold" style={{ color: accentColor }}>${p.product.price.toLocaleString()}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t" style={{ borderColor: "#F0F0F0" }}>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-0.5">
                      {scoreKey.replace("_", " ")} score
                    </p>
                    <ScoreBar score={score} />
                  </div>

                  <p className="mt-3 text-[11.5px] leading-[1.55] text-neutral-600">{p.reason}</p>

                  <div className="mt-2.5 rounded-[6px] bg-neutral-50 px-2.5 py-2 text-[11px] text-neutral-500">
                    ⚠️ {p.limitation}
                  </div>

                  <a
                    href={`https://us.ecoflow.com`}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).cdlTrack) {
                        (window as any).cdlTrack('affiliate_click', {
                          product: `${p.product.brand} ${p.product.model}`,
                          brand: p.product.brand,
                          price: p.product.price,
                          label: p.label,
                          scenario: scenario,
                          appliance: appliance
                        });
                      }
                    }}
                    className="mt-3 block rounded-[8px] py-2.5 text-center text-[12.5px] font-medium text-white transition-opacity hover:opacity-80"
                    style={{ background: accentColor }}
                  >
                    Check current price →
                  </a>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] text-neutral-400">
            {PRODUCTS.length} products analyzed · Required: {result.requiredWh.toLocaleString()} Wh · Surge: {result.requiredSurge.toLocaleString()} W ·
            We earn a commission if you purchase — this doesn't affect our recommendations.
          </p>
        </div>
      )}
    </form>
  );
}
