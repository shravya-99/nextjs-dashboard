# Spec alignment config

- Repo: shravya-99/nextjs-dashboard
- Default branch (git-level): main
- Jira project key: none — no Jira board for this repo
- Operational Config: none — no Sanity match found (connected Sanity account is personal, not the C&T org instance)
- Operational Config dataset: n/a
- Tech lead git ID: @shravya-99
- Tech lead email: shravya.p@codeandtheory.com
- Spec-alignment branch: spec-alignment
- Archive: none
- Docs layout: docs/specs/ (consolidated)
- GitHub repo-shape configuration: Not applied — existing repo, left to the tech lead
- GitHub repo-shape configuration notes: Engineer was warned that changing branch protection, labels, or secret-scanning on an active repo risks disrupting existing conventions. No `develop` branch exists; engineer chose to branch `spec-alignment` from `main` directly rather than creating `develop`. The `sdp check` required status check is deferred until `scaffold-agents-md` sets up CI. Merge queue is always a manual tech-lead follow-up.

## Project context

- Project status: Existing
- Deliverables: nextjs-dashboard (F-001-NEXTJS-DASHBOARD)
- Operational Config lookup: None found for the name given — connected Sanity account is personal (projects: Frontend Flow, Day One Content Operations, tickets, Feedback Processor); no C&T org operationalConfig instance accessible.
- Tech configuration: Next.js (TypeScript), Tailwind CSS, Auth.js (next-auth), pnpm; source dirs: app/, lib/; Next.js App Router dashboard application with authentication.
- Planned structure: app/ (Next.js App Router pages and layouts), lib/ (utilities, data access), public/ (static assets). Single-app repo, no monorepo tooling.
- Source: the engineer (no Sanity match)

## Step status

| Step | Artifact | Status | PR |
|---|---|---|---|
| project-research | docs/specs/spec-alignment/project-brief.md | DONE | https://github.com/shravya-99/nextjs-dashboard/pull/2 |
| scaffold-agents-md | AGENTS.md + adapters | DONE | https://github.com/shravya-99/nextjs-dashboard/pull/3 |
| draft-tier0-spec | Tier 0 spec(s) under deliverables/ | REVIEW | https://github.com/shravya-99/nextjs-dashboard/pull/4 |
| draft-tier1-specs | Tier 1 epics under deliverables/ | DRAFT | — |
