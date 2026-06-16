import { useState } from "react";
import {
  Search,
  ChevronRight,
  ChevronDown,
  Sun,
  Plug,
  BatteryCharging,
  Flame,
  Menu,
  X,
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
    count: "104 products",
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
    status: "Live",
    statusColor: "emerald",
    count: "12 systems",
    href: "/home-batteries",
  },
  {
    icon: Flame,
    code: "LAB-04",
    title: "Backup Power",
    status: "Live",
    statusColor: "emerald",
    count: "12 systems",
    href: "/backup-power",
  },
];

const CALCULATORS = [
  { href: "/solar-calculator", title: "Solar Generator", code: "LAB-01", icon: Sun },
  { href: "/ev-chargers", title: "EV Charger", code: "LAB-02", icon: Plug },
  { href: "/home-batteries", title: "Home Battery", code: "LAB-03", icon: BatteryCharging },
  { href: "/backup-power", title: "Backup Power", code: "LAB-04", icon: Flame },
];

const TOP_HREFS: Record<string, string> = {
  Comparisons: "/comparisons",
  Database: "/runtime-database",
  Methodology: "/methodology",
  Research: "/blog",
  Blog: "/blog",
};

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-50"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-200">
              <span className="text-sm font-semibold text-neutral-900">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-4 space-y-1">
              {/* Labs accordion */}
              <button
                onClick={() => setLabsOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-neutral-900 rounded-lg hover:bg-neutral-50"
              >
                Labs
                <ChevronDown className={`h-4 w-4 transition-transform ${labsOpen ? "rotate-180" : ""}`} />
              </button>
              {labsOpen && (
                <div className="pl-2 pb-2 space-y-1">
                  {LABS.map((l) => (
                    <a
                      key={l.code}
                      href={l.href}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50"
                    >
                      <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <l.icon className="h-4 w-4 text-[#2563eb]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-medium text-neutral-900">{l.title}</div>
                          <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            {l.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">{l.code} · {l.count}</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Calculator accordion */}
              <button
                onClick={() => setCalcOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-neutral-900 rounded-lg hover:bg-neutral-50"
              >
                Calculator
                <ChevronDown className={`h-4 w-4 transition-transform ${calcOpen ? "rotate-180" : ""}`} />
              </button>
              {calcOpen && (
                <div className="pl-2 pb-2 space-y-1">
                  {CALCULATORS.map((c) => (
                    <a
                      key={c.href}
                      href={c.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50"
                    >
                      <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <c.icon className="h-4 w-4 text-[#2563eb]" />
                      </div>
                      <div className="text-sm font-medium text-neutral-900">{c.title}</div>
                    </a>
                  ))}
                </div>
              )}

              {/* Flat nav items */}
              {NAV.filter((n) => n !== "Solar Lab" && n !== "Calculator").map((n) => (
                <a
                  key={n}
                  href={TOP_HREFS[n] ?? "#"}
                  className="block px-3 py-3 text-sm font-semibold text-neutral-900 rounded-lg hover:bg-neutral-50"
                >
                  {n}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?s=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto pl-4 pr-6 h-28 flex items-center gap-6">
        <a href="/" className="flex items-center shrink-0">
          <img src={logo} alt="ClickDecisionLab — Real specs. Real decisions." className="h-10 w-auto sm:h-14 lg:h-20" />
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
          {NAV.filter((n) => n !== "Solar Lab" && n !== "Calculator").map((n) => (
            <a key={n} href={TOP_HREFS[n] ?? "#"} className="hover:text-[#2563eb] transition-colors">
              {n}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 ml-auto">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="hidden sm:flex items-center gap-1">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                placeholder="Search articles..."
                className="h-9 w-48 rounded-full border border-neutral-200 px-3 text-sm focus:outline-none focus:border-[#2563eb]"
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                aria-label="Close search"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-50">
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} aria-label="Open search"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-50">
              <Search className="h-4 w-4" />
            </button>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
