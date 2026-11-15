import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/lib/data";
import { groupOpPacks, leviExtras, mergeBreakdownLines } from "@/lib/engine/breakdown";
import type { BasketItem } from "@/types/product";
import type { BreakdownLine, LeviPacks, TierResult } from "@/types/forecast";

function line(key: string, value: number): BreakdownLine {
  return { key, label: key.toUpperCase(), meta: "", value };
}

function tier(lines: BreakdownLine[]): TierResult {
  return { lines } as TierResult;
}

function item(id: string, qty: number): BasketItem {
  const prod = PRODUCTS.find((p) => p.id === id);
  if (!prod) throw new Error("missing product " + id);
  return { prod, qty };
}

const noLevi: LeviPacks = { op130: 0, op66: 0, op40: 0, op20: 0 };

describe("mergeBreakdownLines", () => {
  it("keeps only the active tier's lines when there is no previous tier", () => {
    const merged = mergeBreakdownLines(tier([line("op", 10), line("card", 5)]), null);
    expect(merged.map((l) => l.key)).toEqual(["op", "card"]);
    expect(merged.every((l) => !l.removed)).toBe(true);
  });

  it("appends a vanished line at zero, flagged removed", () => {
    const merged = mergeBreakdownLines(
      tier([line("op", 10)]),
      tier([line("op", 8), line("hh", 4)]),
    );
    expect(merged.map((l) => l.key)).toEqual(["op", "hh"]);
    const hh = merged[1];
    expect(hh.value).toBe(0);
    expect(hh.removed).toBe(true);
  });

  it("does not mutate the active tier's lines", () => {
    const active = tier([line("op", 10)]);
    mergeBreakdownLines(active, tier([line("hh", 4)]));
    expect(active.lines).toHaveLength(1);
    expect(active.lines[0].value).toBe(10);
  });

  it("preserves shared lines without marking them removed", () => {
    const merged = mergeBreakdownLines(
      tier([line("op", 12)]),
      tier([line("op", 8)]),
    );
    expect(merged).toHaveLength(1);
    expect(merged[0].value).toBe(12);
    expect(merged[0].removed).toBeUndefined();
  });
});

describe("groupOpPacks", () => {
  it("keeps op packs only and folds duplicates by product id", () => {
    const grouped = groupOpPacks([item("op6", 2), item("op6", 3), item("op20", 1)]);
    const byId = Object.fromEntries(grouped.map((g) => [g.prod.id, g.qty]));
    expect(byId).toEqual({ op6: 5, op20: 1 });
  });

  it("sorts most expensive pack first", () => {
    const grouped = groupOpPacks([item("op6", 1), item("op66", 1), item("op20", 1)]);
    expect(grouped.map((g) => g.prod.id)).toEqual(["op66", "op20", "op6"]);
  });

  it("drops non-op items and zero quantities", () => {
    const grouped = groupOpPacks([
      item("monthly_card", 1),
      item("hh_pack", 1),
      item("op6", 0),
    ]);
    expect(grouped).toEqual([]);
  });
});

describe("leviExtras", () => {
  it("returns zero for an empty selection", () => {
    expect(leviExtras(noLevi, PRODUCTS, 100)).toEqual({
      qty: 0,
      spend: 0,
      pulls: 0,
    });
  });

  it("multiplies price and pulls by quantity", () => {
    const op20 = PRODUCTS.find((p) => p.id === "op20")!;
    const extras = leviExtras({ ...noLevi, op20: 2 }, PRODUCTS, 100);
    expect(extras.qty).toBe(2);
    expect(extras.spend).toBeCloseTo(op20.price * 2, 6);
    expect(extras.pulls).toBeGreaterThan(0);
  });

  it("sums across several packs", () => {
    const extras = leviExtras({ ...noLevi, op130: 1, op20: 2 }, PRODUCTS, 100);
    expect(extras.qty).toBe(3);
  });

  it("scales pulls with the OP conversion rate", () => {
    const levi: LeviPacks = { ...noLevi, op20: 1 };
    const full = leviExtras(levi, PRODUCTS, 100).pulls;
    const none = leviExtras(levi, PRODUCTS, 0).pulls;
    expect(full).toBeGreaterThan(none);
  });
});
