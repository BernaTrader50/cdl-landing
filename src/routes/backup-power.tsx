import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/backup-power")({
  head: () => ({
    meta: [
      { title: "Backup Power Decision Lab — Technical Analysis | ClickDecisionLab" },
      { name: "description", content: "Technical analysis and recommendation engine for whole-home backup power systems. Standby generators, transfer switches, fuel types and load management — planned for Q4 2026." },
    ],
  }),
  component: BackupPowerPage,
});

function BackupPowerPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">LAB-04</span>
            <span className="rounded-full bg-neutral-100 px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Planned</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 mb-4">
            Backup Power Decision Lab
          </h1>
          <p className="text-[16px] text-neutral-500 max-w-2xl leading-relaxed">
            Technical analysis for whole-home backup power systems — standby generators, automatic transfer switches, fuel type selection, load management and integration with battery storage. Planned for Q4 2026.
          </p>
        </div>

        <div className="rounded-[16px] border bg-white p-8 text-center" style={{borderColor:"#E2E2E2"}}>
          <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400 mb-4">What this lab will cover</p>
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8 md:grid-cols-3">
            {["Standby generators", "Transfer switches", "Fuel types", "Load management", "Battery integration", "Installation cost"].map(item => (
              <div key={item} className="rounded-[8px] bg-[#FAFAFA] px-3 py-2 text-[12px] text-neutral-600">{item}</div>
            ))}
          </div>
          <a href="mailto:labs@clickdecisionlab.com?subject=Backup Power Lab — Notify me" className="inline-flex items-center gap-2 rounded-[8px] bg-[#2563EB] px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-80 transition-opacity">
            Notify me on launch →
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[13px] text-neutral-500 mb-3">Currently active:</p>
          <a href="/solar-calculator" className="inline-flex items-center gap-2 rounded-[12px] bg-neutral-950 px-5 py-3 text-[13px] font-medium text-white hover:opacity-80 transition-opacity">
            Solar Generator Decision Engine →
          </a>
        </div>
      </div>
    </div>
  );
}
