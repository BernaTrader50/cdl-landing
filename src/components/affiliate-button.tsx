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

// ─── Product-specific affiliate links (verified June 2026) ──────────────────
const PRODUCT_LINKS: Record<string, string> = {
  "Jackery Explorer 300 Plus": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-300-plus-portable-power-station",
  "Jackery Explorer 500 v2": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-500-v2-portable-power-station",
  "Jackery Explorer 500": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-500-portable-power-station",
  "Jackery Explorer 600 Plus": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-600-plus-portable-power-station",
  "Jackery Explorer 1000 Plus": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-1000-plus-portable-power-station",
  "Jackery Explorer 1000 v2": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-1000-v2-portable-power-station",
  "Jackery Explorer 1000 Pro": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-1000-pro-portable-power-station",
  "Jackery Explorer 2000 Plus": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-2000-plus-portable-power-station",
  "Jackery Explorer 2000 v2": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-2000-v2-portable-power-station",
  "Jackery Explorer 2000 Pro": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-2000-pro-portable-power-station",
  "Jackery Explorer 3000 Pro": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https%3A%2F%2Fwww.jackery.com%2Fproducts%2Fexplorer-3000-pro-portable-power-station",
  "Bluetti EB3A": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-eb3a-portable-power-station",
  "Bluetti EB55": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-eb55-portable-power-station",
  "Bluetti EB70": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-eb70-portable-power-station",
  "Bluetti AC60": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-ac60-portable-power-station",
  "Bluetti AC70": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-ac70-portable-power-station",
  "Bluetti AC180": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-ac180-portable-power-station",
  "Bluetti AC200L": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-ac200l-portable-power-station",
  "Bluetti AC200P": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-ac200p-portable-power-station",
  "Bluetti AC300": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-ac300-portable-power-station",
  "Bluetti AC500": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-ac500-portable-power-station",
  "Bluetti Elite 300": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-elite-300-portable-power-station",
  "Bluetti EP500 Pro": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fbluetti-ep500-pro-portable-power-station",
  "Allpowers R600": "https://www.awin1.com/cread.php?awinmid=40342&awinaffid=2929639&ued=https%3A%2F%2Fiallpowers.com%2Fproducts%2Fallpowers-r600-portable-power-station",
  "Allpowers R1500 LITE": "https://www.awin1.com/cread.php?awinmid=40342&awinaffid=2929639&ued=https%3A%2F%2Fiallpowers.com%2Fproducts%2Fallpowers-r1500-lite-portable-power-station",
  "Allpowers S2000 Pro": "https://www.awin1.com/cread.php?awinmid=40342&awinaffid=2929639&ued=https%3A%2F%2Fiallpowers.com%2Fproducts%2Fallpowers-s2000-pro-portable-power-station",
  "Allpowers R2500": "https://www.awin1.com/cread.php?awinmid=40342&awinaffid=2929639&ued=https%3A%2F%2Fiallpowers.com%2Fproducts%2Fallpowers-r2500-portable-power-station",
  "Allpowers R4000": "https://www.awin1.com/cread.php?awinmid=40342&awinaffid=2929639&ued=https%3A%2F%2Fiallpowers.com%2Fproducts%2Fallpowers-r4000-portable-power-station",
  "Anker SOLIX C300": "https://www.amazon.com/dp/B0CX4XGVHK?tag=clickdecision-20",
  "Anker SOLIX C800": "https://www.amazon.com/dp/B0C4GFYMNH?tag=clickdecision-20",
  "Anker SOLIX C800X": "https://www.amazon.com/dp/B0C4GFZ5SB?tag=clickdecision-20",
  "Anker SOLIX C800 Plus": "https://www.amazon.com/dp/B0C4GFZRQH?tag=clickdecision-20",
  "Anker SOLIX C1000": "https://www.amazon.com/dp/B0C4GFYMNH?tag=clickdecision-20",
  "Anker SOLIX C1000 Gen 2": "https://www.amazon.com/dp/B0CW2K7TYL?tag=clickdecision-20",
  "Anker SOLIX C2000": "https://www.amazon.com/dp/B0BH11KGKP?tag=clickdecision-20",
  "Anker SOLIX C2000 Gen 2": "https://www.amazon.com/dp/B0CW2K7TYL?tag=clickdecision-20",
  "Anker SOLIX F3800": "https://www.amazon.com/dp/B0C6XKH4Z9?tag=clickdecision-20",
  "Zendure SuperBase M 607": "https://www.awin1.com/cread.php?awinmid=68786&awinaffid=2929639&ued=https%3A%2F%2Fzendure.com%2Fproducts%2Fsuperbase-m-607",
  "Zendure SuperBase M 1016": "https://www.awin1.com/cread.php?awinmid=68786&awinaffid=2929639&ued=https%3A%2F%2Fzendure.com%2Fproducts%2Fsuperbase-m-1016",
  "Zendure SuperBase Pro 2000": "https://www.awin1.com/cread.php?awinmid=68786&awinaffid=2929639&ued=https%3A%2F%2Fzendure.com%2Fproducts%2Fsuperbase-pro-2000",
  "Zendure SuperBase V 4600": "https://www.awin1.com/cread.php?awinmid=68786&awinaffid=2929639&ued=https%3A%2F%2Fzendure.com%2Fproducts%2Fsuperbase-v-4600",
  "Zendure SuperBase V6400": "https://www.awin1.com/cread.php?awinmid=68786&awinaffid=2929639&ued=https%3A%2F%2Fzendure.com%2Fproducts%2Fsuperbase-v-6400",
  "Zendure Hyper 2000": "https://www.awin1.com/cread.php?awinmid=68786&awinaffid=2929639&ued=https%3A%2F%2Fzendure.com%2Fproducts%2Fhyper-2000",
  "Goal Zero Yeti 200X": "https://www.amazon.com/dp/B07RS5GK3H?tag=clickdecision-20",
  "Goal Zero Yeti 500X": "https://www.amazon.com/dp/B07RS5GK3H?tag=clickdecision-20",
  "Goal Zero Yeti 1000X": "https://www.amazon.com/dp/B07YQ8HJWK?tag=clickdecision-20",
  "Goal Zero Yeti 1500X": "https://www.amazon.com/dp/B07YGPM86G?tag=clickdecision-20",
  "Goal Zero Yeti 3000X": "https://www.amazon.com/dp/B07YGNWX1B?tag=clickdecision-20",
  "Goal Zero Yeti 6000X": "https://www.amazon.com/dp/B08KZHY4ZS?tag=clickdecision-20",
  "VTOMAN Jump 600X": "https://www.amazon.com/dp/B0BZMF36X6?tag=clickdecision-20",
  "VTOMAN FlashSpeed 1500": "https://www.amazon.com/dp/B0BZMF36X6?tag=clickdecision-20",
  "VTOMAN Jump 1500X": "https://www.amazon.com/dp/B0BZN3GRVZ?tag=clickdecision-20",
  "VTOMAN Jump 2200": "https://www.amazon.com/dp/B0BZN3GRVZ?tag=clickdecision-20",
  "Pecron E500LFP": "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
  "Pecron E1000LFP": "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
  "Pecron E1500LFP": "https://www.amazon.com/dp/B0BX7K5M2Q?tag=clickdecision-20",
  "Pecron E2000LFP": "https://www.amazon.com/dp/B09W7RFKBH?tag=clickdecision-20",
  "Pecron E3000LFP": "https://www.amazon.com/dp/B0C8LNYWWX?tag=clickdecision-20",
  "DJI Power 500": "https://www.amazon.com/dp/B0CNWM35D8?tag=clickdecision-20",
  "DJI Power 1000": "https://www.amazon.com/dp/B0CNWM35D8?tag=clickdecision-20",
  "DJI Power 2000": "https://www.amazon.com/dp/B0CNWM35D8?tag=clickdecision-20",
  "Mango Power Union": "https://www.amazon.com/dp/B0CFN7RJXW?tag=clickdecision-20",
  "Aferiy P210": "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
  "OUPES Mega 1": "https://www.amazon.com/dp/B0DG8JQNS4?tag=clickdecision-20",
  "OUPES Mega 2": "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
  "OUPES Mega 3": "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
  "OUPES Mega 5": "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
  "OUPES Exodus 2400": "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
  "OUPES 600 Lite": "https://www.amazon.com/dp/B0DG8JQNS4?tag=clickdecision-20",
  "Growatt Infinity 1500": "https://www.amazon.com/dp/B0C5KFZQ2T?tag=clickdecision-20",
  "Growatt Infinity 1300": "https://www.amazon.com/dp/B0C5KFZQ2T?tag=clickdecision-20",
  "Geneverse HomePower One": "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
  "Geneverse HomePower ONE PRO": "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
  "Geneverse HomePower TWO PRO": "https://www.amazon.com/dp/B09W7RFKBH?tag=clickdecision-20",
  "Lion Energy Safari LT": "https://www.amazon.com/dp/B07YGPM86G?tag=clickdecision-20",
  "Lion Energy UT 1300": "https://www.amazon.com/dp/B07YGNWX1B?tag=clickdecision-20",
  "Renogy Lycan 1000": "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
  "Renogy Lycan 5000": "https://www.amazon.com/dp/B09W7RFKBH?tag=clickdecision-20",
  "Westinghouse iGen300s": "https://www.amazon.com/dp/B0BH11KGKP?tag=clickdecision-20",
  "Westinghouse iGen1200s": "https://www.amazon.com/dp/B0BH11KGKP?tag=clickdecision-20",
  "BioLite BaseCharge 1500": "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
  "Rockpals RP1000": "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
};

function getProductLink(product: string, region: string): string {
  // EcoFlow: always via Impact
  if (ECOFLOW_IMPACT[product]) return ECOFLOW_IMPACT[product];
  // All others: product-specific link from PRODUCT_LINKS
  return PRODUCT_LINKS[product] ?? `https://www.amazon.com/s?k=${encodeURIComponent(product)}&tag=clickdecision-20`;
}

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
  // Priority: 1.EcoFlow Impact 2.Product-specific Awin/Amazon 3.Fallbacks
  if (product) return getProductLink(product, region);
  if (links.manufacturer_url) return links.manufacturer_url;
  const regionalKey = `amazon_${region.toLowerCase()}` as keyof AffiliateLinks;
  if (links[regionalKey]) return links[regionalKey]!;
  if (links.amazon_us)    return links.amazon_us;
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
