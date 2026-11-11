import { describe, expect, it } from "vitest";
import { DEFAULT_SCENARIO, parseScenario, toSearch } from "../lib/url-state";

describe("parseScenario", () => {
  it("returns defaults for an empty query", () => {
    const { scenario, invalid } = parseScenario("");
    expect(scenario).toEqual(DEFAULT_SCENARIO);
    expect(invalid).toEqual([]);
  });

  it("parses a full shared scenario", () => {
    const { scenario, invalid } = parseScenario(
      "?profit=150000&year=2025%2F26&pension=10000&horizon=3&strategy=spread"
    );
    expect(scenario).toEqual({
      profit: 150_000,
      year: "2025/26",
      pension: 10_000,
      horizon: 3,
      strategy: "spread",
    });
    expect(invalid).toEqual([]);
  });

  it("clamps profit and pension into range and reports them", () => {
    const { scenario, invalid } = parseScenario("?profit=9999999&pension=90000");
    expect(scenario.profit).toBe(1_000_000);
    expect(scenario.pension).toBe(60_000);
    expect(invalid).toContain("profit");
    expect(invalid).toContain("pension");
  });

  it("never lets pension exceed profit", () => {
    const { scenario } = parseScenario("?profit=20000&pension=60000");
    expect(scenario.pension).toBe(20_000);
  });

  it("falls back on unknown year, horizon and strategy", () => {
    const { scenario, invalid } = parseScenario(
      "?year=1999%2F00&horizon=4&strategy=magic"
    );
    expect(scenario.year).toBe("2026/27");
    expect(scenario.horizon).toBe(1);
    expect(scenario.strategy).toBe("extract");
    expect(invalid.sort()).toEqual(["horizon", "strategy", "year"]);
  });

  it("treats a one-year horizon as extract", () => {
    const { scenario } = parseScenario("?profit=60000&horizon=1&strategy=spread");
    expect(scenario.strategy).toBe("extract");
    expect(scenario.horizon).toBe(1);
  });
});

describe("toSearch", () => {
  it("keeps the URL short when nothing is unusual", () => {
    expect(toSearch(DEFAULT_SCENARIO)).toBe("?profit=60000&year=2026%2F27");
  });

  it("round-trips a shared scenario", () => {
    const scenario = {
      profit: 150_000,
      year: "2025/26" as const,
      pension: 10_000,
      horizon: 3 as const,
      strategy: "spread" as const,
    };
    expect(parseScenario(toSearch(scenario)).scenario).toEqual(scenario);
  });

  it("omits pension when zero and plan params when one year", () => {
    const query = toSearch({ ...DEFAULT_SCENARIO, pension: 0, horizon: 1 });
    expect(query).not.toContain("pension");
    expect(query).not.toContain("horizon");
  });
});
