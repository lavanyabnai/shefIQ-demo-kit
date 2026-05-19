# ShelfIQ Demo MVP

**A 1-2 week build of a c-store planogram demo that lands.**

Three user journeys — Create, Analyze, AI agent — designed to be shown to a real audience (c-store ops VP, category management director, DACH retail partner) in about 10 minutes.

---

## What's in this kit

| File | Purpose |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Repo-level Claude Code instructions, demo edition |
| [`docs/bootstrap.md`](docs/bootstrap.md) | **Start here.** Session 0 setup before Session 1. |
| [`docs/demo-brief.md`](docs/demo-brief.md) | **The most important doc.** What the audience sees, beat by beat, in three journeys. |
| [`docs/spec.md`](docs/spec.md) | Technical contract — stack, data shapes, state, formulas, fallbacks |
| [`docs/claude-code-prompts.md`](docs/claude-code-prompts.md) | 5 session prompts for Claude Code |
| [`docs/wireframe/`](docs/wireframe/) | Visual reference — open `ShelfIQ.html` |

---

## What this kit is NOT

This is **not** the production architecture. The production kit is in `prod-kit/` if you have it.

| | This (Demo) | Production kit |
|---|---|---|
| Frontend | Next.js | Next.js |
| Backend | None | FastAPI + Postgres |
| Auth | None | SSO/SAML |
| State | In-memory | Multi-tenant DB |
| AI Agent | Real LLM, faked tools | Real LLM with real tool use |
| Sessions | 5, ~1-2 weeks | 7, ~10 weeks |
| Goal | Land the demo | Ship to paying customers |

If the audience asks about anything in the right column, the honest answer is "yes, that's in the production architecture; this demo focuses on the user journey." Pre-baked answers are in `docs/demo-brief.md §"What we explicitly skip"`.

---

## The three journeys

```
┌──────────────────────────────────────────────────────────────────┐
│  Journey 1 — Create (≈3 min)                                     │
│  Maria authors the new Q2 Energy Drinks planogram from scratch.  │
│  Drag-and-drop on a Konva canvas, real interactions.             │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Journey 2 — Analyze (≈3 min)                                    │
│  Maria opens an existing Beer Cooler v4.1, finds Stella waste    │
│  via Space-to-Sales heatmap, runs what-if, compares v4.1 → v4.2. │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Journey 3 — AI Agent (≈3 min)                                   │
│  Maria asks the agent to optimize for the Urban Premium cluster. │
│  Real streaming LLM, faked tool calls, recommendation card with  │
│  one-click apply.                                                │
└──────────────────────────────────────────────────────────────────┘
```

Each journey is 3 minutes of demo time. Read `docs/demo-brief.md` for the full beat-by-beat narrative.

---

## Timeline

```
Day 1        ████ Bootstrap + Session 1 (scaffold)
Day 2-3      ████████ Session 2 (non-editor screens)
Day 4-7      ████████████████ Session 3 (editor canvas, the big one)
Day 8-9      ████████ Session 4 (what-if + compare)
Day 10-11    ████████ Session 5 (AI agent + polish)
Day 12       ████ Dry run #1 (alone)
Day 13       ████ Dry run #2 (with a colleague)
Day 14       ██   Demo
```

If you have less time, cut from Session 2 (some screens can stay as empty states) and Session 5 (use scripted fallback responses). **Do not cut Session 3.** The editor canvas is what makes the demo memorable.

---

## Stack at a glance

```
┌─────────────────────────────────────────────────────┐
│  Next.js 14 App Router + TypeScript                 │
│  ┌────────────────┬────────────────┬─────────────┐ │
│  │ Tailwind +     │ Zustand        │ Konva       │ │
│  │ shadcn/ui +    │ (canvas,       │ (drag-      │ │
│  │ Lucide         │  agent,        │  to-place)  │ │
│  │                │  what-if)      │             │ │
│  └────────────────┴────────────────┴─────────────┘ │
│  ┌─────────────────────────────────────────────┐  │
│  │ app/api/agent/route.ts                       │  │
│  │ Anthropic SDK → claude-sonnet-4-5 streaming  │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

No database. No auth. No backend service. State in-memory + Zustand.
```

---

## Where to start

```bash
cat docs/bootstrap.md
```

Then follow it. End of README.
