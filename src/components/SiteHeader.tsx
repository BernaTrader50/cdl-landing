import {
  Search,
  ChevronRight,
  Sun,
  Plug,
  BatteryCharging,
  Flame,
} from "lucide-react";
import logo from "@/assets/logo.png";

const NAV = ["Solar Lab", "Calculator", "Comparisons", "Database", "Methodology", "Research", "Blog"];

const LABS = [
  {
    icon: Sun,
    code: "LAB-01",
    title: "Solar Generators",
    status: "Live",
    statusColor: "emerald",
    count: "100 products",
    href: "/solar-calculator",
  },
  {
    icon: Plug,
    code: "LAB-02",
    title: "EV Chargers",
    status: "Live",
    statusColor: "emerald",
    count: "49 products",
    href: "/ev-chargers",
  },
  {
    icon: BatteryCharging,
    code: "LAB-03",
    title: "Home Batteries",
    status: "In Analysis",
    statusColor: "amber",
    count: "32 systems",
    href: "/home-batteries",
  },
  {
    icon: Flame,
    code: "LAB-04",
    title: "Backup Power",
    status: "Planned",
    statusColor: "gray",
    count: "Q4 2026",
    href: "/backup-power",
  },
];

const CALCULATORS = [
  { href: "/?calc=solar", title: "Solar Generator", code: "LAB-01", icon: Sun },
  { href: "/?calc=ev", title: "EV Charger", code: "LAB-02", icon: Plug },
  { href: "/?calc=battery", title: "Home Battery", code: "LAB-03", icon: BatteryCharging },
  { href: "/?calc=backup", title: "Backup Power", code: "LAB-04", icon: Flame },
];


export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto pl-4 pr-6 h-28 flex items-center gap-6">
        <a href="/" className="flex items-center shrink-0">
          <img src={logo} alt="ClickDecisionLab — Real specs. Real decisions." className="h-20 w-auto" />
        </a>
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-700">
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-[#2563eb] transition-colors py-5">
              Labs
              <ChevronRight className="h-3.5 w-3.5 rotate-90" />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full pt-2 w-[360px] z-50">
              <div className="bg-white border border-neutral-200 rounded-lg shadow-xl overflow-hidden">
                {LABS.map((l) => (
                  <a
                    key={l.code}
                    href={l.href}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 border-b last:border-b-0 border-neutral-100"
                  >
                    <div className="h-9 w-9 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                      <l.icon className="h-4 w-4 text-[#2563eb]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-neutral-900">{l.title}</div>
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          l.statusColor === "emerald"
                            ? "bg-emerald-50 text-emerald-700"
                            : l.statusColor === "amber"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}>
                          {l.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{l.code} · {l.count}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-[#2563eb] transition-colors py-5">
              Calculator
              <ChevronRight className="h-3.5 w-3.5 rotate-90" />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full pt-2 w-[280px] z-50">
              <div className="bg-white border border-neutral-200 rounded-lg shadow-xl overflow-hidden">
                {CALCULATORS.map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 border-b last:border-b-0 border-neutral-100"
                  >
                    <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                      <c.icon className="h-4 w-4 text-[#2563eb]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-neutral-900">{c.title}</div>
                      <div className="text-[11px] text-neutral-500">{c.code} · Calculator</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {NAV.filter((n) => n !== "Solar Lab" && n !== "Calculator").map((n) => {
            const HREFS: Record<string, string> = {
              Comparisons: "/comparisons",
              Methodology: "/methodology",
            };
            return (
              <a key={n} href={HREFS[n] ?? "#"} className="hover:text-[#2563eb] transition-colors">
                {n}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 ml-auto">
          <button className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-50">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
