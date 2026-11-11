---
product: drawdesk
gate: 5
status: approved
owner_skill: foundry-architect
updated: 2026-11-11
sources:
  - https://www.gov.uk/tax-on-dividends
  - https://www.gov.uk/income-tax-rates
  - https://www.gov.uk/national-insurance-rates-letters
  - https://www.gov.uk/corporation-tax-rates
  - https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027
assumptions:
  - "One director, no Employment Allowance, England/Wales/NI."
  - "Future years in a multi-year plan reuse the selected year's rates."
---

# PRD — DrawDesk v1

## Summary
A free, static planner for UK one-director limited companies. Enter annual
company profit; DrawDesk finds the salary/dividend mix that maximises take-home,
adds employer pension and retained profit, and projects 1–5 years. No signup,
shareable result, every rate sourced.

## Users and jobs
1. **The owner-manager (primary).** Profit £40k–£150k, one director, wants the
   best mix and a sanity check on their accountant. Trigger: year-end or a
   dividend decision. Success: a number they trust and can explain. Failure: a
   wrong rate or an unexplained total.
2. **The new director.** First year, no idea what salary to take. Trigger:
   Google "best director salary 2026/27". Success: a default they can act on.
3. **The curious adviser-adjacent user.** Wants the workings and sources.
   Success: can audit the model.

## Scope
F1–F7 from `docs/02-features.md`. Nothing else.

## Non-goals
- Not tax advice; no personalised recommendations.
- No accounts, login, saved scenarios, or server.
- No Scotland, two directors, student loans, child benefit, IR35, BADR, director
  loans, VAT, or MTD in v1.
- No live HMRC calls; rates are a versioned static config.
- No ads, affiliate links, or lead capture at launch.

## User flows
1. **Happy:** land → profit prefilled £60,000 → see best mix + take-home →
   adjust profit → see the breakdown and the next-£1,000 table → switch to
   "Spread over 3 years" → copy link.
2. **Error:** profit empty or non-numeric → inline "Enter your company profit"
   and keep the last valid result; no crash.
3. **Share:** URL with params → identical inputs and results → a small "shared
   scenario" note.

## Calculation spec

### Inputs
| Name | Type | Unit | Range | Default | Validation |
|------|------|------|-------|---------|------------|
| profit | integer | £/year | 0–1,000,000 | 60,000 | required, numeric, clamp |
| year | enum | — | 2025/26, 2026/27 | 2026/27 | one of |
| pension | integer | £/year | 0–60,000 | 0 | ≤ profit |
| horizon | enum | years | 1, 3, 5 | 1 | one of |
| strategy | enum | — | extract, spread | extract | one of |

### Outputs
salary, dividends, employerNI, corporationTax, incomeTax, employeeNI,
dividendTax, takeHome, totalTax, effectiveRate, pension, retained.

### Formulas (per year)
Let `S` salary, `E` employer pension, `P` profit, `PA` personal allowance.

```
ERNI   = 0.15 * max(0, S - 5000)
T      = max(0, P - S - ERNI - E)                 # taxable profit
CT     = T <= 50000  ? 0.19*T
       : T >= 250000 ? 0.25*T
       : 0.25*T - 0.015*(250000 - T)              # marginal relief
Dmax   = max(0, T - CT)
D      = strategy == extract ? Dmax : min(Dmax, dividendBudget)
income = S + D
PAeff  = max(0, 12570 - max(0, income - 100000)/2)
taxableS = max(0, S - PAeff)
taxS   = bandTax(taxableS, [37700@0.20, 74870@0.40, inf@0.45])
# dividends stack on top of salary:
top    = S                                     # income already used
divTaxable = max(0, D - 500)
divTax = sum over slices of divTaxable above (bands - top) at dividend rates
EENI   = 0.08*max(0, min(S,50270)-12570) + 0.02*max(0, S-50270)
takeHome = S - taxS - EENI + D - divTax
totalTax = ERNI + CT + taxS + EENI + divTax
```

Rounding: all money in pence integers; each tax line rounded half-up to the
penny before summing; display to the penny with `£` and thousands separators.

### Rates config

| Constant | 2025/26 | 2026/27 | Source |
|----------|---------|---------|--------|
| Personal allowance | 12,570 | 12,570 | gov.uk/income-tax-rates |
| PA taper start / rate | 100,000 / 50% | same | gov.uk/income-tax-rates |
| Basic band top | 50,270 | 50,270 | gov.uk/income-tax-rates |
| Higher band top | 125,140 | 125,140 | gov.uk/income-tax-rates |
| Dividend allowance | 500 | 500 | gov.uk/tax-on-dividends |
| Dividend basic | 8.75% | 10.75% | gov.uk/tax-on-dividends |
| Dividend higher | 33.75% | 35.75% | gov.uk/tax-on-dividends |
| Dividend additional | 39.35% | 39.35% | gov.uk/tax-on-dividends |
| Employee NI band | 12,570–50,270 @8%, then 2% | same | gov.uk/national-insurance-rates-letters |
| Employer NI | 15% above 5,000 | same | gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027 |
| Corporation tax | 19% ≤50k, 25% ≥250k, 26.5% marginal | same | gov.uk/corporation-tax-rates |
| Employment Allowance | not eligible (single director) | same | gov.uk/claim-employment-allowance |

`verifiedOn: 2026-11-11`. Any change requires a new config entry, a test, and a
"last reviewed" update.

### Acceptance table
| Profit | Year | Expected |
|--------|------|----------|
| 60,000 | 2026/27 | salary 12,570; dividends 37,498.54; CT 8,795.96; ERNI 1,135.50; div tax 3,977.34; take-home 46,091.20 |
| 30,000 | 2026/27 | take-home 24,403.45 ±1 |
| 50,000 | 2026/27 | take-home 38,861.95 ±1 |
| 100,000 | 2026/27 | take-home 65,209.63 ±5 |
| 150,000 | 2026/27 | take-home 85,320.94 ±5; salary < 12,570 |
| 0 | any | all zero, no NaN |
| 60,000 | 2025/26 | take-home > 2026/27 (dividend rise) |
| 60,000 + £10k pension | 2026/27 | CT falls, cash falls, pension 10,000 |
| 150,000 ×3 spread | 2026/27 | total ≥ extract-all |

## Copy deck
- H1: "What should you draw from your company?"
- Sub: "The best salary, dividend and pension mix for your profit — this year and
  the next five. Free, no signup, every rate sourced."
- Primary label: "Company profit before your pay"
- CTA: "Copy result link"
- Result hero: "You keep £46,091" / "£13,909 goes to tax"
- Empty: "Enter your company profit to see your best mix."
- Error: "Use a number between £0 and £1,000,000."
- Disclaimer: "General information, not tax advice. Rates checked 11 Nov 2026
  against GOV.UK."

## Analytics
None at launch (privacy-first). If added later: `plan_calculated` (year, horizon,
bucket of profit — no exact profit), `link_copied`, `methodology_viewed`.

## Risks
| Risk | Mitigation |
|------|------------|
| Rate error | One config, source URLs, reference tests against two independent published examples |
| Model overreach | Visible assumptions; "not advice"; non-goals on the page |
| Search saturation | Lead with multi-year + pension wedge in title/H1 |
| Multi-year false precision | Label future years as "same rates assumed" |
| Stale after April 2027 | "Last reviewed" + a single config update path |
