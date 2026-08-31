```yaml
id: F-001
ref: FOUNDATION::NEXTJS-DASHBOARD::[001]
tier: 0
status: REVIEW
owner: "@shravya-99"
last_updated: 2026-08-31T00:00
```

# Foundation spec — nextjs-dashboard

## Purpose

A Next.js App Router learning/tutorial dashboard application built on the Vercel Next.js Learn Course template. Implements a fictional "Acme" company's financial dashboard with invoice management, customer listing, and an overview page with revenue and summary cards. The project is a learning project — not a production application — but the spec gate and architectural conventions apply from the point of introduction so that any future extension follows a disciplined process.

## Authorized Surface

This spec governs the entire `shravya-99/nextjs-dashboard` repository. It is a single-deliverable repo with no monorepo boundary to draw. The governed surface is:

**Routes and layouts**
- `app/page.tsx` — landing page (public)
- `app/layout.tsx` — root layout
- `app/login/page.tsx` — login page (public)
- `app/dashboard/layout.tsx` — dashboard shell layout (protected)
- `app/dashboard/(overview)/page.tsx` — dashboard overview (protected)
- `app/dashboard/(overview)/loading.tsx` — streaming skeleton
- `app/dashboard/invoices/page.tsx` — invoice list (protected)
- `app/dashboard/invoices/create/page.tsx` — create invoice (protected)
- `app/dashboard/invoices/[id]/edit/page.tsx` — edit invoice (protected)
- `app/dashboard/invoices/error.tsx` — invoice error boundary
- `app/dashboard/invoices/not-found.tsx` — invoice not-found boundary
- `app/dashboard/customers/page.tsx` — customer list (protected)

**Library**
- `app/lib/data.ts` — all database read functions
- `app/lib/actions.ts` — all Server Actions (mutations + authenticate)
- `app/lib/definitions.ts` — shared TypeScript type definitions
- `app/lib/utils.ts` — formatting utilities (`formatCurrency`, `generatePagination`)
- `app/lib/placeholder-data.ts` — seed data for database seeding

**UI components**
- `app/ui/dashboard/` — sidebar, nav links, cards, revenue chart, latest invoices, sign-out, switch
- `app/ui/invoices/` — create/edit forms, table, buttons, pagination, status badge, breadcrumbs
- `app/ui/customers/` — customer table
- `app/ui/login-form.tsx`, `app/ui/login/loginForm.tsx` — login form components
- `app/ui/button.tsx`, `app/ui/search.tsx`, `app/ui/skeletons.tsx`, `app/ui/acme-logo.tsx`, `app/ui/fonts.ts` — shared primitives

**Authentication**
- `auth.ts` — NextAuth configuration (credentials provider, `signIn`, `signOut`, `auth`)
- `auth.config.ts` — auth route rules and middleware callbacks
- `proxy.ts` — NextAuth middleware (route protection matcher)

**Shared utilities**
- `lib/utils.ts` — Tailwind class-merge helper (`cn`) — root level, separate from `app/lib/utils.ts`

**Debug (tutorial only)**
- `app/query/route.ts` — `GET /query` debug endpoint; not a production API

**Static assets**
- `public/` — hero images, customer avatars, favicon, opengraph image

**Configuration**
- `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.js`, `sdp.config.json`

**Out of scope for this spec:** `docs/`, `.github/`, `AGENTS.md` and adapters, `.env` — these are process/tooling artifacts, not application code governed by this foundation.

## Architectural Conventions

### Topology
Single Next.js App Router monolith. No monorepo tooling. One deployable artifact targeting Vercel.

### Rendering strategy
React Server Components (RSC) by default. Client Components (`"use client"`) are explicit, justified exceptions. Streaming via React Suspense with `loading.tsx` skeleton boundaries.

### Server Actions
All mutations go through Next.js Server Actions defined in `app/lib/actions.ts` (`"use server"`). All action inputs are validated at the boundary with Zod before any database write. Actions call `revalidatePath` after successful mutations and `redirect` to the relevant list page.

### Data access pattern
- All database reads: functions in `app/lib/data.ts` only — called from Server Components or Server Actions, never from Client Components or page files directly.
- All database writes: Server Actions in `app/lib/actions.ts` only.
- Database: PostgreSQL via the `postgres` npm package. All queries are raw SQL via tagged template literals (`sql\`...\``). No ORM. SSL required (`ssl: 'require'`). Connection established from `POSTGRES_URL` environment variable.

### Authentication
NextAuth v5 beta (`next-auth@5.0.0-beta.30`) with credentials provider. Password hashing via bcryptjs. Route protection via Next.js middleware (`proxy.ts`): all routes matching `/((?!api|_next/static|_next/image|.*\.png$).*)` are protected; unauthenticated requests to `/dashboard/*` redirect to `/login`; authenticated requests to `/` redirect to `/dashboard`.

### Styling
Tailwind CSS utility classes throughout. Class composition via `cn()` from `lib/utils.ts` (root). No ad-hoc hex values or magic numbers in component styles. No inline `style={{}}` for anything Tailwind covers.

### TypeScript
Strict mode on (`tsconfig.json`). Manual type definitions in `app/lib/definitions.ts` for all data models. No `any`.

### Package management
pnpm. `pnpm-lock.yaml` updated with every dependency change.

### i18n
No i18n library is currently configured. All user-facing strings are hardcoded in JSX (tutorial baseline). If an i18n library is introduced, all strings must be routed through it from the point of introduction — none hardcoded thereafter.

## Hard Boundaries

1. **No direct database access from UI components or page files.** Reads must go through `app/lib/data.ts`; writes through `app/lib/actions.ts`. A UI component that imports `postgres` directly is a violation.

2. **No secrets committed to the repo.** `POSTGRES_URL`, `AUTH_SECRET`, and any other secret values live in `.env` (gitignored). They are referenced by environment variable name in code and specs — never by value. `.env.example` documents required keys without values.

3. **No bypassing route protection without a spec decision.** Any route under `/dashboard` is automatically protected by `proxy.ts`. A route that deliberately bypasses protection requires an explicit spec decision — not a code comment.

4. **`app/query/route.ts` must not be extended.** It is a tutorial debug endpoint returning a hardcoded query (`amount = 666`). It must be removed before any production deployment.

5. **`deleteInvoice` stub must not be implemented without a governing spec.** `app/lib/actions.ts:121` throws intentionally as a tutorial placeholder. Implementation requires an approved Tier 2 story spec first.

6. **No PCI-scoped data in logs, specs, or agent-visible context.** This repo does not currently handle payment data — this boundary prevents it from growing into that territory without an explicit spec decision and security review.

7. **Generated adapter files (`CLAUDE.md`, `.cursor/rules/*.mdc`, `.github/copilot-instructions.md`) must not be hand-edited.** Regenerate from `AGENTS.md` via `npx @codeandtheory/sdp generate-rules`.

## Open Items

| Question | Status | Decision | Resolved |
|---|---|---|---|
| `sdp check` CI enforcement — no `.github/workflows/` exists; `sdp check` cannot be a required status check until a CI pipeline is configured. Tech lead to confirm whether a CI workflow will be added and when. | Open | | |
| Two `utils.ts` files — `lib/utils.ts` (root, `cn` helper) and `app/lib/utils.ts` (currency/pagination) are intentionally kept separate (confirmed by tech lead in project-brief sync). This boundary should be stated explicitly: `lib/utils.ts` is for Tailwind class composition only; all other utilities belong in `app/lib/utils.ts`. Confirm this is the intended permanent split. | Open | | |

## Status History

| Status | Timestamp | By | Note |
|---|---|---|---|
| `DRAFT` | 2026-08-31T00:00 | shravyap99 | Spec created — draft-tier0-spec install step |
