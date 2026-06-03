import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ev-chargers")({
  head: () => ({
    meta: [
      { title: "EV Charger Decision Lab — Technical Analysis | ClickDecisionLab" },
      { name: "description", content: "Independent technical analysis of Level 2 home EV chargers. Amperage, panel requirements, smart features, NACS vs J1772 — scored for your specific vehicle and installation. Launching Q3 2026." },
    ],
  }),
  component: EVChargersPage,
});

function StatusRow({ icon, text, done }: { icon: string; text: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-[13px] ${done ? "text-[#10B981]" : "text-neutral-400"}`}>{done ? "✓" : "○"}</span>
      <span className={`text-[13px] ${done ? "text-neutral-700" : "text-neutral-400"}`}>{text}</span>
    </div>
  );
}

function EVChargersPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-5xl px-5 py-16">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">LAB-02</span>
            <span className="rounded-full bg-[#FEF3C7] px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#92400E]">In Analysis</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 mb-4">
            EV Charger Decision Lab
          </h1>
          <p className="text-[16px] text-neutral-500 max-w-2xl leading-relaxed">
            Technical analysis and recommendation engine for Level 2 home EV chargers. We evaluate amperage output, electrical panel requirements, smart charging features, connector compatibility and long-term value — scored for your specific vehicle and installation scenario.
          </p>
          <p className="mt-3 font-mono text-[12px] text-neutral-400">Expected launch: Q3 2026</p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

          {/* What we evaluate */}
          <div className="rounded-[16px] border bg-white p-7" style={{borderColor:"#E2E2E2"}}>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-5">What we evaluate</p>
            <div className="space-y-4">
              {[
                { label: "Charging Speed", desc: "Amperage (16A-80A), kW output, miles of range per hour" },
                { label: "Electrical Requirements", desc: "Panel compatibility, breaker size, 60A vs 100A service" },
                { label: "Connector Type", desc: "NACS (Tesla standard) vs J1772, universal adapters" },
                { label: "Smart Features", desc: "WiFi scheduling, energy monitoring, load management, TOU optimization" },
                { label: "Installation Complexity", desc: "Plug-in vs hardwired, indoor vs outdoor, cord length" },
                { label: "Long-term Value", desc: "Warranty, firmware updates, future EV compatibility" },
              ].map((item) => (
                <div key={item.label} className="border-b pb-4 last:border-0 last:pb-0" style={{borderColor:"#F0F0F0"}}>
                  <p className="text-[13px] font-medium text-neutral-800">{item.label}</p>
                  <p className="text-[12px] text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Development status */}
          <div className="space-y-6">
            <div className="rounded-[16px] border bg-white p-7" style={{borderColor:"#E2E2E2"}}>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-5">Development status</p>
              <div className="space-y-3">
                <StatusRow icon="✓" text="Scoring framework designed" done={true} />
                <StatusRow icon="✓" text="Evaluation criteria defined" done={true} />
                <StatusRow icon="✓" text="Product database in development" done={true} />
                <StatusRow icon="○" text="Dataset complete (40+ products)" done={false} />
                <StatusRow icon="○" text="Decision engine live" done={false} />
              </div>
              <div className="mt-5 pt-5 border-t" style={{borderColor:"#F0F0F0"}}>
                <p className="font-mono text-[10px] text-neutral-400">Products tracked when live</p>
                <p className="font-mono text-[22px] font-semibold text-neutral-800 mt-0.5">40+</p>
              </div>
            </div>

            {/* Notify */}
            <div className="rounded-[16px] border bg-[#F8F9FF] p-7" style={{borderColor:"#E8EDFF"}}>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#2563EB] mb-3">Get notified</p>
              <p className="text-[13px] text-neutral-600 mb-4">We'll let you know when the EV Charger lab launches with full analysis and recommendations.</p>
              <a href="mailto:labs@clickdecisionlab.com?subject=EV Charger Lab — Notify me&body=Please notify me when the EV Charger Decision Lab launches." className="inline-flex items-center gap-2 rounded-[8px] bg-[#2563EB] px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-80 transition-opacity">
                Notify me on launch →
              </a>
            </div>
          </div>
        </div>

        {/* Research available now */}
        <div className="mt-10 rounded-[16px] border bg-white p-7" style={{borderColor:"#E2E2E2"}}>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">Research available now</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Level 1 vs Level 2 EV Chargers Explained", href: "/level-1-vs-level-2-ev-chargers/" },
              { title: "How Many Amps Do You Need for a Home EV Charger?", href: "/how-many-amps-ev-charger/" },
              { title: "NACS vs J1772: Which Connector Do You Need?", href: "/nacs-vs-j1772-ev-charger/" },
              { title: "Best Level 2 EV Chargers 2026", href: "/best-level-2-ev-chargers-2026/" },
              { title: "EV Charger Installation Cost Guide 2026", href: "/ev-charger-installation-cost-2026/" },
            ].map((article) => (
              <a key={article.href} href={article.href} className="flex items-center justify-between rounded-[8px] border p-3 hover:border-neutral-400 transition-colors" style={{borderColor:"#E2E2E2"}}>
                <span className="text-[12.5px] text-neutral-700">{article.title}</span>
                <span className="text-neutral-400 ml-2">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Back to active lab */}
        <div className="mt-8 text-center">
          <p className="text-[13px] text-neutral-500 mb-3">While the EV lab is in development, explore our active lab:</p>
          <a href="/solar-calculator" className="inline-flex items-center gap-2 rounded-[12px] bg-neutral-950 px-5 py-3 text-[13px] font-medium text-white hover:opacity-80 transition-opacity">
            Solar Generator Decision Engine →
          </a>
        </div>

      </div>
    </div>
  );
}
