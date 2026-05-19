# ShelfIQ Demo — Claude Code Session Prompts

Five sessions, each a fresh Claude Code conversation. Paste the prompt block (everything inside the triple-backticks) as your first message in each session. The model will stop between numbered steps so you can review.

**Pacing for the 1-2 week timeline:**

| Session | Wall time | Calendar |
|---|---|---|
| 1 — Scaffold + seed data + design system | half-day | Day 1 |
| 2 — Dashboard + Planograms list + Stores + Products + Fixtures + Reports | 1-2 days | Day 2-3 |
| 3 — Editor canvas (Konva) with create + analyze flows | 3-4 days | Day 4-7 |
| 4 — What-if simulator + Compare + heatmaps | 2 days | Day 8-9 |
| 5 — AI agent (real LLM) + demo polish + URL params | 2 days | Day 10-11 |

Buffer: Day 12-14 for the dry-run, fixes, and the actual demo.

---

## Session 1 — Scaffold, seed data, design system

```
You are building ShelfIQ, a c-store planogram demo MVP. Frontend-only Next.js
app, no backend, in-memory state. The demo audience is a c-store ops VP.

Read first (all in docs/):
- demo-brief.md   — what the demo shows (the why)
- spec.md         — technical contract (the what)
- wireframe/      — visual reference (run python3 -m http.server in this
                    folder and open ShelfIQ.html for live reference). Do not
                    copy .jsx files; rewrite cleanly in TypeScript.

Output a 1-line confirmation that you've read all three before step 1.

Sequence:

1. Initialize the Next.js 14 project at apps/web/ (App Router, TypeScript
   strict, Tailwind, ESLint, src/ layout). Install: zustand, konva,
   react-konva, recharts, framer-motion, react-hook-form, zod,
   @anthropic-ai/sdk, lucide-react. Install shadcn/ui and add: button,
   dialog, sheet, tabs, popover, toast, dropdown-menu, input, select,
   checkbox, badge, tooltip, scroll-area, separator, avatar.

   Configure Tailwind with the design tokens from spec.md: teal-700 primary,
   slate scale for surfaces, a 'brand' palette. Set up CSS variables for
   light/dark theme.

   Verify: pnpm dev runs on :3000 and shows the default Next.js page without
   errors.

2. Create the lib/types.ts file with all TypeScript interfaces from
   spec.md §"Data shapes". Export everything. No implementation yet.

3. Create lib/seed/ with these JSON files. Author the data carefully — the
   numbers must support the demo narrative.

   - products.json — 24 SKUs per spec. Each product needs realistic
     unitsPerWeek and retailPrice such that Stella Artois 12-pack appears
     OVER-spaced (high facings, low sales share) and White Claw Variety
     appears UNDER-spaced (low facings, high velocity). This calibration is
     what makes the Analyze journey work.
   - fixtures.json — 8 fixtures per spec.
   - stores.json — 6 stores per spec.
   - plans/beer-v41.json — the live Beer Cooler plan, 25 positions across 5
     doors, Stella at 4 facings on Door 5, White Claw at 3 facings on Door 4.
   - plans/energy-q2-draft.json — empty 3-door energy cooler.
   - plans/salty-v3.json and plans/roller-v2.json — minimal valid plans for
     list-screen window dressing.
   - users.json — 3 users with avatar URLs (use pravatar.cc or
     gravatar-style placeholders).
   - dashboard.json — KPI values, 8-week reset calendar events, 6 activity
     feed entries, top-categories chart data, compliance heatmap data
     (6 stores × 6 categories grid).

   Audit your numbers by running the space-to-sales formula from spec.md by
   hand on 3 SKUs and showing me the math. If the calibration doesn't make
   Stella red and White Claw green, fix the numbers.

4. Build the app shell:
   - apps/web/src/app/layout.tsx — root layout with the Toaster, theme
     provider, font setup (Inter)
   - apps/web/src/components/shell/Sidebar.tsx — 8 nav items per the
     wireframe, BlueNorth wordmark at top, user pill at bottom
   - apps/web/src/components/shell/Topbar.tsx — global search input
     (non-functional placeholder), banner selector, theme toggle (real),
     notification bell with badge, avatar
   - apps/web/src/components/shell/CommandPalette.tsx — Cmd/Ctrl+K opens
     a Dialog with a search input and 10 hardcoded actions

5. Make /dashboard show a tasteful skeleton: the date header, the welcome
   line ("Good afternoon, Maria"), and 4 empty KPI tile placeholders.
   Sidebar nav works (Planograms etc. show a "Coming soon" empty state).
   Light/dark theme toggle works. Cmd+K opens the palette.

Stop after step 5. Confirm: pnpm dev shows the empty dashboard with working
sidebar, topbar, theme toggle, and command palette. Take a screenshot.
```

---

## Session 2 — All non-editor screens

```
Continuing the ShelfIQ demo build. Re-read docs/demo-brief.md and docs/spec.md.
This session builds every screen except the editor and the compare view.

Sequence:

1. Implement /dashboard fully:
   - 4 KPI tiles from dashboard.json with delta indicators
   - 8-week reset calendar: horizontal scroll, dated columns, colored event
     pills, hover tooltips. Use a simple flex layout, no calendar library.
   - Activity feed: list of 6 entries with avatar + action + timestamp
   - "Top categories by sales/linear ft" — Recharts horizontal bar chart
   - Compliance heatmap — 6×6 grid of colored cells (green/yellow/red)
     with store labels on rows, category labels on columns, hover for value

   Acceptance: every element from screenshots/01-dashboard.png is present
   and the layout matches. Use the actual seed data; no placeholders.

2. Implement /planograms:
   - Filter bar at top: banner select, cluster select, status select,
     category select, search input. Filters are AND-combined.
   - Table with: name, version, category, banner, cluster, status pill,
     effective date, last modified, owner avatar
   - Click row → router.push(`/planograms/${id}`) (editor doesn't exist
     yet — leave as a stub page that shows "Editor will load here for
     {id}")
   - "New planogram" button top right → opens the modal from step 3

3. New-planogram modal:
   - Triggered from /planograms button OR /dashboard "New planogram" button
   - Step 1: pick a fixture template (grid of 8 cards from fixtures.json,
     selectable)
   - Step 2: name + category + banner + cluster (react-hook-form + zod)
   - Submit: creates a new Plan in canvasStore, navigates to editor
     (still a stub for now)

4. Implement /stores:
   - Top-right toggle: Map ↔ Table
   - Map view: SVG of the contiguous US (use a simple stylized outline,
     not a real basemap; coordinates from the wireframe). Place 6 pins
     colored by cluster. Click a pin: side panel slides in with store
     details, compliance %, banner, format, sqft.
   - Table view: sortable columns, search input, banner/region filters
   - Both views read from stores.json

5. Implement /products:
   - Search input + category filter + vendor filter
   - Card grid (3 cols on lg, 2 on md, 1 on sm): swatch color band on top,
     name, vendor, dimensions, retail price, "Used in N planograms" badge
   - Click card: side sheet with full product details

6. Implement /fixtures:
   - Grid of 8 fixture cards
   - Each shows: name, type icon, dimensions, type-specific attributes
     (doors/shelves/slots), "Used in N planograms" stat
   - No click action; pure showcase

7. Implement /reports:
   - 8 report cards in a grid: Space-to-Sales Index, Compliance Trend,
     Reset Velocity, Category Performance, Daypart Mix, Vendor Scorecard,
     Cluster Comparison, OOS Risk
   - Click any card → modal opens with a sample Recharts chart (use
     different chart types per report: bar, line, donut, stacked, scatter)
   - Modal has "Export PDF" and "Export CSV" buttons. Export PDF
     downloads /public/samples/store-pack.pdf (you need to create this
     file: a tasteful 4-page PDF with "ShelfIQ Sample Report" branding).
     For the PDF, use any text content; it's just a prop.

Stop after step 7. Verify: every screen except the editor and compare is
fully functional. The "Coming soon" states are gone except for /clusters
and /settings. Walk through every page and confirm no console errors.
```

---

## Session 3 — Editor canvas (THE BIG ONE)

```
Continuing the ShelfIQ demo build. Re-read docs/demo-brief.md (especially
Journey 1 and Journey 2) and docs/spec.md (especially the canvas state
and data shapes sections). Also re-read docs/wireframe/components/editor.jsx
for visual structure — but rewrite cleanly in TypeScript.

This session is the hardest one. Plan to spend 3-4 days. Do not rush.

Sequence:

1. Implement the canvasStore (Zustand) per spec.md exactly. Include the
   undo/redo stack with a 20-step limit. Pure functions for state
   transitions; document each action's invariants in a comment.

2. Build the editor route /planograms/[id]/page.tsx with the three-pane
   layout:
   - Left rail (280px): Product Library
   - Center: canvas toolbar + Konva Stage
   - Right rail (320px): tabs for Properties / Rules / Analytics / AI Agent

   No interactivity yet. Just load a plan from seed and render the
   structure. Use CSS grid for the three-pane layout, sticky positioning
   for the toolbar.

3. Build the canvas Stage for the cold-vault fixture type:
   - Fixture frame: SVG-style rectangle drawn in Konva
   - Glass doors: gradient fill + door mullion lines
   - Shelves: horizontal lines per door
   - Temperature pills above each door
   - Inch-marked ruler at top
   - Render existing positions from the plan as colored rectangles with
     facing labels

   Test by loading beer-v41 — verify all 25 positions render in their
   correct slots. Pan with right-click-drag, zoom with scroll wheel.
   Performance target: 60fps pan/zoom.

4. Build the Product Library panel:
   - Searchable list grouped by category (collapsible groups)
   - Each product as a draggable tile with swatch color, name, UPC, size,
     "recommended N facings" hint
   - Make tiles draggable using Konva's drag system — when drag starts,
     set draggedProductId in canvasStore

5. Implement drag-to-place:
   - When a product is being dragged from the library and the pointer
     enters the canvas, show snap-guides: highlight the nearest empty
     shelf slot in teal
   - On drop, call canvasStore.placeProduct(productId, door, shelf, slot,
     defaultFacings)
   - Show a toast: "Red Bull placed on Door 1, Shelf 1"
   - The placed Position renders immediately

6. Implement selection and the Properties panel:
   - Click a Position on the canvas: set selectedPositionId
   - Right rail Properties tab shows: product name, UPC, dimensions,
     current facings (with +/- buttons, range 1-8), daypart multiselect,
     vendor, category, retail price
   - Edits flow back through canvasStore.updateFacings etc.
   - Delete key: removes selected Position

7. Implement the toolbar:
   - Undo/Redo buttons (wired to canvasStore.undo/redo)
   - Zoom in/out/fit buttons
   - Grid/Snap/Ruler toggles (visual only, snap is on by default)
   - 2D/3D toggle: for 3D, render an isometric projection of the same
     scene (cheap CSS transform on the Stage; don't use a real 3D library)
   - "Auto-optimize" button: opens the AI Agent tab (no logic yet, just
     navigation)
   - Heatmap dropdown: 6 modes from spec.md (none, space-to-sales,
     velocity, gmroi, dos, margin, compliance) — wire to
     canvasStore.setHeatmap

8. Implement the heatmap overlay:
   - When heatmapMode !== 'none', each Position gets a color tint based on
     the formula in spec.md §"Heatmap and simulator math"
   - The space-to-sales formula must color Stella RED and White Claw GREEN
     when applied to beer-v41 — verify this and show me the computed values
   - Color scale: red → orange → yellow → green; legend in the bottom-left
     of the canvas
   - Tooltip on hover shows the computed ratio

9. Implement Save:
   - Save button in the editor header
   - Mutates the plan in canvasStore (which is the source of truth; the
     seed JSON is only the initial state)
   - Toast: "Energy Reset Q2 saved as v0.1"
   - Status pill in header updates from "New" to "Draft"
   - isDirty flag resets

10. Add the create-from-scratch path:
   - The new-planogram modal from Session 2 step 3 now actually creates a
     working draft plan in canvasStore and navigates to the editor
   - The editor renders the empty cooler with all shelves empty
   - User can now drag products in and save

Stop after step 10. Demo-test: walk Journey 1 from docs/demo-brief.md
end-to-end (Dashboard → New Planogram → drag 4 SKUs into the energy cooler
→ Save). It must work smoothly with no console errors. Record a 60-second
screen capture and review it for any visual jank.

Specifically check:
- Drag has a shadow under the tile while dragging
- Snap guides appear on shelf hover
- Toast appears within 100ms of drop
- Save toast appears within 100ms of click
- Esc deselects
- Undo works after a placement
- Cmd+K command palette still works inside the editor
```

---

## Session 4 — What-if simulator, Compare, heatmap polish

```
Continuing the ShelfIQ demo build. Re-read docs/demo-brief.md Journey 2 and
docs/spec.md §"Heatmap and simulator math". This session completes the
Analyze journey.

Sequence:

1. Implement the whatIfStore (Zustand) per spec.md. The compute() action
   takes the baseline plan and the modifications list and produces a
   projection. Test with the demo scenario: baseline beer-v41, modifications
   = [Stella 4→2, White Claw 3→5]. The projection should yield approximately
   +$340/wk (calibrate by tuning the elasticity constant if needed).

2. Build the What-If Simulator UI:
   - Side panel slides in from the right when "What-if" button is clicked
     in the editor toolbar
   - Shows a list of current Positions with +/- buttons for facings
   - At the bottom: live-updating projection card with three lines:
     "Projected weekly sales: +$342" (green/red), "Projected GMROI:
     +0.18", "Projected DOS: 6.2 → 5.4"
   - "Apply to Plan" button commits the changes via canvasStore
   - "Discard" closes without saving
   - Esc closes without saving

3. Polish the heatmap:
   - When heatmap is on, the Insights panel (right rail Analytics tab)
     shows live aggregates: total revenue, total margin, total linear ft,
     top 3 over-spaced SKUs, top 3 under-spaced SKUs
   - Subcategory breakdown chart in the Analytics tab (Recharts donut)
   - Updates within 100ms of any canvas change

4. Implement /planograms/[id]/compare/[vsId]:
   - Three-column layout: baseline plan canvas, candidate plan canvas,
     change rail
   - Linked pan/zoom: dragging or zooming one canvas mirrors to the other
   - Diff computation in lib/calc/diff.ts: returns {added, removed,
     modified} arrays of position-level changes
   - Change rail: scrollable list of changes, each with:
     SKU name, change type (added/removed/facings X→Y), per-change
     projected impact, hover highlights the corresponding position on both
     canvases in a yellow outline
   - Top of change rail: summary card with total projected impact
   - Header: "v4.1 (Live)" left, "v4.2 (Draft)" right, "Approve" /
     "Request changes" / "Reject" buttons (fire toasts; no logic)

5. Wire the editor's "Compare versions" button to navigate to
   /planograms/beer-v41/compare/beer-v42. When the user runs the what-if
   and applies, the resulting state becomes beer-v42 in canvasStore.

6. Add the Insights panel content (right rail Analytics tab):
   - Aggregate stats card (always visible when a plan is loaded)
   - Subcategory breakdown chart
   - "Top 5 over-spaced" list
   - "Top 5 under-spaced" list
   - All live-updating from canvasStore

Stop after step 6. Demo-test Journey 2 end-to-end:
Planograms list → click beer-v41 → toggle Space-to-Sales heatmap →
verify Stella shows red → open Insights panel → click What-If →
adjust Stella and White Claw → see projection update live →
Apply → see canvas update → click Compare → see side-by-side diff.

Specifically check:
- Heatmap toggles in <100ms
- What-if math runs in <50ms per change
- Compare view renders both plans within 500ms
- Linked pan/zoom works smoothly
- Change rail hover highlight works on both sides
```

---

## Session 5 — AI agent, demo polish, URL params, final pass

```
Continuing the ShelfIQ demo build. Re-read docs/demo-brief.md Journey 3 and
docs/spec.md §"The AI agent". This session brings it all home.

Get the user's ANTHROPIC_API_KEY into apps/web/.env.local under that exact
name. Pause and confirm you have it before step 3.

Sequence:

1. Implement the agentStore (Zustand) per spec.md. State: messages array,
   isOpen, isStreaming, current recommendation cards. Actions: send,
   applyRecommendation, applyAll, clear.

2. Build the AI Agent panel UI (right rail AI Agent tab):
   - Conversation area: user/assistant message bubbles, assistant messages
     can have tool-call indicators rendered as a separate compact card
     above the text
   - Input at the bottom with a Send button and Enter-to-send
   - Empty state: shows 3 suggestion chips (the prompts from
     demo-brief.md Journey 3 setup). Clicking a chip fills the input.
   - Streaming text uses a simple "fade in characters as they arrive" feel
     (no need for a fancy library — just append to state and re-render)

3. Implement /api/agent/route.ts:
   - POST handler, Edge runtime, returns SSE
   - Reads messages, planId, context from request body
   - Builds a system prompt from lib/agent/systemPrompt.ts that includes
     the plan name, fixture, positions summary, top over-spaced SKUs,
     heatmap state
   - System prompt explicitly forbids inventing SKU names or numbers; tells
     the model to use only what's in the context
   - System prompt instructs the model to end with a
     <recommendations>JSON</recommendations> block when the user asks for
     changes; specifies the schema with one inline example
   - Calls claude-sonnet-4-5 with stream:true
   - As tokens arrive, emits SSE `data: text` events
   - When stream completes, parses the trailing recommendations block and
     emits a final SSE `event: recommendations\ndata: {...}` event

4. Implement the fake tool-call sequence:
   - Before calling Claude, emit 2-4 SSE events with names like
     `query_store_data`, `analyze_space_to_sales`, `find_alternatives`
   - Space them 600-900ms apart with setTimeout
   - The client renders each as it arrives in the tool-call indicator card

5. Implement the fallback:
   - lib/agent/fallbacks.ts with 4 scripted responses keyed by keyword:
     "optimize" → the Journey 3 scripted response with 3 recommendations
     "under-spaced" → list of under-spaced SKUs (use the actual data)
     "stella" → the Stella-specific recommendation
     default → a generic "I can help with..." response
   - If DEMO_FALLBACK=true OR the Anthropic call fails OR the call takes
     >10s, use the fallback instead. Log which path was used.

6. Implement the recommendation card:
   - When the agent's recommendations event arrives, render a card below
     the message
   - Card shows up to 3 rows; each row: SKU name, change description, $/wk
     impact, "Apply" button
   - "Apply All" button at the top
   - Clicking Apply (single or all) calls canvasStore.placeProduct /
     updateFacings / removePosition as appropriate, then a toast, then the
     canvas updates
   - Use Framer Motion for the card materialize (fade up + slight scale)

7. Implement URL params per spec.md §"Demo URL params":
   - ?demo=create — opens the new-planogram modal pre-filled
   - ?demo=create-canvas — loads a half-built energy cooler
   - ?demo=analyze — loads beer-v41 with heatmap on
   - ?demo=agent — loads beer-v41 with agent panel open
   - ?demo=compare — loads the compare view directly

   Test each one and confirm the demo can be resumed mid-flow from any of
   these URLs.

8. Final demo polish pass — go through every screen and fix:
   - Any loading spinner visible during normal nav (use Suspense
     boundaries with skeleton states; nothing should ever spin)
   - Any layout shift after first paint (set explicit dimensions on
     async-loading elements)
   - Any console error or warning (zero tolerance)
   - Any "TODO", "Lorem ipsum", "Click me" placeholder
   - Any unhandled error boundary
   - Add a global ErrorBoundary around the canvas that shows a "Refresh
     canvas" button on error
   - Add a global ErrorBoundary around the agent that falls back to the
     fallback message on error

9. Run the three journeys end-to-end from docs/demo-brief.md, timing each:
   - Journey 1 (Create) should take ≤3 min of demo time
   - Journey 2 (Analyze) ≤3 min
   - Journey 3 (Agent) ≤3 min

   If any step has visible friction (>200ms unexplained pause, awkward
   layout, unclear affordance), list it and fix it before finishing.

Stop after step 9. Confirm with a screen recording that all three journeys
flow cleanly. List any known gotchas in docs/DEMO_NOTES.md so the demo
operator knows them in advance.
```

---

## After Session 5 — what to do before the demo

These aren't Claude Code tasks; they're things you do:

1. **Dry run twice.** Once alone, once with a willing colleague playing the audience. Time the journeys. Note where you stumble.
2. **Pre-open the tabs.** Browser tabs for: Dashboard (`?demo=` default), the New Planogram modal (`?demo=create`), the Analyze entry point (`?demo=analyze`), the Agent entry (`?demo=agent`). Have them all open before you start so route transitions are warm.
3. **Disable browser extensions** that inject into pages. Some ad-blockers will break the LLM call to api.anthropic.com.
4. **Pre-warm the agent** by running one query before the audience arrives. The first call takes longer due to model warmup.
5. **Test on the actual demo screen and resolution.** Your laptop's retina display ≠ the projector. Run a dry-run at 1080p with the browser dev tools closed.
6. **Have a fallback plan.** If WiFi dies: `DEMO_FALLBACK=true pnpm dev` and the demo still works.
7. **Quit Slack, Notifications, all chat apps.** Demo mode = no popups.

---

## What to do if a session fails halfway

- Session 1 fails → restart the session with the same prompt. Scaffold steps are deterministic.
- Session 2 fails on one screen → finish the rest, leave the broken screen with a tasteful empty state, come back at the end of Session 5.
- Session 3 fails on the canvas → this is the riskiest one. If you're 4+ days in and the canvas still isn't smooth, fall back to a static SVG canvas matching the wireframe and skip the drag-to-place for Journey 1 (use a scripted "click to place" instead, with the same end result). Update demo-brief.md Journey 1 step 4 to "Maria clicks the empty slot, then picks Red Bull from a popup."
- Session 4 fails → cut Compare, keep What-If. The demo still works.
- Session 5 fails → keep `DEMO_FALLBACK=true` permanently on. The scripted responses are good enough for the audience.

The demo doesn't need to be feature-complete. It needs to land.
