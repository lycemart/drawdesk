---
product: drawdesk
gate: 0
status: approved
owner_skill: product-foundry
updated: 2026-11-11
sources: []
assumptions:
  - "Static product: no backend, no accounts, no paid APIs."
  - "Tax content limited to England/Wales/NI; Scotland is out of scope for v1."
---

# DrawDesk — idea brief

## Who
A UK limited-company owner-manager: one director, often the only employee, taking
£40k–£150k of profit out of their own company. They file their own Self
Assessment or use a small accountant, and they make the salary/dividend decision
once or twice a year.

## Problem
The April 2026 dividend tax rise broke the old "£12,570 salary, rest as
dividends" rule of thumb. The decision now depends on profit level, corporation
tax band, pension, and how much to leave in the company. Most free calculators
answer "this year, this split" and stop; the actual question is "what should I
draw this year, and what should I leave for next year?"

## Today
They use an accountant's lead-gen calculator, a spreadsheet, or a stale blog
table. Those tools are single-year, often gated by a "talk to us" funnel, and
rarely show the workings or the cost of the next £1,000.

## One job
Given a company's annual profit, find the pay mix (salary, dividends, employer
pension, retained profit) that maximises the director's after-tax cash over the
chosen horizon, and show why.

## Why now
From 6 April 2026 the basic and higher dividend rates rose to 10.75% and 35.75%.
Every pre-2026 rule of thumb is now wrong for some profit levels, and the
incumbents' content is being rewritten in public.

## Kill criteria
- No differentiated angle beyond "another calculator" after the competitor scan.
- Tax rules cannot be sourced from GOV.UK with confidence.
- A single-session static build cannot meet the accuracy bar.

## Constraints
- Static, client-side only; GitHub Pages deploy; no secrets.
- Tax years 2025/26 and 2026/27; England/Wales/NI only.
- Every rate sourced and dated; visible assumptions; not tax advice.
- Unique brand, original logo, SEO-first landing page.

## Success signal
A director can enter one number (company profit), get an optimal split for this
year and a 3-year plan, and share the result by URL — in under 60 seconds, with
zero signup.
