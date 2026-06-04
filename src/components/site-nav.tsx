import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

function FlaskIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="#2563EB"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 3h6" />
      <path d="M10 3v5.2L4.6 17.4A2 2 0 0 0 6.3 20.5h11.4a2 2 0 0 0 1.7-3.1L14 8.2V3" />
      <path
        d="M12.6 9.8l-2.7 4.2h2.2l-1 3.3 2.9-4.2h-2.1l0.7-3.3z"
        fill="#0a0a0a"
        stroke="#0a0a0a"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex h-[36px] items-center gap-1.5 leading-none ${className}`}>
      <FlaskIcon className="block h-[36px] w-[36px] shrink-0 text-neutral-900" />
      <span className="flex h-[36px] items-center text-[22px] font-semibold leading-none tracking-[-0.01em] text-neutral-950">
        <span>click</span>
        <span style={{ color: "#2563EB" }}>decision</span>
        <span>lab</span>
      </span>
    </Link>
  );
}

function StatusBar() {
  return (
    <div className="hidden h-8 items-center border-b border-[#ececec] bg-[#fafafa] text-[11.5px] text-neutral-600 md:flex">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
            <span className="font-medium text-neutral-700">Research live</span>
          </span>
          <span className="text-neutral-300">·</span>
          <span>49 products tracked</span>
          <span className="text-neutral-300">·</span>
          <span>Updated weekly</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-500">
        </div>
      </div>
    </div>
  );
}

const labs: Array<{ label: string; to?: string; live?: boolean }> = [
  { label: "Solar Lab", to: "/solar-calculator", live: true },
  { label: "Battery Lab" },
  { label: "Sauna Lab" },
  { label: "Spa Lab" },
  { label: "Off-Grid Lab" },
];

const tools: Array<{ label: string; to: string }> = [
  { label: "Calculator", to: "/solar-calculator" },
  { label: "Comparisons", to: "/comparisons" },
  { label: "Technical Analysis", to: "/technical-analysis" },
  { label: "Runtime DB", to: "/runtime-database" },
  { label: "Research", to: "/blog" },
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
      <StatusBar />
      <div
        className="border-b transition-colors duration-200"
        style={{
          borderColor: scrolled ? "#e8e8e8" : "rgba(232,232,232,0.6)",
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "saturate(180%) blur(14px)",
          WebkitBackdropFilter: "saturate(180%) blur(14px)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex h-16 items-center gap-3">
            <Logo />
            <div className="hidden items-center gap-3 leading-none md:flex">
              <span className="flex h-[36px] items-center leading-none text-neutral-300">/</span>
              <span className="flex h-[36px] items-center font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-neutral-500">
                Real specs. Real decisions.
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-[13px] text-neutral-700 lg:flex">
            <div className="group relative">
              <span className="cursor-default transition-colors hover:text-neutral-950">Labs</span>
              <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-[260px] -translate-x-1/2 rounded-md border border-[#e8e8e8] bg-white p-2 opacity-0 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)] transition-all duration-150 group-hover:visible group-hover:opacity-100">
                {labs.map((l) =>
                  l.to ? (
                    <Link
                      key={l.label}
                      to={l.to}
                      className="flex items-center justify-between rounded px-2.5 py-1.5 text-[13px] hover:bg-[#f5f5f5]"
                    >
                      <span>{l.label}</span>
                      {l.live && (
                        <span className="rounded-sm bg-[#dcfce7] px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-wider text-[#166534]">
                          Live
                        </span>
                      )}
                    </Link>
                  ) : (
                    <div
                      key={l.label}
                      className="flex items-center justify-between rounded px-2.5 py-1.5 text-[13px] text-neutral-400"
                    >
                      <span>{l.label}</span>
                      <span className="text-[10px] uppercase tracking-wider">Soon</span>
                    </div>
                  ),
                )}
              </div>
            </div>
            {tools.map((t) => (
              <Link key={t.label} to={t.to} className="transition-colors hover:text-neutral-950">
                {t.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Search" className="text-neutral-700 transition-colors hover:text-neutral-950">
              <Search className="h-[17px] w-[17px]" strokeWidth={1.6} />
            </button>
            <Link
              to="/solar-calculator"
              className="group inline-flex items-center gap-1.5 rounded-md border border-neutral-900 bg-neutral-900 px-3.5 py-1.5 text-[12.5px] font-medium text-white transition-colors duration-200 hover:bg-[#2563EB] hover:border-[#2563EB]"
            >
              Open Lab
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
