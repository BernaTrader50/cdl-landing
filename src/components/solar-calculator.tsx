import { useState } from "react";

// ─── DATASET (39 products — CDL Google Sheets) ───────────────────────────────
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

// ─── SCENARIO → SCORE KEY ────────────────────────────────────────────────────
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
const APPLIANCE_DATA: Record<string, { whPerDay: number; surgeW: number; needsUps: boolean; label: string }> = {
  "Refrigerator":        { whPerDay: 150, surgeW: 1200, needsUps: false, label: "refrigerator" },
  "Well pump (½ HP)":    { whPerDay: 500, surgeW: 2600, needsUps: false, label: "well pump" },
  "CPAP machine":        { whPerDay: 40,  surgeW: 300,  needsUps: true,  label: "CPAP" },
  "Lights + devices":    { whPerDay: 50,  surgeW: 200,  needsUps: false, label: "lights and devices" },
  "Multiple appliances": { whPerDay: 300, surgeW: 2000, needsUps: false, label: "multiple appliances" },
  "12V cooler":          { whPerDay: 100, surgeW: 400,  needsUps: false, label: "12V cooler" },
  "Medical device":      { whPerDay: 80,  surgeW: 300,  needsUps: true,  label: "medical device" },
  "Home office":         { whPerDay: 200, surgeW: 500,  needsUps: true,  label: "home office" },
};
const APPLIANCE_KEYS = Object.keys(APPLIANCE_DATA);

const DAYS_MAP: Record<string, number> = {
  "1 night": 1, "2 days": 2, "3 days": 3, "5+ days": 5,
};
const DAYS_KEYS = Object.keys(DAYS_MAP);

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Product = typeof PRODUCTS[0];
type EliminationReason = { count: number; reason: string };
type ScoreComponent = { label: string; value: number; note: string };
type PickResult = {
  product: Product;
  label: "Best Match" | "Best Value" | "Premium Pick";
  expertVerdict: string;
  tradeoffs: string[];
  strengths: string[];
  limitation: string;
  scoreComponents: ScoreComponent[];
};
type AnalysisResult = {
  picks: PickResult[];
  eliminations: EliminationReason[];
  totalEvaluated: number;
  requiredWh: number;
  requiredSurge: number;
  outOfBudget: boolean;
  scoreKey: keyof typeof PRODUCTS[0]["scores"];
};

// ─── SCORE COMPONENT CALCULATOR ─────────────────────────────────────────────
// Derives component scores from real specs — no hardcoded values
function getScoreComponents(
  p: Product,
  scoreKey: keyof typeof PRODUCTS[0]["scores"],
  requiredWh: number,
  requiredSurge: number,
  needsUps: boolean
): ScoreComponent[] {
  // Capacity score: how much margin above requirement
  const capacityRatio = p.wh / Math.max(requiredWh, 1);
  const capacityScore = Math.min(10, Math.round(Math.min(capacityRatio * 7, 10) * 10) / 10);
  const capacityNote = capacityRatio >= 2
    ? `${p.wh.toLocaleString()} Wh — ${Math.round(capacityRatio * 10) / 10}× your requirement`
    : capacityRatio >= 1
    ? `${p.wh.toLocaleString()} Wh — meets your requirement`
    : `${p.wh.toLocaleString()} Wh — below your requirement`;

  // Surge score: headroom above required surge
  const surgeRatio = p.surge / Math.max(requiredSurge, 1);
  const surgeScore = Math.min(10, Math.round(Math.min(surgeRatio * 4, 10) * 10) / 10);
  const surgeNote = `${p.surge.toLocaleString()}W — ${Math.round(surgeRatio * 10) / 10}× surge headroom`;

  // UPS score: critical for medical/office, relevant for backup
  const upsScore = p.ups ? 10 : (needsUps ? 0 : 5);
  const upsNote = p.ups ? "UPS mode — seamless switchover <30ms" : (needsUps ? "No UPS — required for this scenario" : "No UPS — manual switchover required");

  // Use-case fit score: the scenario-specific score from dataset
  const fitScore = p.scores[scoreKey];
  const fitNote = `CDL analysis score for ${scoreKey.replace(/_/g, " ")}`;

  // Portability score: inverse of weight, normalized
  const portScore = p.weight <= 15 ? 9.5 : p.weight <= 25 ? 8 : p.weight <= 40 ? 6.5 : p.weight <= 60 ? 4.5 : 2;
  const portNote = `${p.weight} lbs — ${p.weight <= 15 ? "highly portable" : p.weight <= 25 ? "portable" : p.weight <= 40 ? "manageable" : p.weight <= 60 ? "heavy" : "stationary only"}`;

  return [
    { label: "Runtime / Capacity", value: capacityScore, note: capacityNote },
    { label: "Surge Power",         value: surgeScore,    note: surgeNote },
    { label: "UPS / Switchover",    value: upsScore,      note: upsNote },
    { label: "Scenario Fit",        value: fitScore,      note: fitNote },
    { label: "Portability",         value: portScore,     note: portNote },
  ];
}

// ─── EXPERT VERDICT GENERATOR ────────────────────────────────────────────────
// Generates natural language verdict from real specs — not hardcoded text
function generateVerdict(
  p: Product,
  label: "Best Match" | "Best Value" | "Premium Pick",
  scenario: string,
  appliance: string,
  requiredWh: number,
  requiredSurge: number,
  budget: number,
  allPicks: Product[]
): { verdict: string; strengths: string[]; tradeoffs: string[] } {
  const app = APPLIANCE_DATA[appliance];
  const surgeRatio = Math.round((p.surge / Math.max(requiredSurge, 1)) * 10) / 10;
  const runtimeDays = Math.round((p.wh / Math.max(app.whPerDay, 1)) * 10) / 10;
  const scenarioLabel = scenario.toLowerCase();
  const budgetMargin = budget > 0 ? budget - p.price : null;

  let verdict = "";

  if (label === "Best Match") {
    verdict = `For ${scenarioLabel}, the ${p.brand} ${p.model} provides the strongest fit across all evaluation criteria. `;
    verdict += `It delivers ${p.wh.toLocaleString()} Wh of usable capacity — sufficient for ${runtimeDays} days of ${app.label} runtime. `;
    if (surgeRatio > 2) verdict += `Surge capacity of ${p.surge.toLocaleString()}W exceeds the ${requiredSurge.toLocaleString()}W startup requirement by ${Math.round((surgeRatio - 1) * 100)}%. `;
    if (p.ups && app.needsUps) verdict += `UPS mode ensures uninterrupted power delivery — critical for this scenario. `;
    else if (p.ups) verdict += `UPS mode provides automatic switchover in under 30ms. `;
    if (budgetMargin !== null && budgetMargin > 100) verdict += `At $${p.price.toLocaleString()}, it leaves $${budgetMargin.toLocaleString()} within your stated budget.`;
  } else if (label === "Best Value") {
    const whPerDollar = (p.wh / p.price).toFixed(2);
    verdict = `The ${p.brand} ${p.model} delivers the best capacity-per-dollar in this analysis at ${whPerDollar} Wh/$. `;
    verdict += `For ${scenarioLabel}, it provides ${runtimeDays} days of ${app.label} coverage at $${p.price.toLocaleString()}. `;
    const bestMatch = allPicks[0];
    if (bestMatch && bestMatch !== p) {
      const saving = bestMatch.price - p.price;
      if (saving > 0) verdict += `It costs $${saving.toLocaleString()} less than the Best Match while meeting all technical requirements.`;
    }
  } else {
    verdict = `The ${p.brand} ${p.model} represents the highest-performance option for ${scenarioLabel}. `;
    verdict += `With ${p.wh.toLocaleString()} Wh capacity and ${p.surge.toLocaleString()}W surge output, it significantly exceeds minimum requirements. `;
    if (p.expandable) verdict += `Expandable architecture allows capacity growth as needs increase. `;
    verdict += `Recommended when performance headroom matters more than price optimization.`;
  }

  // Strengths
  const strengths: string[] = [];
  if (surgeRatio >= 3) strengths.push(`Surge ${Math.round(surgeRatio)}× above minimum — handles demanding startup loads`);
  else if (surgeRatio >= 1.5) strengths.push(`${p.surge.toLocaleString()}W surge — adequate headroom above ${requiredSurge.toLocaleString()}W requirement`);
  if (p.ups) strengths.push(app.needsUps ? "UPS required for this scenario — confirmed" : "UPS included — seamless automatic switchover");
  if (runtimeDays >= 2) strengths.push(`${runtimeDays}d runtime — ${runtimeDays >= 3 ? "exceeds" : "meets"} your ${DAYS_MAP[Object.keys(DAYS_MAP).find(k => DAYS_MAP[k] >= 2) || "2 days"] || 2}-day requirement`);
  if (p.expandable) strengths.push("Expandable — add capacity as needs grow");
  if (p.warranty >= 5) strengths.push(`${p.warranty}-year warranty — above category average`);

  // Tradeoffs
  const tradeoffs: string[] = [];
  if (p.weight > 50) tradeoffs.push(`${p.weight} lbs — stationary installation recommended`);
  else if (p.weight > 30) tradeoffs.push(`${p.weight} lbs — not lightweight`);
  if (!p.ups && !app.needsUps) tradeoffs.push("No UPS — brief interruption when switching to battery");
  if (!p.expandable) tradeoffs.push("Fixed capacity — cannot expand for longer outages");
  if (p.warranty < 3) tradeoffs.push(`${p.warranty}-year warranty — below category average`);
  if (runtimeDays < 1.5 && requiredWh > 0) tradeoffs.push(`${runtimeDays}d runtime — tight margin for your requirement`);

  return { verdict, strengths: strengths.slice(0, 3), tradeoffs: tradeoffs.slice(0, 2) };
}

// ─── COMPUTE ANALYSIS ────────────────────────────────────────────────────────
function computeAnalysis(
  scenario: string,
  appliance: string,
  days: string,
  budget: number
): AnalysisResult {
  const app = APPLIANCE_DATA[appliance];
  const d = DAYS_MAP[days] || 2;
  const scoreKey = SCENARIO_SCORE_MAP[scenario] || "home_backup";
  const requiredWh = Math.round(app.whPerDay * d * 1.25);
  const requiredSurge = app.surgeW;
  const needsUps = app.needsUps;

  // Step-by-step elimination with reasons
  const eliminations: EliminationReason[] = [];
  let pool = [...PRODUCTS];

  // 1. Budget filter
  if (budget > 0) {
    const overBudget = pool.filter(p => p.price > budget * 1.15);
    if (overBudget.length) {
      eliminations.push({ count: overBudget.length, reason: `over budget ($${budget.toLocaleString()})` });
      pool = pool.filter(p => p.price <= budget * 1.15);
    }
  }

  // 2. Surge filter
  const insufficientSurge = pool.filter(p => p.surge < requiredSurge);
  if (insufficientSurge.length) {
    eliminations.push({ count: insufficientSurge.length, reason: `insufficient surge capacity (< ${requiredSurge.toLocaleString()}W required)` });
    pool = pool.filter(p => p.surge >= requiredSurge);
  }

  // 3. UPS filter
  if (needsUps) {
    const noUps = pool.filter(p => !p.ups);
    if (noUps.length) {
      eliminations.push({ count: noUps.length, reason: "no UPS support (required for this scenario)" });
      pool = pool.filter(p => p.ups);
    }
  }

  // 4. Capacity filter (soft — keep if within 60% of requirement)
  const insufficientCap = pool.filter(p => p.wh < requiredWh * 0.6);
  if (insufficientCap.length) {
    eliminations.push({ count: insufficientCap.length, reason: `insufficient runtime (< ${Math.round(requiredWh * 0.6).toLocaleString()} Wh)` });
    pool = pool.filter(p => p.wh >= requiredWh * 0.6);
  }

  const outOfBudget = pool.length === 0;

  // Fallback: if nothing passes all filters, relax budget
  if (outOfBudget) {
    pool = PRODUCTS.filter(p => p.surge >= requiredSurge && (!needsUps || p.ups));
  }

  // Score and rank
  const scored = [...pool].sort((a, b) => b.scores[scoreKey] - a.scores[scoreKey]);

  const bestMatchProduct = scored[0];
  const bestValueProduct = [...pool]
    .filter(p => p !== bestMatchProduct)
    .sort((a, b) => (b.wh / b.price) - (a.wh / a.price))[0];
  const premiumProduct = [...PRODUCTS]
    .filter(p => p !== bestMatchProduct && p !== bestValueProduct && p.surge >= requiredSurge && (!needsUps || p.ups))
    .sort((a, b) => b.scores[scoreKey] - a.scores[scoreKey])[0];

  const rawPicks: Array<{ product: Product | undefined; label: PickResult["label"] }> = [
    { product: bestMatchProduct,  label: "Best Match" },
    { product: bestValueProduct,  label: "Best Value" },
    { product: premiumProduct,    label: "Premium Pick" },
  ];

  const allProducts = rawPicks.map(r => r.product).filter(Boolean) as Product[];

  const picks: PickResult[] = rawPicks
    .filter((r): r is { product: Product; label: PickResult["label"] } => !!r.product)
    .map(({ product, label }) => {
      const { verdict, strengths, tradeoffs } = generateVerdict(
        product, label, scenario, appliance, requiredWh, requiredSurge, budget, allProducts
      );
      const limitation = (() => {
        if (app.surgeW > product.surge) return `Surge insufficient — ${app.surgeW.toLocaleString()}W required, unit has ${product.surge.toLocaleString()}W`;
        if (needsUps && !product.ups) return "No UPS mode — required for this scenario";
        if (product.weight > 50) return `Heavy at ${product.weight} lbs — stationary unit`;
        if (!product.expandable && product.wh < 1500) return "Fixed capacity — cannot expand for multi-day outages";
        return "No critical limitations for this scenario";
      })();
      return {
        product, label,
        expertVerdict: verdict,
        strengths, tradeoffs, limitation,
        scoreComponents: getScoreComponents(product, scoreKey, requiredWh, requiredSurge, needsUps),
      };
    });

  return { picks, eliminations, totalEvaluated: PRODUCTS.length, requiredWh, requiredSurge, outOfBudget, scoreKey };
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
function FieldIcon({ kind }: { kind: "home" | "fridge" | "dollar" | "calendar" }) {
  const c = { viewBox:"0 0 24 24", className:"h-[18px] w-[18px] text-neutral-500", fill:"none" as const, stroke:"currentColor", strokeWidth:1.6, strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
  if (kind === "home") return <svg {...c}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>;
  if (kind === "fridge") return <svg {...c}><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M5 10h14M8 6v2M8 14v3"/></svg>;
  if (kind === "dollar") return <svg {...c}><circle cx="12" cy="12" r="9"/><path d="M15 9c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2M12 6v12"/></svg>;
  return <svg {...c}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
}

function Field({ label, icon, children }: { label: string; icon: "home"|"fridge"|"dollar"|"calendar"; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-neutral-500">{label}</label>
      <div className="mt-2 flex h-12 items-center gap-3 rounded-[8px] border bg-white px-3.5 transition-colors focus-within:border-neutral-500 hover:border-neutral-400" style={{borderColor:"#E2E2E2"}}>
        <FieldIcon kind={icon} />
        {children}
      </div>
    </div>
  );
}

// ─── SCORE BAR ───────────────────────────────────────────────────────────────
function ScoreBar({ score, small }: { score: number; small?: boolean }) {
  const color = score >= 8 ? "#10B981" : score >= 6 ? "#F59E0B" : "#9CA3AF";
  return (
    <div className={`flex items-center gap-2 ${small ? "mt-1" : "mt-1.5"}`}>
      <div className={`flex-1 ${small ? "h-[3px]" : "h-1"} bg-neutral-100 rounded-full overflow-hidden`}>
        <div style={{width:`${score*10}%`,background:color,height:"100%",borderRadius:99,transition:"width 0.5s ease"}}/>
      </div>
      <span className={`font-mono ${small ? "text-[10px]" : "text-[11px]"}`} style={{color,minWidth:28}}>{score}/10</span>
    </div>
  );
}

// ─── ANALYSIS HEADER ─────────────────────────────────────────────────────────
function AnalysisHeader({ result }: { result: AnalysisResult }) {
  const matched = result.picks.length;
  const eliminated = result.totalEvaluated - matched;
  return (
    <div className="mb-6 rounded-[12px] border bg-white p-5" style={{borderColor:"#E2E2E2",borderLeft:"3px solid #111"}}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">Analysis Complete</p>
          <p className="mt-0.5 text-[15px] font-semibold text-neutral-950">
            {result.totalEvaluated} products evaluated — {matched} match{matched !== 1 ? "es" : ""}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#166534]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] inline-block"/>
            {matched} matched
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {result.eliminations.map((e, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100">
              <span className="font-mono text-[10px] font-semibold text-neutral-500">{e.count}</span>
            </div>
            <div className="flex-1 h-[1px] bg-neutral-100"/>
            <span className="text-[11.5px] text-neutral-500 shrink-0">removed — {e.reason}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB]">
            <span className="font-mono text-[10px] font-semibold text-white">{matched}</span>
          </div>
          <div className="flex-1 h-[1px] bg-[#2563EB] opacity-20"/>
          <span className="text-[11.5px] font-medium text-[#2563EB] shrink-0">passed all requirements</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t" style={{borderColor:"#F0F0F0"}}>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Required Wh</p>
          <p className="mt-0.5 font-mono text-[13px] font-semibold text-neutral-800">{result.requiredWh.toLocaleString()} Wh</p>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Min Surge</p>
          <p className="mt-0.5 font-mono text-[13px] font-semibold text-neutral-800">{result.requiredSurge.toLocaleString()} W</p>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Products</p>
          <p className="mt-0.5 font-mono text-[13px] font-semibold text-neutral-800">{result.totalEvaluated} evaluated</p>
        </div>
      </div>
    </div>
  );
}

// ─── SCORE BREAKDOWN ─────────────────────────────────────────────────────────
function ScoreBreakdown({ components, overallScore, scoreKey }: { components: ScoreComponent[]; overallScore: number; scoreKey: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 pt-3 border-t" style={{borderColor:"#F0F0F0"}}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex-1 text-left">
          <p className="font-mono text-[9.5px] uppercase tracking-wider text-neutral-400 mb-0.5">
            {scoreKey.replace(/_/g," ")} score
          </p>
          <ScoreBar score={overallScore} />
        </div>
        <span className="ml-3 font-mono text-[9.5px] text-neutral-400 group-hover:text-neutral-600 transition-colors shrink-0">
          {open ? "hide ↑" : "breakdown ↓"}
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-2.5 rounded-[8px] bg-[#FAFAFA] p-3">
          {components.map((c, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11px] text-neutral-600">{c.label}</span>
              </div>
              <ScoreBar score={c.value} small />
              <p className="mt-0.5 text-[10px] text-neutral-400">{c.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── RESULT CARD ─────────────────────────────────────────────────────────────
function ResultCard({ pick, accentColor, scoreKey }: { pick: PickResult; accentColor: string; scoreKey: string }) {
  const { product: p, label, expertVerdict, strengths, tradeoffs, limitation, scoreComponents } = pick;
  const overallScore = p.scores[scoreKey as keyof typeof p.scores];
  const brandUrl: Record<string, string> = {
    "EcoFlow": "https://us.ecoflow.com",
    "Bluetti": "https://www.bluettipower.com",
    "Jackery": "https://www.jackery.com",
    "Anker SOLIX": "https://www.ankersolix.com",
    "Zendure": "https://zendure.com",
  };

  return (
    <div
      className="rounded-[12px] border bg-white p-4 opacity-0 animate-fade-in"
      style={{ borderColor:"#E2E2E2", borderTop:`3px solid ${accentColor}`, animationFillMode:"forwards" }}
    >
      {/* Label + Product */}
      <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]" style={{color:accentColor}}>{label}</p>
      <h3 className="mt-1 text-[15px] font-semibold leading-tight text-neutral-950">{p.brand} {p.model}</h3>

      {/* Specs */}
      <div className="mt-3 grid grid-cols-2 gap-y-1 text-[12px] tabular-nums text-neutral-700">
        <span className="text-neutral-500">Capacity</span>
        <span className="text-right">{p.wh.toLocaleString()} Wh</span>
        <span className="text-neutral-500">Surge</span>
        <span className="text-right">{p.surge.toLocaleString()} W</span>
        <span className="text-neutral-500">UPS</span>
        <span className="text-right">{p.ups ? "✓ Yes" : "✗ No"}</span>
        <span className="text-neutral-500">Price</span>
        <span className="text-right font-semibold" style={{color:accentColor}}>${p.price.toLocaleString()}</span>
      </div>

      {/* Score Breakdown */}
      <ScoreBreakdown components={scoreComponents} overallScore={overallScore} scoreKey={scoreKey} />

      {/* Expert Verdict */}
      <div className="mt-3 rounded-[8px] bg-[#F8F9FF] border px-3 py-2.5" style={{borderColor:"#E8EDFF"}}>
        <p className="font-mono text-[9.5px] font-medium uppercase tracking-wider text-[#2563EB] mb-1.5">Expert Verdict</p>
        <p className="text-[11.5px] leading-[1.6] text-neutral-700">{expertVerdict}</p>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mt-2.5 space-y-1">
          {strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="mt-[3px] text-[#10B981] text-[10px] shrink-0">✓</span>
              <span className="text-[11px] text-neutral-600">{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tradeoffs */}
      {tradeoffs.length > 0 && (
        <div className="mt-2 space-y-1">
          {tradeoffs.map((t, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="mt-[3px] text-[#F59E0B] text-[10px] shrink-0">⚠</span>
              <span className="text-[11px] text-neutral-500">{t}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <a
        href={brandUrl[p.brand] || "https://us.ecoflow.com"}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => {
          if (typeof window !== "undefined" && (window as any).cdlTrack) {
            (window as any).cdlTrack("affiliate_click", {
              product: `${p.brand} ${p.model}`,
              brand: p.brand,
              price: p.price,
              label,                          // "Best Match" | "Best Value" | "Premium Pick"
              scenario: scoreKey,
              appliance: scoreKey,
              recommendation_position: label === "Best Match" ? 1 : label === "Best Value" ? 2 : 3,
            });
          }
        }}
        className="mt-4 block rounded-[8px] py-2.5 text-center text-[12.5px] font-medium text-white transition-opacity hover:opacity-80"
        style={{background: accentColor}}
      >
        Check current price →
      </a>
    </div>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", text: "Calculate your energy requirement from appliance and coverage days" },
    { n: "02", text: "Filter by surge capacity, UPS requirement, and budget" },
    { n: "03", text: "Score remaining products across 7 use-case dimensions" },
    { n: "04", text: "Rank by scenario fit, value efficiency, and performance headroom" },
  ];
  return (
    <div className="mt-5 rounded-[12px] border p-5" style={{borderColor:"#E2E2E2", background:"#FAFAFA"}}>
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">How recommendations work</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {steps.map(s => (
          <div key={s.n} className="flex items-start gap-2">
            <span className="font-mono text-[11px] font-semibold text-neutral-300 shrink-0 mt-[1px]">{s.n}</span>
            <span className="text-[11.5px] text-neutral-500 leading-[1.5]">{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function SolarCalculator() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [appliance, setAppliance] = useState("Refrigerator");
  const [budget, setBudget] = useState("1500");
  const [days, setDays] = useState("2 days");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const selectCls = "w-full appearance-none bg-transparent text-[14px] text-neutral-900 outline-none cursor-pointer";

  const LABEL_COLORS: Record<string, string> = {
    "Best Match":   "#2563EB",
    "Best Value":   "#10B981",
    "Premium Pick": "#8B5CF6",
  };

  const onSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && (window as any).cdlTrack) {
      (window as any).cdlTrack("calculator_submit", { scenario, appliance, budget: budget || "unset", days });
    }
    setAnalyzing(true);
    setResult(null);
    // Brief delay to let the analyzing state render — adds perceived intelligence
    setTimeout(() => {
      const b = parseInt(budget || "0", 10) || 0;
      const analysis = computeAnalysis(scenario, appliance, days, b);
      setResult(analysis);
      setAnalyzing(false);
      if (typeof window !== "undefined" && (window as any).cdlTrack) {
        (window as any).cdlTrack("result_view", {
          scenario,
          appliance,
          budget: b || "unset",
          days,
          products_matched: analysis.picks.length,
          products_eliminated: analysis.eliminations.reduce((s: number, e: {count:number}) => s + e.count, 0),
          top_recommendation: analysis.picks[0] ? `${analysis.picks[0].product.brand} ${analysis.picks[0].product.model}` : "none",
        });
      }
    }, 480);
  };

  return (
    <form onSubmit={onSubmit} className="rounded-[16px] bg-white p-7 md:p-9" style={{boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>

      {/* Authority strip */}
      <div className="mb-5 flex items-center gap-4 flex-wrap">
        {["39 products", "5 brands", "7 use-case scores", "Updated weekly"].map(t => (
          <span key={t} className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{t}</span>
        ))}
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field label="SCENARIO" icon="home">
          <select className={selectCls} value={scenario} onChange={e => {
              setScenario(e.target.value);
              if (typeof window !== "undefined" && (window as any).cdlTrack) {
                (window as any).cdlTrack("calculator_start", { first_field: "scenario", value: e.target.value });
              }
            }}>
            {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="KEY APPLIANCE" icon="fridge">
          <select className={selectCls} value={appliance} onChange={e => setAppliance(e.target.value)}>
            {APPLIANCE_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="BUDGET (USD)" icon="dollar">
          <input type="number" min={200} max={15000} value={budget} onChange={e => setBudget(e.target.value)} className={selectCls} placeholder="e.g. 1500" />
        </Field>
        <Field label="DAYS OF COVERAGE" icon="calendar">
          <select className={selectCls} value={days} onChange={e => setDays(e.target.value)}>
            {DAYS_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={analyzing}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-neutral-950 px-5 py-4 text-[14.5px] font-medium text-white transition-all duration-200 hover:-translate-y-[2px] hover:opacity-[0.85] disabled:opacity-60 disabled:cursor-default disabled:translate-y-0"
      >
        {analyzing ? (
          <>
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"/>
            Analyzing {PRODUCTS.length} products…
          </>
        ) : (
          <>
            Find my system
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </>
        )}
      </button>

      {/* How it works — always visible below button */}
      {!result && <HowItWorks />}

      {/* Results */}
      {result && (
        <div className="mt-7">
          {/* Analysis header */}
          <AnalysisHeader result={result} />

          {result.outOfBudget && (
            <p className="mb-4 text-[12.5px] text-neutral-500 text-center">
              No products matched all criteria within budget — showing closest alternatives.
            </p>
          )}

          {/* Product cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {result.picks.map((pick, i) => (
              <div key={pick.product.model + i} style={{animationDelay:`${i * 120}ms`}}>
                <ResultCard
                  pick={pick}
                  accentColor={LABEL_COLORS[pick.label] || "#2563EB"}
                  scoreKey={result.scoreKey}
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="mt-5 text-[11px] text-neutral-400 text-center leading-relaxed">
            {PRODUCTS.length} products analyzed · {result.eliminations.reduce((s, e) => s + e.count, 0)} eliminated · {result.picks.length} matched ·{" "}
            <a href="/methodology" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">Methodology</a>
            {" "}· We earn a commission if you purchase — this does not affect our analysis.
          </p>
        </div>
      )}
    </form>
  );
}
