# Working notes — DrawDesk

## GitHub account
Use **lycemart** only. `intercitygastro` is a client account (Shahzad) — never
read, push, merge, tag or run Actions there. Check `gh api user --jq .login`
before any repo operation.

## Non-negotiables
- One area per change. Calculation changes touch `lib/engine.ts` + tests only.
- Every rate lives in `lib/tax-config.ts` with a source URL and `verifiedOn`;
  no magic number in a component.
- Tests before merge: `pnpm test && pnpm typecheck && pnpm build`. Paste output.
- Never commit a secret. There are none; keep it that way.
- Do not change a displayed number without a source and a test.
- Do not add a dependency without a one-line justification and a bundle check.
- Accessibility and performance budgets are in `docs/02-features.md`; a miss
  needs a written reason.

## Release
- `main` is releasable. Work on `feat/<area>/<slug>`, squash merge.
- Tag only a commit that passed CI and a live smoke test.
- Rollback: re-run the previous green Pages workflow; no hotfix by force-push.

## Tax content
- England, Wales, Northern Ireland only. Scotland, two directors, student
  loans and child benefit are explicitly out of scope for v1.
- "Last reviewed" must match `verifiedOn` in the config.
- This is general information, not advice. Keep the disclaimer visible.
