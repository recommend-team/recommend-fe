# Project Foundation Plan

**Branch:** `develop`
**Owner:** Lead Developer
**Goal:** Establish a consistent, professional project structure so every future feature — API calls, types, state management, hooks — follows the same conventions across the team.

---

## Why This Matters

The codebase currently works but has architectural debt that will compound as more devs contribute:

- `QueryClientProvider` is only wired into `/store/*`, so React Query silently fails on other routes.
- API types live inside `src/lib/api.ts`, coupling every type consumer to the transport layer.
- No service layer — domain functions (`getStorefront`, `createOrder`) sit loose in `api.ts`.
- Hook filenames don't match their exports (`useStore.ts` exports `useStorefront()`).
- Error handling is coarse; no typed errors, no env validation, no auth-refresh hook.
- Root metadata still says "Create Next App".

If we don't fix this before the next 2–3 feature areas land (auth, vendor dashboard, rider app), every new dev will pick a different pattern and consistency is lost.

---

## Pre-Work (before Sprint 1 starts)

- [ ] Merge all outstanding feature branches into `develop`
  - `feat/about-page` → `develop`
  - `whatsapp-inapp-browser` → `develop`
  - any other open dev branches
- [ ] Announce a short foundation freeze to the team: "No PRs into `develop` until foundation sprint closes."
- [ ] Tag the pre-foundation state for rollback:
  ```bash
  git checkout develop
  git pull origin develop
  git tag pre-foundation-setup
  git push origin pre-foundation-setup
  ```

---

## Sprint 1 — Critical Fixes & Infrastructure

**Objective:** Fix the blocking bug and lay down the type + error foundations that every later sprint depends on.

### Tasks

- [ ] **Move `<Providers>` to root layout**
  - File: `src/app/layout.tsx`
  - Remove `<Providers>` wrapper from `src/app/store/layout.tsx`
  - Rationale: React Query must be available on every route, not just `/store/*`

- [ ] **Update root metadata**
  - File: `src/app/layout.tsx`
  - Replace placeholder title/description with real app metadata

- [ ] **Create `src/types/` directory**
  - `src/types/vendor.ts` — `Vendor`, `VendorMeta`
  - `src/types/product.ts` — `Product`, `ProductVariant`
  - `src/types/order.ts` — `CreateOrderPayload`, `CreateOrderResponse`, `OrderStatus`
  - `src/types/storefront.ts` — `StorefrontData`
  - `src/types/index.ts` — re-export all
  - Remove these definitions from `src/lib/api.ts`

- [ ] **Harden `src/lib/api.ts`**
  - Keep only: `request<T>()` helper, base URL resolution, `ApiError` class
  - Introduce typed `ApiError` with `status` + `details` fields
  - Validate `NEXT_PUBLIC_API_URL` at module load (throw if unset in production)
  - Remove domain functions (moved to services in Sprint 2)

### Acceptance

- App builds and runs with no React Query errors on any route
- `import { Vendor } from '@/types'` works across the codebase
- Throwing a 4xx response produces an `ApiError` instance with `.status` and `.details` accessible to callers

### Risks

- Breaking import paths in existing components — do a repo-wide search/replace and run the build before committing
- Missing `NEXT_PUBLIC_API_URL` in CI — verify env vars are set in Vercel / hosting before merging

---

## Sprint 2 — Service Layer

**Objective:** Introduce a domain-oriented service layer so API calls are grouped logically and reusable.

### Tasks

- [ ] **Create `src/services/` directory**
  - `src/services/storefront.service.ts` — `getStorefront(slug)`, future: `getVendorById(id)`
  - `src/services/order.service.ts` — `createOrder(payload)`, future: `getOrder(id)`, `updateOrderStatus(id, status)`
  - `src/services/index.ts` — re-export all

- [ ] **Migrate existing API functions**
  - Move `getStorefront` from `src/lib/api.ts` → `src/services/storefront.service.ts`
  - Move `createOrder` from `src/lib/api.ts` → `src/services/order.service.ts`
  - Each service function uses the shared `request<T>()` client from `lib/api.ts`

- [ ] **Establish the service convention**
  - Each service file exports a namespaced object (e.g. `storefrontService.getStorefront(...)`)
  - Or named exports if the team prefers — pick one and document it

### Acceptance

- No domain-specific API calls remain in `src/lib/api.ts`
- Every service function returns a typed response from `src/types/`
- Hooks (Sprint 3) consume services, never `api.ts` directly

### Risks

- Import churn across hooks and components — run the build after each service migration

---

## Sprint 3 — Hooks Normalization

**Objective:** Make hooks consistent, correctly named, and cleanly wired to services.

### Tasks

- [ ] **Rename `useStore.ts` → `useStorefront.ts`**
  - File matches exported hook name
  - Update all imports across the codebase

- [ ] **Refactor hooks to consume services**
  - `useStorefront` calls `storefrontService.getStorefront(slug)`
  - `useCreateOrder` calls `orderService.createOrder(payload)`

- [ ] **Document the hook convention**
  - Query hooks: `useX` → `useQuery`
  - Mutation hooks: `useCreateX`, `useUpdateX`, `useDeleteX` → `useMutation`
  - Query keys: export constants from `src/hooks/queryKeys.ts` to avoid magic strings

### Acceptance

- Every hook file is named exactly after its primary exported hook
- No hook imports `src/lib/api.ts` directly — only services
- Query keys are centralized and typed

---

## Sprint 4 — Migration, Verification & Documentation

**Objective:** Ensure every existing page and component uses the new foundation, and document the conventions so future devs don't reinvent them.

### Tasks

- [ ] **Sweep existing consumers**
  - Update all component imports to use `@/types`, `@/services`, new hook paths
  - Grep for any remaining inline `fetch()` or `axios` calls outside `lib/api.ts` and migrate them

- [ ] **Build & smoke test every route**
  - `/`, `/about`, `/rider`, `/store/[slug]`, `/store/[slug]/order/[productId]`, `/order/success`
  - Verify data-fetching works, error states render, mutations succeed

- [ ] **Create `ARCHITECTURE.md`** at repo root
  - One-page diagram: `page → hook → service → request() → API`
  - Conventions for: types, services, hooks, query keys, error handling, env vars
  - "How to add a new endpoint" checklist for new devs

- [ ] **Create or update `CONTRIBUTING.md`**
  - Branch naming: `feat/*`, `fix/*`, `chore/*`
  - Commit message style (reference recent log)
  - PR requirements: passing build, no direct commits to `develop`

### Acceptance

- `pnpm build` (or equivalent) passes with zero errors
- Every route renders in dev without console errors
- `ARCHITECTURE.md` and `CONTRIBUTING.md` exist at repo root

---

## Commit Discipline (applies to every sprint)

Work on `develop` directly is a tradeoff for speed — to keep it safe:

- **Small logical commits**, not one giant foundation commit. Examples:
  - `chore: add src/types directory and extract domain interfaces`
  - `fix: wrap root layout with QueryClientProvider`
  - `refactor: move storefront API calls into services/storefront.service`
- **Push after each commit** — don't let work sit locally.
- **Run build after each commit** before pushing.
- If anything breaks production, revert the specific commit, not the whole sprint.

---

## Out of Scope

These are valuable but not part of this foundation pass — track separately:

- Authentication / token refresh flow
- Retry logic with exponential backoff
- Request cancellation / AbortController wiring
- E2E tests (Playwright / Cypress)
- Storybook for the atomic components
- Design-token / theme extraction from Tailwind utility soup

---

## Sprint Timeline (rough)

| Sprint | Estimated effort | Dependencies |
|--------|-----------------|---------------|
| Pre-work | 30 min | Team coordination |
| Sprint 1 | 1–2 hrs | None |
| Sprint 2 | 1 hr | Sprint 1 |
| Sprint 3 | 45 min | Sprint 2 |
| Sprint 4 | 1–2 hrs | Sprints 1–3 |

Total: roughly half a focused day of work.
