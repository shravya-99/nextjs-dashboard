# Copilot instructions — shravya-99/nextjs-dashboard

Generated from AGENTS.md — do not hand-edit. Regenerate with `npx @codeandtheory/sdp generate-rules`.

---

## General rules

**Spec gate:** No code changes without a governing, approved spec. Update the spec before diverging from it. A story's Tier 2 spec is the first commit on its feature branch.

**Documentation status contract:** Every doc declares owner, status, last-updated, review-by, and exactly one Diátaxis type (tutorial / how-to / reference / explanation).

**Pre-share quality gate:** Before committing spec/backlog artifacts — resolve all TBDs, confirm no secrets staged, stage only reviewed files.

**Traceability:** Full issue key in commits/PRs. Figma links must point to a specific frame/node, not a whole file. Confirm links resolve.

**Knowledge governance:** Single source of truth for every fact. Derive from the source system; don't copy-paste snapshots.

**Rule-parity via generation:** Only `AGENTS.md` is hand-edited. All adapter files are regenerated — never edited directly.

**Command-first instructions:** Use exact shell commands below, not prose descriptions.

**Compliance is machine-checkable:** Spec approved before diff opens; docs have four metadata fields; no TBD in staged spec files; generated files match source; timestamps are datetime not bare date.

---

## Discipline — App / product engineering

**Server-first rendering:** React Server Components by default. `"use client"` requires explicit justification — don't add it just to unblock a hook.

**Server Actions:** Mutations via Server Actions in `app/lib/actions.ts`. Zod validation at the action boundary before every database write.

**i18n:** All user-facing strings through the i18n layer — none hardcoded in JSX.

**Styling:** Tailwind utilities and `cn()` only. No ad-hoc hex values or magic numbers. No inline `style={{}}` for anything Tailwind covers.

**Auth boundary:** All `/dashboard` routes are protected by `proxy.ts` middleware. Bypassing protection requires a spec decision.

**Debug routes:** `app/query/route.ts` is a tutorial-only endpoint — do not extend; remove before production.

---

## Stack — TypeScript / Next.js (App Router)

**TypeScript:** Strict mode on. No `any` — use `unknown` and narrow.

**App Router:** Routes under `app/` only. UI in `app/ui/`. Library code in `app/lib/`. `lib/utils.ts` (root) is the `cn` helper only.

**Database:** PostgreSQL via `postgres` npm, raw SQL tagged templates, `POSTGRES_URL` env var (SSL required). Reads in `app/lib/data.ts`, mutations in `app/lib/actions.ts` only.

**Dependencies:** pnpm only — no `npm install` or `yarn add`.

**Secrets:** Never commit secret values. Reference by env var name. `.env` is gitignored.

---

## Build commands

```bash
pnpm run dev        # Dev server (Turbopack)
pnpm run build      # Production build
pnpm run start      # Production server
pnpm run lint       # ESLint
```

No test command configured. No CI pipeline configured.
