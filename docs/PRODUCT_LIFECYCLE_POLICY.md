# Product Lifecycle Policy — ClickDecisionLab

**Decided:** 2026-06-17, with Berna.

This policy exists because of a real mistake made during the monetization audit: products that didn't have a clean Amazon ASIN match were initially mislabeled as "possibly discontinued." That conclusion was wrong — "not sold on Amazon" is not the same as "doesn't exist." Several manufacturers (Goal Zero, DJI, Pecron, Growatt) sell mostly direct and simply aren't well represented on Amazon. This policy prevents that error from recurring.

## 1. Status classification (4 categories)

| Status | Verification criteria | Treatment |
|---|---|---|
| **Live** | Confirmed in the manufacturer's sitemap/site, with an active purchase option | Normal listing, no badge |
| **Sold out (temporary)** | Manufacturer's product page exists and says "Sold Out," with no sign of permanent withdrawal (e.g. still SEO'd, price still listed, no "discontinued" language anywhere) | Blue badge: "Temporarily out of stock" |
| **Discontinued (confirmed)** | Either (a) ≥2 independent third-party sources explicitly state it's discontinued, OR (b) zero presence in the manufacturer's current sitemap with no live product page found anywhere | Amber badge: "⚠ Discontinued — hard to find new" (already implemented on Renogy Lycan 5000/1000) |
| **Naming error / doesn't exist** | Zero match in any sitemap for the brand AND zero match in independent web search confirming it as a real SKU | **Remove from dataset** — this was never a real product, not a lifecycle state |

The scoring engine is never blocked by status — a Discontinued or Sold Out product can still surface as a top recommendation if it's genuinely the best technical fit. The badge informs the user's purchase decision; it doesn't make the decision for them.

## 2. Mandatory verification order before any status change

Never conclude "discontinued" or "doesn't exist" just because Amazon search comes up empty. Required order:

1. **Manufacturer sitemap** (`get_sitemap_urls()` in cdl-agent, or direct sitemap.xml fetch) — this is the primary source of truth, checked before Amazon is even considered.
2. **If no sitemap match:** independent web search (third-party retailers, forums, reviews) — looking for explicit "(Discontinued)" language, or conversely confirmation the product is live and sold.
3. **Only if both 1 and 2 turn up nothing:** classify as Naming error / doesn't exist, and remove from the dataset.

Amazon presence/absence is never used as the sole signal for discontinuation. It's relevant only for the *monetization* tier (AWIN > Manufacturer Direct > Amazon Verified > Amazon Generic — see `docs/MONETIZATION_AUDIT.md`), which is a separate axis from product lifecycle status.

## 3. Revalidation cadence: every 15 days, all products, no exceptions by status

Every product's manufacturer link and lifecycle status gets re-checked on a 15-day cycle — short enough to catch real changes (restocks, new discontinuations, manufacturer site restructuring) without drowning in unnecessary daily checks. No status gets a longer or shorter cycle than any other; simplicity over micro-optimization.

*(Implementation note for a future session: this should become a dedicated check in cdl-agent's product.py, tracking `last_verified` per product and flagging anything past 15 days for review — not yet built as of this policy's creation date.)*

## 4. Case study: how this policy caught its own first near-miss

**Zendure "SuperBase M 607" and "SuperBase M 1016"** were flagged across two earlier sessions as a likely naming error — zero matches in `www.zendure.com`'s sitemap. Applying this policy's mandatory verification order (step 2: independent web search) before removing them surfaced that the product is real and well-documented (reviews since 2021, BuiltWith product history). The actual problem was a **wrong domain** — the correct storefront is `us.zendure.com`, not `www.zendure.com` or `zendure.com` (which serves the EU site and 404s on this slug). Fixed by pointing both SKUs (607Wh and 1016Wh are capacity variants of the same product page) to `https://us.zendure.com/products/zendure-superbase-m-portable-power-station`.

This is exactly the failure mode this policy is meant to prevent: concluding "doesn't exist" from a single failed domain check instead of exhausting step 2 (independent web search) first. Kept as a case study here rather than deleted, as a reminder for future sessions.
