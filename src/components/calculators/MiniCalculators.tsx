import * as React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Plug,
  BatteryCharging,
  Flame,
  Home as HomeIcon,
  Building2,
  Caravan,
  Car,
  Sun,
  Wallet,
  ShieldCheck,
  Mountain,
  CloudLightning,
  Wrench,
  Fuel,
} from "lucide-react";

function Shell({
  title,
  badge,
  onSubmit,
  children,
  ctaLabel = "Find my system",
}: {
  title: string;
  badge: string;
  onSubmit: () => void;
  children: React.ReactNode;
  ctaLabel?: string;
}) {
  return (
    <div className="bg-white text-neutral-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 bg-neutral-50">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {title}
        </div>
        <span className="text-[11px] font-mono text-neutral-400">{badge}</span>
      </div>
      <div className="p-5 space-y-4">{children}</div>
      <div className="px-5 pb-5">
        <button
          onClick={onSubmit}
          className="inline-flex w-full items-center justify-center gap-2 h-11 rounded-md bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8]"
        >
          {ctaLabel} <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Label({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">{children}</div>
      {right}
    </div>
  );
}

function OptionCard<T extends string>({
  active,
  onClick,
  label,
  sub,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-1.5 py-2 px-2 rounded-md border text-left transition-colors ${
        active ? "border-[#2563eb] bg-blue-50" : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      {Icon && <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${active ? "text-[#2563eb]" : "text-neutral-500"}`} />}
      <div className="min-w-0">
        <div className={`text-[11px] font-medium leading-tight ${active ? "text-[#2563eb]" : "text-neutral-800"}`}>
          {label}
        </div>
        {sub && <div className="text-[10px] text-neutral-500 leading-tight mt-0.5">{sub}</div>}
      </div>
    </button>
  );
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-[11px] font-medium border transition-colors ${
        active
          ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
          : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
      }`}
    >
      {children}
    </button>
  );
}

/* ───────────── EV Charger ───────────── */
const EV_SITUATIONS = [
  { id: "sfh", label: "Single-family", sub: "dedicated parking", icon: HomeIcon },
  { id: "apt", label: "Apartment", sub: "shared parking", icon: Building2 },
  { id: "trip", label: "Road trips", sub: "flexibility", icon: Caravan },
  { id: "multi", label: "Multiple EVs", sub: "at home", icon: Car },
  { id: "budget", label: "Tight budget", sub: "basic charging", icon: Wallet },
];
const EV_CONNECTORS = [
  { id: "any", label: "Any" },
  { id: "nacs", label: "NACS" },
  { id: "j1772", label: "J1772" },
  { id: "type2", label: "Type 2" },
];
const EV_PANELS = [
  { id: "60", label: "60A" },
  { id: "100", label: "100A" },
  { id: "200", label: "200A+" },
];

export function EvCalcCard() {
  const navigate = useNavigate();
  const [situation, setSituation] = useState("sfh");
  const [connector, setConnector] = useState("any");
  const [panel, setPanel] = useState("100");

  return (
    <Shell
      title="EV Charger Calculator"
      badge="49 chargers · weekly"
      onSubmit={() =>
        navigate({
          to: "/ev-chargers",
          search: { situation, connector, panel },
        })
      }
    >
      <div>
        <Label>1 · Your situation</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {EV_SITUATIONS.map((s) => (
            <OptionCard
              key={s.id}
              active={situation === s.id}
              onClick={() => setSituation(s.id)}
              label={s.label}
              sub={s.sub}
              icon={s.icon}
            />
          ))}
        </div>
      </div>
      <div>
        <Label>2 · Connector type</Label>
        <div className="grid grid-cols-4 gap-1">
          {EV_CONNECTORS.map((c) => (
            <PillButton key={c.id} active={connector === c.id} onClick={() => setConnector(c.id)}>
              <Plug className="h-3 w-3" />
              {c.label}
            </PillButton>
          ))}
        </div>
      </div>
      <div>
        <Label>3 · Electrical panel</Label>
        <div className="grid grid-cols-3 gap-1">
          {EV_PANELS.map((p) => (
            <PillButton key={p.id} active={panel === p.id} onClick={() => setPanel(p.id)}>
              {p.label}
            </PillButton>
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* ───────────── Home Battery ───────────── */
const HB_GOALS = [
  { id: "backup", label: "Whole-home backup", sub: "during outages", icon: ShieldCheck },
  { id: "solar", label: "Solar self-use", sub: "use what you make", icon: Sun },
  { id: "offgrid", label: "Off-grid", sub: "independence", icon: BatteryCharging },
  { id: "ev", label: "EV integration", sub: "smart pairing", icon: Car },
  { id: "budget", label: "Budget-friendly", sub: "entry point", icon: Wallet },
];
const HB_SIZES = [
  { id: "s", label: "Small", sub: "1-2 bed" },
  { id: "m", label: "Medium", sub: "3-4 bed" },
  { id: "l", label: "Large", sub: "5+ bed" },
];
const HB_INSTALLS = [
  { id: "pro", label: "Professional", sub: "permitted" },
  { id: "diy", label: "DIY", sub: "portable" },
  { id: "either", label: "Either", sub: "flexible" },
];

export function BatteryCalcCard() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("backup");
  const [size, setSize] = useState("m");
  const [install, setInstall] = useState("pro");

  return (
    <Shell
      title="Home Battery Calculator"
      badge="32 systems · weekly"
      onSubmit={() =>
        navigate({
          to: "/home-batteries",
          search: { goal, size, install },
        })
      }
    >
      <div>
        <Label>1 · Primary goal</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {HB_GOALS.map((g) => (
            <OptionCard
              key={g.id}
              active={goal === g.id}
              onClick={() => setGoal(g.id)}
              label={g.label}
              sub={g.sub}
              icon={g.icon}
            />
          ))}
        </div>
      </div>
      <div>
        <Label>2 · Home size</Label>
        <div className="grid grid-cols-3 gap-1">
          {HB_SIZES.map((s) => (
            <PillButton key={s.id} active={size === s.id} onClick={() => setSize(s.id)}>
              {s.label}
            </PillButton>
          ))}
        </div>
      </div>
      <div>
        <Label>3 · Installation</Label>
        <div className="grid grid-cols-3 gap-1">
          {HB_INSTALLS.map((p) => (
            <PillButton key={p.id} active={install === p.id} onClick={() => setInstall(p.id)}>
              {p.label}
            </PillButton>
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* ───────────── Backup Power ───────────── */
const BP_GOALS = [
  { id: "whole", label: "Whole-home", sub: "every circuit", icon: HomeIcon },
  { id: "essentials", label: "Essentials", sub: "fridge, lights", icon: Plug },
  { id: "offgrid", label: "Off-grid", sub: "cabin, no utility", icon: Mountain },
  { id: "storm", label: "Frequent outages", sub: "storm-prone", icon: CloudLightning },
  { id: "hybrid", label: "Solar hybrid", sub: "gen as backup", icon: Sun },
  { id: "value", label: "Value pick", sub: "best $/kW", icon: Wallet },
];
const BP_LOADS = [
  { id: "ac", label: "AC / Heat", kw: 3.5 },
  { id: "range", label: "Range", kw: 2.5 },
  { id: "dryer", label: "Dryer", kw: 3.0 },
  { id: "well", label: "Well pump", kw: 1.5 },
  { id: "sump", label: "Sump", kw: 0.8 },
  { id: "fridge", label: "Fridge", kw: 0.6 },
  { id: "ev", label: "EV charger", kw: 7.2 },
  { id: "lights", label: "Lights", kw: 1.2 },
  { id: "water", label: "Water htr", kw: 4.5 },
];
const BP_FUELS = [
  { id: "ng", label: "Nat. gas", icon: Flame },
  { id: "lp", label: "Propane", icon: Fuel },
  { id: "diesel", label: "Diesel", icon: Fuel },
  { id: "dual", label: "Dual / Any", icon: Fuel },
];
const BP_SOLARS = [
  { id: "yes", label: "Have", icon: Sun },
  { id: "planning", label: "Planning", icon: Wrench },
  { id: "no", label: "Gen-only", icon: Flame },
];

export function BackupCalcCard() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("whole");
  const [loads, setLoads] = useState<string[]>(["ac", "fridge", "well", "lights"]);
  const [fuel, setFuel] = useState("ng");
  const [solar, setSolar] = useState("no");
  const [budget, setBudget] = useState(8000);

  const connectedKw = useMemo(
    () => BP_LOADS.filter((l) => loads.includes(l.id)).reduce((s, l) => s + l.kw, 0),
    [loads],
  );

  const toggleLoad = (id: string) =>
    setLoads((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  return (
    <Shell
      title="Backup Power Calculator"
      badge="In analysis · weekly"
      onSubmit={() =>
        navigate({
          to: "/backup-power",
          search: {
            goal,
            loads: loads.join(","),
            fuel,
            solar,
            budget,
          },
        })
      }
    >
      <div>
        <Label>1 · Primary goal</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {BP_GOALS.map((g) => (
            <OptionCard
              key={g.id}
              active={goal === g.id}
              onClick={() => setGoal(g.id)}
              label={g.label}
              sub={g.sub}
              icon={g.icon}
            />
          ))}
        </div>
      </div>
      <div>
        <Label right={<span className="text-[10px] font-mono text-neutral-600">{connectedKw.toFixed(1)} kW</span>}>
          2 · Loads to cover
        </Label>
        <div className="flex flex-wrap gap-1">
          {BP_LOADS.map((l) => {
            const active = loads.includes(l.id);
            return (
              <button
                key={l.id}
                onClick={() => toggleLoad(l.id)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] transition-colors ${
                  active
                    ? "border-[#2563eb] bg-[#2563eb] text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <Label>3 · Fuel type</Label>
        <div className="grid grid-cols-4 gap-1">
          {BP_FUELS.map((f) => (
            <PillButton key={f.id} active={fuel === f.id} onClick={() => setFuel(f.id)}>
              <f.icon className="h-3 w-3" />
              {f.label}
            </PillButton>
          ))}
        </div>
      </div>
      <div>
        <Label>4 · Solar + battery integration</Label>
        <div className="grid grid-cols-3 gap-1">
          {BP_SOLARS.map((s) => (
            <PillButton key={s.id} active={solar === s.id} onClick={() => setSolar(s.id)}>
              <s.icon className="h-3 w-3" />
              {s.label}
            </PillButton>
          ))}
        </div>
      </div>
      <div>
        <Label right={<span className="text-[10px] font-semibold text-neutral-900">${budget.toLocaleString()}</span>}>
          5 · Budget
        </Label>
        <input
          type="range"
          min={0}
          max={20000}
          step={500}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-[#2563eb]"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
          <span>$0</span><span>$10k</span><span>$20k</span>
        </div>
      </div>
    </Shell>
  );
}
