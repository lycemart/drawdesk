import { DEFAULT_YEAR, type TaxYear } from "./tax-config";
import type { Horizon, Strategy } from "./engine";

export interface Scenario {
  profit: number; // pounds
  year: TaxYear;
  pension: number; // pounds
  horizon: Horizon;
  strategy: Strategy;
}

export const DEFAULT_SCENARIO: Scenario = {
  profit: 60_000,
  year: DEFAULT_YEAR,
  pension: 0,
  horizon: 1,
  strategy: "extract",
};

const MAX_PROFIT = 1_000_000;
const MAX_PENSION = 60_000;

function numberParam(
  params: URLSearchParams,
  key: string,
  fallback: number,
  min: number,
  max: number
): { value: number; invalid: boolean } {
  const raw = params.get(key);
  if (raw === null) return { value: fallback, invalid: false };
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return { value: fallback, invalid: true };
  const clamped = Math.min(max, Math.max(min, Math.round(parsed)));
  return { value: clamped, invalid: clamped !== Math.round(parsed) };
}

export function parseScenario(search: string): {
  scenario: Scenario;
  invalid: string[];
} {
  const params = new URLSearchParams(search);
  const invalid: string[] = [];

  const profit = numberParam(params, "profit", DEFAULT_SCENARIO.profit, 0, MAX_PROFIT);
  if (profit.invalid) invalid.push("profit");

  const pension = numberParam(params, "pension", 0, 0, MAX_PENSION);
  if (pension.invalid) invalid.push("pension");

  const rawYear = params.get("year");
  const year: TaxYear =
    rawYear === "2025/26" || rawYear === "2026/27" ? rawYear : DEFAULT_YEAR;
  if (rawYear !== null && rawYear !== year) invalid.push("year");

  const rawHorizon = Number(params.get("horizon") ?? 1);
  const horizon: Horizon =
    rawHorizon === 3 ? 3 : rawHorizon === 5 ? 5 : 1;
  if (params.has("horizon") && ![1, 3, 5].includes(rawHorizon)) invalid.push("horizon");

  const rawStrategy = params.get("strategy");
  const strategy: Strategy = rawStrategy === "spread" ? "spread" : "extract";
  if (rawStrategy !== null && rawStrategy !== strategy) invalid.push("strategy");

  const safePension = Math.min(pension.value, profit.value);

  return {
    scenario: {
      profit: profit.value,
      year,
      pension: safePension,
      horizon,
      strategy: horizon === 1 ? "extract" : strategy,
    },
    invalid,
  };
}

export function toSearch(scenario: Scenario): string {
  const params = new URLSearchParams();
  params.set("profit", String(scenario.profit));
  params.set("year", scenario.year);
  if (scenario.pension > 0) params.set("pension", String(scenario.pension));
  if (scenario.horizon > 1) {
    params.set("horizon", String(scenario.horizon));
    params.set("strategy", scenario.strategy);
  }
  return `?${params.toString()}`;
}
