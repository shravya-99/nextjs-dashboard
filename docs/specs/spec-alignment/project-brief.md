# Project brief — shravya-99/nextjs-dashboard

**Produced by:** shravyap99 (spec-alignment install, 2026-08-31)
**Status:** DRAFT — pending tech-lead sync

---

## 1. Architecture summary

Single Next.js App Router monolith. No monorepo tooling. One `package.json`, one `pnpm-lock.yaml` at root.

Top-level layout:
```
app/                  — Next.js App Router: pages, layouts, UI components, server actions, data layer
  dashboard/          — Protected dashboard area (invoices, customers, overview)
  login/              — Auth login page
  query/              — Debug API route
  lib/                — Data access, server actions, types, utilities
  ui/                 — UI components (dashboard, invoices, customers, shared)
auth.ts               — NextAuth configuration (credentials provider)
auth.config.ts        — Auth route rules and middleware callbacks
proxy.ts              — NextAuth middleware (route protection)
lib/utils.ts          — Root-level shared utility (cn helper for class merging)
public/               — Static assets (hero images, customer avatars, favicon)
```

This repo is built on the Next.js Learn Course starter template ("Acme" fictional dashboard). It appears to be an extension of that tutorial codebase.

---

## 2. Client/server architecture

- **Topology:** Monolith — Next.js App Router handles both rendering and server-side logic in a single deployable. No separate backend service.
- **Client:** `app/ui/` React components (mix of Server Components and Client Components, distinguished by `"use client"` directive). Entry pages under `app/`.
- **Server:** Same `app/` directory — React Server Components, Server Actions (`app/lib/actions.ts` with `"use server"`), and one API Route Handler (`app/query/route.ts`). No standalone server process.
- **Communication contract:** No explicit client/server API contract. Communication between client components and the server happens exclusively through Next.js Server Actions (form submissions) and RSC data fetching. The one REST-like endpoint (`GET /query`) is a debug utility, not a production API. No OpenAPI spec, GraphQL schema, or proto files.
- **Data layer:** PostgreSQL, accessed directly via the `postgres` npm package. Connection string from `POSTGRES_URL` environment variable (SSL required). Only server-side code (Server Components, Server Actions, API routes) can access the database — no ORM; queries are raw SQL via tagged template literals.
- **Deployment topology:** Single Next.js artifact. Vercel deployment is implied (remote branch `vercel/react-server-components-cve-vu-gdvobc` exists on origin; `next start` in `package.json`).

---

## 3. Function & module map

| Module/package | Responsibility | Key entry points | Client/server/shared | Size signal |
|---|---|---|---|---|
| `app/` (routes & layouts) | Route definitions, root layout, landing page | `app/page.tsx`, `app/layout.tsx`, `app/dashboard/layout.tsx` | Server | ~4 files |
| `app/dashboard/(overview)/` | Dashboard home: revenue chart, cards, latest invoices | `page.tsx`, `loading.tsx` | Server | ~2 files |
| `app/dashboard/invoices/` | Invoice CRUD — list (paginated+filtered), create, edit | `page.tsx`, `create/page.tsx`, `[id]/edit/page.tsx`, `error.tsx`, `not-found.tsx` | Server/Client | ~5 files |
| `app/dashboard/customers/` | Customer listing with invoice totals | `page.tsx` | Server | ~1 file |
| `app/login/` | Login page | `page.tsx` | Server/Client | ~2 files (+ `app/ui/login/loginForm.tsx`) |
| `app/lib/data.ts` | All database read functions (8 queries: revenue, invoices, customers, cards) | `fetchRevenue`, `fetchLatestInvoices`, `fetchCardData`, `fetchFilteredInvoices`, `fetchInvoicesPages`, `fetchInvoiceById`, `fetchCustomers`, `fetchFilteredCustomers` | Server | ~1 file |
| `app/lib/actions.ts` | Server Actions for mutations + auth | `createInvoice`, `updateInvoice`, `deleteInvoice` (throws — placeholder), `authenticate` | Server | ~1 file |
| `app/lib/definitions.ts` | TypeScript type definitions for all data models | Type exports: `User`, `Customer`, `Invoice`, `Revenue`, `InvoicesTable`, `CustomersTableType`, etc. | Shared | ~1 file |
| `app/lib/utils.ts` | Formatting utilities | `formatCurrency`, `generatePagination` | Shared | ~1 file |
| `app/lib/placeholder-data.ts` | Seed data for DB seeding | — | Shared | ~1 file |
| `app/ui/dashboard/` | Dashboard widgets: sidebar, cards, revenue chart, latest invoices, nav links, sign-out | `sidenav.tsx`, `cards.tsx`, `revenue-chart.tsx`, `latest-invoices.tsx`, `nav-links.tsx`, `signOut.tsx`, `switch.tsx` | Client/Server mix | ~7 files |
| `app/ui/invoices/` | Invoice form/table/pagination components | `create-form.tsx`, `edit-form.tsx`, `table.tsx`, `buttons.tsx`, `pagination.tsx`, `status.tsx`, `breadcrumbs.tsx` | Client/Server mix | ~7 files |
| `app/ui/customers/` | Customer table component | `table.tsx` | Server | ~1 file |
| `app/ui/` (shared) | Shared primitives: button, search, skeletons, login form, logo, fonts | `button.tsx`, `search.tsx`, `skeletons.tsx`, `login-form.tsx`, `acme-logo.tsx`, `fonts.ts` | Client/shared | ~6 files |
| `auth.ts` + `auth.config.ts` + `proxy.ts` | Authentication: NextAuth credentials provider, middleware route protection | `auth` (session), `signIn`, `signOut`; middleware matcher covers all non-static routes | Server | ~3 files |
| `app/query/route.ts` | Debug API route — returns invoices with amount=666 | `GET /query` | Server | ~1 file |
| `lib/utils.ts` (root) | Tailwind class-merge helper (`cn`) | `cn()` | Shared | ~1 file — distinct from `app/lib/utils.ts` |

---

## 4. Documentation found

- **`README.md`** — Minimal; describes this as the Next.js App Router Learn Course starter template. No architectural or operational detail.
- **`docs/`** — Created by `initialize-spec-alignment` (this install). No pre-existing docs.
- **No existing rule files** — no `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.github/copilot-instructions.md`. `scaffold-agents-md` will create from scratch (no merge needed).

---

## 5. Stack detected

**Manifest:** `package.json` (Node.js ecosystem, managed by pnpm)

| Layer | Technology |
|---|---|
| Framework | Next.js (latest, App Router), React 19 |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 3.4, @tailwindcss/forms, tailwind-merge, clsx, class-variance-authority, tailwindcss-animate |
| Auth | next-auth 5.0.0-beta.30 (Auth.js), bcryptjs |
| Database | PostgreSQL via `postgres` npm (raw SQL) |
| Validation | Zod |
| Icons | Heroicons, Lucide React |
| UI primitives | Radix UI (@radix-ui/react-slot) |
| Performance | use-debounce |
| Testing | Vitest (installed, no tests or test script configured) |
| Storybook | @storybook/nextjs-vite (installed, no stories found) |
| Linting | ESLint 9 + eslint-config-next |
| Package manager | pnpm |

**Stack module for `scaffold-agents-md`:** Next.js App Router (TypeScript, Tailwind, pnpm, PostgreSQL, Server Actions, next-auth)

---

## 6. Candidate epics (unconfirmed)

Commit history is thin — 6 commits total, with one large catch-all commit (`c3ffcfb "updated code"`) containing nearly all the application code. Candidate epics are derived from logical groupings within that commit, not from distinct initiative waves. The tech-lead sync should confirm these boundaries.

| Candidate epic | Evidence | Modules touched (section 3) |
|---|---|---|
| **Authentication & route protection** | `c3ffcfb` (auth.ts, auth.config.ts, proxy.ts, login pages); `ac8bc8d` (login page/form refinements) | `auth.ts`+`auth.config.ts`+`proxy.ts`, `app/login/`, `app/ui/login/`, `app/lib/actions.ts` (`authenticate`) |
| **Invoice management (CRUD)** | `c3ffcfb` (all invoice pages, forms, server actions, data queries) | `app/dashboard/invoices/`, `app/ui/invoices/`, `app/lib/data.ts` (invoice queries), `app/lib/actions.ts` (create/update/delete) |
| **Dashboard overview** | `c3ffcfb` (overview page, cards, revenue chart, latest invoices, sidebar) | `app/dashboard/(overview)/`, `app/ui/dashboard/` |
| **Customer management** | `c3ffcfb` (customers page and table) | `app/dashboard/customers/`, `app/ui/customers/` |
| **Build & dependency maintenance** | `edbf524` (React Server Components CVE fix); `72ea5c4` (Next.js upgrade for build failure) | `package.json`, `pnpm-lock.yaml` |

---

## 7. CI/build commands

**No CI configured.** No `.github/workflows/` directory exists.

Commands available from `package.json` (all run via pnpm):

```bash
pnpm run build     # Production build (next build)
pnpm run dev       # Dev server with Turbopack (next dev --turbopack)
pnpm run start     # Production server (next start)
pnpm run lint      # ESLint (eslint .)
```

**No test script configured.** Vitest is installed as a dependency but there are no test files and no `test` script in `package.json`.

---

## 8. Open questions for the tech-lead sync

1. **Project intent — tutorial vs. real application:** This repo is built on the Next.js Learn Course template. Is this intended to remain a tutorial/learning project, or is it being extended into a real production application? The answer significantly affects what a Tier 0 foundation spec should say about authorized scope and hard boundaries.

2. **`deleteInvoice` action is a known broken placeholder:** `app/lib/actions.ts:121` throws `new Error("Failed to Delete Invoice")` unconditionally with unreachable code below it. Is this an intentional tutorial exercise stub that should be completed, or is delete functionality out of scope?

3. **Debug route `/query`:** `app/query/route.ts` is a hardcoded debug query returning invoices with `amount = 666`. Is this route safe to leave in place, or should it be removed/restricted before any production use?

4. **Test strategy:** Vitest is installed but no tests exist and no test script is configured. Is a test suite planned? If so, what should the scope be (unit, integration, e2e)?

5. **Storybook:** `@storybook/nextjs-vite` is installed but no story files exist. Is a Storybook workflow planned for the UI component library?

6. **Two `utils.ts` files:** `lib/utils.ts` at the repo root (Tailwind `cn` helper) and `app/lib/utils.ts` (currency formatting, pagination). Are these intended as separate concerns, or should they be consolidated?

7. **GitHub repo-shape configuration:** `alignment-config.md` records this as "Not applied — existing repo, left to the tech lead." Per `github-config-reference.md` sections 2/3/6/8, the following are not yet configured: `delete_branch_on_merge`, basic branch protection on `main` (PR required, no force-push), SDP PR labels, and secret scanning/push protection. Should any of these be applied now, deferred, or handled manually outside this process?

8. **`develop` branch:** No `develop` branch exists. The engineer chose to branch `spec-alignment` from `main` directly. Should `develop` be created as the ongoing feature working branch, or will `main` serve as the integration branch for this project?

---

## 9. Project context (Sanity)

n/a — no Sanity `operationalConfig` matched for this project. The connected Sanity account is personal (projects: Frontend Flow, Day One Content Operations, tickets, Feedback Processor) — the C&T org Sanity instance was not accessible in this session.

---

## Open questions & decisions

| Question | Status | Decision | Resolved |
|---|---|---|---|
| Project intent (tutorial vs. production) | Open | | |
| `deleteInvoice` placeholder | Open | | |
| Debug `/query` route | Open | | |
| Test strategy | Open | | |
| Storybook workflow | Open | | |
| Two `utils.ts` files | Open | | |
| GitHub repo-shape configuration | Open | | |
| `develop` branch | Open | | |
