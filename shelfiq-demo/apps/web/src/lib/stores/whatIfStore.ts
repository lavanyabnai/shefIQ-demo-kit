// What-If simulator store.
//
// Holds the side-panel open state, the baseline plan snapshot (a deep clone
// taken at open time so the user can play with facings without touching the
// editor), the working modifications map, and the live projection.
//
// Invariants:
//   - open(plan) takes a deep clone of the plan as the baseline. The store
//     never mutates that clone; modifications are stored separately.
//   - setFacings is the only mutator. It updates / adds / removes from the
//     modifications map and re-runs compute() on every change.
//   - close() and discard() are equivalent — both reset state.
//   - apply() returns the modifications array for the caller to push to
//     canvasStore. The store does NOT call canvasStore directly.

"use client";
import { create } from "zustand";
import type { Plan } from "@/lib/types";
import { compute, type FacingMod, type Projection } from "@/lib/calc/whatif";
import { products as allProducts } from "@/lib/seed";

const productById = new Map(allProducts.map((p) => [p.id, p]));

interface WhatIfState {
  isOpen: boolean;
  baseline: Plan | null;
  // positionId -> { oldFacings, newFacings }
  modifications: Map<string, FacingMod>;
  projection: Projection | null;

  open: (plan: Plan) => void;
  close: () => void;
  setFacings: (positionId: string, newFacings: number) => void;
  reset: () => void;
  modificationsList: () => FacingMod[];
}

function recompute(baseline: Plan | null, mods: Map<string, FacingMod>): Projection | null {
  if (!baseline) return null;
  return compute(baseline, Array.from(mods.values()), productById);
}

export const useWhatIfStore = create<WhatIfState>((set, get) => ({
  isOpen: false,
  baseline: null,
  modifications: new Map(),
  projection: null,

  open: (plan) => {
    const baseline = structuredClone(plan);
    set({
      isOpen: true,
      baseline,
      modifications: new Map(),
      projection: compute(baseline, [], productById),
    });
  },

  close: () => set({ isOpen: false }),

  reset: () =>
    set({
      isOpen: false,
      baseline: null,
      modifications: new Map(),
      projection: null,
    }),

  setFacings: (positionId, newFacings) => {
    const s = get();
    if (!s.baseline) return;
    const pos = s.baseline.positions.find((p) => p.id === positionId);
    if (!pos) return;
    const clamped = Math.max(1, Math.min(8, newFacings));

    const next = new Map(s.modifications);
    if (clamped === pos.facings) {
      // back to baseline → drop the modification
      next.delete(positionId);
    } else {
      next.set(positionId, { positionId, oldFacings: pos.facings, newFacings: clamped });
    }
    set({
      modifications: next,
      projection: recompute(s.baseline, next),
    });
  },

  modificationsList: () => Array.from(get().modifications.values()),
}));
