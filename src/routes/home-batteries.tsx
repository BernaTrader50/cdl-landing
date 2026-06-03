import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home-batteries")({
  head: () => ({
    meta: [
      { title: "Home Battery Decision Lab — Technical Analysis | ClickDecisionLab" },
      { name: "description", content: "Independent technical analysis of home battery storage systems. LFP chemistry, kWh capacity, cycle life, inverter compatibility and ROI — scored for your home and energy goals. Launching Q3 2026." },
    ],
  }),
  component: HomeBatteriesPage,
});

function StatusRow({ text, done }: { text: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-[13px] ${done ? "text-[#10B981]" : "text-neutral-400"}`}>{done ? "✓" : "○"}</span>
      <span className={`text-[13px] ${done ? "text-neutral-700" : "text-neutral-400"}`}>{text}</span>
    </div>
  );
}

function HomeBatteriesPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-5xl px-5 py-16">

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">LAB-03</span>
            <span className="rounded-full bg-[#FEF3C7] px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#92400E]">In Analysis</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 mb-4">
            Home Battery Decision Lab
          </h1>
          <p className="text-[16px] text-neutral-500 max-w-2xl leading-relaxed">
            Technical analysis and recommendation engine for residential battery storage systems. We evaluate capacity, chemistry, inverter compatibility, grid-tie options and long-term value — scored for your home's energy consumption and backup goals.
          </p>
          <p className="mt-3 font-mono text-[12px] text-neutral-400">Expected launch: Q3 2026</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-[16px] border bg-white p-7" style={{borderColor:"#E2E2E2"}}>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-5">What we evaluate</p>
            <div className="space-y-4">
              {[
                { label: "Usable Capacity", desc: "kWh available for use, depth of discharge, real vs rated capacity" },
                { label: "Battery Chemistry", desc: "LFP (LiFePO4) vs NMC — cycle life, safety, temperature performance" },
                { label: "Power Output", desc: "Continuous kW, peak kW, loads supported simultaneously" },
                { label: "Inverter Integration", desc: "Compatible inverters, hybrid vs AC-coupled, installation complexity" },
                { label: "Solar Compatibility", desc: "DC-coupled vs AC-coupled solar, self-consumption optimization" },
                { label: "Economics", desc: "$/kWh installed, payback period, utility incentives, ROI analysis" },
              ].map((item) => (
                <div key={item.label} className="border-b pb-4 last:border-0 last:pb-0" style={{borderColor:"#F0F0F0"}}>
                  <p className="text-[13px] font-medium text-neutral-800">{item.label}</p>
                  <p className="text-[12px] text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[16px] border bg-white p-7" style={{borderColor:"#E2E2E2"}}>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-5">Development status</p>
              <div className="space-y-3">
                <StatusRow text="Scoring framework designed" done={true} />
                <StatusRow text="Evaluation criteria defined" done={true} />
                <StatusRow text="Product database in development" done={true} />
                <StatusRow text="Dataset complete (25+ systems)" done={false} />
                <StatusRow text="Decision engine live" done={false} />
              </div>
              <div className="mt-5 pt-5 border-t" style={{borderColor:"#F0F0F0"}}>
                <p className="font-mono text-[10px] text-neutral-400">Systems tracked when live</p>
                <p className="font-mono text-[22px] font-semibold text-neutral-800 mt-0.5">25+</p>
              </div>
            </div>

            <div className="rounded-[16px] border bg-[#F8F9FF] p-7" style={{borderColor:"#E8EDFF"}}>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#2563EB] mb-3">Get notified</p>
              <p className="text-[13px] text-neutral-600 mb-4">Be the first to access the Home Battery Decision Engine when it launches.</p>
              <a href="mailto:labs@clickdecisionlab.com?subject=Home Battery Lab — Notify me&body=Please notify me when the Home Battery Decision Lab launches." className="inline-flex items-center gap-2 rounded-[8px] bg-[#2563EB] px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-80 transition-opacity">
                Notify me on launch →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[16px] border bg-white p-7" style={{borderColor:"#E2E2E2"}}>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">Research available now</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Powerwall Alternatives 2026: Best Home Batteries Compared", href: "/powerwall-alternatives-2026/" },
              { title: "LFP vs NMC Home Batteries: Which Chemistry to Choose", href: "/lfp-vs-nmc-home-batteries/" },
              { title: "How Much Battery Storage Do You Need at Home?", href: "/how-much-battery-storage-home/" },
              { title: "Best Home Battery Systems 2026", href: "/best-home-battery-systems-2026/" },
              { title: "Whole Home Backup: Solar + Battery System Guide", href: "/whole-home-backup-solar-battery-guide/" },
            ].map((article) => (
              <a key={article.href} href={article.href} className="flex items-center justify-between rounded-[8px] border p-3 hover:border-neutral-400 transition-colors" style={{borderColor:"#E2E2E2"}}>
                <span className="text-[12.5px] text-neutral-700">{article.title}</span>
                <span className="text-neutral-400 ml-2">→</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[13px] text-neutral-500 mb-3">While the Home Battery lab is in development, explore our active lab:</p>
          <a href="/solar-calculator" className="inline-flex items-center gap-2 rounded-[12px] bg-neutral-950 px-5 py-3 text-[13px] font-medium text-white hover:opacity-80 transition-opacity">
            Solar Generator Decision Engine →
          </a>
        </div>

      </div>
    </div>
  );
}
