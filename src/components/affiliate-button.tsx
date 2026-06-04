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

function resolveLink(links: AffiliateLinks, region: string): string {
  // Priority: manufacturer > awin > amazon local > amazon US
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

  const href = resolveLink(links, region);
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
