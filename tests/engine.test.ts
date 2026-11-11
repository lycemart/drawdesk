import { describe, expect, it } from "vitest";
import {
  buildPlan,
  compareYears,
  compute,
  marginalRoutes,
  optimiseSalary,
} from "../lib/engine";

const P = (pounds: number) => Math.round(pounds * 100);

describe("compute — published reference cases", () => {
  it("matches the £60,000 / 2026-27 worked example to the penny", () => {
    const b = compute(P(60_000), P(12_570), 0, "2026/27");
    expect(b.salary).toBe(P(12_570));
    expect(b.employerNI).toBe(P(1_135.5));
    expect(b.corporationTax).toBe(P(8_795.96));
    expect(b.dividends).toBe(P(37_498.54));
    expect(b.dividendTax).toBe(P(3_977.34));
    expect(b.takeHome).toBe(P(46_091.2));
    expect(b.totalTax).toBe(P(13_908.8));
  });

  it.each([
    [30_000, 24_403.45],
    [50_000, 38_861.95],
    [100_000, 65_209.63],
  ])("profit £%i optimises to the published take-home", (profit, expected) => {
    const { best } = optimiseSalary(P(profit), 0, "2026/27");
    expect(best.takeHome / 100).toBeCloseTo(expected, 0);
  });

  it("returns zeros and no NaN for zero profit", () => {
    const b = compute(0, 0, 0, "2026/27");
    for (const value of Object.values(b)) {
      expect(Number.isFinite(value)).toBe(true);
    }
    expect(b.takeHome).toBe(0);
    expect(b.totalTax).toBe(0);
    expect(b.effectiveRate).toBe(0);
  });

  it("clamps an unaffordable salary to what the profit can fund", () => {
    const b = compute(P(10_000), P(50_000), 0, "2026/27");
    expect(b.salary).toBeLessThanOrEqual(P(10_000));
    expect(b.salary + b.employerNI).toBeLessThanOrEqual(P(10_000));
    expect(b.takeHome + b.totalTax).toBe(b.profit);
  });
});

describe("tax-year comparison", () => {
  it("2026/27 leaves less than 2025/26 at £60,000 because of the dividend rise", () => {
    const { previous, current, deltaTakeHome } = compareYears(P(60_000), 0);
    expect(current.takeHome).toBeLessThan(previous.takeHome);
    expect(deltaTakeHome).toBeLessThan(0);
    expect(previous.dividendTax).toBeLessThan(current.dividendTax);
  });
});

describe("optimiser properties", () => {
  it("is monotonic: more profit never means less take-home", () => {
    let last = -1;
    for (let profit = 0; profit <= 200_000; profit += 2_500) {
      const { best } = optimiseSalary(P(profit), 0, "2026/27");
      expect(best.takeHome).toBeGreaterThanOrEqual(last);
      last = best.takeHome;
    }
  });

  it("take-home plus total tax equals the profit", () => {
    for (const profit of [20_000, 45_000, 60_000, 120_000, 300_000]) {
      const { best } = optimiseSalary(P(profit), 0, "2026/27");
      expect(best.takeHome + best.totalTax).toBe(best.profit);
    }
  });

  it("keeps the effective rate between 0 and 100", () => {
    for (const profit of [0, 15_000, 60_000, 250_000]) {
      const { best } = optimiseSalary(P(profit), 0, "2026/27");
      expect(best.effectiveRate).toBeGreaterThanOrEqual(0);
      expect(best.effectiveRate).toBeLessThan(100);
    }
  });
});

describe("pension", () => {
  it("is deductible: £10,000 pension lowers corporation tax and cash, and raises total value", () => {
    const without = optimiseSalary(P(60_000), 0, "2026/27").best;
    const withPension = optimiseSalary(P(60_000), P(10_000), "2026/27").best;
    expect(withPension.corporationTax).toBeLessThan(without.corporationTax);
    expect(withPension.takeHome).toBeLessThan(without.takeHome);
    expect(withPension.pension).toBe(P(10_000));
    expect(withPension.takeHome + withPension.pension).toBeGreaterThan(
      without.takeHome
    );
  });

  it("caps the pension at the profit", () => {
    const b = compute(P(5_000), 0, P(20_000), "2026/27");
    expect(b.pension).toBe(P(5_000));
  });
});

describe("multi-year plan", () => {
  it("horizon 1 equals the single-year result for both strategies", () => {
    const one = buildPlan(P(60_000), 0, 1, "2026/27", "spread");
    const single = optimiseSalary(P(60_000), 0, "2026/27").best;
    expect(one.totalTakeHome).toBe(single.takeHome);
  });

  it("spreading dividends over three years beats extracting everything", () => {
    const spread = buildPlan(P(150_000), 0, 3, "2026/27", "spread");
    const all = buildPlan(P(150_000), 0, 3, "2026/27", "extract");
    expect(spread.totalTakeHome).toBeGreaterThan(all.totalTakeHome);
    expect(spread.totalTakeHome).toBeGreaterThan(0);
  });

  it("never carries a negative balance and ends at zero", () => {
    const plan = buildPlan(P(150_000), 0, 5, "2026/27", "spread");
    for (const row of plan.rows) expect(row.carried).toBeGreaterThanOrEqual(0);
    expect(plan.rows.at(-1)?.carried).toBe(0);
  });

  it("keeps totals consistent with the rows", () => {
    const plan = buildPlan(P(80_000), P(5_000), 3, "2026/27", "spread");
    const sum = plan.rows.reduce((s, r) => s + r.takeHome, 0);
    expect(plan.totalTakeHome).toBe(sum);
  });
});

describe("marginal routes", () => {
  it("returns three routes and pension has no cash gain", () => {
    const routes = marginalRoutes(P(60_000), 0, "2026/27");
    expect(routes.map((r) => r.key)).toEqual(["salary", "dividend", "pension"]);
    const pension = routes.find((r) => r.key === "pension")!;
    expect(pension.cashDelta).toBeLessThanOrEqual(0);
    expect(pension.pensionDelta).toBe(P(1_000));
  });

  it("every route's value delta is non-negative at £60,000", () => {
    for (const route of marginalRoutes(P(60_000), 0, "2026/27")) {
      expect(route.valueDelta).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("salary presentation", () => {
  it("is never worse than the standard £12,570 salary", () => {
    for (const profit of [40_000, 60_000, 100_000, 140_000, 180_000, 200_000]) {
      const { best } = optimiseSalary(P(profit), 0, "2026/27");
      const standard = compute(P(profit), P(12_570), 0, "2026/27");
      expect(best.takeHome).toBeGreaterThanOrEqual(standard.takeHome - 100);
    }
  });

  it("keeps the £60,000 reference salary exactly", () => {
    const { best } = optimiseSalary(P(60_000), 0, "2026/27");
    expect(best.salary).toBe(P(12_570));
  });

  it("is deterministic", () => {
    const a = optimiseSalary(P(140_000), 0, "2026/27").best;
    const b = optimiseSalary(P(140_000), 0, "2026/27").best;
    expect(a.salary).toBe(b.salary);
    expect(a.takeHome).toBe(b.takeHome);
  });
});
