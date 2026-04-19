# Architecture

This document describes the shape of the frontend codebase so new contributors can add features without reinventing patterns.

## Data flow

```
┌──────────────┐        ┌────────┐        ┌───────────┐        ┌──────────────┐        ┌─────────┐
│  Page / UI   │ ─────▶ │  Hook  │ ─────▶ │  Service  │ ─────▶ │  request<T>  │ ─────▶ │  API    │
│  component   │        │        │        │           │        │  (lib/api)   │        │  server │
└──────────────┘        └────────┘        └───────────┘        └──────────────┘        └─────────┘
       ▲                    │                  │                      │
       │                    │                  │                      │
       │                    ▼                  ▼                      ▼
       │               ┌────────────────────────────────────────────────┐
       └───────────────┤  types: Vendor, Product, ApiError, etc.         │
                       └────────────────────────────────────────────────┘
```

Every API interaction flows through these four layers, in this order. A component never calls `fetch` directly, a hook never constructs a URL, a service never knows React Query exists. Each layer has exactly one job.

## Directory map

```
src/
├── app/               Next.js App Router routes and layouts
│   ├── layout.tsx     Root layout — wraps the tree with <Providers>
│   ├── providers.tsx  QueryClientProvider (and future global providers)
│   ├── about/
│   ├── order/
│   ├── rider/
│   └── store/
│
├── components/        UI components (atomic design)
│   ├── atoms/         Smallest building blocks (Text, Card, icons)
│   ├── molecules/     Composed atoms (form fields, cards with content)
│   ├── organisms/     Feature blocks (Header, ProductList)
│   └── templates/     Page-level compositions
│
├── hooks/             React Query hooks and query-key constants
│   ├── index.ts       Barrel export — consumers import from "@/hooks"
│   ├── queryKeys.ts   Centralized, typed query keys
│   ├── useStorefront.ts
│   └── useCreateOrder.ts
│
├── services/          Domain-oriented API functions
│   ├── index.ts       Barrel export — consumers import from "@/services"
│   ├── storefront.service.ts
│   └── order.service.ts
│
├── lib/               Transport & generic utilities (no domain logic)
│   ├── api.ts         request<T>(), ApiError, API_URL, env validation
│   └── utilities.ts
│
└── types/             Shared type definitions
    ├── index.ts       Barrel — consumers import from "@/types"
    ├── vendor.ts
    ├── product.ts
    ├── storefront.ts
    └── order.ts
```

## Layer responsibilities

### `lib/api.ts` — Transport
- Owns the `fetch` call and URL construction.
- Resolves `NEXT_PUBLIC_API_URL` (throws in production if unset).
- Exposes `request<T>(path, options)` which unwraps the backend's `{ success, data, message, errors }` envelope.
- Exposes `ApiError`, which carries `status`, `fieldErrors`, and the raw body for consumers that need to react to specific error shapes.

**No file outside `lib/` should ever call `fetch` directly.** Add transport-level concerns (auth token headers, retries, cancellation) here.

### `services/` — Domain API functions
- One file per domain (`storefront.service.ts`, `order.service.ts`, future: `auth.service.ts`, `vendor.service.ts`).
- Each function takes typed input, returns a typed `Promise<T>`, and calls `request<T>()`.
- No React, no hooks, no UI concerns — a service function could be called from a test or a Node script.

### `hooks/` — React Query integration
- Wraps service functions in `useQuery` or `useMutation`.
- Query hooks (`useStorefront`) read data; their keys come from `queryKeys` (never magic strings).
- Mutation hooks (`useCreateOrder`) take `<Response, ApiError, Payload>` generics so components catch typed errors.
- Each hook file is named exactly after its primary exported hook.

### `types/` — Shape definitions
- Single source of truth for every domain interface.
- Cross-reference against `recommend-be` (backend) — when backend changes a field, update here first, then compile errors guide the rest of the migration.

### `app/` — Routes
- Pages import from `@/hooks`, `@/services` (rarely), and `@/types`.
- Never import from `@/lib/api` directly — that would couple UI to the transport layer.

## Adding a new endpoint — checklist

Say the backend adds `GET /vendors/:id` returning a `Vendor`.

1. **Types** — add or update the shape in `src/types/vendor.ts`. Re-export from `src/types/index.ts` if new.
2. **Service** — add the function in the matching domain service:
   ```ts
   // src/services/vendor.service.ts
   import { request } from "@/lib/api";
   import type { Vendor } from "@/types";

   export async function getVendorById(id: string): Promise<Vendor> {
     return request<Vendor>(`/vendors/${id}`);
   }
   ```
   Add the new file to `src/services/index.ts`.
3. **Query key** — add to `src/hooks/queryKeys.ts`:
   ```ts
   export const queryKeys = {
     storefront: (slug: string) => ["storefront", slug] as const,
     vendor: (id: string) => ["vendor", id] as const,
   } as const;
   ```
4. **Hook** — create the React Query hook, named after the data it returns:
   ```ts
   // src/hooks/useVendor.ts
   "use client";
   import { useQuery } from "@tanstack/react-query";
   import { getVendorById } from "@/services";
   import type { Vendor } from "@/types";
   import { queryKeys } from "./queryKeys";

   export function useVendor(id: string) {
     return useQuery<Vendor>({
       queryKey: queryKeys.vendor(id),
       queryFn: () => getVendorById(id),
       enabled: !!id,
     });
   }
   ```
   Add to `src/hooks/index.ts`.
5. **Consume** — pages import from the barrel:
   ```ts
   import { useVendor } from "@/hooks";
   ```

If you skip a layer — e.g. call `request()` directly from a page — stop and route it through the service layer. The point of the structure is consistency.

## Error handling

All thrown errors from the API layer are `ApiError` instances with:

- `status: number` — HTTP status (0 for network failures)
- `fieldErrors?: { field, message }[]` — validation errors from the backend
- `raw?: unknown` — original response body

Pages and hooks should treat errors with `instanceof ApiError` checks when they need to distinguish validation errors from 5xx failures. Top-level React Query error UI is fine for the generic case.

## Environment variables

- `NEXT_PUBLIC_API_URL` — required in production. Falls back to staging in development. Module load fails loudly if missing in production — do not silently deploy pointing at staging.

## What does NOT belong in this repo

- Business-logic decisions the backend owns (order pricing, payment flow, vendor status rules) — the frontend reflects backend truth.
- Types copied from the backend instead of defined against the response shape. If a field can be null from the API, type it as nullable here.
- Inline `fetch` calls in components, ad-hoc axios instances, or hand-written URL strings outside `src/lib/api.ts` and `src/services/*`.
