# ShelfIQ Demo — Narrative Brief

This is what the demo *shows*, not what it *is*. Read this first; every other doc serves this one.

---

## The audience and the stakes

You are demoing ShelfIQ to a decision-maker (likely a c-store ops VP, category management director, or DACH retail partner via TCC). They have seen JDA Space Planning, Blue Yonder, Symphony Retail. They will compare ShelfIQ to those tools within 90 seconds of seeing it.

**What you need them to feel:**
- "This was built by people who understand c-store, not just retail."
- "The AI agent feels useful, not gimmicky."
- "I could see my team using this on Monday."

**What sinks the demo:**
- Loading spinners during the live walkthrough
- An agent that hallucinates a number Maria can fact-check
- A canvas that lags or flickers when you drag
- Generic data ("Product 1, Product 2") that breaks the c-store framing
- Anything that makes the audience wonder if it's real

---

## The protagonist

**Maria Chen** is the category manager at Quikstop Inc., a 247-store c-store chain headquartered in Dallas. She owns Cold Beverages and Energy Drinks. She has 90 minutes a day to do real planogram work; the rest is meetings. She knows space-to-sales index, GMROI, days of supply by heart.

Every demo journey is told as one of Maria's afternoons.

---

## The three journeys

### Journey 1 — Create (≈3 minutes of demo time)

**Setup line:** "Maria just got the spring vendor PSA from Red Bull. She needs to author the new Q2 Energy Drinks planogram for the Urban Premium store cluster."

**What the audience sees, beat by beat:**

1. **Dashboard.** Land on it. Headline: "12 planograms in review, 7 categories due for reset." Maria's avatar is in the top-right. Cursor pauses on "Energy Drinks — due May 26."
2. **Click "New Planogram".** Modal: pick a fixture template. Maria picks "3-Door Energy Cooler — 60"H × 78"W." Canvas opens.
3. **Empty canvas appears** with the cooler outline rendered: 3 glass doors, 5 shelves each, temperature pills at the top reading "34°F." Mention: "Cold vault is a first-class fixture here, not a labeled gondola."
4. **Drag Red Bull 8.4oz from the catalog** to top shelf, Door 1, Slot 1. It snaps to the shelf line. Facing count appears as "1." Adjust to "3 facings."
5. **Continue placing:** Red Bull Sugar Free, Monster Original, Monster Ultra, Celsius Live Fit, Bang Energy, 5-Hour Energy, Rockstar. Each drag-and-drop snaps cleanly. Right rail updates the SKU count and total linear ft as you go.
6. **Properties panel.** Click on Red Bull. Right rail shows dimensions (2.5"W × 6.4"H × 2.5"D), facings (3), category (Energy), vendor (Red Bull GmbH), and a "Daypart" multi-select (morning rush / afternoon / late-night).
7. **Save.** Click Save. Toast: "Energy Reset Q2 saved as v0.1." Status pill in the header changes from "New" to "Draft."

**Demo close:** "That's a 7-minute task in the real product. In JDA it's about an hour."

### Journey 2 — Analyze (≈3 minutes of demo time)

**Setup line:** "While that draft sits with the vendor, Maria wants to find waste in the existing Beer Cooler reset that's been live since January."

**What the audience sees:**

1. **Planograms list.** Filter by category=Beer. Click "Beer Cooler v4.1 — Urban Premium."
2. **Editor opens with the existing plan** loaded: 5 doors, 25 SKUs across Bud Light, Coors, Modelo, Stella, Heineken, White Claw, Truly. The canvas is full.
3. **Toggle the heatmap** in the toolbar → "Space-to-Sales Index." Canvas colors update: most SKUs are green (well-spaced), but **Door 5 Shelves 4-5** are bright red. Mention: "Red means over-spaced — getting more shelf than its sales share earns. Stella Artois is 14% of facings and 6% of sales."
4. **Open Insights panel** (right rail tab). Sub-category breakdown chart: Domestic 42%, Imported 28%, Craft 18%, Hard Seltzer 12%. Maria points at the Imported chunk: "Imported is 28% of space but Stella alone accounts for half of it."
5. **Click What-If Simulator.** Side panel opens. Maria drags Stella 12-pack from 4 facings to 2; drags White Claw Variety from 3 facings to 5. The panel shows live: "Projected weekly sales: +$342. Projected GMROI: +0.18. Projected DOS: 6.2 → 5.4."
6. **Click Apply.** Toast: "Changes applied to working copy. Saved as v4.2 draft."
7. **Click Compare versions.** Side-by-side opens: v4.1 (Live) left, v4.2 (Draft) right. Change rail shows: "−2 Stella facings, +2 White Claw facings, projected +$342/wk." All three changes have hover tooltips with the math.

**Demo close:** "In 90 seconds we identified $17K of annualized lift in one cooler. There are 246 other coolers."

### Journey 3 — AI Agent (≈3 minutes of demo time)

**Setup line:** "Maria's running short on time. She asks the agent to do what she'd do, but for the whole category."

**What the audience sees:**

1. **Right rail tab → AI Agent.** Chat panel slides open. Seeded suggestion chips: "Optimize this cooler for the Urban Premium cluster", "Find under-spaced SKUs by velocity", "What should I do about Stella?"
2. **Maria types or clicks the first chip.** Message goes up.
3. **Tool-call indicator appears** (faked but believable): "🔍 Querying store data... 📊 Checking velocity data... 🧮 Running space-to-sales analysis..." Each item appears in sequence over ~3 seconds. (This is real LLM streaming with prefixed status lines.)
4. **Agent response streams in** as actual streaming text from `claude-sonnet-4-5`:
   > "Looking at Beer Cooler v4.1 for Urban Premium, I see three opportunities. Stella Artois 12-pack is taking 14% of facings but generating only 6% of revenue — recommend dropping from 4 to 2 facings. White Claw Variety is your second-highest velocity SKU but stuck at 3 facings — recommend bumping to 5. Truly Berry has 30 days of supply at current velocity — consider pulling it for Truly Margarita, which sells 2.3× faster in the Urban Premium cluster..."
5. **Below the streamed response, a structured recommendation card** materializes with three rows: each shows the SKU, the change (−2 / +2 / swap), the projected impact ($/week), and an "Apply" button. There's a "Apply all" button at the top.
6. **Maria clicks Apply All.** Toast: "3 changes applied. v4.3 created." Canvas updates with the three changes visible.
7. **Click Compare to see v4.1 vs v4.3.** Change rail shows all three changes plus combined "+$580/wk projected."

**Demo close:** "The agent didn't make any of those numbers up. Every recommendation is grounded in the store data set bound to this plan. We can show its tool calls if you want to see the receipts."

---

## Cross-journey polish

These are the small things that separate a built demo from a hacky one. Each prompt enforces them.

**Visual.**
- Light mode by default. Dark mode works via the topbar toggle (one shortcut for the audience: "we built it both ways").
- Brand: teal-700 primary, slate-50/100/900 surfaces. BlueNorth wordmark in the sidebar header.
- All KPI tiles have a subtle delta indicator (+12 this month, −0.3 vs target).
- The reset calendar on the dashboard shows real-looking pill events spanning the next 8 weeks.

**Interaction.**
- Cmd/Ctrl+K opens command palette anywhere.
- Esc closes any modal.
- Every async action has an optimistic toast in <100ms.
- Hover any KPI tile or chart segment for a tooltip with the breakdown.
- Drag has visible affordances: shadow under dragged object, snap-line on the shelf, "+1 facing" tooltip while dragging.

**Realism.**
- 6 stores in the seed data, 4 banners (Quikstop Core / Fuel / Express / NorCal), 3 clusters (Urban Premium / Suburban Family / Highway Travel).
- 24 SKUs across Beer, Energy, Cold Beverages, Salty Snacks — each with real-looking dimensions and a vendor.
- 5 planograms in various states (1 live, 2 in review, 1 draft, 1 archived).
- 3 user avatars including Maria's; activity feed has real-looking actions ("Maria approved Energy Reset Q1", "John uploaded compliance photos for store #1247").

**Anti-failure.**
- The editor canvas has a try/catch boundary; if Konva throws, the surface shows a tasteful "Refresh canvas" button instead of a stack trace.
- The agent has a fallback scripted response per journey if the API call fails or times out (>10s). Set `DEMO_FALLBACK=true` in `.env.local` to force-use the fallback for offline demos.
- Every screen loads in <500ms from a cold start because everything is in-memory.

---

## What we explicitly skip (and what to say if asked)

The audience may ask about things this MVP doesn't do. Pre-baked honest answers:

| If they ask… | Say… |
|---|---|
| "Is this multi-tenant?" | "Yes in the production architecture, not in this demo build. The data model and API are already designed for it; this MVP is single-tenant for speed." |
| "Where's the database?" | "This runs in-memory for the demo. Production uses Postgres with the schema we've already specified." |
| "Can the agent write to the planogram?" | "Today it produces recommendations the user applies. The production design keeps the agent read-only with the user committing every change. It's an intentional safety choice." |
| "Can I import a PSA file?" | "The button is there; the parser is stubbed for the demo. PSA round-trip is in the production spec." |
| "Does this work on mobile?" | "The dashboard and lists are responsive. The editor is desktop-only; that matches how category managers actually work." |
| "Can I export a PDF?" | "Yes" — and click the button; it downloads a real pre-rendered sample PDF that lives in `/public/samples/`. |

---

## Demo opening (you say, before clicking anything)

> "ShelfIQ is a planogram and category management platform built specifically for c-store. Everything you're about to see was designed around the way Maria, our protagonist category manager, actually works on a Tuesday afternoon — vendor templates, reset cadence, space-to-sales waste, AI-assisted optimization. Three journeys, about 10 minutes total. Stop me whenever."

## Demo closing (after the third journey)

> "What you saw is built on the architecture we already have specced for production — multi-tenant, audit-logged, the agent grounded in real store data via tool calls. Happy to walk through the production architecture next, or to talk about the rollout path for your stores."
