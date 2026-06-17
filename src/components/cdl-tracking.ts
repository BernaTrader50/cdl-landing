/**
 * CDL Click Tracking — own affiliate click + impression logging
 * Independent of GA4. Backed by Supabase project "cdl-analytics" (lamqijprhblvrifeoyqo).
 *
 * Why this exists: GA4 alone can't answer "which exact product, at which
 * recommendation position, generated this click" without going through
 * Google's UI/exports, and is vulnerable to ad-blockers and processing delay.
 * This gives Berna a queryable source of truth: every recommendation shown
 * (impression) and every affiliate click, with a CDL-generated click_id,
 * tier (AWIN/Manufacturer/Amazon-verified/Amazon-generic), and position.
 *
 * Privacy: no PII collected. session_id is a random client-generated token
 * stored in sessionStorage, used only to compute basic funnel metrics
 * (impressions -> clicks) within a single visit, not to identify a person.
 */

const SUPABASE_URL = "https://lamqijprhblvrifeoyqo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SEdq6vfGlESqH85jEYJaaw_g3ZEoRDH";

export type AffiliateTier =
  | "AWIN_DIRECT"
  | "IMPACT_DIRECT"
  | "MANUFACTURER_DIRECT"
  | "AMAZON_VERIFIED"
  | "AMAZON_GENERIC";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.sessionStorage.getItem("cdl_session_id");
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem("cdl_session_id", id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

function getUtmParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

async function insertRow(table: "affiliate_clicks" | "recommendation_impressions", row: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(row),
      keepalive: true, // ensures the request survives the page navigation a click usually triggers
    });
  } catch {
    // Never block the user's click on a tracking failure
  }
}

/** Log that a recommendation was shown to the user (an "impression"). */
export function trackImpression(params: {
  lab: string;
  brand: string;
  model: string;
  recommendation_position?: number;
  recommendation_label?: string;
  scenario?: string;
}) {
  insertRow("recommendation_impressions", {
    ...params,
    session_id: getSessionId(),
  });
}

/** Log an affiliate click — the core event for the monetization KPI. */
export function trackAffiliateClick(params: {
  lab: string;
  brand: string;
  model: string;
  price?: number;
  recommendation_position?: number;
  recommendation_label?: string;
  affiliate_tier: AffiliateTier;
  destination_url: string;
  scenario?: string;
}) {
  const sessionId = getSessionId();
  const clickId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  insertRow("affiliate_clicks", {
    click_id: clickId,
    ...params,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    session_id: sessionId,
    ...getUtmParams(),
  });
  return clickId;
}

/** Helper to classify a destination URL into a tier, for cards that don't already know their own tier. */
export function classifyTier(url: string): AffiliateTier {
  if (url.includes("awin1.com")) return "AWIN_DIRECT";
  if (url.includes("impact.com") || url.includes("impactradius")) return "IMPACT_DIRECT";
  if (url.includes("/dp/") && url.includes("amazon")) return "AMAZON_VERIFIED";
  if (url.includes("amazon") && url.includes("/s?")) return "AMAZON_GENERIC";
  if (!url.includes("amazon")) return "MANUFACTURER_DIRECT";
  return "AMAZON_GENERIC";
}
