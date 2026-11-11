# DrawDesk

A free planner for UK limited company directors. Enter company profit; it finds
the salary, dividend and employer pension mix that leaves the most take-home,
then models spreading a one-off pot over up to five tax years.

Live: https://drawdesk.76-13-181-161.sslip.io/ (own server, nginx + TLS). Mirror: https://lycemart.github.io/drawdesk/

## Why
The April 2026 dividend tax rise broke the "£12,570 salary, rest as dividends"
rule of thumb. Existing calculators stop at one year and often gate the answer
behind a sales funnel. DrawDesk shows the whole model, the next £1,000, and a
multi-year extraction plan — with every rate sourced.

## Stack
Next.js static export, React, TypeScript, Vitest. No backend, no cookies, no
analytics, no secrets.

## Commands
```bash
pnpm install
pnpm test          # 30 engine and URL-state tests
pnpm typecheck
NEXT_PUBLIC_BASE_PATH=/drawdesk NEXT_PUBLIC_SITE_URL=https://lycemart.github.io/drawdesk pnpm build
```

## Accuracy
- Rates in `lib/tax-config.ts` with source URLs and `verifiedOn`.
- `tests/` covers the published £60,000 example to the penny,
  £30k/£50k/£100k reference cases, affordability, pension, year comparison,
  multi-year totals and monotonicity.
- Not tax advice. England, Wales and Northern Ireland; one director.

## Structure
```
app/            routes, metadata, JSON-LD, sitemap/robots
components/     Planner client island
lib/            engine, tax config, URL state, formatting, SEO
brand/          logo, favicon, OG, tokens, proofs
docs/           brief, market, features, brand, identity, PRD, architecture, SEO, release, QA
tests/          engine tests
```

## Deploy
GitHub Pages via `.github/workflows/pages.yml` on every push to `main`. Rollback:
re-run the last green Pages workflow on the previous commit.

## Licence
Code private to the owner. No competitor assets or copy included.
