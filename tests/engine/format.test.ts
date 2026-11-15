import { describe, expect, it } from "vitest";
import { signed, signedUsd } from "@/lib/engine/format";

describe("signed", () => {
  it("prefixes positives with +", () => {
    expect(signed(3.14)).toBe("+3.1");
  });

  it("uses a true minus sign, not a hyphen", () => {
    expect(signed(-3.14)).toBe("−3.1");
    expect(signed(-3.14).charAt(0)).toBe("\u2212");
  });

  it("collapses near-zero to a bare 0", () => {
    expect(signed(0)).toBe("0");
    expect(signed(0.049)).toBe("0");
    expect(signed(-0.049)).toBe("0");
  });

  it("treats the 0.05 boundary as a real delta", () => {
    expect(signed(0.05)).toBe("+0.1");
    expect(signed(-0.05)).toBe("−0.1");
  });

  it("keeps whole numbers free of a decimal", () => {
    expect(signed(12)).toBe("+12");
  });
});

describe("signedUsd", () => {
  it("always shows two decimals", () => {
    expect(signedUsd(3.1)).toBe("+$3.10");
    expect(signedUsd(-3.1)).toBe("−$3.10");
  });

  it("collapses near-zero to $0.00 without a sign", () => {
    expect(signedUsd(0)).toBe("$0.00");
    expect(signedUsd(0.004)).toBe("$0.00");
    expect(signedUsd(-0.004)).toBe("$0.00");
  });

  it("treats the 0.005 boundary as a real delta", () => {
    expect(signedUsd(0.005)).toBe("+$0.01");
    expect(signedUsd(-0.005)).toBe("−$0.01");
  });
});
