# Specs — shravya-99/nextjs-dashboard

This tree holds every spec and spec-process artifact for this repo.

## Layout

Every spec tier uses the same scannable `{id}-{slug}` folder pattern with a
fixed inner filename per tier.

| Tier | Slug in folder name | Example |
|------|---------------------|---------|
| Foundation | Machine `ref` segment (deliverable) | `F-001-NEXTJS-DASHBOARD` |
| Epic | Short epic-only suffix | `E-001-AUTH-FLOW` |
| Story | `{sequence}-{SHORT-STORY-SLUG}` (folder) | `S-01-LOGIN-PAGE` |

There are **no** typed parent folders (`epics/`, `stories/`).

```
docs/specs/
├── README.md
├── spec-alignment/
│   ├── alignment-config.md
│   └── project-brief.md
├── templates/
└── deliverables/
    └── F-<NNN>-<foundation-slug>/
        ├── foundation.md
        └── E-<NNN>-<SHORT-EPIC-SLUG>/
            ├── epic.md
            └── S-<NN>-<SHORT-STORY-SLUG>/
                └── story.md
```

Authoritative schema: [`references/spec-structure-reference.md`](../../references/spec-structure-reference.md).
