export type TaxYear = "2025/26" | "2026/27";

export interface TaxConfig {
  label: TaxYear;
  /** All amounts in pence. */
  personalAllowance: number;
  taperStart: number;
  basicTop: number;
  higherTop: number;
  dividendAllowance: number;
  dividendRates: { basic: number; higher: number; additional: number };
  employeeNI: { primary: number; upper: number; main: number; upperRate: number };
  employerNI: { threshold: number; rate: number };
  corporationTax: {
    smallRate: number;
    mainRate: number;
    smallLimit: number;
    mainLimit: number;
    marginalRelief: number;
  };
  verifiedOn: string;
}

const P = (pounds: number) => Math.round(pounds * 100);

const shared = {
  personalAllowance: P(12_570),
  taperStart: P(100_000),
  basicTop: P(50_270),
  higherTop: P(125_140),
  dividendAllowance: P(500),
  employeeNI: { primary: P(12_570), upper: P(50_270), main: 0.08, upperRate: 0.02 },
  employerNI: { threshold: P(5_000), rate: 0.15 },
  corporationTax: {
    smallRate: 0.19,
    mainRate: 0.25,
    smallLimit: P(50_000),
    mainLimit: P(250_000),
    marginalRelief: 0.015,
  },
  verifiedOn: "2026-11-11",
};

export const TAX_YEARS: Record<TaxYear, TaxConfig> = {
  "2025/26": {
    ...shared,
    label: "2025/26",
    dividendRates: { basic: 0.0875, higher: 0.3375, additional: 0.3935 },
  },
  "2026/27": {
    ...shared,
    label: "2026/27",
    dividendRates: { basic: 0.1075, higher: 0.3575, additional: 0.3935 },
  },
};

export const DEFAULT_YEAR: TaxYear = "2026/27";
export const TAX_YEAR_ORDER: TaxYear[] = ["2025/26", "2026/27"];

export const SOURCES = [
  {
    label: "Income Tax rates and Personal Allowances",
    url: "https://www.gov.uk/income-tax-rates",
  },
  {
    label: "Tax on dividends (rates from 6 April 2026)",
    url: "https://www.gov.uk/tax-on-dividends",
  },
  {
    label: "National Insurance rates and categories",
    url: "https://www.gov.uk/national-insurance-rates-letters",
  },
  {
    label: "Corporation Tax rates and marginal relief",
    url: "https://www.gov.uk/corporation-tax-rates",
  },
  {
    label: "Rates and thresholds for employers 2026 to 2027",
    url: "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027",
  },
] as const;
