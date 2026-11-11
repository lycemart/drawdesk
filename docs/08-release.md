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

# Release — DrawDesk v1.1.0

## Live
- URL: https://drawdesk.76-13-181-161.sslip.io/ (the owner's server)
- Mirror: https://lycemart.github.io/drawdesk/ (canonical points at the server)
- Repo: https://github.com/lycemart/drawdesk
- Branch: `main` (squash merges only)
- Host: this server, nginx static site, Let's Encrypt TLS, `/srv/drawdesk/current`
- Deploy: `./deploy.sh` (build → release dir → symlink → nginx reload → smoke)
- No AWS, no registrar, no secrets.

## Pipeline
| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | push/PR to main | install, 30 tests, typecheck, build |
| `pages.yml` | push to main / manual | install, build, deploy the mirror to Pages |

The server is the primary host. `deploy.sh` is the release path; Pages is a
read-only mirror whose canonical points at the server.

First runs: `ci` #43044183157 failed on a pnpm version conflict
(`version: 9` in the action plus `packageManager` in package.json). Fixed by
removing the action's version and letting `packageManager` win; both workflows
green since (`ci` 43044292576, `pages` 43044292597).

## Deploy steps (repeatable)
```bash
git push origin main            # CI + mirror
gh run watch -R lycemart/drawdesk
./deploy.sh                     # primary: server
```
Pages settings: Source = GitHub Actions, HTTPS enforced. `gh api
repos/lycemart/drawdesk/pages -X POST -f build_type=workflow` was used once.

## Verification (from outside, after deploy)
| Check | Result |
|-------|--------|
| `GET /` on the server | 200 in 0.02 s, 41,531 bytes |
| HTTP → HTTPS | 301 to the https host |
| TLS | valid for the host, expires 2027-02-09, auto-renew |
| `/methodology/`, `/take-home/` | 200 |
| `/nope/` | 404 |
| Title in served HTML | Director Salary vs Dividend Planner 2026/27 — DrawDesk |
| JSON-LD blocks | 3 (WebApplication, FAQPage, Organization) |
| `sitemap.xml` | 200, 3 URLs on the server host |
| `robots.txt` | 200, allows all |
| `og.png` | 200, image/png |
| Security headers | nosniff, DENY, strict-origin, HSTS 1 year |
| CSS chunk | 200 |
| Live browser | hero £46,091; plan toggles; URL updates; no console errors except the intentional 404 fetch |
| Missing path `/nope/` | 404 with the custom page |
| Mobile 390 px | `scrollWidth = 390`, no horizontal overflow |

## Tags
- `v1.0.0` — first public release, on the commit that passed CI + Pages + the
  live smoke test.
- `v1.0.1` — methodology polish (human-readable review date, one row per
  dividend band); same engine, same behaviour.
- `v1.1.0` — `/take-home/` reference table, year-comparison card in the planner,
  finer salary search (catches the tapered-allowance optimum), 30 tests.

Tags are never moved; a fix gets a new patch tag.

## Rollback
Server: releases are immutable directories. Re-point the symlink and reload:
```bash
ln -sfn /srv/drawdesk/releases/<previous-sha> /srv/drawdesk/current
systemctl reload nginx
```
Mirror: re-run the previous green `pages` workflow on the last good SHA.
No force-push, no edits inside a release directory.

## Known gaps
- The URL is the server's sslip.io name; a real domain is a one-variable change
  (`NEXT_PUBLIC_SITE_URL`) plus DNS to this server and a new cert.
- No uptime monitor or Search Console property yet.
- No analytics, by design.

## Rollback drill
The previous deployment can be restored by re-running `pages` on the first
green SHA; the workflow has no state outside the artifact, so this is
deterministic.
