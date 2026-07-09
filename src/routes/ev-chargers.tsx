import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import { SiteFooter } from "@/components/site-footer";
import { EVChargerCalculator } from "@/components/ev-charger-calculator";
import { Zap, Gauge, Plug, Wifi, Cog, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/ev-chargers")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://clickdecisionlab.com/ev-chargers/" }],
    meta: [
      { title: "EV Charger Decision Lab — Compare 49 Home EV Chargers | ClickDecisionLab" },
      { name: "description", content: "Compare 49 Level 2 home EV chargers across 22 brands. Get matched by amperage, panel requirements, connector type (NACS/J1772) and smart features for your exact situation." },
    ],
  }),
  component: Page,
});

const CRITERIA = [
  { icon: Zap, title: "Charging Speed", desc: "Amperage (16A–80A), kW output, miles of range per hour" },
  { icon: Gauge, title: "Electrical Requirements", desc: "Panel compatibility, breaker size, 60A vs 100A service" },
  { icon: Plug, title: "Connector Type", desc: "NACS (Tesla standard) vs J1772, universal adapters" },
  { icon: Wifi, title: "Smart Features", desc: "WiFi scheduling, energy monitoring, load management, TOU optimization" },
  { icon: Cog, title: "Installation Complexity", desc: "Plug-in vs hardwired, indoor vs outdoor, cord length" },
  { icon: ShieldCheck, title: "Long-term Value", desc: "Warranty, firmware updates, future EV compatibility" },
];

const RESEARCH_LINKS = [
  { title: "Level 1 vs Level 2 EV Chargers Explained", href: "/level-1-vs-level-2-ev-chargers/" },
  { title: "How Many Amps Do You Need for a Home EV Charger?", href: "/how-many-amps-ev-charger/" },
  { title: "NACS vs J1772: Which Connector Do You Need?", href: "/nacs-vs-j1772-ev-charger/" },
  { title: "Best Level 2 EV Chargers 2026", href: "/best-level-2-ev-chargers-2026/" },
  { title: "EV Charger Installation Cost Guide 2026", href: "/ev-charger-installation-cost-2026/" },
];

function Page() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />

      {/* HERO */}
      <section className="relative bg-[#2563eb] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-32 lg:pb-44 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
              LAB-02
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-200 bg-emerald-500/15 border border-emerald-300/30 rounded-full px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Live
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-blue-100 bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
              49 products tracked
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            EV Charger Decision Lab
          </h1>
          <p className="mt-4 text-blue-50/90 max-w-2xl mx-auto">
            Answer 3 questions about your home and vehicle. We match you against 49 Level 2 EV chargers across 22 brands.
          </p>
        </div>
      </section>

      {/* CALCULATOR — real engine, 49 products */}
      <section className="relative bg-[#2563eb] pb-16">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 -mt-24 lg:-mt-36">
          <EVChargerCalculator />
        </div>
      </section>

      {/* CRITERIA */}
      <section className="bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-xs font-mono text-[#2563eb] tracking-[0.18em] uppercase mb-3">
            What we evaluate
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-8">6 scoring dimensions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRITERIA.map((c) => (
              <div key={c.title} className="bg-white border border-neutral-200 rounded-xl p-5">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <c.icon className="h-5 w-5 text-[#2563eb]" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{c.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research available now */}
      <section className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">Research available now</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RESEARCH_LINKS.map((article) => (
              <a key={article.href} href={article.href} className="flex items-center justify-between rounded-[8px] border border-neutral-200 p-3 hover:border-neutral-400 transition-colors">
                <span className="text-[12.5px] text-neutral-700">{article.title}</span>
                <span className="text-neutral-400 ml-2">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
