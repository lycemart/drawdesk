---
product: drawdesk
gate: 8
status: approved
owner_skill: foundry-release
updated: 2026-11-11
sources:
  - https://github.com/lycemart/drawdesk
  - https://lycemart.github.io/drawdesk/
assumptions:
  - "GitHub account lycemart owns the repo; Pages uses the workflow build type."
---

# Release — DrawDesk v1.0.1

## Live
- URL: https://lycemart.github.io/drawdesk/
- Repo: https://github.com/lycemart/drawdesk
- Branch: `main` (squash merges only)
- Host: GitHub Pages, artifact deployed by Actions
- No secrets, no env values, no server. Build env is public:
  `NEXT_PUBLIC_BASE_PATH=/drawdesk`, `NEXT_PUBLIC_SITE_URL=https://lycemart.github.io/drawdesk`

## Pipeline
| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | push/PR to main | install, 18 tests, typecheck, build |
| `pages.yml` | push to main / manual | install, build, upload `out`, deploy Pages |

First runs: `ci` #43044183157 failed on a pnpm version conflict
(`version: 9` in the action plus `packageManager` in package.json). Fixed by
removing the action's version and letting `packageManager` win; both workflows
green since (`ci` 43044292576, `pages` 43044292597).

## Deploy steps (repeatable)
```bash
git push origin main            # CI + Pages run
gh run watch -R lycemart/drawdesk
```
Pages settings: Source = GitHub Actions, HTTPS enforced. `gh api
repos/lycemart/drawdesk/pages -X POST -f build_type=workflow` was used once.

## Verification (from outside, after deploy)
| Check | Result |
|-------|--------|
| `GET /drawdesk/` | 200 in 0.29 s, 40,613 bytes |
| Title in served HTML | Director Salary vs Dividend Planner 2026/27 — DrawDesk |
| JSON-LD blocks | 3 (WebApplication, FAQPage, Organization) |
| `sitemap.xml` | 200, 2 URLs |
| `robots.txt` | 200, allows all |
| `og.png` | 200, image/png |
| CSS chunk | 200 |
| Live browser | hero £46,091; plan toggles; URL updates; no console errors except the intentional 404 fetch |
| Missing path `/nope/` | 404 with the custom page |
| Mobile 390 px | `scrollWidth = 390`, no horizontal overflow |

## Tags
- `v1.0.0` — first public release, on the commit that passed CI + Pages + the
  live smoke test.
- `v1.0.1` — methodology polish (human-readable review date, one row per
  dividend band); same engine, same behaviour.

Tags are never moved; a fix gets a new patch tag.

## Rollback
1. Pages keeps deployments; re-run the previous green `pages` workflow from
   Actions on the last good `main` SHA, or
2. `git revert <bad sha>` and push; CI redeploys.
Both are one action; no force-push, no manual file edits on the host.

## Known gaps
- Custom domain `drawdesk.co.uk` is unregistered. When registered: add the
  domain in Pages settings, create the DNS records GitHub shows, then change
  `NEXT_PUBLIC_SITE_URL` and the Pages base path (if serving at the apex) and
  redeploy.
- No uptime monitor or Search Console property yet.
- No analytics, by design.

## Rollback drill
The previous deployment can be restored by re-running `pages` on the first
green SHA; the workflow has no state outside the artifact, so this is
deterministic.
