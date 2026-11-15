import type { BasketItem, Product } from "@/types/product";
import type { BreakdownLine, LeviPacks, TierResult } from "@/types/forecast";
import { productPulls } from "./basket";

// Lines of the active tier, with any line that existed in the previous tier
// but vanished here appended at zero and flagged as removed.
export function mergeBreakdownLines(
  tier: TierResult,
  prev: TierResult | null,
): BreakdownLine[] {
  const merged = tier.lines.map((l) => ({ ...l }));
  if (prev) {
    prev.lines.forEach((l) => {
      if (!merged.some((x) => x.key === l.key)) {
        merged.push({ ...l, value: 0, removed: true });
      }
    });
  }
  return merged;
}

// OP packs folded by product id, most expensive first.
export function groupOpPacks(
  items: BasketItem[],
): { prod: Product; qty: number }[] {
  const grouped = new Map<string, { prod: Product; qty: number }>();
  items.forEach((item) => {
    if (item.prod.category !== "op" || item.qty <= 0) return;
    const entry = grouped.get(item.prod.id);
    if (entry) entry.qty += item.qty;
    else grouped.set(item.prod.id, { prod: item.prod, qty: item.qty });
  });
  return [...grouped.values()].sort((a, b) => b.prod.price - a.prod.price);
}

// Custom LEVIATHAN add-on packs entered by hand.
export function leviExtras(
  levi: LeviPacks,
  products: Product[],
  opPct: number,
): { qty: number; spend: number; pulls: number } {
  let qty = 0;
  let spend = 0;
  let pulls = 0;
  (Object.keys(levi) as (keyof LeviPacks)[]).forEach((id) => {
    const n = levi[id] || 0;
    if (n <= 0) return;
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    qty += n;
    spend += n * prod.price;
    pulls += n * productPulls(prod, opPct);
  });
  return { qty, spend, pulls };
}
