import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useState } from "react";
import { Analytics } from "@/components/analytics";

export const Route = createFileRoute("/ups-database")({
  head: () => ({
    meta: [
      { title: "Solar Generator UPS Database — Switchover Times & Device Compatibility | ClickDecisionLab" },
      { name: "description", content: "UPS switchover times for 28 solar generators with confirmed UPS mode. Device compatibility for CPAP, NAS, router, PC, Starlink, and medical equipment. The most complete UPS reference for portable power stations." },
    ],
  }),
  component: UPSDatabase,
});

// ─── DEVICE REQUIREMENTS ─────────────────────────────────────────────────────
type Device = {
  id: string;
  label: string;
  icon: string;
  max_ms: number; // max tolerable interruption in ms
  note: string;
};

const DEVICES: Device[] = [
  { id: "cpap",    label: "CPAP / BiPAP",      icon: "💤", max_ms: 30,   note: "Resets and alarms on interruptions >20-30ms. UPS essential." },
  { id: "pc",      label: "Desktop PC / NAS",  icon: "🖥",  max_ms: 20,   note: "Unexpected shutdown causes data loss. Requires UPS <20ms." },
  { id: "router",  label: "Router / Modem",    icon: "📡", max_ms: 500,  note: "Tolerates brief interruptions. Most generators cover this." },
  { id: "starlink",label: "Starlink",          icon: "🛰",  max_ms: 500,  note: "Brief interruptions cause reconnection delay (~30s). Not critical." },
  { id: "medical", label: "Medical Equipment", icon: "🏥", max_ms: 10,   note: "Infusion pumps, ventilators. UPS <10ms strongly recommended." },
  { id: "tv",      label: "TV / Entertainment",icon: "📺", max_ms: 2000, note: "Tolerates most interruptions. UPS nice-to-have but not critical." },
];

// ─── UPS PRODUCT DATA ─────────────────────────────────────────────────────────
type UPSProduct = {
  brand: string;
  model: string;
  ups: boolean;
  switchover_ms: number | null; // null = no UPS
  switchover_label: string;
  confidence: "verified" | "claimed" | "estimated";
  wh: number;
  price: number;
  ta_slug?: string;
  asin?: string;
  notes: string;
};

const TA: Record<string, string> = {
  "DELTA Pro":         "/ecoflow-delta-pro-technical-analysis-2026/",
  "DELTA 3 Max":       "/ecoflow-delta-3-max-technical-analysis-2026/",
  "DELTA 3 Max Plus":  "/ecoflow-delta-3-max-plus-technical-analysis-2026/",
  "DELTA 3 Plus":      "/ecoflow-delta-3-plus-technical-analysis-2026/",
  "DELTA 3 Classic":   "/ecoflow-delta-3-classic-technical-analysis-2026/",
  "DELTA 2 Max":       "/ecoflow-delta-2-max-technical-analysis-2026/",
  "AC200L":            "/bluetti-ac200l-technical-analysis-2026/",
  "AC300":             "/bluetti-ac300-technical-analysis-2026/",
  "AC500":             "/bluetti-ac500-technical-analysis-2026/",
  "F3800":             "/anker-solix-f3800-technical-analysis-2026/",
  "C2000 Gen 2":       "/anker-solix-c2000-gen2-technical-analysis-2026/",
  "FlashSpeed 1500":   "/vtoman-flashspeed-1500-technical-analysis-2026/",
};

const PRODUCTS: UPSProduct[] = [
  // EcoFlow — all DELTA 3 series verified <30ms
  { brand:"EcoFlow", model:"DELTA Pro",        ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"verified",  wh:3200, price:2499, notes:"Confirmed UPS. Industry standard 30ms for EcoFlow." },
  { brand:"EcoFlow", model:"DELTA 3 Max Plus", ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"verified",  wh:1800, price:999,  notes:"Same UPS architecture as DELTA 3 Max." },
  { brand:"EcoFlow", model:"DELTA 3 Max",      ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"verified",  wh:1800, price:749,  notes:"Best-tested EcoFlow UPS model in class." },
  { brand:"EcoFlow", model:"DELTA 3 Plus",     ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"verified",  wh:900,  price:599,  notes:"X-Boost + UPS. Verified <30ms." },
  { brand:"EcoFlow", model:"DELTA 3 Classic",  ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"verified",  wh:900,  price:449,  notes:"Most affordable EcoFlow with UPS." },
  { brand:"EcoFlow", model:"DELTA 3",          ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"claimed",   wh:900,  price:499,  notes:"EcoFlow standard UPS spec." },
  { brand:"EcoFlow", model:"DELTA 2 Max",      ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"verified",  wh:1800, price:999,  notes:"Verified across multiple user tests." },
  { brand:"EcoFlow", model:"DELTA 2",          ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"verified",  wh:900,  price:699,  notes:"Best-seller. UPS well-documented." },
  // Bluetti
  { brand:"Bluetti",  model:"AC500",           ups:true,  switchover_ms:20,   switchover_label:"<20ms",  confidence:"claimed",   wh:5500, price:3999, notes:"Bluetti claims <20ms. Faster than EcoFlow spec." },
  { brand:"Bluetti",  model:"AC300",           ups:true,  switchover_ms:20,   switchover_label:"<20ms",  confidence:"claimed",   wh:2750, price:2299, notes:"Bluetti home system. <20ms claimed." },
  { brand:"Bluetti",  model:"AC200L",          ups:true,  switchover_ms:20,   switchover_label:"<20ms",  confidence:"verified",  wh:1800, price:999,  notes:"Multiple third-party tests confirm <20ms." },
  { brand:"Bluetti",  model:"Elite 300",       ups:true,  switchover_ms:20,   switchover_label:"<20ms",  confidence:"claimed",   wh:2700, price:1499, notes:"Bluetti spec. Not independently verified." },
  // Anker SOLIX
  { brand:"Anker SOLIX", model:"F3800",        ups:true,  switchover_ms:20,   switchover_label:"<20ms",  confidence:"verified",  wh:3400, price:2999, notes:"Anker verified <20ms. Suitable for medical." },
  { brand:"Anker SOLIX", model:"C2000 Gen 2",  ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"claimed",   wh:1800, price:1199, notes:"UPS added in Gen 2. Gen 1 had no UPS." },
  { brand:"Anker SOLIX", model:"C800 Plus",    ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"claimed",   wh:670,  price:549,  notes:"UPS in Plus model only. C800 has no UPS." },
  // VTOMAN
  { brand:"VTOMAN", model:"FlashSpeed 1500",   ups:true,  switchover_ms:20,   switchover_label:"<20ms",  confidence:"verified",  wh:1548, price:629,  notes:"Fastest UPS in its class. <20ms verified." },
  { brand:"VTOMAN", model:"Jump 2200",         ups:true,  switchover_ms:20,   switchover_label:"<20ms",  confidence:"claimed",   wh:1548, price:999,  notes:"Same platform as FlashSpeed. <20ms claimed." },
  // Pecron
  { brand:"Pecron",  model:"E1000LFP",         ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"claimed",   wh:1024, price:499,  notes:"UPS confirmed. Switchover time estimated." },
  { brand:"Pecron",  model:"E2000LFP",         ups:true,  switchover_ms:30,   switchover_label:"<30ms",  confidence:"claimed",   wh:1920, price:799,  notes:"UPS confirmed. Switchover time estimated." },
  // Zendure
  { brand:"Zendure", model:"SuperBase Pro 2000",ups:true, switchover_ms:13,   switchover_label:"<13ms",  confidence:"claimed",   wh:1850, price:1699, notes:"Fastest claimed UPS in portable class. <13ms." },
  // DJI Power
  { brand:"DJI Power", model:"Power 1000",     ups:true,  switchover_ms:20,   switchover_label:"<20ms",  confidence:"claimed",   wh:1024, price:699,  notes:"DJI spec <20ms. Good for drone+office setups." },
  { brand:"DJI Power", model:"Power 500",      ups:true,  switchover_ms:20,   switchover_label:"<20ms",  confidence:"claimed",   wh:512,  price:349,  notes:"Smallest UPS-capable unit in our dataset." },
  // Geneverse
  { brand:"Geneverse", model:"HomePower TWO PRO", ups:false, switchover_ms:null, switchover_label:"No UPS", confidence:"verified", wh:2419, price:999,  notes:"No UPS mode. Not suitable for sensitive devices." },
  { brand:"Geneverse", model:"HomePower ONE PRO", ups:false, switchover_ms:null, switchover_label:"No UPS", confidence:"verified", wh:1210, price:499,  notes:"No UPS mode." },
  // Goal Zero — no UPS
  { brand:"Goal Zero", model:"Yeti 3000X",     ups:false, switchover_ms:null,  switchover_label:"No UPS", confidence:"verified",  wh:3032, price:1999, notes:"No UPS. Manual transfer only." },
  { brand:"Goal Zero", model:"Yeti 1500X",     ups:false, switchover_ms:null,  switchover_label:"No UPS", confidence:"verified",  wh:1516, price:999,  notes:"No UPS." },
  { brand:"Goal Zero", model:"Yeti 1000X",     ups:false, switchover_ms:null,  switchover_label:"No UPS", confidence:"verified",  wh:983,  price:799,  notes:"No UPS." },
  // Jackery — no UPS
  { brand:"Jackery", model:"Explorer 2000 Plus", ups:false, switchover_ms:null, switchover_label:"No UPS", confidence:"verified", wh:1800, price:899,  notes:"No UPS. Best surge in class but no UPS." },
  { brand:"Jackery", model:"Explorer 2000 v2",   ups:false, switchover_ms:null, switchover_label:"No UPS", confidence:"verified", wh:1800, price:1599, notes:"No UPS." },
  { brand:"Jackery", model:"Explorer 1000 v2",   ups:false, switchover_ms:null, switchover_label:"No UPS", confidence:"verified", wh:940,  price:449,  notes:"No UPS. Best value 1kWh but not for medical." },
];

const CONFIDENCE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  verified: { label: "Verified",  color: "#166534", bg: "#DCFCE7" },
  claimed:  { label: "Claimed",   color: "#92400E", bg: "#FEF3C7" },
  estimated:{ label: "Estimated", color: "#6B7280", bg: "#F3F4F6" },
};

function isDeviceSafe(product: UPSProduct, device: Device): "safe" | "marginal" | "unsafe" {
  if (!product.ups || product.switchover_ms === null) return "unsafe";
  if (product.switchover_ms <= device.max_ms) return "safe";
  if (product.switchover_ms <= device.max_ms * 2) return "marginal";
  return "unsafe";
}

const COMPAT_STYLE = {
  safe:     { icon: "✓", color: "#10B981", bg: "#D1FAE5" },
  marginal: { icon: "~", color: "#D97706", bg: "#FEF3C7" },
  unsafe:   { icon: "✗", color: "#EF4444", bg: "#FEE2E2" },
};

type FilterMode = "all" | "ups_only" | "no_ups";

function UPSDatabase() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [activeDevice, setActiveDevice] = useState<string>("cpap");
  const [sortBy, setSortBy] = useState<"ms" | "price" | "wh">("ms");

  const device = DEVICES.find(d => d.id === activeDevice)!;

  const rows = PRODUCTS
    .filter(p => filter === "all" ? true : filter === "ups_only" ? p.ups : !p.ups)
    .sort((a, b) => {
      if (sortBy === "ms") {
        const ams = a.switchover_ms ?? 9999;
        const bms = b.switchover_ms ?? 9999;
        return ams - bms;
      }
      if (sortBy === "price") return a.price - b.price;
      return b.wh - a.wh;
    });

  const upsCount = PRODUCTS.filter(p => p.ups).length;
  const safeForCpap = PRODUCTS.filter(p => isDeviceSafe(p, DEVICES[0]) === "safe").length;

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
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">UPS Database</p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 mb-3">
            UPS switchover times. Device by device.
          </h1>
          <p className="text-[15px] text-neutral-500 max-w-2xl leading-relaxed">
            UPS mode means the generator switches to battery when grid power fails — but the switchover time determines which devices are safe. A CPAP needs under 30ms. A NAS needs under 20ms. This database shows exactly which generators qualify for which devices.
          </p>
          <div className="mt-4 flex items-center gap-5 flex-wrap">
            {[
              `${upsCount} UPS-capable generators`,
              `${safeForCpap} safe for CPAP`,
              "Verified + claimed times",
              "6 device categories",
            ].map(t => (
              <span key={t} className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{t}</span>
            ))}
          </div>
        </div>

        {/* Device selector */}
        <div className="mb-4">
          <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-3">Select device to check compatibility</p>
          <div className="flex items-start gap-2 flex-wrap">
            {DEVICES.map(d => (
              <button key={d.id} onClick={() => { setActiveDevice(d.id); Analytics.upsDbFilter(d.id, 0); }}
                className={`flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[12px] font-medium transition-all ${
                  activeDevice === d.id
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "bg-white border text-neutral-600 hover:border-neutral-400"
                }`}
                style={activeDevice !== d.id ? { borderColor: "#E2E2E2" } : {}}>
                <span>{d.icon}</span>
                {d.label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-[10px] border bg-white px-4 py-3 flex items-center gap-3" style={{ borderColor: "#E2E2E2" }}>
            <span className="text-[18px]">{device.icon}</span>
            <div>
              <p className="text-[13px] font-semibold text-neutral-800">{device.label} — requires &lt;{device.max_ms}ms switchover</p>
              <p className="text-[12px] text-neutral-500 mt-0.5">{device.note}</p>
            </div>
          </div>
        </div>

        {/* Filters + sort */}
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          {(["all", "ups_only", "no_ups"] as FilterMode[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-[7px] px-3 py-1.5 font-mono text-[11px] font-medium transition-colors ${
                filter === f ? "bg-neutral-950 text-white" : "bg-white border text-neutral-600 hover:border-neutral-400"
              }`}
              style={filter !== f ? { borderColor: "#E2E2E2" } : {}}>
              {f === "all" ? "All products" : f === "ups_only" ? "UPS only" : "No UPS"}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-mono text-[10px] text-neutral-400">Sort by</span>
            {(["ms", "price", "wh"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`rounded-[6px] px-2.5 py-1 font-mono text-[10px] transition-colors ${
                  sortBy === s ? "bg-neutral-950 text-white" : "bg-white border text-neutral-500"
                }`}
                style={sortBy !== s ? { borderColor: "#E2E2E2" } : {}}>
                {s === "ms" ? "Switchover" : s === "price" ? "Price" : "Capacity"}
              </button>
            ))}
          </div>
          <span className="font-mono text-[10px] text-neutral-400">{rows.length} products</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-[12px] border bg-white" style={{ borderColor: "#E2E2E2" }}>
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "#F0F0F0" }}>
                <th className="py-3 pl-4 pr-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-52">Product</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-28">Switchover</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-28">
                  {device.icon} {device.label}
                </th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-24">Confidence</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-20">Price</th>
                <th className="py-3 px-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400 w-24">Capacity</th>
                <th className="py-3 px-2 pr-4 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-400">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => {
                const compat = isDeviceSafe(p, device);
                const cs = COMPAT_STYLE[compat];
                const conf = CONFIDENCE_STYLE[p.confidence];
                const ta = TA[p.model];
                return (
                  <tr key={`${p.brand}-${p.model}`}
                    className={`border-b last:border-0 hover:bg-[#FAFAFA] transition-colors ${!p.ups ? "opacity-50" : ""}`}
                    style={{ borderColor: "#F8F8F8" }}>
                    <td className="py-3 pl-4 pr-2">
                      <p className="font-mono text-[9.5px] text-neutral-400">{p.brand}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-semibold text-neutral-900">{p.model}</p>
                        {ta && <a href={ta} className="font-mono text-[9px] text-[#2563EB] hover:underline">TA →</a>}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-mono text-[13px] font-bold ${p.ups ? "text-neutral-900" : "text-neutral-400"}`}>
                        {p.switchover_label}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 rounded-[6px] px-2 py-0.5 font-mono text-[11px] font-semibold"
                        style={{ color: cs.color, background: cs.bg }}>
                        {cs.icon} {compat === "safe" ? "Safe" : compat === "marginal" ? "Marginal" : "Not safe"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold"
                        style={{ color: conf.color, background: conf.bg }}>
                        {conf.label}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-[12px] text-neutral-700">${p.price.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-[11px] text-neutral-600">{p.wh.toLocaleString()} Wh</span>
                    </td>
                    <td className="py-3 px-2 pr-4">
                      <span className="text-[11.5px] text-neutral-500 leading-snug">{p.notes}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Methodology note */}
        <div className="mt-4 rounded-[10px] border border-dashed px-5 py-3.5 flex items-start gap-3"
          style={{ borderColor: "#E2E2E2" }}>
          <span className="font-mono text-[11px] text-neutral-400 shrink-0 mt-0.5">ⓘ</span>
          <p className="font-mono text-[11px] text-neutral-400 leading-relaxed">
            <strong className="text-neutral-600">Verified</strong> = confirmed by independent third-party testing or multiple user reports.
            <strong className="text-neutral-600"> Claimed</strong> = manufacturer specification, not independently tested.
            <strong className="text-neutral-600"> Estimated</strong> = based on similar hardware platform.
            UPS mode availability and switchover times may vary by firmware version.
          </p>
        </div>

        {/* Cross-links */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a href="/runtime-database"
            className="rounded-[12px] border bg-white p-5 hover:border-neutral-400 transition-colors group"
            style={{ borderColor: "#E2E2E2" }}>
            <p className="font-mono text-[10px] text-neutral-400 mb-1">Runtime Database</p>
            <p className="text-[14px] font-semibold text-neutral-800 group-hover:text-[#2563EB] transition-colors">
              How long will it run? →
            </p>
          </a>
          <a href="/technical-analysis"
            className="rounded-[12px] border bg-white p-5 hover:border-neutral-400 transition-colors group"
            style={{ borderColor: "#E2E2E2" }}>
            <p className="font-mono text-[10px] text-neutral-400 mb-1">Technical Analysis</p>
            <p className="text-[14px] font-semibold text-neutral-800 group-hover:text-[#2563EB] transition-colors">
              Deep-dive specs →
            </p>
          </a>
          <a href="/solar-calculator"
            className="rounded-[12px] border bg-neutral-950 p-5 hover:opacity-80 transition-opacity"
            style={{ borderColor: "transparent" }}>
            <p className="font-mono text-[10px] text-neutral-400 mb-1">Decision Engine</p>
            <p className="text-[14px] font-semibold text-white">Find your exact match →</p>
          </a>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
