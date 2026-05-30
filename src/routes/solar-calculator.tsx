import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SolarCalculator } from "@/components/solar-calculator";

export const Route = createFileRoute("/solar-calculator")({
  head: () => ({
    meta: [
      { title: "Solar Calculator — ClickDecisionLab" },
      {
        name: "description",
        content:
          "Find the right solar generator for your real scenario. Capacity, surge, ports, and budget — matched to verified models.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <SiteNav />
      <main>
        <section
          className="relative w-full overflow-hidden border-b pt-32"
          style={{
            borderColor: "#e8e8e8",
            backgroundImage: "linear-gradient(to bottom, #FFFFFF 0%, #F4F6F8 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6 pb-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#2563EB]">
              SOLAR LAB
            </p>
            <h1 className="mt-3 text-[40px] font-semibold leading-[1.15] tracking-[-0.025em]">
              Solar generator calculator.
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-neutral-600">
              Pick your scenario, the key appliance you need to run, and your budget. We match against
              real specs and surge requirements.
            </p>

            <div className="mt-10">
              <SolarCalculator />
            </div>

            <div
              className="mt-12 rounded-[12px] border bg-white p-7"
              style={{ borderColor: "#e8e8e8" }}
            >
              <h2 className="text-[18px] font-semibold">How we recommend</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-neutral-600">
                Recommendations are based on appliance load profiles, surge requirements, port
                compatibility, and verified manufacturer specs. We do not accept brand sponsorships.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
