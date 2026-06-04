import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { QuickCalculator } from "@/components/quick-calculator";
import { SolarCalculator } from "@/components/solar-calculator";
import powerStation from "@/assets/power-station.png";
import solarPanel from "@/assets/solar-panel.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClickDecisionLab — Complex products. Clear decisions." },
      {
        name: "description",
        content:
          "A technical decision platform for high-ticket purchases. We turn specifications, runtime claims and marketing promises into clear, engineering-grade recommendations.",
      },
      { property: "og:title", content: "ClickDecisionLab — Complex products. Clear decisions." },
      {
        property: "og:description",
        content:
          "Engineering-grade product recommendations for solar, batteries, saunas, spas and off-grid systems.",
      },
    ],
  }),
  component: Index,
});

const MONO = "font-mono text-[11px] uppercase tracking-[0.14em]";
const ACCENT = "#2563EB";
const BORDER = "#e8e8e8";
const SOFT = "#fafafa";

/* Subtle technical background — engineering grid + faint topographic wash.
   Sits behind every section, almost invisible. */
function TechBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: [
          "linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px)",
          "linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px)",
          "linear-gradient(to right, rgba(15,23,42,0.02) 1px, transparent 1px)",
          "linear-gradient(to bottom, rgba(15,23,42,0.02) 1px, transparent 1px)",
          "radial-gradient(1200px 600px at 85% -10%, rgba(37,99,235,0.045), transparent 60%)",
          "radial-gradient(900px 500px at -10% 30%, rgba(15,23,42,0.025), transparent 60%)",
        ].join(","),
        backgroundSize:
          "48px 48px, 48px 48px, 240px 240px, 240px 240px, 100% 100%, 100% 100%",
      }}
    />
  );
}

/* Inline sparkline — pure SVG, no deps. */
function Sparkline({
  data,
  color = ACCENT,
  width = 120,
  height = 28,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <polyline
        points={`0,${height} ${pts} ${width},${height}`}
        fill={color}
        opacity={0.08}
        stroke="none"
      />
    </svg>
  );
}

/* Horizontal score bar */
function ScoreBar({ value, label, sub }: { value: number; label: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[12.5px] text-neutral-700">{label}</span>
        <span className="text-[13px] font-semibold tabular-nums text-neutral-950">
          {value.toFixed(1)}
          <span className="text-neutral-400">/10</span>
        </span>
      </div>
      <div className="mt-1.5 h-[5px] w-full rounded-full bg-[#f1f2f4]">
        <div
          className="h-full rounded-full"
          style={{ width: `${value * 10}%`, backgroundColor: ACCENT }}
        />
      </div>
      {sub && <p className="mt-1 text-[11px] text-neutral-500">{sub}</p>}
    </div>
  );
}

function Eyebrow({ children, num }: { children: React.ReactNode; num?: string }) {
  return (
    <div className="flex items-center gap-2 text-neutral-500">
      {num && <span className={`${MONO} text-[#2563EB]`}>{num}</span>}
      <span className={`${MONO}`}>{children}</span>
    </div>
  );
}

function Section({
  id,
  bg = "white",
  children,
}: {
  id?: string;
  bg?: "white" | "soft" | "dark";
  children: React.ReactNode;
}) {
  const bgClass = bg === "soft" ? "bg-[#fafafa]" : bg === "dark" ? "bg-[#0b0d10]" : "bg-white";
  return (
    <section
      id={id}
      className={`${bgClass} border-b px-6 py-20 md:py-24`}
      style={{ borderColor: bg === "dark" ? "#1a1d22" : BORDER }}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

/* ------------------------------ HERO ------------------------------ */
function Hero() {
  const specs = [
    {
      v: "1000W",
      l: "Continuous power",
      icon: (
        <path d="M3 12h3l2-7 4 14 2-7h7" />
      ),
    },
    {
      v: "2000W",
      l: "Surge power",
      icon: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
    },
    {
      v: "1024Wh",
      l: "Capacity",
      icon: (
        <>
          <rect x="3" y="7" width="16" height="10" rx="2" />
          <path d="M19 10v4M22 11v2" />
        </>
      ),
    },
    {
      v: "LiFePO4",
      l: "Battery chemistry",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </>
      ),
    },
  ];

  return (
    <section
      className="relative w-full overflow-hidden border-b pt-[96px]"
      style={{
        borderColor: BORDER,
        backgroundImage: "linear-gradient(to bottom, #FFFFFF 0%, #F4F6F8 100%)",
      }}
    >
      {/* fine geometric grid overlay, #000 @ 3% */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* topographic CAD lines */}
      <svg
        aria-hidden
        viewBox="0 0 1400 700"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full text-[#2563EB] opacity-[0.06]"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <path d="M0 520 C 200 460, 400 560, 700 480 S 1200 420, 1400 460" />
        <path d="M0 560 C 220 500, 420 600, 720 520 S 1200 460, 1400 500" />
        <path d="M0 600 C 240 540, 440 640, 740 560 S 1200 500, 1400 540" />
      </svg>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:py-14 lg:grid-cols-12 lg:gap-10">
        {/* LEFT — copy + power station render */}
        <div className="flex flex-col lg:col-span-3">
          <p className={`${MONO} text-[#2563EB]`}>SOLAR LAB</p>
          <h1
            className="mt-4 font-semibold leading-[1.02] tracking-[-0.03em] text-neutral-950"
            style={{ fontSize: "clamp(36px, 4.4vw, 52px)" }}
          >
            Solar generator
            <br />
            calculator.
          </h1>
          <p className="mt-5 max-w-[280px] text-[14px] leading-[1.6] text-neutral-600">
            Pick your scenario, the key appliance you need to run, and your budget. We match
            against real specs and surge requirements.
          </p>

          <div className="hidden mt-8 justify-start lg:flex">
            <img
              src={powerStation}
              alt="Generic portable power station — reference unit"
              width={1024}
              height={1024}
              className="h-auto w-[180px] select-none object-contain"
              draggable={false}
            />
          </div>
        </div>

        {/* CENTER — calculator card */}
        <div className="lg:col-span-6">
          <SolarCalculator />
          <div className="mt-4 flex justify-center">
            <Link
              to="/blog"
              className="text-[14px] text-[#2563EB] hover:underline"
            >
              Browse research & guides →
            </Link>
          </div>
        </div>

        {/* RIGHT — specs + solar panel */}
        <div className="flex flex-col lg:col-span-3">

          <ul className="space-y-6">
            {specs.map((s) => (
              <li key={s.v} className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-neutral-500">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon}
                  </svg>
                </span>
                <div>
                  <div className="text-[18px] font-semibold leading-tight tracking-[-0.01em] text-neutral-950">
                    {s.v}
                  </div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-neutral-500">
                    {s.l}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden flex-1 items-center justify-end lg:flex">
            <svg viewBox="0 0 380 480" xmlns="http://www.w3.org/2000/svg" role="img" className="h-auto w-full max-w-[280px] select-none">
              <rect width="380" height="480" fill="#F8F9FB" rx="10"/>
              <rect width="380" height="480" fill="none" stroke="#E2E5EA" strokeWidth="0.5" rx="10"/>
              <rect width="380" height="32" fill="#FFFFFF" rx="10"/>
              <rect y="10" width="380" height="22" fill="#FFFFFF"/>
              <circle cx="14" cy="16" r="4" fill="#22C55E"/>
              <text x="24" y="20" fontFamily="monospace" fontSize="8" fill="#22C55E">LIVE</text>
              <text x="50" y="20" fontFamily="monospace" fontSize="8" fill="#BBBBBB">·</text>
              <text x="58" y="20" fontFamily="monospace" fontSize="8" fill="#888">UNIT · 2048 Wh CLASS</text>
              <text x="270" y="20" fontFamily="monospace" fontSize="8" fill="#BBBBBB">sync 2h ago</text>
              <rect y="32" width="380" height="0.5" fill="#E2E5EA"/>
              <rect x="12" y="44" width="356" height="96" rx="6" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="0.5"/>
              <text x="20" y="59" fontFamily="monospace" fontSize="7.5" fill="#AAAAAA" letterSpacing="1">RUNTIME CURVE · 215W CONTINUOUS LOAD</text>
              <line x1="20" y1="125" x2="360" y2="125" stroke="#F0F0F0" strokeWidth="0.5"/>
              <line x1="20" y1="108" x2="360" y2="108" stroke="#F0F0F0" strokeWidth="0.5"/>
              <line x1="20" y1="91" x2="360" y2="91" stroke="#F0F0F0" strokeWidth="0.5"/>
              <line x1="20" y1="74" x2="360" y2="74" stroke="#F0F0F0" strokeWidth="0.5"/>
              <text x="22" y="128" fontFamily="monospace" fontSize="7" fill="#CCC">0%</text>
              <text x="22" y="111" fontFamily="monospace" fontSize="7" fill="#CCC">25%</text>
              <text x="22" y="94" fontFamily="monospace" fontSize="7" fill="#CCC">50%</text>
              <text x="22" y="77" fontFamily="monospace" fontSize="7" fill="#CCC">75%</text>
              <polyline points="46,115 80,108 114,103 148,107 182,101 216,95 250,98 284,91 318,94 352,89" fill="none" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3,2"/>
              <polyline points="46,115 80,105 114,97 148,102 182,93 216,84 250,88 284,78 318,82 352,74" fill="none" stroke="#2563EB" strokeWidth="1.8"/>
              <circle cx="352" cy="74" r="3" fill="#2563EB"/>
              <text x="355" y="73" fontFamily="monospace" fontSize="8" fill="#2563EB">13.4h</text>
              <circle cx="352" cy="89" r="3" fill="#CBD5E1"/>
              <text x="355" y="93" fontFamily="monospace" fontSize="8" fill="#AAAAAA">11.1h</text>
              <text x="44" y="136" fontFamily="monospace" fontSize="7" fill="#CCC">0h</text>
              <text x="114" y="136" fontFamily="monospace" fontSize="7" fill="#CCC">4h</text>
              <text x="184" y="136" fontFamily="monospace" fontSize="7" fill="#CCC">8h</text>
              <text x="254" y="136" fontFamily="monospace" fontSize="7" fill="#CCC">12h</text>
              <rect x="12" y="152" width="356" height="90" rx="6" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="0.5"/>
              <text x="20" y="167" fontFamily="monospace" fontSize="7.5" fill="#AAAAAA" letterSpacing="1">COMPOSITE SCORE · METHODOLOGY v2.3</text>
              <text x="20" y="196" fontFamily="monospace" fontSize="30" fontWeight="bold" fill="#111111">8.7</text>
              <text x="62" y="182" fontFamily="monospace" fontSize="9" fill="#22C55E">↑ 0.3</text>
              <text x="62" y="196" fontFamily="monospace" fontSize="8" fill="#AAAAAA">/10</text>
              <text x="110" y="178" fontFamily="monospace" fontSize="8" fill="#555">Backup Reliability</text>
              <rect x="232" y="171" width="110" height="5" rx="2" fill="#F0F0F0"/>
              <rect x="232" y="171" width="100" height="5" rx="2" fill="#2563EB"/>
              <text x="346" y="177" fontFamily="monospace" fontSize="7.5" fill="#2563EB">9.1</text>
              <text x="110" y="191" fontFamily="monospace" fontSize="8" fill="#555">Surge Handling</text>
              <rect x="232" y="184" width="110" height="5" rx="2" fill="#F0F0F0"/>
              <rect x="232" y="184" width="97" height="5" rx="2" fill="#2563EB"/>
              <text x="346" y="190" fontFamily="monospace" fontSize="7.5" fill="#2563EB">8.8</text>
              <text x="110" y="204" fontFamily="monospace" fontSize="8" fill="#555">Efficiency</text>
              <rect x="232" y="197" width="110" height="5" rx="2" fill="#F0F0F0"/>
              <rect x="232" y="197" width="93" height="5" rx="2" fill="#2563EB"/>
              <text x="346" y="203" fontFamily="monospace" fontSize="7.5" fill="#2563EB">8.4</text>
              <text x="110" y="217" fontFamily="monospace" fontSize="8" fill="#777">Apt. Suitability</text>
              <rect x="232" y="210" width="110" height="5" rx="2" fill="#F0F0F0"/>
              <rect x="232" y="210" width="79" height="5" rx="2" fill="#CBD5E1"/>
              <text x="346" y="216" fontFamily="monospace" fontSize="7.5" fill="#AAAAAA">7.2</text>
              <rect x="12" y="254" width="82" height="52" rx="6" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="0.5"/>
              <text x="20" y="268" fontFamily="monospace" fontSize="7" fill="#AAAAAA">UPS LATENCY</text>
              <text x="20" y="286" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#22C55E">20ms</text>
              <text x="20" y="299" fontFamily="monospace" fontSize="7" fill="#AAAAAA">0 dropouts</text>
              <rect x="102" y="254" width="82" height="52" rx="6" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="0.5"/>
              <text x="110" y="268" fontFamily="monospace" fontSize="7" fill="#AAAAAA">CYCLE LIFE</text>
              <text x="110" y="286" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#111">3,500</text>
              <text x="110" y="299" fontFamily="monospace" fontSize="7" fill="#AAAAAA">@ 80% DoD</text>
              <rect x="192" y="254" width="82" height="52" rx="6" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="0.5"/>
              <text x="200" y="268" fontFamily="monospace" fontSize="7" fill="#AAAAAA">EFFICIENCY</text>
              <text x="200" y="286" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#111">94.1%</text>
              <text x="200" y="299" fontFamily="monospace" fontSize="7" fill="#AAAAAA">AC-AC</text>
              <rect x="282" y="254" width="86" height="52" rx="6" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="0.5"/>
              <text x="290" y="268" fontFamily="monospace" fontSize="7" fill="#AAAAAA">SOLAR INPUT</text>
              <text x="290" y="286" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#111">800W</text>
              <text x="290" y="299" fontFamily="monospace" fontSize="7" fill="#AAAAAA">max charge</text>
              <rect x="12" y="318" width="356" height="52" rx="6" fill="#FFFBF0" stroke="#F5E6C0" strokeWidth="0.5"/>
              <rect x="12" y="318" width="3" height="52" rx="1" fill="#F59E0B"/>
              <text x="24" y="333" fontFamily="monospace" fontSize="7.5" fill="#B45309" letterSpacing="0.5">TRADE-OFF</text>
              <text x="24" y="348" fontFamily="monospace" fontSize="8.5" fill="#444">Excellent whole-home backup performance,</text>
              <text x="24" y="361" fontFamily="monospace" fontSize="8.5" fill="#888">but oversized for apartment emergency use.</text>
              <rect x="12" y="382" width="356" height="86" rx="6" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="0.5"/>
              <text x="20" y="397" fontFamily="monospace" fontSize="7.5" fill="#AAAAAA" letterSpacing="1">ACTIVE RESEARCH</text>
              <circle cx="22" cy="413" r="3" fill="#22C55E"/>
              <text x="32" y="417" fontFamily="monospace" fontSize="8" fill="#333">Runtime database refreshed · 12 SKUs re-scored</text>
              <text x="310" y="417" fontFamily="monospace" fontSize="7.5" fill="#CCCCCC">2h</text>
              <circle cx="22" cy="430" r="3" fill="#2563EB"/>
              <text x="32" y="434" fontFamily="monospace" fontSize="8" fill="#333">Surge simulations updated · 8 inductive loads</text>
              <text x="310" y="434" fontFamily="monospace" fontSize="7.5" fill="#CCCCCC">9h</text>
              <circle cx="22" cy="447" r="3" fill="#94A3B8"/>
              <text x="32" y="451" fontFamily="monospace" fontSize="8" fill="#777">LiFePO4 degradation model · +3 chemistries</text>
              <text x="310" y="451" fontFamily="monospace" fontSize="7.5" fill="#CCCCCC">2d</text>
              <circle cx="22" cy="460" r="3" fill="#94A3B8"/>
              <text x="32" y="464" fontFamily="monospace" fontSize="8" fill="#777">Noise benchmarking · 6 inverters @ 1m</text>
              <text x="310" y="464" fontFamily="monospace" fontSize="7.5" fill="#CCCCCC">4d</text>
            </svg>
          </div>


        </div>

      </div>
    </section>
  );
}


/* ---------------------------- CALC FIELD ---------------------------- */
function CalcField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: "home" | "fridge" | "dollar" | "calendar";
}) {
  const Icon = () => {
    const common = {
      viewBox: "0 0 24 24",
      className: "h-[18px] w-[18px] text-neutral-500",
      fill: "none" as const,
      stroke: "currentColor",
      strokeWidth: 1.6,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    };
    if (icon === "home")
      return (
        <svg {...common}>
          <path d="M3 11l9-7 9 7" />
          <path d="M5 10v10h14V10" />
        </svg>
      );
    if (icon === "fridge")
      return (
        <svg {...common}>
          <rect x="5" y="2.5" width="14" height="19" rx="2" />
          <path d="M5 10h14M8 6v2M8 14v3" />
        </svg>
      );
    if (icon === "dollar")
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2M12 6v12" />
        </svg>
      );
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    );
  };

  return (
    <div>
      <label className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </label>
      <div
        className="mt-2 flex items-center gap-3 rounded-[10px] border bg-white px-3.5 py-3 transition-colors hover:border-neutral-400"
        style={{ borderColor: BORDER }}
      >
        <Icon />
        <span className="flex-1 text-[14px] text-neutral-900">{value}</span>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

/* ---------------------------- FEATURE BAR ---------------------------- */
function FeatureBar() {
  const items: Array<{ l: string; icon: React.ReactNode }> = [
    {
      l: "Real Data",
      icon: (
        <path d="M3 17l4-4 3 3 7-7 4 4" />
      ),
    },
    {
      l: "Surge Tested",
      icon: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
    },
    {
      l: "Updated Weekly",
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ),
    },
    {
      l: "No Sponsored Rankings",
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M5 5l14 14" />
        </>
      ),
    },
    {
      l: "Transparent Methodology",
      icon: (
        <>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </>
      ),
    },
  ];
  return (
    <section className="border-b bg-white px-6" style={{ borderColor: BORDER }}>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-4 py-5 md:flex md:items-center md:justify-between">
        {items.map((it) => (
          <div
            key={it.l}
            className="flex items-center gap-2.5 text-[12px] uppercase tracking-[0.1em] text-neutral-700"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#2563EB]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {it.icon}
            </svg>
            <span className="font-medium text-neutral-800">{it.l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- DATABASE BAR --------------------------- */
function DatabaseStrip() {
  const items = [
    { n: "49", l: "Products tracked" },
    { n: "420+", l: "Specs monitored" },
    { n: "6", l: "Decision verticals" },
    { n: "0", l: "Sponsored rankings" },
    { n: "Weekly", l: "Dataset refresh" },
  ];
  return (
    <section className="border-b bg-white px-6" style={{ borderColor: BORDER }}>
      <div
        className="mx-auto grid max-w-7xl grid-cols-2 divide-x py-0 md:grid-cols-5"
        style={{ borderColor: BORDER }}
      >
        {items.map((s, i) => (
          <div
            key={s.l}
            className={`flex flex-col gap-1 px-5 py-7 ${
              i % 2 === 1 && i < 4 ? "border-l" : ""
            } md:border-l`}
            style={{ borderColor: BORDER }}
          >
            <p className="text-[22px] font-semibold tabular-nums tracking-tight text-neutral-950">
              {s.n}
            </p>
            <p className={`${MONO} text-neutral-500`}>{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- LIVE DATABASE ---------------------------- */
function LiveDatabase() {
  const rows = [
    { sku: "PWR-2048-A", b: "Model A", wh: 2048, surge: 4800, score: 92, st: "Verified" },
    { sku: "PWR-2000-B", b: "Model B", wh: 2000, surge: 4800, score: 84, st: "Verified" },
    { sku: "PWR-3600-A", b: "Model A+", wh: 3600, surge: 7200, score: 95, st: "Verified" },
    { sku: "PWR-1024-A", b: "Model A", wh: 1024, surge: 2400, score: 78, st: "Verified" },
    { sku: "PWR-0716-B", b: "Model B", wh: 716, surge: 1400, score: 68, st: "Tracking" },
    { sku: "PWR-0768-A", b: "Model A", wh: 768, surge: 1600, score: 72, st: "Verified" },
  ];
  return (
    <Section id="research" bg="soft">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow num="02">Live research database</Eyebrow>
          <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 md:text-[40px]">
            Active monitoring.
            <br />
            <span className="text-neutral-400">Continuous analysis.</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-neutral-500">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
          <span>Last sync: 2 hours ago</span>
        </div>
      </div>

      <div
        className="mt-10 overflow-hidden rounded-lg border bg-white"
        style={{ borderColor: BORDER }}
      >
        <div
          className={`grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.6fr_0.8fr] gap-4 border-b bg-white px-5 py-3 ${MONO} text-neutral-500`}
          style={{ borderColor: BORDER }}
        >
          <div>SKU</div>
          <div>Brand</div>
          <div className="text-right">Capacity</div>
          <div className="text-right">Surge</div>
          <div className="text-right">Score</div>
          <div className="text-right">Status</div>
        </div>
        {rows.map((r) => (
          <div
            key={r.sku}
            className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.6fr_0.8fr] gap-4 border-b px-5 py-3 text-[13px] text-neutral-800 last:border-0"
            style={{ borderColor: BORDER }}
          >
            <div className="font-mono text-[12.5px] text-neutral-900">{r.sku}</div>
            <div className="text-neutral-600">{r.b}</div>
            <div className="text-right tabular-nums">{r.wh} Wh</div>
            <div className="text-right tabular-nums">{r.surge} W</div>
            <div className="text-right">
              <span
                className="inline-block w-10 rounded-sm px-1.5 py-px text-right text-[12px] font-semibold tabular-nums"
                style={{
                  backgroundColor: r.score >= 85 ? "#eff6ff" : "#f5f5f5",
                  color: r.score >= 85 ? ACCENT : "#6b7280",
                }}
              >
                {r.score}
              </span>
            </div>
            <div className="text-right">
              <span
                className={`${MONO}`}
                style={{ color: r.st === "Verified" ? "#166534" : "#6b7280" }}
              >
                {r.st}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- COMPARISON SNAPSHOT ---------------------------- */
function ComparisonSnapshot() {
  const metrics: Array<{ k: string; a: string; b: string; winner: "a" | "b" | "tie" }> = [
    { k: "Capacity", a: "2,048 Wh", b: "2,000 Wh", winner: "a" },
    { k: "Surge power", a: "4,800 W", b: "4,800 W", winner: "tie" },
    { k: "Runtime (215 W load)", a: "13.4 h", b: "11.1 h", winner: "a" },
    { k: "Recharge to 80%", a: "65 min", b: "180 min", winner: "a" },
    { k: "UPS switchover", a: "20 ms", b: "—", winner: "a" },
    { k: "Cycle life @ 80%", a: "3,000", b: "3,500", winner: "b" },
    { k: "Weight", a: "23 kg", b: "27.5 kg", winner: "a" },
    { k: "Noise @ 1 m", a: "52 dB", b: "48 dB", winner: "b" },
  ];

  const Cell = ({ v, win }: { v: string; win: boolean }) => (
    <div
      className={`px-4 py-3 text-right text-[13px] tabular-nums ${
        win ? "font-semibold text-neutral-950" : "text-neutral-700"
      }`}
      style={win ? { backgroundColor: "#eff6ff" } : undefined}
    >
      {v}
    </div>
  );

  return (
    <Section bg="white">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow num="03">Comparison snapshot</Eyebrow>
          <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 md:text-[40px]">
            Structured. Not subjective.
          </h2>
          <p className="mt-3 max-w-xl text-[15px] text-neutral-600">
            Every metric is sourced from manufacturer datasheets and verified against independent
            runtime tests. We show winners — and we show trade-offs.
          </p>
        </div>
        <Link
          to="/comparisons"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2563EB] hover:underline"
        >
          View all comparisons →
        </Link>
      </div>

      <div
        className="mt-10 overflow-hidden rounded-lg border bg-white"
        style={{ borderColor: BORDER }}
      >
        <div
          className="grid grid-cols-[1.4fr_1fr_1fr] border-b bg-[#fafafa]"
          style={{ borderColor: BORDER }}
        >
          <div className={`px-4 py-3 ${MONO} text-neutral-500`}>Metric</div>
          <div className="border-l px-4 py-3 text-right" style={{ borderColor: BORDER }}>
            <div className={`${MONO} text-neutral-500`}>Unit A</div>
            <div className="mt-1 text-[13.5px] font-semibold text-neutral-900">
              Reference Unit · 2,048 Wh class
            </div>
          </div>
          <div className="border-l px-4 py-3 text-right" style={{ borderColor: BORDER }}>
            <div className={`${MONO} text-neutral-500`}>Unit B</div>
            <div className="mt-1 text-[13.5px] font-semibold text-neutral-900">Reference Unit · 2,000 Wh class</div>
          </div>
        </div>
        {metrics.map((m, i) => (
          <div
            key={m.k}
            className={`grid grid-cols-[1.4fr_1fr_1fr] ${i < metrics.length - 1 ? "border-b" : ""}`}
            style={{ borderColor: BORDER }}
          >
            <div className="px-4 py-3 text-[13px] text-neutral-700">{m.k}</div>
            <div className="border-l" style={{ borderColor: BORDER }}>
              <Cell v={m.a} win={m.winner === "a"} />
            </div>
            <div className="border-l" style={{ borderColor: BORDER }}>
              <Cell v={m.b} win={m.winner === "b"} />
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-4 rounded border-l-2 bg-[#fafafa] px-4 py-3 text-[12.5px] text-neutral-700"
        style={{ borderColor: ACCENT }}
      >
        <span className="font-semibold text-neutral-900">Trade-off note —</span> Unit A wins on
        runtime, surge response and recharge speed. Unit B wins on cycle life and acoustic profile —
        relevant for living-room placements.
      </div>
    </Section>
  );
}

/* ------------------------------ LABS ------------------------------ */
type Lab = {
  code: string;
  title: string;
  desc: string;
  metrics: string[];
  status: "live" | "soon";
  href?: string;
};

function LabCard({ lab }: { lab: Lab }) {
  const isLive = lab.status === "live";
  const inner = (
    <div
      className={`group relative h-full rounded-lg border bg-white p-6 transition-colors duration-200 ${
        isLive ? "hover:border-[#2563EB]" : ""
      }`}
      style={{ borderColor: BORDER, opacity: isLive ? 1 : 0.75 }}
    >
      <div className="flex items-center justify-between">
        <span className={`${MONO} text-neutral-500`}>{lab.code}</span>
        <span
          className={`${MONO} rounded-sm px-1.5 py-px`}
          style={
            isLive
              ? { backgroundColor: "#dcfce7", color: "#166534" }
              : { backgroundColor: "#f3f4f6", color: "#9ca3af" }
          }
        >
          {isLive ? "Live" : "Q3 2026"}
        </span>
      </div>
      <h3 className="mt-5 text-[18px] font-semibold text-neutral-950">{lab.title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-600">{lab.desc}</p>
      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 text-[11.5px] text-neutral-500">
        {lab.metrics.map((m, i) => (
          <span key={m} className="flex items-center gap-3">
            {i > 0 && <span className="text-neutral-300">·</span>}
            <span>{m}</span>
          </span>
        ))}
      </div>
      {isLive && (
        <span className="absolute bottom-6 right-6 text-[#2563EB] transition-transform duration-200 group-hover:translate-x-0.5">
          →
        </span>
      )}
    </div>
  );

  if (isLive && lab.href) {
    return <Link to={lab.href}>{inner}</Link>;
  }
  return inner;
}

function Labs() {
  // Real-time metrics — keep in sync with actual site stats
  const SITE_STATS = {
    products: 49,
    brands: 10,
    technicalAnalyses: 15,
    articles: 83,
    comparisons: 25,
  };

  const labs: Lab[] = [
    {
      code: "LAB-01",
      title: "Solar Generators",
      desc: "49 products. 15 Technical Analysis. 25 comparisons. Complete decision engine with real specs and expert verdicts.",
      metrics: ["49 products", "10 brands", "7 use-case scores"],
      status: "live",
      href: "/solar-calculator",
    },
    {
      code: "LAB-02",
      title: "EV Chargers",
      desc: "Level 1 vs Level 2, amperage requirements, panel compatibility, NACS vs J1772, smart features and installation complexity.",
      metrics: ["Amperage", "Panel load", "Smart features"],
      status: "analysis",
      href: "/ev-chargers",
    },
    {
      code: "LAB-03",
      title: "Home Batteries",
      desc: "Whole-home storage systems — LFP chemistry, cycle life, depth of discharge, inverter pairing and grid-tie compatibility.",
      metrics: ["kWh capacity", "Cycle life", "Grid-tie"],
      status: "analysis",
      href: "/home-batteries",
    },
    {
      code: "LAB-04",
      title: "Backup Power",
      desc: "Standby generators, transfer switches, whole-home backup design — fuel type, runtime, load management.",
      metrics: ["kW output", "Runtime", "Transfer"],
      status: "planned",
      href: "/backup-power",
    },
  ];

  return (
    <Section id="labs" bg="white">
      <Eyebrow num="04">Labs</Eyebrow>
      <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 md:text-[40px]">
        Specialized. Modular. Scalable.
      </h2>
      <p className="mt-3 max-w-xl text-[15px] text-neutral-600">
        Each lab is a self-contained research environment with its own dataset, methodology and
        calculators.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {labs.map((l) => (
          <LabCard key={l.code} lab={l} />
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- METHODOLOGY ---------------------------- */
function Methodology() {
  const steps = [
    {
      n: "M.01",
      t: "Spec extraction",
      d: "We pull verified manufacturer datasheets and cross-reference them with third-party teardowns and independent runtime tests.",
    },
    {
      n: "M.02",
      t: "Weighted scoring",
      d: "Each metric carries a transparent weight based on the user's scenario — runtime, surge, expandability, efficiency, noise, UPS.",
    },
    {
      n: "M.03",
      t: "Trade-off analysis",
      d: "Every recommendation states what the product does NOT do well, and who should not buy it.",
    },
    {
      n: "M.04",
      t: "Real-world conditions",
      d: "Cold temperatures, inverter losses, real appliance draw — modelled, not assumed.",
    },
  ];

  return (
    <Section id="methodology" bg="soft">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow num="05">Methodology</Eyebrow>
          <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 md:text-[40px]">
            How recommendations are made.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
            We publish our scoring weights and testing methodology so every verdict is auditable.
            No paid rankings. No hidden criteria. Limitations are part of the output, not an
            afterthought.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[12px] text-neutral-500">
            <span className={`${MONO}`}>Methodology v2.3</span>
            <span className="text-neutral-300">·</span>
            <span className={`${MONO}`}>Changelog public</span>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div
            className="overflow-hidden rounded-lg border bg-white"
            style={{ borderColor: BORDER }}
          >
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`grid grid-cols-[80px_1fr] gap-6 p-6 ${
                  i < steps.length - 1 ? "border-b" : ""
                }`}
                style={{ borderColor: BORDER }}
              >
                <div className={`${MONO} pt-0.5 text-[#2563EB]`}>{s.n}</div>
                <div>
                  <h3 className="text-[15.5px] font-semibold text-neutral-950">{s.t}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-600">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------- CALCULATOR ---------------------------- */
function CalculatorSection() {
  return (
    <Section bg="white">
      <Eyebrow num="06">Calculator</Eyebrow>
      <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 md:text-[40px]">
        Runtime calculator.
      </h2>
      <p className="mt-3 max-w-xl text-[15px] text-neutral-600">
        Define your scenario. We compute load, surge and runtime against the live database.
      </p>
      <div className="mt-10">
        <QuickCalculator />
      </div>
    </Section>
  );
}

/* ---------------------------- PHILOSOPHY ---------------------------- */
function Philosophy() {
  const items = [
    {
      n: "P.01",
      t: "We publish limitations",
      d: "Every recommendation explains who should not buy the product. No exceptions.",
    },
    {
      n: "P.02",
      t: "Trade-offs over hype",
      d: "There is no universal best. We show the scenarios each product wins — and loses.",
    },
    {
      n: "P.03",
      t: "Advisory, not transactional",
      d: "We earn only when you buy. Brands cannot pay to rank. CTAs respect your autonomy.",
    },
  ];
  return (
    <Section bg="soft">
      <Eyebrow num="07">Philosophy</Eyebrow>
      <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 md:text-[40px]">
        Built to reduce buying mistakes.
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((i) => (
          <div
            key={i.n}
            className="rounded-lg border bg-white p-6"
            style={{ borderColor: BORDER }}
          >
            <div className={`${MONO} text-[#2563EB]`}>{i.n}</div>
            <h3 className="mt-4 text-[16px] font-semibold text-neutral-950">{i.t}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-600">{i.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- FINAL CTA ---------------------------- */
function FinalCTA() {
  return (
    <section className="border-b bg-[#0b0d10] px-6 py-24" style={{ borderColor: "#1a1d22" }}>
      <div className="mx-auto max-w-3xl text-center">
        <div className={`${MONO} text-[#60a5fa]`}>08 · Start here</div>
        <h2 className="mt-5 text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[44px]">
          Engineering-grade recommendations.
          <br />
          <span className="text-neutral-500">Open the lab.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-relaxed text-neutral-400">
          Solar Lab is live. Battery, Sauna, Spa and Off-Grid labs are in active research.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/solar-calculator"
            className="group inline-flex items-center gap-1.5 rounded-md bg-[#2563EB] px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors duration-200 hover:bg-[#1d4ed8]"
          >
            Open Solar Lab
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
          <a
            href="#methodology"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 px-5 py-2.5 text-[13.5px] font-medium text-neutral-200 transition-colors duration-200 hover:border-neutral-400"
          >
            Read methodology
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- RESEARCH ACTIVITY ---------------------------- */
function ResearchActivity() {
  const items = [
    { t: "2h", tag: "DB", msg: "Runtime database refreshed · 12 SKUs re-scored" },
    { t: "9h", tag: "TEST", msg: "UPS transition tests completed on Unit A (20 ms verified)" },
    { t: "1d", tag: "SIM", msg: "Apartment backup simulations updated · 215 W baseline" },
    { t: "2d", tag: "DATA", msg: "Battery cycle database expanded · +3 LiFePO4 chemistries" },
    { t: "4d", tag: "BENCH", msg: "Noise benchmarking session · 6 inverters measured @ 1 m" },
  ];
  return (
    <section className="relative border-b bg-white px-6" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-7xl py-5">
        <div className="flex items-center gap-4 overflow-x-auto">
          <div className="flex shrink-0 items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16a34a] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16a34a]" />
            </span>
            <span className={`${MONO} text-neutral-700`}>Lab activity</span>
          </div>
          <span className="h-4 w-px shrink-0 bg-neutral-200" />
          <div className="flex items-center gap-5 whitespace-nowrap text-[12px] text-neutral-600">
            {items.map((i) => (
              <div key={i.msg} className="flex items-center gap-2">
                <span className={`${MONO} rounded-sm bg-[#f3f4f6] px-1.5 py-px text-neutral-500`}>
                  {i.tag}
                </span>
                <span className="text-neutral-800">{i.msg}</span>
                <span className="text-neutral-400">· {i.t} ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- SCORING PANEL ---------------------------- */
function ScoringPanel() {
  const dims = [
    { v: 9.3, l: "Surge handling", s: "Cold-start of 4 kW inductive loads" },
    { v: 8.9, l: "Backup reliability", s: "20 ms UPS · 0 dropouts in 96 h test" },
    { v: 8.4, l: "Efficiency (round-trip)", s: "94.1% AC-AC · inverter losses modelled" },
    { v: 8.2, l: "Expandability", s: "Stackable to 6,144 Wh · +400 W solar input" },
    { v: 6.8, l: "Portability", s: "23 kg unit weight · single-handle carry" },
    { v: 7.4, l: "Acoustic profile", s: "52 dB @ 1 m under 1 kW load" },
  ];
  const runtime = [62, 64, 61, 70, 74, 78, 80, 82, 85, 84, 86, 88, 87, 89, 92];
  return (
    <Section bg="white">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow num="04">Scoring system</Eyebrow>
          <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 md:text-[40px]">
            Methodology-driven scores.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
            Every score is a weighted aggregate of measured properties — never an editorial opinion.
            Weights are published, the changelog is public, and every dimension links back to its
            test protocol.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-neutral-500">
            <span className={MONO}>Methodology v2.3</span>
            <span className="text-neutral-300">·</span>
            <span className={MONO}>14-day rolling window</span>
            <span className="text-neutral-300">·</span>
            <a href="#methodology" className="text-[#2563EB] hover:underline">
              Read protocol →
            </a>
          </div>

          <div
            className="mt-7 rounded-lg border bg-white p-5"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`${MONO} text-neutral-500`}>Composite score · 14-day</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[28px] font-semibold tabular-nums text-neutral-950">
                    8.7
                  </span>
                  <span className="text-[12px] text-neutral-500">/10</span>
                  <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 0.3</span>
                </div>
              </div>
              <Sparkline data={runtime} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div
            className="rounded-lg border bg-white p-6"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: BORDER }}>
              <div>
                <div className={`${MONO} text-neutral-500`}>Unit under analysis</div>
                <div className="mt-1 text-[15.5px] font-semibold text-neutral-950">
                  Reference Unit · 2,048 Wh class
                </div>
              </div>
              <span
                className={`${MONO} rounded-sm px-2 py-0.5`}
                style={{ backgroundColor: "#eff6ff", color: ACCENT }}
              >
                Score 8.7
              </span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {dims.map((d) => (
                <ScoreBar key={d.l} value={d.v} label={d.l} sub={d.s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------- RECOMMENDATION PANEL ---------------------------- */
function RecommendationPanel() {
  const why = [
    "Strong surge handling — handles 4,800 W inductive cold-start.",
    "Stable UPS performance — 20 ms switchover, zero dropouts in 96 h test.",
    "Modular expansion path — stacks to 6,144 Wh with a second battery.",
    "Fast recharge — 65 min to 80% from AC.",
  ];
  const limits = [
    "Oversized for studio apartments under 35 m².",
    "Acoustically noticeable above 1 kW sustained load (52 dB).",
    "Locked into single-vendor ecosystem — no third-party battery compatibility.",
    "23 kg — not a true grab-and-go unit.",
  ];
  return (
    <Section bg="soft">
      <Eyebrow num="05">Recommendation logic</Eyebrow>
      <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 md:text-[40px]">
        Why we recommend it — and where it fails.
      </h2>
      <p className="mt-3 max-w-xl text-[15px] text-neutral-600">
        Every verdict ships with both halves of the trade-off. Limitations are part of the output,
        not a footnote.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
              <span className={`${MONO} text-neutral-500`}>Why we recommend it</span>
            </div>
            <span className={`${MONO} text-[#16a34a]`}>+ Strengths</span>
          </div>
          <ul className="mt-5 space-y-3">
            {why.map((w) => (
              <li key={w} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-neutral-800">
                <svg viewBox="0 0 12 12" className="mt-1 h-3 w-3 shrink-0 text-[#16a34a]">
                  <path d="M2 6.2l2.6 2.6L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border bg-white p-6" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
              <span className={`${MONO} text-neutral-500`}>Limitations</span>
            </div>
            <span className={`${MONO} text-[#dc2626]`}>− Trade-offs</span>
          </div>
          <ul className="mt-5 space-y-3">
            {limits.map((l) => (
              <li key={l} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-neutral-800">
                <svg viewBox="0 0 12 12" className="mt-1 h-3 w-3 shrink-0 text-[#dc2626]">
                  <path d="M3 3l6 6M9 3l-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------- CURRENT RESEARCH ---------------------------- */
function CurrentResearch() {
  const items = [
    {
      id: "R-014",
      t: "Real-world battery degradation",
      d: "12-month tracking of LiFePO4 capacity loss under daily backup cycling.",
      progress: 72,
      status: "In progress",
    },
    {
      id: "R-015",
      t: "Apartment backup simulations",
      d: "215 W baseline load × 6 unit sizes × 3 climate zones.",
      progress: 100,
      status: "Published",
    },
    {
      id: "R-016",
      t: "240 V split-phase testing",
      d: "Whole-home transfer switch behaviour under inductive surge.",
      progress: 38,
      status: "In progress",
    },
    {
      id: "R-017",
      t: "Runtime consistency analysis",
      d: "Variance of advertised vs measured runtime across 14 portable stations.",
      progress: 100,
      status: "Published",
    },
    {
      id: "R-018",
      t: "Noise performance benchmarking",
      d: "1 m dB readings under 200 W, 600 W, 1 kW, 1.5 kW continuous load.",
      progress: 54,
      status: "In progress",
    },
    {
      id: "R-019",
      t: "Cold-temperature derating",
      d: "Capacity behaviour at -10 °C / 0 °C / 10 °C ambient.",
      progress: 18,
      status: "In progress",
    },
  ];
  return (
    <Section bg="white">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow num="06">Current research</Eyebrow>
          <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 md:text-[40px]">
            Continuously evolving.
          </h2>
          <p className="mt-3 max-w-xl text-[15px] text-neutral-600">
            Open research threads across the labs. Each one feeds the database and the scoring
            model.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-neutral-500">
          <span className={MONO}>6 active threads</span>
          <span className="text-neutral-300">·</span>
          <span className={MONO}>Monitoring 49 products</span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border bg-[#e8e8e8] md:grid-cols-2 lg:grid-cols-3" style={{ borderColor: BORDER }}>
        {items.map((it) => {
          const done = it.progress === 100;
          return (
            <div key={it.id} className="bg-white p-5">
              <div className="flex items-center justify-between">
                <span className={`${MONO} text-neutral-500`}>{it.id}</span>
                <span
                  className={`${MONO} rounded-sm px-1.5 py-px`}
                  style={
                    done
                      ? { backgroundColor: "#dcfce7", color: "#166534" }
                      : { backgroundColor: "#eff6ff", color: ACCENT }
                  }
                >
                  {it.status}
                </span>
              </div>
              <h3 className="mt-3.5 text-[15px] font-semibold text-neutral-950">{it.t}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-600">{it.d}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span className={MONO}>Progress</span>
                  <span className="tabular-nums">{it.progress}%</span>
                </div>
                <div className="mt-1.5 h-[3px] w-full rounded-full bg-[#f1f2f4]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${it.progress}%`,
                      backgroundColor: done ? "#16a34a" : ACCENT,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen text-neutral-950">
      <TechBackdrop />
      <div className="relative z-10">
        <SiteNav />
        <main>
          <Hero />
          <FeatureBar />
          <ResearchActivity />
          <DatabaseStrip />
          <LiveDatabase />
          <ComparisonSnapshot />
          <ScoringPanel />
          <RecommendationPanel />
          <CurrentResearch />
          <Labs />
          <Methodology />
          <CalculatorSection />
          <Philosophy />
          <FinalCTA />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
