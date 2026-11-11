---
product: drawdesk
gate: 2
status: approved
owner_skill: foundry-feature-miner
updated: 2026-11-11
sources: [docs/01-market.md]
assumptions:
  - "One director only in v1; Employment Allowance not claimable."
  - "England/Wales/NI bands only; Scotland deferred."
---

# Features — DrawDesk v1

## Differentiation bet
> Unlike single-year salary-vs-dividend calculators, DrawDesk plans the next
> 1–5 years: it optimises salary and dividends, includes employer pension and
> retained profit, and shows the cost of the next £1,000 — with shareable
> results and no signup.

## Scored backlog

| # | Feature | Impact | Conf | Reach | Effort | Score | Verdict |
|---|---------|:------:|:----:|:-----:|:------:|:-----:|---------|
| F1 | Profit → optimal salary/dividend split, live breakdown | 5 | 1.0 | 1.0 | 3 | 1.67 | mvp |
| F2 | Tax-year switch 2025/26 ↔ 2026/27, side-by-side delta | 4 | 1.0 | 0.8 | 2 | 1.60 | mvp |
| F3 | Multi-year plan (1/3/5 yrs): extract-all vs spread dividends | 5 | 0.8 | 0.7 | 4 | 0.70 | mvp |
| F4 | Employer pension in the model + pension-vs-cash trade-off | 4 | 0.9 | 0.6 | 2 | 1.08 | mvp |
| F5 | Next £1,000: net cash by route (salary / dividend / pension) | 4 | 0.8 | 0.8 | 2 | 1.28 | mvp |
| F6 | Shareable URL + copy summary | 3 | 0.9 | 0.9 | 1 | 2.43 | mvp |
| F7 | Methodology: workings, rates, sources, last-reviewed, disclaimer | 5 | 1.0 | 1.0 | 1 | 5.00 | mvp |
| F8 | Two directors + Employment Allowance | 4 | 0.8 | 0.4 | 4 | 0.32 | next |
| F9 | Scottish income tax bands | 3 | 0.9 | 0.2 | 3 | 0.18 | next |
| F10 | Student loan plans | 3 | 0.8 | 0.2 | 2 | 0.24 | next |
| F11 | Child benefit charge / £100k traps warnings | 3 | 0.8 | 0.3 | 2 | 0.36 | next |
| F12 | PDF export | 2 | 0.7 | 0.3 | 2 | 0.21 | later |
| F13 | Accounts/login/saved scenarios | 2 | 0.5 | 0.3 | 4 | 0.08 | killed |

## MVP cut (7)

### F1 — Optimal split
Input: company profit before director pay (integer £, 0–1,000,000), tax year.
Output: best salary, dividends, employer NI, corporation tax, income tax,
employee NI, dividend tax, take-home, effective total tax rate.
Acceptance:
- Profit £60,000, 2026/27 → salary £12,570; dividends £37,498.54; CT £8,795.96;
  employer NI £1,135.50; dividend tax £3,977.34; take-home £46,091.20 (±£0.02).
- Profit £0 → all zeros, no NaN.
- Profit £30,000 → take-home £24,403.45 (±£1).
- Profit £150,000 → best salary < £12,570 and take-home £87,237 (±£5). One
  published competitor shows £85,320.94 for this row; its £30k-£100k rows match
  ours to the penny, so the divergence is recorded, not hidden.

### F2 — Tax-year comparison
Selector 2025/26 and 2026/27; show 2026/27 vs 2025/26 take-home delta for the
same profit. Acceptance: £60,000 shows a negative delta in 2026/27 and the
dividend rates 10.75/35.75/39.35 vs 8.75/33.75/39.35.

### F3 — Multi-year plan
Horizon 1/3/5. Two strategies:
- "Extract it all": each year pays the optimal salary and extracts the rest.
- "Spread dividends": optimal salary each year, dividends fill the basic-rate
  band headroom, remainder carried and extracted by the horizon end.
Output: total take-home, total tax, per-year table.
Acceptance: for £150,000 profit over 3 years, spread ≥ extract-all; totals are
monotonic; carried balance never negative; horizon 1 equals F1.

### F4 — Pension
Optional employer pension contribution (0–60,000, capped at available profit),
deductible, no NI/income tax now. Show cash take-home and pension pot; a
trade-off row "£10,000 into pension vs cash".
Acceptance: pension reduces CT and dividend capacity; total value (cash +
pension) increases at the margin for a 40% taxpayer; cap enforced.

### F5 — Next £1,000
At the current optimum, show net cash change from £1,000 more profit routed as
salary, dividend, or pension. Acceptance: three routes shown, each with a number
and a one-line reason; sum of components reconciles with the F1 engine.

### F6 — Shareable URL
State in query params: profit, year, pension, horizon, strategy. Copy button.
Acceptance: opening the URL in a fresh tab reproduces identical results; invalid
params fall back to defaults with a visible note.

### F7 — Methodology page
Formulas, every rate with source URL and effective date, assumptions, rounding,
exclusions, "last reviewed", "not tax advice". Acceptance: every constant in
`lib/tax-config.ts` appears in the table; links return 200.

## Kill list

| Killed | Why now | Revisit when |
|--------|---------|--------------|
| Accounts / saved scenarios | Needs backend + auth + data protection; not the wedge | Retention proves demand |
| Scottish bands | Different band table and tests; v1 focus | v1.1 |
| Two directors | Employment Allowance and share splits double the model | v1.1 if users ask |
| PDF export | Print CSS is enough for v1 | After 100 sessions |
| Live HMRC API | No API for this; static config is auditable | Never |
| AI chat | No key, no server, no need | Never for this product |
| Ads/affiliate | Trust is the differentiator at launch | After traffic |

## Handoff
Architect: implement F1–F7 only. Builder: one engine, one config, tests from the
acceptance lines. Growth: lead with the multi-year wedge, not "another
calculator".
