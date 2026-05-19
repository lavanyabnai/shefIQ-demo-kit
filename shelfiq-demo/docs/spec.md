# ShelfIQ Demo MVP — Technical Spec

The demo build. Frontend-only. In-memory state. Real LLM calls for the agent. Read `demo-brief.md` first.

---

## Stack — final

**Framework**: Next.js 14 (App Router), TypeScript strict, single `apps/web/` directory (not a monorepo).

**Styling**: Tailwind 3.4 + shadcn/ui primitives (Button, Dialog, Sheet, Tabs, Popover, Toast). Lucide icons.

**State**: Zustand for canvas + selection + history. TanStack Query *not used* (no fetches). Plain `useState` for component-local UI state.

**Canvas**: Konva.js + react-konva. SVG only for static decorations.

**Charts**: Recharts.

**Forms**: react-hook-form + zod, but only for the two forms that need it (new-planogram modal, what-if simulator). Everything else: controlled inputs.

**Animation**: Framer Motion for the recommendation card materialize and the change rail.

**LLM**: Anthropic SDK (`@anthropic-ai/sdk`), called from a Next.js route handler at `app/api/agent/route.ts`, server-side, streaming via SSE. Model: `claude-sonnet-4-5`. API key in `.env.local`.

**Build**: pnpm, Node 20. `next dev` on port 3000.

---

## What we are NOT installing

- No database, no Prisma, no Postgres, no SQLite
- No `next-auth` or any auth library
- No Celery, Redis, or background workers
- No MCP servers
- No state machine library (xstate, etc.) — Zustand handles it
- No animation libraries beyond Framer Motion
- No drag-and-drop library beyond Konva's built-in (no `dnd-kit` etc.)

Adding any of these requires a written justification in `docs/decisions/`.

---

## Page list

| Route | Source of truth | What it does |
|---|---|---|
| `/` | redirects → `/dashboard` | — |
| `/dashboard` | `lib/seed/dashboard.json` | KPI tiles, reset calendar, activity feed, top categories chart, compliance heatmap |
| `/planograms` | `lib/seed/planograms.json` | Filterable table of 5 plans; click row → editor |
| `/planograms/new` | modal route | New-planogram modal with fixture template picker |
| `/planograms/[id]` | `lib/seed/plans/{id}.json` + Zustand canvas store | Editor: 3-pane layout, Konva canvas, AI agent panel |
| `/planograms/[id]/compare/[vsId]` | two plan JSONs + computed diff | Side-by-side compare with change rail |
| `/stores` | `lib/seed/stores.json` | 6 stores; toggle map view ↔ table view |
| `/products` | `lib/seed/products.json` | Filterable product catalog (24 SKUs) |
| `/fixtures` | `lib/seed/fixtures.json` | Grid of 8 fixture cards |
| `/reports` | static | 8 report cards; click → modal with sample chart + "Export PDF" button that downloads `/public/samples/store-pack.pdf` |

Routes that are placeholders in the wireframe (Clusters, Settings) stay as "Coming soon" tasteful empty states.

---

## Data shapes (TypeScript interfaces — the contract)

```typescript
// lib/types.ts

export interface Product {
  id: string;
  upc: string;
  name: string;
  brand: string;
  vendor: string;
  category: 'Beer' | 'Energy' | 'Cold Beverages' | 'Salty Snacks' | 'Candy' | 'Sports Drinks';
  subcategory: string;
  dimensions: { w: number; h: number; d: number };  // inches
  retailPrice: number;
  unitsPerWeek: number;       // velocity, for heatmap math
  marginPct: number;
  daysOfSupply: number;
  swatchColor: string;        // hex, for canvas rendering
}

export interface Fixture {
  id: string;
  name: string;
  type: 'cold-vault' | 'gondola' | 'endcap' | 'rollergrill' | 'tobacco-gantry' | 'counter';
  dimensions: { w: number; h: number; d: number };
  doors?: number;
  shelvesPerDoor?: number;
  temperature?: number;
  swingDirection?: 'left' | 'right' | 'french';
}

export interface Position {
  id: string;
  productId: string;
  doorIndex: number;      // 0-based
  shelfIndex: number;     // 0-based, top to bottom
  slotIndex: number;      // 0-based, left to right
  facings: number;
  daypart: ('morning' | 'afternoon' | 'late-night')[];
}

export interface Plan {
  id: string;
  name: string;
  version: string;        // "v4.1"
  category: string;
  banner: string;
  cluster: string;
  status: 'draft' | 'in-review' | 'approved' | 'live' | 'archived';
  effectiveDate: string;  // ISO
  owner: { id: string; name: string; avatar: string };
  fixtureId: string;
  positions: Position[];
  parentVersionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  number: string;        // "1247"
  name: string;
  address: { city: string; state: string; lat: number; lng: number };
  banner: string;
  cluster: string;
  sqft: number;
  format: 'urban' | 'suburban' | 'highway';
  compliancePct: number;
}
```

---

## State management

### Zustand stores

**`canvasStore`** — the editor's working state
```typescript
{
  plan: Plan | null;
  selectedPositionId: string | null;
  draggedProductId: string | null;
  heatmapMode: 'none' | 'space-to-sales' | 'velocity' | 'gmroi' | 'dos' | 'margin';
  viewToggle: { overlaps: bool, duplicates: bool, orientation: bool };
  isDirty: boolean;
  history: { past: Plan[], future: Plan[] };

  // actions
  loadPlan(planId): void;
  placeProduct(productId, door, shelf, slot, facings): void;
  removePosition(positionId): void;
  updateFacings(positionId, facings): void;
  setHeatmap(mode): void;
  save(): void;  // mutates the plan in lib/seed/plans/ in memory (resets on refresh)
  undo(): void;
  redo(): void;
}
```

**`agentStore`** — the AI agent's conversation
```typescript
{
  isOpen: boolean;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    toolCalls?: Array<{ name: string; status: 'running' | 'done' }>;
    recommendations?: Recommendation[];
  }>;
  isStreaming: boolean;

  // actions
  send(prompt): Promise<void>;
  applyRecommendation(rec): void;
  applyAll(): void;
  clear(): void;
}
```

**`whatIfStore`** — the simulator
```typescript
{
  isOpen: boolean;
  baseline: Plan | null;
  modifications: Array<{ positionId: string; oldFacings: number; newFacings: number }>;
  projection: { dRevenue: number; dGmroi: number; dDos: number } | null;

  // actions
  open(): void;
  addModification(positionId, newFacings): void;
  compute(): void;  // pure function over baseline + modifications + product data
  apply(): void;    // pushes to canvasStore
}
```

### What does *not* go in Zustand

- Form state (use react-hook-form)
- Pure UI toggles (use `useState` in the component)
- Computed values (use `useMemo` or selectors)

---

## Heatmap and simulator math

All client-side. No backend. These are the formulas, baked into `lib/calc/`:

```typescript
// space-to-sales: ideal = 1.0
// green if 0.9 ≤ ratio ≤ 1.1, yellow if 0.7-0.9 or 1.1-1.3, red otherwise
spaceToSales = (position.facings * product.dims.w) / totalLinearFt
             / (product.unitsPerWeek * product.retailPrice) / totalRevenue

// what-if projection: linear approximation
dRevenue = sum over modifications of:
  (newFacings - oldFacings) * product.unitsPerWeek * product.retailPrice * elasticity
elasticity = 0.12  // hardcoded; mention in tooltip "linear elasticity estimate"
```

If the audience asks how this works during the demo: "Linear elasticity estimate, calibrated against historical Quikstop velocity data. The production version uses a non-linear MNL choice model — that's spec'd in our research doc."

---

## The AI agent — implementation contract

### Route handler

`app/api/agent/route.ts` — Edge runtime, POST, streams SSE.

Input:
```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "planId": "beer-v41",
  "context": {
    "fixtureName": "5-Door Beer Cooler",
    "positions": [...],     // summary, not full payload
    "heatmapState": "space-to-sales",
    "topOverspaced": [...]  // pre-computed
  }
}
```

The route handler:
1. Builds a system prompt (see `lib/agent/systemPrompt.ts`) that includes the plan context, formatted as a compact briefing.
2. Calls `claude-sonnet-4-5` with `stream: true`.
3. Parses streaming output for two embedded sections:
   - **Free-form text** — streamed back to the client as it arrives
   - **A trailing `<recommendations>...</recommendations>` JSON block** — parsed once complete, sent as a final SSE event

The model is told (in the system prompt) to always produce this trailing JSON block when the user asks for an action. Robust parsing: if the JSON is malformed or missing, the recommendation card just doesn't appear and the text stands alone.

### Faked tool calls

Before streaming the response, the route handler emits 2-4 fake `tool-call` SSE events with realistic-sounding names (`query_store_data`, `analyze_space_to_sales`, `find_alternatives`), staged 600-900ms apart. These are display-only — the UI uses them to render the "🔍 Querying store data..." sequence. The model doesn't actually use tools in v1 of the demo.

### Fallback mode

If `DEMO_FALLBACK=true` in env, or if the API call fails or times out (>10s), the route handler returns a hardcoded scripted response keyed off keyword matching in the user message. The scripts live in `lib/agent/fallbacks.ts` — one for each of the three demo journeys, plus a generic "tell me more about ShelfIQ" response.

### System prompt principles

- Tell the model it's looking at a specific plan with specific numbers; include the actual numbers in the prompt.
- Forbid making up SKU names or numbers not in the context.
- Specify the recommendation card schema explicitly with one example.
- Cap response length to ~150 words of prose + the JSON block.
- Tone: helpful retail analyst, not chatty assistant.

---

## Seed data — what must exist on day 1

`lib/seed/` is a curated narrative, not a fixture dump. The data tells the demo's story.

**Products** (24 SKUs, real product names, real-ish dimensions, real brand colors):
- 8 beer SKUs (Bud Light, Coors Light, Modelo Especial, Stella Artois 12-pack, Heineken, White Claw Variety, Truly Berry, Truly Margarita)
- 8 energy SKUs (Red Bull 8.4oz, Red Bull Sugar Free, Monster Original, Monster Ultra, Celsius Live Fit, Bang Energy Cherry, 5-Hour Energy Berry, Rockstar Original)
- 4 cold bev SKUs (Coca-Cola 20oz, Diet Coke, Sprite, Dr Pepper)
- 4 snack SKUs (Doritos Nacho, Lays Classic, Cheetos Crunchy, Pringles Original)

Velocity and revenue numbers are calibrated so the Stella over-spaced story works without hand-waving.

**Fixtures** (8):
- 5-Door Beer Cooler (used by the Analyze journey)
- 3-Door Energy Cooler (used by the Create journey)
- 8-Door Walk-In
- Roller Grill 18-slot
- Tobacco Gantry 6-Tier
- 16ft Gondola Run
- Counter Impulse
- Endcap Standard

**Stores** (6): Mix of urban (Dallas, Austin), suburban (Plano, Frisco), highway (I-35 corridor). Compliance % varies 78%-96%.

**Plans** (5):
- `beer-v41` — Beer Cooler v4.1, **live**, Urban Premium, the Analyze journey target. Has the Stella over-spacing.
- `beer-v42` — Beer Cooler v4.2, **in-review**, the what-if output (created at runtime when Maria saves).
- `energy-q2-draft` — empty 3-Door Energy Cooler, **draft**, used as the create-journey landing if you want to skip from the modal.
- `salty-v3` — Salty Snacks Endcap v3, **approved**, just window dressing for the planograms list.
- `roller-v2` — Roller Grill v2, **live**, more window dressing.

**Users** (3): Maria Chen (the protagonist), John Park (does compliance), Priya Shah (regional manager).

---

## Demo URL params

Quality-of-life parameters that let you jump to a state mid-demo without re-doing earlier steps:

- `?demo=create` — opens the new-planogram modal pre-filled with "Energy Reset Q2 — Urban Premium"
- `?demo=create-canvas` — opens the editor on a half-built energy cooler (4 SKUs placed, 4 to go)
- `?demo=analyze` — opens `beer-v41` in the editor with the heatmap already on
- `?demo=agent` — opens `beer-v41` with the agent panel open and the suggestion chips visible
- `?demo=compare` — opens the v4.1 vs v4.2 compare view directly

These don't bypass any logic; they set initial state in the relevant Zustand stores on mount.

---

## Performance budgets (for the demo, not production)

- Cold page load <1s on localhost
- Canvas first render <300ms after route change
- Drag-snap interaction at 60fps on a MacBook Air M2
- Heatmap toggle re-render <100ms
- What-if compute <50ms (it's pure JS over 25 positions)
- Agent first token <2s, full response <8s

Any failure to hit these is a P0 fix.

---

## What "done" looks like

The demo runs end-to-end without:
- Any console errors during normal navigation
- Any layout shifts after first paint
- Any visible loading spinner during the three journeys
- Any "TODO" or placeholder text visible
- Any 4xx/5xx in the network tab
- Any unhandled promise rejections

The exact opening sequence in `demo-brief.md` works smoothly without any clicks needing a retry.
