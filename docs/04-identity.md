---
product: drawdesk
gate: 4
status: approved
owner_skill: foundry-logo
updated: 2026-11-11
sources: [brand/logo.svg, brand/tokens.json]
assumptions:
  - "Wordmark uses Georgia (system serif); no webfont licence needed."
---

# Identity — DrawDesk

## Concept
The mark is a rounded square with its top-right quarter filled: the whole pot,
with one part taken out and set apart. It reads as a split, not as a coin, chart
or pound sign — the three clichés every competitor in the category uses (Taxley
uses a wordmark, the accountant sites use coins/charts/calculator grids).

- **The square** is the company's pot.
- **The filled quarter** is what you draw (accent).
- **The gap between them** is the split decision.
- No text inside the mark, so it works as an app icon and a favicon.

The wordmark is a transitional serif (Georgia) to signal editorial trust next to
the accountant sites, with "Desk" in the brand teal to tie the lockup to the mark.

## Grid and construction
- Mark: 24×24, outer square 20×20 at (2,2), radius 5, stroke 2.4.
- Filled quarter: from x=12/y=2 to the 4.4 radius corner at (20,6.4)/(20,12).
- Lockup: 260×64, mark at 28×28 optical size, cap-height aligned to the wordmark.
- Minimum sizes: mark 16 px; lockup 120 px wide.
- Clear space: half the mark's width on all sides.

## Files
| File | Use |
|------|-----|
| `brand/logo.svg` | full colour horizontal lockup |
| `brand/logo-mark.svg` | mark only, currentColor, 24×24 |
| `brand/logo-mono.svg` | one-colour lockup, currentColor |
| `brand/favicon.svg` | 32×32 app/favicon, teal tile + paper mark |
| `brand/og-image.svg` → `.png` | 1200×630 social card |
| `brand/tokens.json` | colour, type, spacing, radius |
| `brand/proof-*.png` | rendered evidence |

## Colour (all pairs AA or better)
| Pair | Ratio |
|------|-------|
| ink `#17201C` on paper `#F7F4ED` | 15.18 |
| muted `#5B6B64` on paper | 5.12 |
| primary `#0E5F52` on paper | 6.88 |
| paper `#F2F7F4` on primary | 6.98 |
| callout text `#123F37` on `#DCEBE6` | 9.53 |
| disclaimer `#4A2C0C` on `#F4E3CC` | 10.08 |

Accent `#C97B2E` is used for fills and dots only, never body text on paper
(3.2:1).

## Type
- Display: Georgia / Times New Roman (system serif), tight tracking, 700.
- UI: system sans stack, 400/600/650, tabular numerals for money.
- No webfont download; no layout shift; no licence risk.

## Tests performed
| Test | Result | Evidence |
|------|--------|----------|
| 16 px favicon | Idea survives: tile + filled corner readable | `brand/proof-16.png` |
| 1 colour | Solid black on white, no grey edges | `brand/proof-mono.png` |
| Dark background | Paper mark on `#17201C`, legible | `brand/proof-dark.png` |
| Lockup 260 px | Mark and wordmark aligned, spacing tight | `brand/proof-lockup.png` |
| OG 1200×630 | Headline, promise, domain inside safe area | `brand/og-image.png` |
| Similarity | No competitor shape or wordmark reused | competitor screenshots in `docs/research/` |

## Don'ts
- Do not stretch, rotate, recolour or outline the mark.
- Do not put the mark on a mid-tone photo; use the paper or ink version.
- Do not add a gradient, shadow, or bevel.
- Do not set the wordmark in another typeface or change the "Desk" colour.
- Do not crop the OG card below 64 px margins.
