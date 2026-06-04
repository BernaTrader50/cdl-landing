import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ display:"inline-block", width:22, height:22, verticalAlign:"middle", flexShrink:0 }}
      fill="none" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 3h6" />
      <path d="M10 3v5.2L4.6 17.4A2 2 0 0 0 6.3 20.5h11.4a2 2 0 0 0 1.7-3.1L14 8.2V3" />
      <path d="M12.6 9.8l-2.7 4.2h2.2l-1 3.3 2.9-4.2h-2.1l0.7-3.3z"
        fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-1.5 ${className}`}
      style={{ lineHeight: 1 }}>
      <FlaskIcon />
      <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1, color: "#0a0a0a" }}>
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
    const h = () => setScrolled(window.scrollY > 8);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">

      {/* Status bar */}
      <div className="hidden h-7 items-center border-b border-[#ececec] bg-[#fafafa] md:flex">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6"
          style={{ fontSize: 11, color: "#737373" }}>
          <span className="flex items-center gap-1.5">
            <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:"#16a34a" }} />
            <span style={{ fontWeight: 500, color: "#525252" }}>Research live</span>
          </span>
          <span style={{ color: "#d4d4d4" }}>·</span>
          <span>49 products tracked</span>
          <span style={{ color: "#d4d4d4" }}>·</span>
          <span>Updated weekly</span>
        </div>
      </div>

      {/* Main nav */}
      <div style={{
        borderBottom: scrolled ? "1px solid #e8e8e8" : "1px solid rgba(232,232,232,0.6)",
        backgroundColor: "rgba(255,255,255,0.94)",
        backdropFilter: "saturate(180%) blur(14px)",
        WebkitBackdropFilter: "saturate(180%) blur(14px)",
      }}>
        <div className="mx-auto flex h-14 max-w-6xl items-center px-6">

          {/* LEFT — brand, never shrinks */}
          <div className="flex shrink-0 items-center gap-2">
            <Logo />
            <span style={{ color: "#d4d4d4", fontSize: 18, fontWeight: 300, lineHeight: 1, flexShrink: 0 }}>/</span>
            <span className="hidden md:block"
              style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.14em", textTransform: "uppercase", color: "#a3a3a3", lineHeight: 1, flexShrink: 0 }}>
              Real specs. Real decisions.
            </span>
          </div>

          {/* CENTER — nav, takes remaining space */}
          <nav className="hidden flex-1 items-center justify-center gap-5 xl:flex">
            <div className="group relative">
              <span style={{ fontSize: 13, fontWeight: 600, color: "#404040", cursor: "default" }}
                className="transition-colors hover:text-neutral-950">
                Labs
              </span>
              <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-[220px] -translate-x-1/2 rounded-[10px] border border-[#e8e8e8] bg-white p-1.5 opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-150 group-hover:visible group-hover:opacity-100">
                {labs.map(l => {
                  const s = STATUS[l.status];
                  return (
                    <Link key={l.label} to={l.to}
                      className="flex items-center justify-between rounded-[6px] px-2.5 py-1.5 transition-colors hover:bg-[#f5f5f5]"
                      style={{ fontSize: 12.5, color: "#404040" }}>
                      <span>{l.label}</span>
                      <span style={{ background: s.bg, color: s.color, borderRadius: 4, padding: "1px 6px",
                        fontFamily: "ui-monospace,monospace", fontSize: 9, fontWeight: 600 }}>
                        {s.text}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            {tools.map(t => (
              <Link key={t.label} to={t.to}
                style={{ fontSize: 13, fontWeight: 600, color: "#404040", whiteSpace: "nowrap" }}
                className="transition-colors hover:text-neutral-950">
                {t.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT — CTA, never shrinks */}
          <div className="ml-auto shrink-0">
            <Link to="/solar-calculator"
              className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:bg-[#2563EB]"
              style={{ background: "#0a0a0a", color: "#fff", borderRadius: 8,
                padding: "8px 14px", fontSize: 13, fontWeight: 600, lineHeight: 1 }}>
              Open Lab
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
