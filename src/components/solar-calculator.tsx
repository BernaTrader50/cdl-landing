import { useState } from "react";

const PRODUCTS = [
  { name: "EcoFlow Delta 2", capacity: 1024, surge: 2400, price: 999, chemistry: "LiFePO4" },
  { name: "EcoFlow Delta 2 Max", capacity: 2048, surge: 2400, price: 1499, chemistry: "LiFePO4" },
  { name: "EcoFlow Delta Pro", capacity: 3600, surge: 3600, price: 2499, chemistry: "LiFePO4" },
  { name: "Bluetti AC200P", capacity: 2000, surge: 4800, price: 1499, chemistry: "LiFePO4" },
  { name: "Bluetti AC300+B300", capacity: 3072, surge: 3000, price: 2299, chemistry: "LiFePO4" },
  { name: "Jackery Explorer 1000 Plus", capacity: 1264, surge: 2000, price: 999, chemistry: "NMC" },
] as const;

const APPLIANCE_DATA: Record<string, { whPerDay: number; surgeW: number }> = {
  "Refrigerator": { whPerDay: 150, surgeW: 2000 },
  "Well pump (½ HP)": { whPerDay: 500, surgeW: 3000 },
  "CPAP machine": { whPerDay: 30, surgeW: 300 },
  "Lights + devices": { whPerDay: 50, surgeW: 200 },
  "Multiple appliances": { whPerDay: 300, surgeW: 2500 },
  "12V cooler": { whPerDay: 100, surgeW: 400 },
};

const DAYS_MAP: Record<string, number> = {
  "1 night": 1,
  "2 days": 2,
  "3 days": 3,
  "5+ days": 5,
};

const SCENARIOS = [
  "Home backup / Power outage",
  "Camping (weekend)",
  "Overlanding / Extended trips",
  "Rural cabin / Off-grid",
  "Beach / Day trip",
  "Medical device at home",
  "RV / Van life",
];

type Product = (typeof PRODUCTS)[number];
type Pick = { product: Product; label: "Best Match" | "Best Value" | "Premium Pick"; reason: string };

function computePicks(
  appliance: string,
  days: string,
  budget: number,
): { picks: Pick[]; requiredWh: number; requiredSurge: number; outOfBudget: boolean } {
  const a = APPLIANCE_DATA[appliance];
  const d = DAYS_MAP[days];
  const requiredWh = Math.round(a.whPerDay * d * 1.2);
  const requiredSurge = a.surgeW;

  const surgeOk = PRODUCTS.filter((p) => p.surge >= requiredSurge);
  const inBudget = surgeOk.filter((p) => p.price <= budget);
  const premiumBudget = budget * 1.3;

  const covering = inBudget.filter((p) => p.capacity >= requiredWh);
  const bestMatch =
    [...covering].sort((a, b) => a.capacity - b.capacity)[0] ||
    [...inBudget].sort((a, b) => b.capacity - a.capacity)[0];

  const bestValue = [...inBudget]
    .filter((p) => p !== bestMatch)
    .sort((a, b) => b.capacity / b.price - a.capacity / a.price)[0];

  const premiumPool = surgeOk.filter((p) => p.price <= premiumBudget && p !== bestMatch && p !== bestValue);
  const premiumPick = [...premiumPool].sort(
    (a, b) =>
      (b.capacity * 0.4 + (b.surge / 100) * 0.3 - (b.price / 1000) * 0.3) -
      (a.capacity * 0.4 + (a.surge / 100) * 0.3 - (a.price / 1000) * 0.3),
  )[0];

  const raw: Array<{ p: Product | undefined; label: Pick["label"] }> = [
    { p: bestMatch, label: "Best Match" },
    { p: bestValue, label: "Best Value" },
    { p: premiumPick, label: "Premium Pick" },
  ];

  // If we couldn't find 3 within budget, fall back to nearest surge-capable models.
  const outOfBudget = raw.some((r) => !r.p);
  if (outOfBudget) {
    const fallback = [...surgeOk].sort((a, b) => a.price - b.price);
    let idx = 0;
    raw.forEach((r) => {
      if (!r.p) {
        while (idx < fallback.length && raw.some((x) => x.p === fallback[idx])) idx++;
        r.p = fallback[idx++];
      }
    });
  }

  const picks: Pick[] = raw
    .filter((r): r is { p: Product; label: Pick["label"] } => !!r.p)
    .map(({ p, label }) => {
      let reason = "";
      if (label === "Best Match")
        reason = `Smallest unit covering ${requiredWh.toLocaleString()} Wh with ${requiredSurge.toLocaleString()} W surge headroom.`;
      else if (label === "Best Value")
        reason = `Best capacity-per-dollar ratio (${(p.capacity / p.price).toFixed(2)} Wh/$).`;
      else
        reason = `Highest combined score on capacity, surge and price.`;
      return { product: p, label, reason };
    });

  return { picks, requiredWh, requiredSurge, outOfBudget };
}

const APPLIANCE_KEYS = Object.keys(APPLIANCE_DATA);
const DAYS_KEYS = Object.keys(DAYS_MAP);

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
  if (kind === "home")
    return (
      <svg {...common}>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
      </svg>
    );
  if (kind === "fridge")
    return (
      <svg {...common}>
        <rect x="5" y="2.5" width="14" height="19" rx="2" />
        <path d="M5 10h14M8 6v2M8 14v3" />
      </svg>
    );
  if (kind === "dollar")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2M12 6v12" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: "home" | "fridge" | "dollar" | "calendar";
  children: React.ReactNode;
}) {
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

export function SolarCalculator() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [appliance, setAppliance] = useState("Refrigerator");
  const [budget, setBudget] = useState("1500");
  const [days, setDays] = useState("2 days");
  const [result, setResult] = useState<ReturnType<typeof computePicks> | null>(null);

  const onSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const b = parseInt(budget || "0", 10) || 0;
    setResult(computePicks(appliance, days, b));
  };

  const selectCls =
    "w-full appearance-none bg-transparent text-[14px] text-neutral-900 outline-none cursor-pointer";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[16px] bg-white p-7 md:p-9"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
    >
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field label="SCENARIO" icon="home">
          <select className={selectCls} value={scenario} onChange={(e) => setScenario(e.target.value)}>
            {SCENARIOS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="KEY APPLIANCE" icon="fridge">
          <select className={selectCls} value={appliance} onChange={(e) => setAppliance(e.target.value)}>
            {APPLIANCE_KEYS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="BUDGET (USD)" icon="dollar">
          <input
            type="number"
            min={200}
            max={15000}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={selectCls}
          />
        </Field>
        <Field label="DAYS OF COVERAGE" icon="calendar">
          <select className={selectCls} value={days} onChange={(e) => setDays(e.target.value)}>
            {DAYS_KEYS.map((s) => <option key={s} value={s}>{s}</option>)}
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
              Closest options outside your budget:
            </p>
          )}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {result.picks.map((p, i) => (
              <div
                key={p.product.name}
                className="rounded-[12px] border bg-white p-4 opacity-0 animate-fade-in"
                style={{
                  borderColor: "#E2E2E2",
                  borderTop: p.label === "Best Match" ? "3px solid #2563EB" : undefined,
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#2563EB]">
                  {p.label}
                </p>
                <h3 className="mt-1 text-[15.5px] font-semibold leading-tight text-neutral-950">
                  {p.product.name}
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-y-1 text-[12.5px] tabular-nums text-neutral-700">
                  <span className="text-neutral-500">Capacity</span>
                  <span className="text-right">{p.product.capacity.toLocaleString()} Wh</span>
                  <span className="text-neutral-500">Surge</span>
                  <span className="text-right">{p.product.surge.toLocaleString()} W</span>
                  <span className="text-neutral-500">Price</span>
                  <span className="text-right">${p.product.price.toLocaleString()}</span>
                  <span className="text-neutral-500">Chemistry</span>
                  <span className="text-right">{p.product.chemistry}</span>
                </div>
                <p className="mt-3 text-[12px] leading-[1.5] text-neutral-600">{p.reason}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11.5px] text-neutral-500">
            Required: {result.requiredWh.toLocaleString()} Wh · Surge: {result.requiredSurge.toLocaleString()} W ·
            Budget: ${(parseInt(budget || "0", 10) || 0).toLocaleString()}
          </p>
        </div>
      )}
    </form>
  );
}
