// ⚠️ DO NOT MODIFY THIS FILE — nav layout is locked. See commit 3a30e7a.
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

function FlaskIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none"
      stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 3h6" />
      <path d="M10 3v5.2L4.6 17.4A2 2 0 0 0 6.3 20.5h11.4a2 2 0 0 0 1.7-3.1L14 8.2V3" />
      <path d="M12.6 9.8l-2.7 4.2h2.2l-1 3.3 2.9-4.2h-2.1l0.7-3.3z"
        fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex shrink-0 items-center gap-2 ${className}`}>
      <FlaskIcon className="h-8 w-8 shrink-0" />
      <span className="text-[20px] font-bold leading-none tracking-tight text-neutral-950">
        <span>click</span>
        <span style={{ color: "#2563EB" }}>decision</span>
        <span>lab</span>
      </span>
    </Link>
  );
}

const labs = [
  { label: "Solar Generators", to: "/solar-calculator", status: "live"     },
  { label: "EV Chargers",      to: "/ev-chargers",      status: "analysis" },
  { label: "Home Batteries",   to: "/home-batteries",   status: "analysis" },
  { label: "Backup Power",     to: "/backup-power",     status: "planned"  },
];

const STATUS: Record<string, { text: string; color: string; bg: string }> = {
  live:     { text: "Live",        color: "#166534", bg: "#DCFCE7" },
  analysis: { text: "In Analysis", color: "#92400E", bg: "#FEF3C7" },
  planned:  { text: "Planned",     color: "#6B7280", bg: "#F3F4F6" },
};

const tools = [
  { label: "Calculator",         to: "/solar-calculator"   },
  { label: "Comparisons",        to: "/comparisons"        },
  { label: "Technical Analysis", to: "/technical-analysis" },
  { label: "Runtime DB",         to: "/runtime-database"   },
  { label: "Research",           to: "/blog"               },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">

      {/* Status bar */}
      <div className="hidden h-7 items-center border-b border-[#ececec] bg-[#fafafa] text-[11px] text-neutral-500 md:flex">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-8">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
            <span className="font-medium text-neutral-600">Research live</span>
          </span>
          <span className="text-neutral-300">·</span>
          <span>49 products tracked</span>
          <span className="text-neutral-300">·</span>
          <span>Updated weekly</span>
        </div>
      </div>

      {/* Main nav */}
      <div
        className="border-b transition-colors duration-200"
        style={{
          borderColor: scrolled ? "#e8e8e8" : "rgba(232,232,232,0.6)",
          backgroundColor: "rgba(255,255,255,0.94)",
          backdropFilter: "saturate(180%) blur(14px)",
          WebkitBackdropFilter: "saturate(180%) blur(14px)",
        }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-8">

          {/* LEFT: logo + tagline, max 320px, no shrink into nav */}
          <div className="flex items-center gap-3" style={{ width: "320px", flexShrink: 0 }}>
            <Logo />
            <div className="hidden flex-col gap-[2px] border-l border-neutral-200 pl-3 lg:flex">
              <span className="whitespace-nowrap font-mono text-[9.5px] font-medium uppercase tracking-widest text-neutral-400 leading-none">Real specs.</span>
              <span className="whitespace-nowrap font-mono text-[9.5px] font-medium uppercase tracking-widest text-neutral-400 leading-none">Real decisions.</span>
            </div>
          </div>

          {/* CENTER: nav absolutely centered in the full header */}
          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            <div className="group relative">
              <span className="cursor-default select-none text-[13px] font-bold text-neutral-800 transition-colors hover:text-neutral-950">
                Labs
              </span>
              <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-[220px] -translate-x-1/2 rounded-[10px] border border-[#e8e8e8] bg-white p-1.5 opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-150 group-hover:visible group-hover:opacity-100">
                {labs.map(l => {
                  const s = STATUS[l.status];
                  return (
                    <Link key={l.label} to={l.to}
                      className="flex items-center justify-between rounded-[6px] px-2.5 py-1.5 text-[12.5px] text-neutral-700 hover:bg-[#f5f5f5] transition-colors">
                      <span>{l.label}</span>
                      <span className="rounded px-1.5 py-px font-mono text-[9px] font-semibold"
                        style={{ color: s.color, background: s.bg }}>
                        {s.text}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            {tools.map(t => (
              <Link key={t.label} to={t.to}
                className="whitespace-nowrap text-[13px] font-bold text-neutral-800 transition-colors hover:text-neutral-950">
                {t.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Open Lab, 320px, centered */}
          <div className="flex items-center justify-center" style={{ width: "320px", flexShrink: 0 }}>
            <Link to="/solar-calculator"
              className="group inline-flex items-center gap-1.5 rounded-[8px] bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#2563EB]">
              Open Lab
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
