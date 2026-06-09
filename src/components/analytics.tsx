/**
 * CDL Analytics — GA4 event tracking
 * Property: G-RM0BQMSLBV
 * All events flow through this single module
 */

const GA_ID = "G-RM0BQMSLBV";

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as any).gtag;
  if (!gtag) return;
  gtag("event", event, { ...params, send_to: GA_ID });
}

// ─── Calculator events ───────────────────────────────────────────────────────
export const Analytics = {
  calculatorStart: (budget: number, use_case: string) =>
    trackEvent("calculator_start", { budget, use_case }),

  calculatorComplete: (results_count: number, eliminated_count: number, top_product: string) =>
    trackEvent("calculator_complete", { results_count, eliminated_count, top_product }),

  calculatorAffiliate: (product: string, brand: string, price: number, region: string) =>
    trackEvent("calculator_affiliate_click", { product, brand, price, region }),

  // ─── Content events ─────────────────────────────────────────────────────
  articleAffiliate: (product: string, page_slug: string, price: number) =>
    trackEvent("article_affiliate_click", { product, page_slug, price }),

  taPageView: (product: string, brand: string) =>
    trackEvent("ta_page_view", { product, brand }),

  comparisonView: (product_a: string, product_b: string) =>
    trackEvent("comparison_view", { product_a, product_b }),

  // ─── Database events ─────────────────────────────────────────────────────
  runtimeDbFilter: (appliance: string, results_count: number) =>
    trackEvent("runtime_db_filter", { appliance, results_count }),

  upsDbFilter: (device: string, results_count: number) =>
    trackEvent("ups_db_filter", { device, results_count }),

  upsDbAffiliate: (product: string, device: string) =>
    trackEvent("ups_db_affiliate_click", { product, device }),

  runtimeDbAffiliate: (product: string, appliance: string) =>
    trackEvent("runtime_db_affiliate_click", { product, appliance }),
};
