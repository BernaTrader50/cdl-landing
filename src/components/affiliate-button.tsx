/**
 * AffiliateButton — CDL geo-routing affiliate link component
 * Priority: manufacturer direct → awin → amazon local → amazon US
 * Logs GA4 event on click
 */
import { useEffect, useState } from "react";

type AffiliateLinks = {
  amazon_us?: string;
  amazon_es?: string;
  amazon_uk?: string;
  amazon_de?: string;
  amazon_fr?: string;
  amazon_it?: string;
  awin_url?: string;
  manufacturer_url?: string;
};

type Props = {
  product: string;
  links: AffiliateLinks;
  price?: number;
  currency?: string;
  variant?: "primary" | "secondary" | "ghost";
  label?: string;
  className?: string;
};

const AMAZON_TAGS: Record<string, string> = {
  US: "clickdecision-20",
  ES: "clickdecisionES-21",  // pending registration
  UK: "clickdecisionUK-21",  // pending registration
  DE: "clickdecisionDE-21",  // pending registration
  FR: "clickdecisionFR-21",  // pending registration
  IT: "clickdecisionIT-21",  // pending registration
};

function detectRegion(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    const lang = navigator.language ?? "";
    if (tz.startsWith("Europe/Madrid") || lang.startsWith("es"))    return "ES";
    if (tz.startsWith("Europe/London") || lang.startsWith("en-GB")) return "UK";
    if (tz.startsWith("Europe/Berlin") || lang.startsWith("de"))    return "DE";
    if (tz.startsWith("Europe/Paris")  || lang.startsWith("fr"))    return "FR";
    if (tz.startsWith("Europe/Rome")   || lang.startsWith("it"))    return "IT";
  } catch {}
  return "US";
}

// ─── Awin Publisher ID ──────────────────────────────────────────────────────
const AWIN_PUB_ID = "2929639";

function awinLink(merchantId: string, productUrl?: string): string {
  const base = `https://www.awin1.com/cread.php?awinmid=${merchantId}&awinaffid=${AWIN_PUB_ID}`;
  return productUrl ? base + `&ued=${encodeURIComponent(productUrl)}` : base;
}

// ─── Awin merchant IDs (verified from ui.awin.com) ──────────────────────────
const AWIN_MERCHANTS: Record<string, string> = {
  ecoflow_general: "59181",
  ecoflow_uk:      "51797",
  bluetti_us:      "59271",
  bluetti_uk:      "32273",
  bluetti_eu:      "95479",
  allpowers_us:    "40342",
  allpowers_int:   "38934",
  jackery_us:      "59183",
  jackery_uk:      "30413",
  zendure_eu:      "68786",
};

// ─── Awin geo-routing by brand + region ─────────────────────────────────────
function getAwinLink(brand: string, region: string, productUrl?: string): string | null {
  const b = brand.toLowerCase();
  const r = region.toUpperCase();

  if (b.includes("bluetti")) {
    if (r === "US") return awinLink(AWIN_MERCHANTS.bluetti_us, productUrl);
    if (r === "UK") return awinLink(AWIN_MERCHANTS.bluetti_uk, productUrl);
    return awinLink(AWIN_MERCHANTS.bluetti_eu, productUrl); // EU/ES/DE/FR/IT
  }
  if (b.includes("allpowers")) {
    if (r === "US" || r === "CA") return awinLink(AWIN_MERCHANTS.allpowers_us, productUrl);
    return awinLink(AWIN_MERCHANTS.allpowers_int, productUrl);
  }
  if (b.includes("jackery")) {
    if (r === "UK") return awinLink(AWIN_MERCHANTS.jackery_uk, productUrl);
    if (r === "US") return awinLink(AWIN_MERCHANTS.jackery_us, productUrl);
    return awinLink(AWIN_MERCHANTS.jackery_us, productUrl); // fallback
  }
  if (b.includes("zendure")) {
    return awinLink(AWIN_MERCHANTS.zendure_eu, productUrl);
  }
  return null;
}

// ─── EcoFlow Impact affiliate links (priority over Amazon) ──────────────────
const ECOFLOW_IMPACT: Record<string, string> = {
  "DELTA Pro": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-pro-portable-power-station",
  "DELTA Pro 3": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-pro-3-portable-power-station",
  "DELTA Pro Ultra": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-pro-ultra",
  "DELTA 3 Max Plus": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-max-plus-portable-power-station",
  "DELTA 3 Max": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-max-portable-power-station",
  "DELTA 3 Plus": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-plus-portable-power-station",
  "DELTA 3 Classic": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-classic-portable-power-station",
  "DELTA 3": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-portable-power-station",
  "DELTA 3 Ultra Plus": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-ultra-plus-portable-power-station",
  "DELTA 2 Max": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-2-max-portable-power-station",
  "DELTA 2": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-2-portable-power-station",
  "DELTA Max": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-max-portable-power-station",
  "DELTA Mini": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-mini-portable-power-station",
  "RIVER 2 Pro": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-2-pro-portable-power-station",
  "RIVER 2 Max": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-2-max-portable-power-station",
  "RIVER 2": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-2-portable-power-station",
  "RIVER Pro": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-pro-portable-power-station",
  "RIVER 3 Plus": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-3-plus-portable-power-station",
  "RIVER 3": "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-3-portable-power-station",
};

function resolveLink(links: AffiliateLinks, region: string, product?: string, brand?: string): string {
  // Priority: EcoFlow Impact > Awin (brand-specific) > manufacturer > amazon local > amazon US

  // 1. EcoFlow: always via Impact
  if (product && ECOFLOW_IMPACT[product]) return ECOFLOW_IMPACT[product];

  // 2. Other brands: Awin geo-routing
  if (brand) {
    const awinUrl = getAwinLink(brand, region);
    if (awinUrl) return awinUrl;
  }

  // 3. Fallbacks
  if (links.manufacturer_url) return links.manufacturer_url;
  if (links.awin_url)          return links.awin_url;
  const regionalKey = `amazon_${region.toLowerCase()}` as keyof AffiliateLinks;
  if (links[regionalKey])      return links[regionalKey]!;
  if (links.amazon_us)         return links.amazon_us;
  return "#";
}

function trackClick(product: string, region: string, link: string) {
  try {
    // GA4 event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "affiliate_click", {
        product_name: product,
        region,
        destination: link.includes("amazon") ? "amazon" : "direct",
      });
    }
  } catch {}
}

export function AffiliateButton({ product, links, price, currency = "$", variant = "primary", label, className = "" }: Props) {
  const [region, setRegion] = useState("US");

  useEffect(() => {
    setRegion(detectRegion());
  }, []);

  // Extract brand from product name (e.g. "Bluetti AC200L" → "Bluetti")
  const productBrand = product?.split(" ")[0] ?? "";
  const href = resolveLink(links, region, product, productBrand);
  const priceStr = price ? ` — ${currency}${price.toLocaleString()}` : "";
  const displayLabel = label ?? `Check Price${priceStr}`;

  const baseStyles = "inline-flex items-center gap-1.5 rounded-[8px] font-semibold transition-all duration-200 no-underline";
  const variantStyles = {
    primary: "bg-[#FF9900] text-[#0a0a0a] px-5 py-2.5 text-[13px] hover:bg-[#e88a00]",
    secondary: "bg-neutral-950 text-white px-4 py-2 text-[12.5px] hover:bg-[#2563EB]",
    ghost: "border border-neutral-300 text-neutral-700 px-4 py-2 text-[12px] hover:border-neutral-500",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={() => trackClick(product, region, href)}
    >
      {variant === "primary" && <span>🛒</span>}
      {displayLabel}
      <span className="opacity-60 text-[11px]">→</span>
    </a>
  );
}

/** Minimal disclosure shown below affiliate buttons */
export function AffiliateDisclosure() {
  return (
    <p className="font-mono text-[10px] text-neutral-400 text-center mt-1">
      Prices shown at time of analysis. We earn a commission — this does not affect our scores.
    </p>
  );
}

/** Build amazon_us link from ASIN or search fallback */
export function amazonLink(asin: string | null | undefined, fallbackQuery: string, tag = "clickdecision-20"): string {
  if (asin) return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
  const q = encodeURIComponent(fallbackQuery);
  return `https://www.amazon.com/s?k=${q}&tag=${tag}`;
}
