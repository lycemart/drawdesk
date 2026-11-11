---
product: drawdesk
gate: 1
status: approved
owner_skill: foundry-scout
updated: 2026-11-11
sources:
  - https://taxley.co.uk/salary-vs-dividends-calculator
  - https://eternityaccountants.co.uk/calculators/salary-and-dividend-calculator/
  - https://frazerjames.co.uk/salary-vs-dividend-calculator/
  - https://www.gov.uk/tax-on-dividends
  - https://www.gov.uk/income-tax-rates
  - https://www.gov.uk/national-insurance-rates-letters
  - https://www.gov.uk/corporation-tax-rates
  - https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027
assumptions:
  - "No paid keyword tool was available; demand evidence is qualitative."
  - "Three competitors were read in full; the rest are search-result level."
---

# Market — UK director pay / salary vs dividend tools

## The user and the job
One-director limited companies choosing how to pay themselves. The recurring job:
"given my profit, what mix of salary, dividends, pension and retained profit
leaves me best off, and what changes next year?" The decision is annual, involves
thousands of pounds, and is surrounded by rule-of-thumb advice that changed in
April 2026.

## Competitor table

`depth`: **full** = page fetched and read; **search** = found in results, not read.

| # | Competitor | URL | Type | What it does | Weakness (specific) | depth |
|---|-----------|-----|------|--------------|---------------------|-------|
| 1 | Taxley | https://taxley.co.uk/salary-vs-dividends-calculator | Filing SaaS + free tools | Profit input, 2025/26 + 2026/27, salary optimiser to the penny, Scotland, associated companies, Employment Allowance, every-option table, sources, MCP + embeds | Single year only; pension is a separate calculator; no retained-profit horizon | full |
| 2 | Eternity Accountants | https://eternityaccountants.co.uk/calculators/salary-and-dividend-calculator/ | Accountant lead-gen | Two directors, share %, take-home target, retained profit, pension, student loan, Scotland, child benefit, charts, PDF, tax diary | Dense 15-section page; lead-gen CTA; projection still one year; no multi-year plan | full |
| 3 | Frazer James | https://frazerjames.co.uk/salary-vs-dividend-calculator/ | IFA lead-gen | Take-out amount + salary split, CT rate selector, best split, workings, adviser review | No pension in the model; no 2025/26 comparison; single year; lead-gen funnel | full |
| 4 | LDM Accounting | https://ldmaccounting.co.uk/calculators | Accountant calculator hub | Suite of 2026/27 calculators | Hub, not a planner; lead-gen | search |
| 5 | Mercian Accountants | https://www.mercianaccountants.co.uk/salary-vs-dividend-calculator/ | Accountant lead-gen | Salary vs dividend calculator with explanation | Single year; lead-gen | search |
| 6 | SmartFiling | https://smartfiling.co.uk/salary-dividend-calculator-guide/ | Content + calculator guide | Guide and split calculator, 2026/27 | Content-first; shallow tool | search |
| 7 | Crunch | https://www.crunch.co.uk/knowledge/tax/dividend-tax-calculator/ | Accounting SaaS | Dividend tax calculator + guides | Single-year tax estimate, not a split planner (`ASSUMPTION`, not fetched) | search |
| 8 | GoForma | https://www.goforma.com/ | Contractor accounting | Salary/dividend tooling inside an accounting service | Gated by service signup (`ASSUMPTION`, not fetched) | search |
| 9 | ListenToTaxman | https://www.listentotaxman.com/ | Tax calculator site | Broad UK tax calculators | Generic, not director-specific (`ASSUMPTION`, not fetched) | search |
| 10 | RIFT | https://www.riftrefunds.co.uk/ | Tax refund service | Tax calculators + refund service | Not a director pay planner (`ASSUMPTION`, not fetched) | search |
| 11 | GOV.UK | https://www.gov.uk/tax-on-dividends | Official source | Rules, rates, examples | Not a planner; the source of truth we cite | full |

## Feature frequency (from the three full teardowns)

| Feature | Taxley | Eternity | Frazer James | Count |
|---------|:------:|:--------:|:------------:|:-----:|
| Profit input | ✓ | ✓ | ✗ (take-out input) | 2 |
| Tax-year selector | ✓ | ✓ (2026/27 only) | ✗ | 2 |
| Salary optimiser | ✓ | ✓ | ✓ | 3 |
| Dividend/CT breakdown | ✓ | ✓ | ✓ | 3 |
| Pension in the model | ✗ (separate tool) | ✓ | ✗ | 1 |
| Retained profit | ✗ | ✓ | ✗ | 1 |
| Two directors | ✗ | ✓ | ✗ | 1 |
| Other income | ✓ | ✓ | ✗ | 2 |
| Scotland | ✓ | ✓ | ✗ | 2 |
| Student loan | ✗ (separate tool) | ✓ | ✗ | 1 |
| Sources + last reviewed | ✓ | ✓ | ✓ | 3 |
| Workings shown | ✓ | ✓ | ✓ ("show workings") | 3 |
| Shareable result URL | ✗ | ✗ | ✗ | 0 |
| Multi-year projection | ✗ | ✗ | ✗ | 0 |
| Embed / API | ✓ (MCP + embed) | ✗ | ✗ | 1 |
| PDF / print | ✗ | ✓ | ✗ | 1 |
| No signup | ✓ | ✓ | ✓ | 3 |

## Demand evidence
- Every accountant in the results has a dedicated page, several updated for
  2026/27 — the query has commercial intent and recurring demand.
- The 2026 dividend rise is being actively rewritten across the niche: Frazer
  James leads with "the rule of thumb broke in April", Eternity with "what
  changed for 2026/27". Freshness is a live ranking factor here.
- Search results are dominated by accountant lead-gen and one strong SaaS
  (Taxley). That means the informational intent is served, but the *planning*
  intent ("how much should I draw over the next few years") is not.
- `ASSUMPTION`: head-term volume is high and competitive; long-tail question
  queries ("best director salary 2026/27", "dividend vs salary £100k") are where
  a new domain can enter.

## Gaps
1. **Time horizon.** Every tool stops at one tax year. Directors routinely
   decide whether to extract now or leave profit in the company; nobody shows a
   multi-year extraction plan with the same engine.
2. **One integrated mix.** Pension is either absent (Frazer James) or a separate
   calculator (Taxley). Nobody optimises salary + dividends + pension + retained
   profit in one place.
3. **Shareable results.** No competitor has a URL that reproduces the scenario;
   sharing means screenshots.
4. **Transparency of the next pound.** Tools show totals; none show the marginal
   cost of the next £1,000 by route, which is how the actual decision is made.
5. **Lead-gen bias.** Most competitors sell accounting; a free, unbiased,
   no-signup planner has a trust angle ("we don't want your email").

## Positioning
> For one-director companies deciding what to draw and what to leave, DrawDesk
> is the free planner that optimises salary, dividends and pension across
> multiple years and shows the cost of the next £1,000 — without a signup or a
> sales call.

Enemy: the stale "£12,570 + dividends" rule of thumb, and single-year
calculators that hide the trade-off.

## Scorecard

| Dimension | Weight | Score | Reason |
|-----------|--------|-------|--------|
| Pain frequency | 25% | 4 | Annual, high-value, repeated |
| Demand evidence | 20% | 4 | Many dedicated, maintained competitors |
| Differentiation room | 20% | 3 | Multi-year + integrated pension is real but narrow |
| Buildability (static, 1 day) | 15% | 5 | Pure client-side arithmetic |
| Accuracy/legal risk (inverse) | 10% | 3 | Rates must be exact, dated, disclaimed |
| Distribution | 10% | 2 | Head terms owned by strong domains |

Weighted: 4(.25)+4(.20)+3(.20)+5(.15)+3(.10)+2(.10) = 3.55 → **CONDITIONAL GO**

Condition: the product must lead with the multi-year + integrated-pension wedge,
not position as "another salary vs dividend calculator". If the build slips to a
single-year clone, kill it (the market does not need an 11th one).

## Feature seed for G2
1. Profit → optimal salary/dividend/pension split (table stakes)
2. 2025/26 vs 2026/27 comparison (freshness)
3. Multi-year extraction plan (gap)
4. Retained-profit / leave-in-company mode (gap, partial incumbent)
5. Marginal cost of the next £1,000 by route (gap)
6. Shareable URL (gap)
7. Transparent workings + sources + last reviewed (trust baseline)
8. Two directors / Employment Allowance (incumbent parity; later)
9. Scottish bands (later)
10. Student loans, child benefit (later)
