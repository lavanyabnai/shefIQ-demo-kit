// Canvas store — the editor's working state.
//
// Two state islands live here:
//   1. `draftPlans` — a persistent registry of plans created via the
//      new-planogram modal. Survives editor reloads (within the session).
//   2. The active editor session (`plan`, `selectedPositionId`, …) —
//      one plan loaded at a time, with a 20-step undo/redo stack.
//
// Invariants:
//   - Mutations are immutable: actions never mutate `state.plan` in place;
//     they clone via structuredClone, modify the clone, and `set` it.
//   - Any plan-mutating action snapshots the prior plan to `history.past`
//     (capped at HISTORY_LIMIT) and clears `history.future`.
//   - `isDirty` flips to true on any mutation OR undo/redo. `save()`
//     resets it.
//   - `loadPlan` is the only action that resets selection, drag, heatmap,
//     view toggles, dirty, and history.
"use client";
import { create } from "zustand";
import type { Daypart, HeatmapMode, Plan, Position } from "@/lib/types";
import { plans as seedPlans } from "@/lib/seed";

const HISTORY_LIMIT = 20;

export type RightRailTab = "properties" | "rules" | "analytics" | "agent";
export type ViewMode = "2d" | "3d";
export type ZoomCommand = { kind: "in" | "out" | "fit"; nonce: number } | null;
export interface Viewport {
  scale: number;
  origin: { x: number; y: number };
  fitNonce: number;
}

interface CanvasState {
  // ----- Drafts (persisted across editor sessions) -----
  draftPlans: Record<string, Plan>;
  createPlan: (plan: Plan) => void;
  getDraft: (id: string) => Plan | undefined;

  // ----- Active editor session -----
  plan: Plan | null;
  selectedPositionId: string | null;
  draggedProductId: string | null;
  heatmapMode: HeatmapMode;
  viewToggle: { overlaps: boolean; duplicates: boolean; orientation: boolean };
  viewSettings: { grid: boolean; snap: boolean; ruler: boolean; mode: ViewMode };
  rightRailTab: RightRailTab;
  zoomCommand: ZoomCommand;
  /**
   * Viewports keyed by an arbitrary id (typically planId for the editor or
   * `compare:<a>:<b>` for the compare view). Lifted here so two side-by-side
   * canvas stages can share pan/zoom state in the compare view.
   */
  viewports: Record<string, Viewport>;
  isDirty: boolean;
  history: { past: Plan[]; future: Plan[] };

  // Lifecycle
  loadPlan: (planId: string) => boolean;
  unloadPlan: () => void;

  // Plan mutations (push history, flip dirty)
  placeProduct: (
    productId: string,
    doorIndex: number,
    shelfIndex: number,
    slotIndex: number,
    facings: number,
    daypart?: Daypart[]
  ) => boolean;
  removePosition: (positionId: string) => boolean;
  updateFacings: (positionId: string, facings: number) => boolean;
  updateDaypart: (positionId: string, daypart: Daypart[]) => boolean;

  // UI-only state (no history)
  setSelection: (id: string | null) => void;
  setDraggedProduct: (id: string | null) => void;
  setHeatmap: (mode: HeatmapMode) => void;
  setViewToggle: (
    key: "overlaps" | "duplicates" | "orientation",
    value: boolean
  ) => void;
  setViewSetting: (
    key: "grid" | "snap" | "ruler" | "mode",
    value: boolean | ViewMode
  ) => void;
  setRightRailTab: (tab: RightRailTab) => void;
  requestZoom: (kind: "in" | "out" | "fit") => void;

  /** Set or patch the viewport for a given id. Creates one if absent. */
  setViewport: (id: string, partial: Partial<Viewport>) => void;

  // Persistence + history
  save: () => void;
  undo: () => boolean;
  redo: () => boolean;
}

function newPositionId(): string {
  return `pos-${Math.random().toString(36).slice(2, 10)}`;
}

function clonePlan(p: Plan): Plan {
  return structuredClone(p);
}

/**
 * Helper that runs a pure mutation against a clone of the current plan,
 * snapshots the old plan into history.past (capped), and returns a partial
 * state object. Returns null if the mutator returned null (= no-op).
 */
function withMutation(
  state: CanvasState,
  mutator: (draft: Plan) => Plan | null
): Partial<CanvasState> | null {
  if (!state.plan) return null;
  const next = mutator(clonePlan(state.plan));
  if (!next) return null;
  next.updatedAt = new Date().toISOString();
  return {
    plan: next,
    isDirty: true,
    history: {
      past: [...state.history.past, state.plan].slice(-HISTORY_LIMIT),
      future: [],
    },
  };
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // ----- Drafts -----
  draftPlans: {},
  createPlan: (plan) =>
    set((s) => ({ draftPlans: { ...s.draftPlans, [plan.id]: plan } })),
  getDraft: (id) => get().draftPlans[id],

  // ----- Editor session defaults -----
  plan: null,
  selectedPositionId: null,
  draggedProductId: null,
  heatmapMode: "none",
  viewToggle: { overlaps: false, duplicates: false, orientation: false },
  viewSettings: { grid: false, snap: true, ruler: true, mode: "2d" },
  rightRailTab: "properties",
  zoomCommand: null,
  viewports: {},
  isDirty: false,
  history: { past: [], future: [] },

  // loadPlan: replace editor state entirely. Prefer drafts (newly created via
  // the modal) over seed (live/published plans like beer-v41).
  loadPlan: (planId) => {
    const s = get();
    const source = s.draftPlans[planId] ?? seedPlans[planId];
    if (!source) return false;
    set({
      plan: clonePlan(source),
      selectedPositionId: null,
      draggedProductId: null,
      heatmapMode: "none",
      viewToggle: { overlaps: false, duplicates: false, orientation: false },
      viewSettings: { grid: false, snap: true, ruler: true, mode: "2d" },
      rightRailTab: "properties",
      zoomCommand: null,
      isDirty: false,
      history: { past: [], future: [] },
    });
    return true;
  },

  unloadPlan: () =>
    set({
      plan: null,
      selectedPositionId: null,
      draggedProductId: null,
      isDirty: false,
      history: { past: [], future: [] },
    }),

  // placeProduct: rejects placement on an occupied slot (returns false, no
  // state change). Clamps facings to [1, 8].
  placeProduct: (productId, doorIndex, shelfIndex, slotIndex, facings, daypart = ["afternoon", "late-night"]) => {
    const delta = withMutation(get(), (p) => {
      const occupied = p.positions.some(
        (pos) =>
          pos.doorIndex === doorIndex &&
          pos.shelfIndex === shelfIndex &&
          pos.slotIndex === slotIndex
      );
      if (occupied) return null;
      const newPos: Position = {
        id: newPositionId(),
        productId,
        doorIndex,
        shelfIndex,
        slotIndex,
        facings: Math.max(1, Math.min(8, facings)),
        daypart,
      };
      p.positions = [...p.positions, newPos];
      return p;
    });
    if (!delta) return false;
    set(delta);
    return true;
  },

  // removePosition: no-op if id not found. Clears selection if it pointed
  // at the removed Position.
  removePosition: (positionId) => {
    const delta = withMutation(get(), (p) => {
      const before = p.positions.length;
      p.positions = p.positions.filter((pos) => pos.id !== positionId);
      return p.positions.length === before ? null : p;
    });
    if (!delta) return false;
    set((s) => ({
      ...delta,
      selectedPositionId:
        s.selectedPositionId === positionId ? null : s.selectedPositionId,
    }));
    return true;
  },

  // updateFacings: clamps to [1, 8]. No-op if unchanged.
  updateFacings: (positionId, facings) => {
    const clamped = Math.max(1, Math.min(8, facings));
    const delta = withMutation(get(), (p) => {
      const ix = p.positions.findIndex((pos) => pos.id === positionId);
      if (ix < 0 || p.positions[ix].facings === clamped) return null;
      p.positions[ix] = { ...p.positions[ix], facings: clamped };
      return p;
    });
    if (!delta) return false;
    set(delta);
    return true;
  },

  // updateDaypart: replaces the daypart array wholesale.
  updateDaypart: (positionId, daypart) => {
    const delta = withMutation(get(), (p) => {
      const ix = p.positions.findIndex((pos) => pos.id === positionId);
      if (ix < 0) return null;
      p.positions[ix] = { ...p.positions[ix], daypart };
      return p;
    });
    if (!delta) return false;
    set(delta);
    return true;
  },

  setSelection: (id) => set({ selectedPositionId: id }),
  setDraggedProduct: (id) => set({ draggedProductId: id }),
  setHeatmap: (mode) => set({ heatmapMode: mode }),
  setViewToggle: (key, value) =>
    set((s) => ({ viewToggle: { ...s.viewToggle, [key]: value } })),
  setViewSetting: (key, value) =>
    set((s) => ({
      viewSettings: { ...s.viewSettings, [key]: value } as CanvasState["viewSettings"],
    })),
  setRightRailTab: (tab) => set({ rightRailTab: tab }),
  requestZoom: (kind) =>
    set({ zoomCommand: { kind, nonce: Math.random() } }),

  setViewport: (id, partial) =>
    set((s) => {
      const prev = s.viewports[id] ?? {
        scale: 6,
        origin: { x: 0, y: 0 },
        fitNonce: 0,
      };
      return {
        viewports: {
          ...s.viewports,
          [id]: { ...prev, ...partial },
        },
      };
    }),

  // save: copies the current plan back to draftPlans (overwriting the prior
  // snapshot). Promotes status from any non-live state to "draft" so the
  // pill in the editor header flips correctly. Does NOT clear history —
  // undo still works after save.
  save: () => {
    const s = get();
    if (!s.plan) return;
    const saved: Plan = {
      ...s.plan,
      status: s.plan.status === "live" ? "live" : "draft",
      updatedAt: new Date().toISOString(),
    };
    set({
      plan: saved,
      draftPlans: { ...s.draftPlans, [saved.id]: saved },
      isDirty: false,
    });
  },

  // undo: pops history.past, pushes current to history.future. Selection
  // cleared to avoid pointing at a position that may not exist in the
  // restored snapshot.
  undo: () => {
    const s = get();
    if (!s.plan || s.history.past.length === 0) return false;
    const past = s.history.past.slice(0, -1);
    const prev = s.history.past[s.history.past.length - 1];
    set({
      plan: clonePlan(prev),
      history: {
        past,
        future: [s.plan, ...s.history.future].slice(0, HISTORY_LIMIT),
      },
      selectedPositionId: null,
      isDirty: true,
    });
    return true;
  },

  // redo: pops the head of history.future, pushes current onto history.past.
  redo: () => {
    const s = get();
    if (!s.plan || s.history.future.length === 0) return false;
    const [next, ...rest] = s.history.future;
    set({
      plan: clonePlan(next),
      history: {
        past: [...s.history.past, s.plan].slice(-HISTORY_LIMIT),
        future: rest,
      },
      selectedPositionId: null,
      isDirty: true,
    });
    return true;
  },
}));
