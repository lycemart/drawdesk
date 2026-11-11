---
product: drawdesk
gate: 5
status: approved
owner_skill: foundry-architect
updated: 2026-11-11
sources: [docs/05-prd.md]
assumptions:
  - "GitHub Pages project site needs a configurable basePath."
---

# Architecture — DrawDesk v1

## ADR-1: Next.js static export
**Context:** SEO-first, three routes, no backend, GitHub Pages, one React island.
**Decision:** Next.js (app router) with `output: "export"`, React 19, TypeScript.
**Consequences:** static HTML for crawlers; metadata API; `basePath` for project
Pages; ~100 KB JS budget to watch.
**Alternatives:** Vite SPA (weaker SEO), plain HTML (slower iteration), Astro
(best output, extra toolchain risk in this session).

## ADR-2: No UI or chart library
**Context:** one form, one bar chart, one table set.
**Decision:** hand-written CSS with tokens; SVG chart component.
**Consequences:** small bundle, full control, more CSS to write.
**Alternatives:** Tailwind (build step, class noise), Recharts (bundle).

## ADR-3: URL is the state
**Context:** shareable scenarios without a backend.
**Decision:** profit, year, pension, horizon, strategy in query params; parse →
defaults → clamp → write with `replaceState`.
**Consequences:** shareable, no storage, no PII. Invalid params fall back safely.

## Repo layout
```
app/
  layout.tsx        metadata, fonts, JSON-LD, footer
  page.tsx          server shell: H1, copy, <Planner/>, FAQ, sources
  methodology/      formulas, rates table, assumptions
  not-found.tsx
  globals.css       tokens + layout + components
  sitemap.ts        static sitemap
  robots.ts
components/
  Planner.tsx       client island (state, results)
  ResultCard.tsx    hero number + breakdown
  SplitBar.tsx      where the profit goes
  YearPlan.tsx      multi-year table
  MarginalTable.tsx next £1,000
  FAQ.tsx           details/summary, no JS
lib/
  tax-config.ts     rates, years, sources, verifiedOn
  engine.ts         pure calculate/optimise/plan/marginal
  format.ts         money/percent formatting
  url-state.ts      parse/serialise params
  seo.ts            metadata + JSON-LD builders
tests/
  engine.test.ts    reference cases + boundaries + properties
  url-state.test.ts
```

## Routes
| URL | Intent | Render |
|-----|--------|--------|
| `/` | salary vs dividend planner 2026/27 | static + client island |
| `/methodology` | rates, formulas, sources, assumptions | static |
| `/404.html` | not found | static |

## Data model
No persistence. `Scenario = {profit, year, pension, horizon, strategy}`; derived
`Breakdown` and `Plan` are computed, never stored.

## Engine contract
```ts
calculate(scenario): Breakdown
optimiseSalary(profit, pension, year): { best: Breakdown; curve: Point[] }
buildPlan(profit, pension, years, year, strategy): Plan
marginalRoutes(profit, pension, year): Route[]
```
All pure, integer pence inside, no `Date` calls.

## Design tokens
`brand/tokens.json` → CSS variables in `globals.css`. One accent (teal), warm
paper, near-black ink; tabular numerals; system sans stack (no webfont download).

## SEO
- `/`: title "Director Salary vs Dividend Planner 2026/27 — DrawDesk"; H1 with
  the job; answer block ≤60 words; FAQPage + WebApplication JSON-LD.
- `/methodology`: reference page targeting "dividend tax rates 2026/27",
  "employer NI rates"; citations to GOV.UK.
- Canonical base from `NEXT_PUBLIC_SITE_URL`, default the Pages URL.
- `sitemap.xml`, `robots.txt`, `llms.txt`, OG image 1200×630.

## Build order
1. `tax-config.ts` + `engine.ts` + tests (reference £60k first).
2. `format.ts`, `url-state.ts` + tests.
3. Page shell + tokens + layout + metadata.
4. Planner: inputs, best mix, breakdown, split bar.
5. Multi-year plan + marginal table.
6. Methodology page + FAQ + JSON-LD.
7. A11y/perf pass; OG image; sitemap/robots/llms.
8. CI + Pages deploy + smoke.

## Ops
- Build: `pnpm build` → `out/`.
- Env: `NEXT_PUBLIC_BASE_PATH` (Pages project path), `NEXT_PUBLIC_SITE_URL`.
- Host: GitHub Pages via Actions; no secrets.
- Rollback: re-run the last green Pages workflow on the previous SHA.

## Risks
| Risk | Mitigation |
|------|------------|
| basePath asset 404 | build once with the real basePath, verify asset URLs in HTML |
| JS budget | no chart/UI lib; measure `out/_next/static` size |
| Hydration mismatch | state initialised from URL only in `useEffect`, defaults on server |
| Rate drift | config with `verifiedOn`; methodology page renders the same object |
