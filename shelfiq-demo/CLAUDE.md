# ShelfIQ Demo — Claude Code Instructions

You are building **ShelfIQ Demo MVP**, a c-store planogram demo for a real audience meeting in 1-2 weeks. Frontend-only Next.js app. No backend, no database, no auth.

This is a **demo build, not a production build.** The production architecture is documented separately in the `prod-kit/` reference folder — do not reach into it for code patterns. Demo conventions are different from production conventions: it's OK to skip tests for screens that work, OK to hardcode constants, OK to put a calculation in a component if it's used once. The bar is "the audience leaves wanting it", not "ready for paying customers."

---

## Always read first

1. `docs/demo-brief.md` — the narrative spec. What the audience sees, in what order. **This is the most important doc.** If you have to make a trade-off, optimize for the demo brief.
2. `docs/spec.md` — the technical contract. Stack, data shapes, state stores, formulas.
3. `docs/claude-code-prompts.md` — the session you're currently in, plus future sessions for context.

At the start of every session, paste a one-line confirmation that you've re-read these.

The wireframe lives at `docs/wireframe/`. It's visual reference only. Do not copy `.jsx` files into `apps/web/`; rewrite cleanly in TypeScript.

---

## Stack — single source of truth

Read `docs/spec.md §"Stack — final"` for the exact list. Summary:

- Next.js 14 App Router + TypeScript strict
- Tailwind + shadcn/ui + Lucide
- Zustand (state), Konva (canvas), Recharts (charts), Framer Motion (motion)
- Anthropic SDK for the agent — real LLM calls from a route handler
- No database, no auth, no backend service

If you find yourself wanting to add a major dependency not on this list, write a one-paragraph note in `docs/decisions/` and surface for review. The bar is high: demo time is short.

---

## Working style — demo edition

- **Optimize for the demo, not for code quality.** A 100-line component that works is better than a 30-line "elegant" one that has a subtle bug. The audience can't see your code.
- **Read `demo-brief.md` before every session.** The narrative is the spec; the spec serves the narrative.
- **Pause and summarize at the end of each numbered step.** Show: files changed, what works, screenshots if relevant, what's a TODO. Then wait for "continue."
- **When stuck, stub it.** If PSA import is broken, make the button toast "Imported successfully" and move on. The demo doesn't require it to work.
- **Performance matters more than correctness.** A 60fps canvas that shows the wrong heatmap color for 2 SKUs is fine. A 100% correct canvas that lags is not.
- **Console errors are P0.** Any error, warning, or unhandled rejection in the browser console breaks the demo. Zero tolerance.

---

## Critical invariants (don't break these)

1. **Every async action shows a toast within 100ms.** Demos can't have invisible state. Save → toast. Drag → toast. Apply → toast.
2. **No loading spinners during normal navigation.** Use Suspense boundaries with skeleton states, not spinners. Spinners feel slow even when they're not.
3. **Canvas state lives in Zustand, not component state.** React will re-render too aggressively otherwise.
4. **The AI agent never hallucinates SKU names or numbers.** The system prompt forbids it. If the model breaks this rule, tighten the prompt; don't paper over it client-side.
5. **The seed data tells the story.** Don't add data that contradicts the demo brief. Stella must be over-spaced. White Claw must be under-spaced.
6. **Every modal closes on Esc.** Every drag has a visible affordance. Every page loads in <1s on localhost.
7. **The demo URL params must work** (`?demo=create`, `?demo=analyze`, `?demo=agent`, `?demo=compare`). These are demo lifelines.

---

## What this is NOT

- Not multi-tenant
- Not authenticated
- Not persistent (state resets on page refresh; the new-plan modal can pre-populate via URL param)
- Not deployed (runs on `pnpm dev` localhost:3000)
- Not tested beyond manual demo walkthroughs
- Not internationalized
- Not accessible to WCAG AA (target: nothing visibly broken with keyboard nav; that's it)

If a request implies any of these, push back: "Demo build. Production architecture is in `prod-kit/`. Want me to scope this to demo polish instead?"

---

## Session map

| Session | Focus | Reference |
|---|---|---|
| 1 | Scaffold, seed data, app shell | `docs/claude-code-prompts.md §S1` |
| 2 | All non-editor screens | §S2 |
| 3 | Editor canvas (Konva) — Create & Analyze foundations | §S3 |
| 4 | What-if, Compare, heatmap polish | §S4 |
| 5 | AI agent (real LLM) + demo polish | §S5 |

Each session is one fresh Claude Code conversation. Don't compress.

---

## When in doubt

Ask: "Does this make the demo better?" If yes, do it. If no, skip it.
