import { describe, expect, it } from "vitest";
import { PRODUCTS, TIERS } from "@/lib/data";
import { optimizeBasket } from "@/lib/engine/basket";

const defaultOn = (id: string) =>
  PRODUCTS.find((p) => p.id === id)?.defaultEnabled ?? false;

function pullsAt(cap: number) {
  return optimizeBasket(PRODUCTS, defaultOn, cap, 100, 1).pulls;
}

describe("tier caps land on basket breakpoints", () => {
  it("GOLDFISH cap buys the full recurring basket", () => {
    const cap = TIERS.find((t) => t.key === "GOLDFISH")!.cap;
    const basket = optimizeBasket(PRODUCTS, defaultOn, cap, 100, 1);
    const ids = basket.items.map((x) => x.prod.id);
    expect(ids).toContain("monthly_card");
    expect(ids).toContain("hh_pack");
  });

  it("GOLDFISH cap is not just below the card + HH breakpoint", () => {
    const cap = TIERS.find((t) => t.key === "GOLDFISH")!.cap;
    const card = PRODUCTS.find((p) => p.id === "monthly_card")!.price;
    const hh = PRODUCTS.find((p) => p.id === "hh_pack")!.price;
    expect(cap).toBeGreaterThanOrEqual(Number((card + hh).toFixed(2)));
  });

  it("one cent under the cap loses the card", () => {
    expect(pullsAt(30.97)).toBeLessThan(pullsAt(30.98));
  });

  it("DOLPHIN entry is not a dead zone", () => {
    const goldfish = TIERS.find((t) => t.key === "GOLDFISH")!.cap;
    const dolphin = TIERS.find((t) => t.key === "DOLPHIN")!.cap;
    expect(dolphin).toBeGreaterThan(goldfish);
    expect(pullsAt(dolphin)).toBeGreaterThan(pullsAt(goldfish));
  });

  it("every cap increases pulls monotonically", () => {
    const caps = TIERS.map((t) => t.cap);
    for (let i = 1; i < caps.length; i++) {
      expect(pullsAt(caps[i])).toBeGreaterThanOrEqual(pullsAt(caps[i - 1]));
    }
  });
});
