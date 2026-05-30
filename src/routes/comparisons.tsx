import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/comparisons")({
  head: () => ({
    meta: [
      { title: "Comparisons — ClickDecisionLab" },
      {
        name: "description",
        content:
          "Side-by-side technical comparisons across high-ticket categories. Specs, tests, and verdicts.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <SiteNav />
      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#2563EB]">
            COMPARISONS
          </p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.15] tracking-[-0.025em]">
            Side-by-side, spec by spec.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-neutral-600">
            Comparisons land here as each vertical opens. Solar generator matchups are first up.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
