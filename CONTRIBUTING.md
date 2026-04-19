# Contributing

How to work on this repo without stepping on teammates.

## Branches

The `develop` branch is **protected**. You cannot push directly — all changes land through pull requests that pass CI. Do not try to bypass this.

### Naming

| Prefix | Use for | Example |
|---|---|---|
| `feat/` | New user-facing features | `feat/vendor-dashboard` |
| `fix/` | Bug fixes | `fix/order-total-rounding` |
| `chore/` | Tooling, refactors, infrastructure | `chore/project-foundation` |
| `docs/` | Documentation only | `docs/api-endpoint-checklist` |

Branch off `develop` unless coordinating a longer-lived integration branch.

```bash
git checkout develop
git pull origin develop
git checkout -b feat/my-feature
```

## Commit messages

Follow the style already in the log. Short imperative subject, lowercase, conventional-style prefix:

```
feat: add rider page with hero and account types sections
fix: wrap root layout with QueryClientProvider
refactor(api): extract types and add ApiError class
chore: update dependencies
docs: document data-flow architecture
```

- First line ≤ 72 characters.
- Body (optional) explains *why*, not what. The diff shows what.
- Keep commits small and logically atomic. One concern per commit makes review, revert, and `git bisect` all work.

## Pull requests

1. Push your branch: `git push -u origin feat/my-feature`
2. Open a PR against `develop`.
3. Wait for CI status checks to pass.
4. Request review from at least one teammate.
5. Squash or rebase merge — **merge commits are not allowed** on `develop`.

### PR description template

```markdown
## Summary
What this change does, in 1–3 bullets.

## Why
The user need or constraint that motivated it.

## Test plan
- [ ] Built with `pnpm build`
- [ ] Smoke-tested the affected route(s) in dev
- [ ] Updated types if backend response shape changed

## Screenshots
(UI changes only)
```

## Architecture boundaries

Before opening a PR that adds API calls, read [ARCHITECTURE.md](./ARCHITECTURE.md). In particular:

- Never call `fetch` outside `src/lib/api.ts`.
- Never import from `@/lib/api` in UI code — go through `@/services` and `@/hooks`.
- Never hardcode query keys — add to `src/hooks/queryKeys.ts`.
- Never define response types inline — add to `src/types/` and cross-check against the backend.

## Local development

```bash
pnpm install
pnpm dev              # next dev server
pnpm build            # production build
pnpm lint             # eslint
pnpm test             # jest
pnpm e2e              # cypress
```

Required env vars: `NEXT_PUBLIC_API_URL`. Copy `.env.local.example` to `.env.local` if it exists; otherwise ask the lead for the staging URL.

## When you hit a blocker

- **CI fails on a check you can't reproduce locally** — check the Node and pnpm versions in `package.json` (`packageManager` field).
- **Backend contract changed** — update `src/types/*` first. TypeScript will show every downstream file that needs editing.
- **Merge conflicts with `develop`** — rebase your branch onto latest `develop`. Do not merge `develop` into your feature branch; that produces messy history.
- **You need to commit something risky** — open a draft PR and ask. Do not force-push shared branches.
