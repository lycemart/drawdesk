# Build plan and what changed

## Plan
1. Tax config + engine + reference tests (£60k first).
2. Formatting and URL state + tests.
3. Layout, tokens, metadata, static shell.
4. Planner: inputs, optimiser, breakdown, split bar.
5. Multi-year plan, marginal table.
6. Methodology, FAQ, JSON-LD.
7. A11y/perf, OG, sitemap/robots/llms.
8. CI, Pages, tag, smoke.

## Deviations from the plan
- **Multi-year model narrowed.** The first design spread a recurring profit
  across years; with constant profit the total basic-band usage is identical and
  there is no saving. It was replaced with a one-off pot spread over 1/3/5 years
  (salary in year one only), which produces a real, explainable saving and a
  sharper product claim.
- **Affordability rule added.** Salary + employer NI + pension are capped at the
  year's profit, so take-home + tax always reconciles to profit. This changed
  one test expectation from "salary = profit" to "clamped affordable salary".
- **Hero stats rounded to whole pounds** to keep the summary scannable; the
  workings table shows pence.
- **Initial JS 180 KB gzip**, above the 150 KB budget. Recorded in G7/G9 as a
  known miss with a v1.1 follow-up rather than hidden.
