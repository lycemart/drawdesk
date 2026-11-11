import { TAX_YEARS, type TaxConfig, type TaxYear } from "./tax-config";

export type Strategy = "extract" | "spread";
export type Horizon = 1 | 3 | 5;

export interface Breakdown {
  profit: number;
  salary: number;
  pension: number;
  employerNI: number;
  corporationTax: number;
  dividends: number;
  incomeTax: number;
  employeeNI: number;
  dividendTax: number;
  takeHome: number;
  totalTax: number;
  retained: number;
  effectiveRate: number;
}

export interface PersonalTax {
  incomeTax: number;
  employeeNI: number;
  dividendTax: number;
  takeHome: number;
  totalTax: number;
}

export interface PlanRow extends Breakdown {
  yearIndex: number;
  paidOut: number;
  carried: number;
}

export interface Plan {
  rows: PlanRow[];
  totalTakeHome: number;
  totalTax: number;
  totalPension: number;
  extractAllTakeHome: number;
  extractAllTax: number;
  salary: number;
  pot: number;
}

export interface Route {
  key: "salary" | "dividend" | "pension";
  label: string;
  cashDelta: number;
  pensionDelta: number;
  valueDelta: number;
  note: string;
}

const pound = (pence: number) => pence / 100;

function pct(n: number): number {
  return Math.round(n * 10_000) / 100;
}

export function employerNIFor(salary: number, cfg: TaxConfig): number {
  return Math.round(
    Math.max(0, salary - cfg.employerNI.threshold) * cfg.employerNI.rate
  );
}

function taxOnSalary(taxable: number, cfg: TaxConfig): number {
  const basicWidth = cfg.basicTop - cfg.personalAllowance;
  const higherWidth = cfg.higherTop - cfg.basicTop;
  let left = taxable;
  let tax = 0;
  const b = Math.min(left, basicWidth);
  tax += b * 0.2;
  left -= b;
  const h = Math.min(left, higherWidth);
  tax += h * 0.4;
  left -= h;
  tax += left * 0.45;
  return Math.round(tax);
}

function dividendTax(
  dividends: number,
  salary: number,
  personalAllowance: number,
  cfg: TaxConfig
): number {
  const paLeft = Math.max(0, personalAllowance - salary);
  const zeroPa = Math.min(dividends, paLeft);
  let rest = dividends - zeroPa;
  const allowance = Math.min(rest, cfg.dividendAllowance);
  rest -= allowance;

  let position = salary + zeroPa + allowance;
  let tax = 0;

  const slices: Array<[number, number, number]> = [
    [0, cfg.basicTop, cfg.dividendRates.basic],
    [cfg.basicTop, cfg.higherTop, cfg.dividendRates.higher],
    [cfg.higherTop, Number.POSITIVE_INFINITY, cfg.dividendRates.additional],
  ];

  for (const [start, end, rate] of slices) {
    if (rest <= 0) break;
    const from = Math.max(position, start);
    const to = Math.min(position + rest, end);
    const width = to - from;
    if (width > 0) {
      tax += width * rate;
      rest -= width;
      position = to;
    }
  }
  return Math.round(tax);
}

export function personalTax(
  salary: number,
  dividends: number,
  year: TaxYear
): PersonalTax {
  const cfg = TAX_YEARS[year];
  const income = salary + dividends;
  const personalAllowance = Math.max(
    0,
    cfg.personalAllowance - Math.max(0, income - cfg.taperStart) / 2
  );
  const incomeTax = taxOnSalary(Math.max(0, salary - personalAllowance), cfg);
  const employeeNI = Math.round(
    Math.max(0, Math.min(salary, cfg.employeeNI.upper) - cfg.employeeNI.primary) *
      cfg.employeeNI.main +
      Math.max(0, salary - cfg.employeeNI.upper) * cfg.employeeNI.upperRate
  );
  const divTax = dividendTax(dividends, salary, personalAllowance, cfg);
  const takeHome = salary - incomeTax - employeeNI + dividends - divTax;
  return {
    incomeTax,
    employeeNI,
    dividendTax: divTax,
    takeHome,
    totalTax: incomeTax + employeeNI + divTax,
  };
}

/**
 * Salary and pension are limited to what this year's profit can fund, so
 * take-home + total tax always reconciles to the profit.
 */
export function affordableSalary(
  profit: number,
  salary: number,
  pension: number,
  cfg: TaxConfig
): number {
  const safePension = Math.min(Math.max(0, pension), profit);
  const budget = profit - safePension;
  let s = Math.min(Math.max(0, Math.floor(salary)), budget);
  const threshold = cfg.employerNI.threshold;
  const rate = cfg.employerNI.rate;
  if (s > threshold) {
    s = Math.min(s, Math.floor((budget + threshold * rate) / (1 + rate)));
  }
  while (s > 0 && s + employerNIFor(s, cfg) > budget) s -= 1;
  return s;
}

export function compute(
  profit: number,
  salary: number,
  pension: number,
  year: TaxYear,
  dividendsOverride?: number
): Breakdown {
  const cfg = TAX_YEARS[year];
  const safeProfit = Math.max(0, Math.round(profit));
  const safePension = Math.min(Math.max(0, Math.round(pension)), safeProfit);
  const safeSalary = affordableSalary(
    safeProfit,
    Math.round(salary),
    safePension,
    cfg
  );

  const employerNI = employerNIFor(safeSalary, cfg);
  const taxableProfit = Math.max(
    0,
    safeProfit - safeSalary - employerNI - safePension
  );

  let corporationTax: number;
  const ct = cfg.corporationTax;
  if (taxableProfit <= ct.smallLimit) {
    corporationTax = Math.round(taxableProfit * ct.smallRate);
  } else if (taxableProfit >= ct.mainLimit) {
    corporationTax = Math.round(taxableProfit * ct.mainRate);
  } else {
    corporationTax = Math.round(
      taxableProfit * ct.mainRate -
        (ct.mainLimit - taxableProfit) * ct.marginalRelief
    );
  }

  const distributable = Math.max(0, taxableProfit - corporationTax);
  const dividends =
    dividendsOverride === undefined
      ? distributable
      : Math.min(Math.max(0, Math.round(dividendsOverride)), distributable);

  const personal = personalTax(safeSalary, dividends, year);
  const totalTax = employerNI + corporationTax + personal.totalTax;

  return {
    profit: safeProfit,
    salary: safeSalary,
    pension: safePension,
    employerNI,
    corporationTax,
    dividends,
    incomeTax: personal.incomeTax,
    employeeNI: personal.employeeNI,
    dividendTax: personal.dividendTax,
    takeHome: personal.takeHome,
    totalTax,
    retained: Math.max(0, distributable - dividends),
    effectiveRate: safeProfit > 0 ? pct(totalTax / safeProfit) : 0,
  };
}

export interface CurvePoint {
  salary: number;
  takeHome: number;
}

export function optimiseSalary(
  profit: number,
  pension: number,
  year: TaxYear
): { best: Breakdown; curve: CurvePoint[] } {
  const safeProfit = Math.max(0, Math.round(profit));
  const cfg = TAX_YEARS[year];
  const maxSalary = affordableSalary(safeProfit, safeProfit, pension, cfg);

  let best = compute(safeProfit, 0, pension, year);
  let bestSalary = 0;

  const coarse = 1_000; // £10: fine enough to catch the personal-allowance spike
  for (let s = 0; s <= maxSalary; s += coarse) {
    const b = compute(safeProfit, s, pension, year);
    if (b.takeHome > best.takeHome) {
      best = b;
      bestSalary = b.salary;
    }
  }

  const from = Math.max(0, bestSalary - coarse);
  const to = Math.min(maxSalary, bestSalary + coarse);
  for (let s = from; s <= to; s += 100) {
    const b = compute(safeProfit, s, pension, year);
    if (b.takeHome > best.takeHome) {
      best = b;
      bestSalary = b.salary;
    }
  }

  // Near-ties are common because the tax function is piecewise linear. Within
  // £1 we prefer a salary a director would recognise, so the result is stable
  // and explainable instead of an arbitrary penny-level winner.
  const standardSalaries = [0, 500_000, 670_800, 1_257_000].filter(
    (s) => s <= maxSalary
  );
  if (!standardSalaries.includes(bestSalary)) {
    let snap: { best: Breakdown; salary: number } | null = null;
    for (const s of standardSalaries) {
      const b = compute(safeProfit, s, pension, year);
      if (
        b.takeHome >= best.takeHome - 100 &&
        (!snap || b.takeHome > snap.best.takeHome)
      ) {
        snap = { best: b, salary: s };
      }
    }
    if (snap) {
      best = snap.best;
      bestSalary = snap.salary;
    }
  }

  const points = 41;
  const curve: CurvePoint[] = [];
  for (let i = 0; i < points; i++) {
    const s = Math.round((maxSalary * i) / (points - 1));
    curve.push({
      salary: s,
      takeHome: compute(safeProfit, s, pension, year).takeHome,
    });
  }

  return { best, curve };
}

/**
 * One-off extraction. The company earns `profit` once, pays the optimal salary
 * in year 1, and the remaining post-tax pot is paid as dividends either at once
 * or spread over the horizon to use more than one year's bands and allowance.
 */
export function buildPlan(
  profit: number,
  pension: number,
  years: Horizon,
  year: TaxYear,
  strategy: Strategy
): Plan {
  const cfg = TAX_YEARS[year];
  const { best } = optimiseSalary(profit, pension, year);
  const pot = best.dividends;

  if (strategy === "extract" || years === 1) {
    const row: PlanRow = {
      ...best,
      yearIndex: 1,
      paidOut: pot,
      carried: 0,
    };
    return {
      rows: [row],
      totalTakeHome: best.takeHome,
      totalTax: best.totalTax,
      totalPension: best.pension,
      extractAllTakeHome: best.takeHome,
      extractAllTax: best.totalTax,
      salary: best.salary,
      pot,
    };
  }

  let remaining = pot;
  const rows: PlanRow[] = [];

  for (let i = 1; i <= years; i++) {
    const isFirst = i === 1;
    const isLast = i === years;
    const salary = isFirst ? best.salary : 0;
    const headroom = Math.max(0, cfg.basicTop - salary);
    const payout = isLast ? remaining : Math.min(remaining, headroom);
    remaining -= payout;

    const personal = personalTax(salary, payout, year);
    const employerNI = isFirst ? best.employerNI : 0;
    const corporationTax = isFirst ? best.corporationTax : 0;
    const totalTax = personal.totalTax + employerNI + corporationTax;

    rows.push({
      profit: isFirst ? best.profit : 0,
      salary,
      pension: isFirst ? best.pension : 0,
      employerNI,
      corporationTax,
      dividends: payout,
      incomeTax: personal.incomeTax,
      employeeNI: personal.employeeNI,
      dividendTax: personal.dividendTax,
      takeHome: personal.takeHome,
      totalTax,
      retained: remaining,
      effectiveRate:
        isFirst && best.profit > 0 ? pct(totalTax / best.profit) : 0,
      yearIndex: i,
      paidOut: payout,
      carried: remaining,
    });
  }

  return {
    rows,
    totalTakeHome: rows.reduce((sum, r) => sum + r.takeHome, 0),
    totalTax: rows.reduce((sum, r) => sum + r.totalTax, 0),
    totalPension: best.pension,
    extractAllTakeHome: best.takeHome,
    extractAllTax: best.totalTax,
    salary: best.salary,
    pot,
  };
}

export function marginalRoutes(
  profit: number,
  pension: number,
  year: TaxYear
): Route[] {
  const { best } = optimiseSalary(profit, pension, year);
  const extra = 100_000;

  const salaryCase = compute(profit + extra, best.salary + extra, pension, year);
  const dividendCase = compute(profit + extra, best.salary, pension, year);
  const pensionCase = compute(
    profit + extra,
    best.salary,
    Math.min(pension + extra, profit + extra),
    year
  );

  const delta = (b: Breakdown) => b.takeHome - best.takeHome;
  const value = (b: Breakdown) => b.takeHome + b.pension;

  return [
    {
      key: "salary",
      label: "Extra salary",
      cashDelta: delta(salaryCase),
      pensionDelta: 0,
      valueDelta: value(salaryCase) - value(best),
      note: "Employee NI and Income Tax, but the company deducts it.",
    },
    {
      key: "dividend",
      label: "Extra dividend",
      cashDelta: delta(dividendCase),
      pensionDelta: 0,
      valueDelta: value(dividendCase) - value(best),
      note: "Corporation Tax first, then dividend tax. No NI.",
    },
    {
      key: "pension",
      label: "Into pension",
      cashDelta: delta(pensionCase),
      pensionDelta: pensionCase.pension - best.pension,
      valueDelta: value(pensionCase) - value(best),
      note: "Deductible, no NI, no Income Tax now. Locked until pension age.",
    },
  ];
}

export function compareYears(profit: number, pension: number) {
  const previous = optimiseSalary(profit, pension, "2025/26").best;
  const current = optimiseSalary(profit, pension, "2026/27").best;
  return { previous, current, deltaTakeHome: current.takeHome - previous.takeHome };
}

export { pound };
