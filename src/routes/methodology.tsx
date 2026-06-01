import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/methodology")({
  head: () => ({
      meta: [
            { title: "Our Methodology — ClickDecisionLab" },
                  { name: "description", content: "How ClickDecisionLab evaluates products and builds decision frameworks." },
                      ],
                        }),
                          component: Page,
                          });

                          const sections = [
                            { id: "philosophy", title: "Philosophy of Decision-Making", body: "Our goal is not to identify the best product. Our goal is to identify the best product for a specific use case. Every recommendation depends on context. We do not produce rankings. We build decision frameworks." },
                              { id: "evaluate", title: "How We Evaluate Products", body: "We evaluate nominal vs. usable capacity (Wh), continuous and peak AC output (W), battery chemistry (LFP vs NMC), charging speed (AC/solar/car), noise level, UPS switchover time, weight, price per usable Wh, and warranty terms." },
                                { id: "scoring", title: "Use-Case Scoring System", body: "We score each product per use case — not with a single overall score. Categories: Home Backup (capacity, UPS, expandability), RV & Van Life (weight, 12V output), Camping (portability, noise), Apartment Emergency (compact, quiet), Off-Grid Living (cycle life, expandability), Medical Devices (UPS reliability). A product may score 9.1 for Home Backup and 5.8 for Camping without contradiction." },
                                  { id: "data", title: "Data Sources", body: "Our evaluations combine: manufacturer specifications, independent testing sources (third-party reviews with measurable data), field reports from verified users, engineering analysis (first-principles calculations), and structured comparison frameworks. Where claims conflict with test data, we note the discrepancy. Where data is unavailable, we say so." },
                                    { id: "calculators", title: "How Our Calculators Work", body: "Required capacity = (appliance wattage x daily hours) / inverter efficiency x safety margin. Inverter efficiency defaults to 85-90%. Safety margin defaults to 20%. Depth of discharge: LFP 80-90% usable; NMC 70-80% usable. Every result includes the assumptions used to generate it." },
                                      { id: "limitations", title: "Limitations", body: "We have not physically tested every product — real-world performance may vary. Specifications change without model number updates. Individual units vary due to manufacturing tolerances. Use cases vary — your situation may require criteria our scores do not capture. Our analysis does not replace professional assessment for critical applications." },
                                        { id: "affiliate", title: "Affiliate Policy", body: "ClickDecisionLab earns commissions through affiliate links. Our editorial process is independent of affiliate relationships. We do not accept payment for positive coverage. When a product we recommend has no affiliate program, we recommend it anyway." },
                                          { id: "roadmap", title: "Research Roadmap", body: "Solar Generators & Portable Power Stations: Active. Home Battery Storage Systems: Active. Infrared & Home Saunas: In Development. Inflatable Spas & Hot Tubs: Planned. Overlanding & Off-Road Equipment: Planned." },
                                            { id: "updates", title: "Update Policy", body: "Product data is reviewed when models update, independent tests contradict our evaluation, pricing shifts materially, or user feedback surfaces errors. Each page displays the date of last review." },
                                            ];

                                            function Page() {
                                              return (
                                                  <div className="min-h-screen bg-white text-neutral-950">
                                                        <SiteNav />
                                                              <main className="px-6 pb-24 pt-32">
                                                                      <div className="mx-auto max-w-3xl">
                                                                                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#2563EB]">METHODOLOGY</p>
                                                                                          <h1 className="mt-3 text-[40px] font-semibold leading-[1.15] tracking-[-0.025em]">Our Methodology</h1>
                                                                                                    {sections.map(({ id, title, body }) => (
                                                                                                                <section key={id} className="mt-14 border-t border-neutral-200 pt-10">
                                                                                                                              <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-950">{title}</h2>
                                                                                                                                            <p className="mt-4 text-[15px] leading-relaxed text-neutral-700">{body}</p>
                                                                                                                                                        </section>
                                                                                                                                                                  ))}
                                                                                                                                                                            <div className="mt-14 border-t border-neutral-200 pt-8">
                                                                                                                                                                                        <p className="text-[15px] italic text-neutral-500">Decision quality improves when assumptions are visible. For that reason, we publish not only our recommendations, but also the reasoning, methodology, limitations, and trade-offs behind them.</p>
                                                                                                                                                                                                  </div>
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                </main>
                                                                                                                                                                                                                      <SiteFooter />
                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                            );
                                                                                                                                                                                                                            }
