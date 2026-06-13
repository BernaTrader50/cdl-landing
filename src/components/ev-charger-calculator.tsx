import { useState, useMemo } from "react";

// ─── DATASET — 49 chargers, 22 brands ───────────────────────────────────────
type Charger = {
  brand: string; model: string; price: number;
  amps_max: number; kw_max: number; connector: string;
  hardwire_or_plug: "hardwire"|"plug"|"both";
  wifi: boolean; app_scheduling: boolean; weatherproof: string;
  cable_ft: number; warranty: number;
  scores: { home_install:number; apartment:number; road_trip_value:number; smart_features:number; reliability:number; value:number };
};

const CHARGERS: Charger[] = [
  { brand:"ChargePoint", model:"Home Flex", price:494, amps_max:50, kw_max:12, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"IP55", cable_ft:23, warranty:3, scores:{home_install:9,apartment:5,road_trip_value:7,smart_features:9,reliability:8,value:8} },
  { brand:"Wallbox", model:"Pulsar Plus", price:649, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"IP54", cable_ft:25, warranty:3, scores:{home_install:9,apartment:6,road_trip_value:6,smart_features:9,reliability:8,value:7} },
  { brand:"Wallbox", model:"Quasar 2", price:6499, amps_max:32, kw_max:11.5, connector:"NACS", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"IP54", cable_ft:20, warranty:3, scores:{home_install:6,apartment:1,road_trip_value:3,smart_features:10,reliability:7,value:4} },
  { brand:"Wallbox", model:"Pulsar Pro", price:799, amps_max:48, kw_max:11.5, connector:"J1772", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"IP55", cable_ft:25, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:6,smart_features:9,reliability:8,value:7} },
  { brand:"Emporia", model:"Level 2 EV Charger", price:429, amps_max:48, kw_max:11.5, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 3R", cable_ft:24, warranty:3, scores:{home_install:9,apartment:5,road_trip_value:7,smart_features:9,reliability:8,value:9} },
  { brand:"Emporia", model:"Level 2 EV Charger (NACS)", price:429, amps_max:48, kw_max:11.5, connector:"NACS", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 3R", cable_ft:24, warranty:3, scores:{home_install:9,apartment:5,road_trip_value:7,smart_features:9,reliability:8,value:9} },
  { brand:"Grizzl-E", model:"Classic", price:300, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:false, app_scheduling:false, weatherproof:"NEMA 4", cable_ft:24, warranty:3, scores:{home_install:8,apartment:6,road_trip_value:7,smart_features:2,reliability:9,value:10} },
  { brand:"Grizzl-E", model:"Smart", price:439, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:24, warranty:3, scores:{home_install:8,apartment:6,road_trip_value:7,smart_features:7,reliability:9,value:8} },
  { brand:"Grizzl-E", model:"Duo", price:579, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:24, warranty:3, scores:{home_install:8,apartment:4,road_trip_value:7,smart_features:7,reliability:9,value:7} },
  { brand:"Autel", model:"MaxiCharger AC Wallbox", price:549, amps_max:50, kw_max:12, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:25, warranty:3, scores:{home_install:9,apartment:5,road_trip_value:7,smart_features:9,reliability:8,value:8} },
  { brand:"Autel", model:"MaxiCharger AC Lite", price:399, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:18, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:6,smart_features:7,reliability:8,value:8} },
  { brand:"Tesla", model:"Wall Connector Gen 3", price:475, amps_max:48, kw_max:11.5, connector:"NACS", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"NEMA 3R", cable_ft:24, warranty:4, scores:{home_install:9,apartment:4,road_trip_value:5,smart_features:8,reliability:9,value:8} },
  { brand:"Tesla", model:"Universal Wall Connector", price:580, amps_max:48, kw_max:11.5, connector:"NACS+J1772 adapter", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"NEMA 3R", cable_ft:24, warranty:4, scores:{home_install:9,apartment:4,road_trip_value:8,smart_features:8,reliability:9,value:8} },
  { brand:"JuiceBox", model:"40", price:549, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:25, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:6,smart_features:8,reliability:7,value:7} },
  { brand:"ClipperCreek", model:"HCS-40", price:489, amps_max:32, kw_max:7.7, connector:"J1772", hardwire_or_plug:"hardwire", wifi:false, app_scheduling:false, weatherproof:"NEMA 4", cable_ft:25, warranty:3, scores:{home_install:8,apartment:6,road_trip_value:6,smart_features:1,reliability:10,value:7} },
  { brand:"ClipperCreek", model:"HCS-50", price:579, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"hardwire", wifi:false, app_scheduling:false, weatherproof:"NEMA 4", cable_ft:25, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:6,smart_features:1,reliability:10,value:7} },
  { brand:"Siemens", model:"VersiCharge", price:399, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:false, app_scheduling:false, weatherproof:"NEMA 4", cable_ft:20, warranty:3, scores:{home_install:7,apartment:5,road_trip_value:6,smart_features:1,reliability:8,value:7} },
  { brand:"Blink", model:"HQ 200", price:699, amps_max:50, kw_max:12, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:23, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:6,smart_features:7,reliability:6,value:6} },
  { brand:"evec", model:"E-Hub Pro", price:579, amps_max:32, kw_max:7.4, connector:"Type 2", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"IP65", cable_ft:25, warranty:3, scores:{home_install:8,apartment:4,road_trip_value:5,smart_features:8,reliability:7,value:7} },
  { brand:"Pod Point", model:"Solo 3", price:799, amps_max:32, kw_max:7.4, connector:"Type 2", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"IP65", cable_ft:25, warranty:3, scores:{home_install:8,apartment:3,road_trip_value:5,smart_features:8,reliability:8,value:6} },
  { brand:"Lectron", model:"V-BOX", price:399, amps_max:40, kw_max:9.6, connector:"NACS", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:24, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:7,smart_features:6,reliability:6,value:8} },
  { brand:"Megear", model:"MA-EVSE03", price:259, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:false, app_scheduling:false, weatherproof:"IP65", cable_ft:25, warranty:1, scores:{home_install:6,apartment:6,road_trip_value:6,smart_features:1,reliability:5,value:9} },
  { brand:"ChargePoint", model:"Home Flex (NACS)", price:494, amps_max:50, kw_max:12, connector:"NACS", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"IP55", cable_ft:23, warranty:3, scores:{home_install:9,apartment:5,road_trip_value:8,smart_features:9,reliability:8,value:8} },
  { brand:"Enel X", model:"JuiceBox 48", price:629, amps_max:48, kw_max:11.5, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:25, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:6,smart_features:8,reliability:7,value:7} },
  { brand:"Grizzl-E", model:"Ultimate", price:329, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:false, app_scheduling:false, weatherproof:"NEMA 4", cable_ft:24, warranty:3, scores:{home_install:8,apartment:6,road_trip_value:7,smart_features:2,reliability:9,value:9} },
  { brand:"Autel", model:"MaxiCharger DC Compact", price:3899, amps_max:80, kw_max:20, connector:"NACS+CCS", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"IP54", cable_ft:18, warranty:3, scores:{home_install:4,apartment:1,road_trip_value:9,smart_features:9,reliability:7,value:5} },
  { brand:"Lectron", model:"Level 2 J1772", price:299, amps_max:32, kw_max:7.6, connector:"J1772", hardwire_or_plug:"plug", wifi:false, app_scheduling:false, weatherproof:"IP65", cable_ft:24, warranty:1, scores:{home_install:6,apartment:7,road_trip_value:6,smart_features:1,reliability:5,value:9} },
  { brand:"ESVEL", model:"Smart EV Charger", price:289, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"IP66", cable_ft:25, warranty:2, scores:{home_install:7,apartment:6,road_trip_value:6,smart_features:6,reliability:5,value:9} },
  { brand:"Morec", model:"Level 2 EVSE", price:269, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:false, app_scheduling:false, weatherproof:"IP65", cable_ft:21, warranty:2, scores:{home_install:6,apartment:6,road_trip_value:6,smart_features:1,reliability:5,value:9} },
  { brand:"Tesla", model:"Mobile Connector", price:230, amps_max:32, kw_max:7.7, connector:"NACS", hardwire_or_plug:"plug", wifi:false, app_scheduling:false, weatherproof:"IP55", cable_ft:20, warranty:1, scores:{home_install:5,apartment:7,road_trip_value:9,smart_features:1,reliability:8,value:8} },
  { brand:"Wallbox", model:"Copper SB", price:1299, amps_max:48, kw_max:11.5, connector:"J1772", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"IP54", cable_ft:25, warranty:3, scores:{home_install:7,apartment:3,road_trip_value:6,smart_features:9,reliability:7,value:5} },
  { brand:"Go Zero", model:"Smart Charger 7kW", price:649, amps_max:32, kw_max:7.0, connector:"Type 2", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"IP65", cable_ft:25, warranty:3, scores:{home_install:8,apartment:3,road_trip_value:5,smart_features:8,reliability:6,value:6} },
  { brand:"EVoCharge", model:"EVSE-HT", price:399, amps_max:32, kw_max:7.7, connector:"J1772", hardwire_or_plug:"both", wifi:false, app_scheduling:false, weatherproof:"IP65", cable_ft:18, warranty:3, scores:{home_install:7,apartment:6,road_trip_value:6,smart_features:1,reliability:7,value:8} },
  { brand:"Wallbox", model:"Pulsar Max", price:679, amps_max:48, kw_max:11.5, connector:"NACS", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"IP54", cable_ft:25, warranty:3, scores:{home_install:9,apartment:5,road_trip_value:8,smart_features:9,reliability:8,value:8} },
  { brand:"Autel", model:"MaxiCharger AC Podium", price:899, amps_max:50, kw_max:12, connector:"NACS", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:25, warranty:3, scores:{home_install:8,apartment:2,road_trip_value:7,smart_features:9,reliability:8,value:7} },
  { brand:"Webasto", model:"TurboCord", price:439, amps_max:32, kw_max:7.7, connector:"J1772", hardwire_or_plug:"plug", wifi:false, app_scheduling:false, weatherproof:"NEMA 4", cable_ft:20, warranty:1, scores:{home_install:6,apartment:7,road_trip_value:6,smart_features:1,reliability:7,value:7} },
  { brand:"Bosch", model:"Power Max 2", price:549, amps_max:48, kw_max:11.5, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:24, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:6,smart_features:8,reliability:8,value:7} },
  { brand:"Leviton", model:"EVR-Green 50", price:639, amps_max:40, kw_max:9.6, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:25, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:6,smart_features:7,reliability:8,value:6} },
  { brand:"Lectron", model:"V-BOX Pro 80A", price:599, amps_max:80, kw_max:19.2, connector:"NACS", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:24, warranty:3, scores:{home_install:6,apartment:2,road_trip_value:8,smart_features:6,reliability:6,value:8} },
  { brand:"ChargePoint", model:"Flex (48A hardwire)", price:699, amps_max:48, kw_max:11.5, connector:"J1772", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"IP55", cable_ft:23, warranty:3, scores:{home_install:9,apartment:3,road_trip_value:6,smart_features:9,reliability:8,value:7} },
  { brand:"Emporia", model:"EV Charger Pro 48A", price:499, amps_max:48, kw_max:11.5, connector:"J1772", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"NEMA 3R", cable_ft:24, warranty:3, scores:{home_install:9,apartment:3,road_trip_value:6,smart_features:9,reliability:8,value:8} },
  { brand:"Grizzl-E", model:"Avalon", price:489, amps_max:48, kw_max:11.5, connector:"NACS", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:24, warranty:3, scores:{home_install:8,apartment:5,road_trip_value:8,smart_features:7,reliability:9,value:8} },
  { brand:"Tesla", model:"Wall Connector (Gen 3 4-pack)", price:475, amps_max:48, kw_max:11.5, connector:"NACS", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"NEMA 3R", cable_ft:24, warranty:4, scores:{home_install:8,apartment:2,road_trip_value:5,smart_features:8,reliability:9,value:7} },
  { brand:"Wallbox", model:"Pulsar Plus (16A EU)", price:599, amps_max:16, kw_max:3.7, connector:"Type 2", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"IP54", cable_ft:25, warranty:3, scores:{home_install:7,apartment:8,road_trip_value:3,smart_features:9,reliability:8,value:6} },
  { brand:"Autel", model:"MaxiCharger AC Wallbox (NACS)", price:549, amps_max:50, kw_max:12, connector:"NACS", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:25, warranty:3, scores:{home_install:9,apartment:5,road_trip_value:8,smart_features:9,reliability:8,value:8} },
  { brand:"evec", model:"E-Hub Lite", price:399, amps_max:16, kw_max:3.7, connector:"Type 2", hardwire_or_plug:"hardwire", wifi:false, app_scheduling:false, weatherproof:"IP65", cable_ft:20, warranty:2, scores:{home_install:6,apartment:7,road_trip_value:3,smart_features:1,reliability:6,value:7} },
  { brand:"Pod Point", model:"Solo 3 (Smart)", price:899, amps_max:32, kw_max:7.4, connector:"Type 2", hardwire_or_plug:"hardwire", wifi:true, app_scheduling:true, weatherproof:"IP65", cable_ft:25, warranty:3, scores:{home_install:8,apartment:3,road_trip_value:5,smart_features:9,reliability:8,value:6} },
  { brand:"JuiceBox", model:"32", price:429, amps_max:32, kw_max:7.7, connector:"J1772", hardwire_or_plug:"both", wifi:true, app_scheduling:true, weatherproof:"NEMA 4", cable_ft:24, warranty:3, scores:{home_install:7,apartment:6,road_trip_value:6,smart_features:8,reliability:7,value:8} },
  { brand:"ClipperCreek", model:"HCS-20", price:419, amps_max:16, kw_max:3.8, connector:"J1772", hardwire_or_plug:"hardwire", wifi:false, app_scheduling:false, weatherproof:"NEMA 4", cable_ft:25, warranty:3, scores:{home_install:6,apartment:7,road_trip_value:3,smart_features:1,reliability:10,value:7} },
];

// ─── Affiliate links (Awin where approved, else Amazon search) ─────────────
const AWIN_PUB = "2929639";
const TAG = "clickdecision-20";
function awin(mid: string, ued: string) {
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN_PUB}&ued=${ued}`;
}
function amzSearch(brand: string, model: string) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(brand + " " + model)}&tag=${TAG}`;
}

const AFFILIATE_LINKS: Record<string, string> = {
  // Pod Point (Awin 73493), evec (33447), Go Zero (36016) — once applied
  "Pod Point|Solo 3": amzSearch("Pod Point","Solo 3"),
  "Pod Point|Solo 3 (Smart)": amzSearch("Pod Point","Solo 3 Smart"),
  "evec|E-Hub Pro": amzSearch("evec","E-Hub Pro"),
  "evec|E-Hub Lite": amzSearch("evec","E-Hub Lite"),
  "Go Zero|Smart Charger 7kW": amzSearch("Go Zero","Smart Charger 7kW"),
};
function getLink(brand: string, model: string) {
  return AFFILIATE_LINKS[`${brand}|${model}`] || amzSearch(brand, model);
}

// ─── Scenario inputs ─────────────────────────────────────────────────────────
type Scenario = "single_family" | "apartment" | "frequent_road_trips" | "multi_ev" | "budget";

const SCENARIO_LABELS: Record<Scenario,string> = {
  single_family: "Single-family home, dedicated parking",
  apartment: "Apartment / condo / shared parking",
  frequent_road_trips: "Frequent road trips, need flexibility",
  multi_ev: "Multiple EVs at home",
  budget: "Tight budget, basic charging is fine",
};

type Connector = "any" | "NACS" | "J1772" | "Type 2";
type PanelService = "60A" | "100A" | "200A+";

// ─── Scoring engine ──────────────────────────────────────────────────────────
function computeScore(c: Charger, scenario: Scenario, connector: Connector, panel: PanelService): number {
  let score = 0;

  // Base scenario fit
  switch (scenario) {
    case "single_family": score += c.scores.home_install * 2; break;
    case "apartment": score += c.scores.apartment * 2.5; break;
    case "frequent_road_trips": score += c.scores.road_trip_value * 2.5; break;
    case "multi_ev": score += c.scores.smart_features * 1.5 + c.scores.home_install; break;
    case "budget": score += c.scores.value * 2.5; break;
  }

  // Connector match
  if (connector !== "any") {
    if (c.connector === connector) score += 15;
    else if (c.connector.includes(connector)) score += 8;
    else score -= 10;
  }

  // Panel constraints — penalize high-amp chargers on small panels
  if (panel === "60A" && c.amps_max > 32) score -= 12;
  if (panel === "60A" && c.amps_max <= 32) score += 8;
  if (panel === "100A" && c.amps_max > 48) score -= 5;

  // General quality signals
  score += c.scores.reliability * 0.8;
  score += c.scores.value * 0.5;

  // Price sanity for budget scenario
  if (scenario === "budget" && c.price > 500) score -= (c.price - 500) / 50;

  return Math.round(score * 10) / 10;
}

// ─── UI Components ───────────────────────────────────────────────────────────
function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-24 text-neutral-500 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${value*10}%` }} />
      </div>
      <span className="w-6 text-right text-neutral-400 font-mono">{value}</span>
    </div>
  );
}

function ChargerCard({ charger, score, rank }: { charger: Charger; score: number; rank: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
            {rank === 1 ? "TOP MATCH" : `#${rank} MATCH`}
          </div>
          <h3 className="text-lg font-semibold text-neutral-950">{charger.brand} {charger.model}</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#2563EB]">${charger.price}</div>
          <div className="text-[11px] text-neutral-400">score {score}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[12px] text-neutral-600 mb-4">
        <div>⚡ {charger.amps_max}A / {charger.kw_max}kW max</div>
        <div>🔌 {charger.connector}</div>
        <div>📡 {charger.wifi ? "WiFi + App" : "No app"}</div>
        <div>🛡️ {charger.weatherproof}, {charger.warranty}yr warranty</div>
        <div>📏 {charger.cable_ft}ft cable</div>
        <div>🔧 {charger.hardwire_or_plug}</div>
      </div>

      <div className="space-y-1.5 mb-4">
        <ScoreBar label="Reliability" value={charger.scores.reliability} />
        <ScoreBar label="Smart features" value={charger.scores.smart_features} />
        <ScoreBar label="Value" value={charger.scores.value} />
      </div>

      <a
        href={getLink(charger.brand, charger.model)}
        target="_blank" rel="noopener noreferrer sponsored"
        className="block w-full text-center rounded-lg bg-neutral-950 text-white text-[13px] font-medium py-2.5 hover:bg-neutral-800 transition"
      >
        Check Price →
      </a>
    </div>
  );
}

// ─── Main Calculator ──────────────────────────────────────────────────────────
export function EVChargerCalculator() {
  const [scenario, setScenario] = useState<Scenario>("single_family");
  const [connector, setConnector] = useState<Connector>("any");
  const [panel, setPanel] = useState<PanelService>("100A");

  const results = useMemo(() => {
    return CHARGERS
      .map(c => ({ charger: c, score: computeScore(c, scenario, connector, panel) }))
      .sort((a,b) => b.score - a.score)
      .slice(0, 3);
  }, [scenario, connector, panel]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-neutral-950 mb-2">EV Charger Decision Engine</h2>
        <p className="text-[14px] text-neutral-500">Answer 3 questions to get your top 3 matches from {CHARGERS.length} chargers across {new Set(CHARGERS.map(c=>c.brand)).size} brands.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Your situation</label>
          <select value={scenario} onChange={e => setScenario(e.target.value as Scenario)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[13px]">
            {Object.entries(SCENARIO_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Connector type</label>
          <select value={connector} onChange={e => setConnector(e.target.value as Connector)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[13px]">
            <option value="any">Any / Not sure</option>
            <option value="NACS">NACS (Tesla standard)</option>
            <option value="J1772">J1772</option>
            <option value="Type 2">Type 2 (EU/UK)</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Electrical panel</label>
          <select value={panel} onChange={e => setPanel(e.target.value as PanelService)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[13px]">
            <option value="60A">60A service (older homes)</option>
            <option value="100A">100A service (standard)</option>
            <option value="200A+">200A+ service (modern)</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {results.map((r, i) => (
          <ChargerCard key={`${r.charger.brand}-${r.charger.model}`} charger={r.charger} score={r.score} rank={i+1} />
        ))}
      </div>
    </div>
  );
}
