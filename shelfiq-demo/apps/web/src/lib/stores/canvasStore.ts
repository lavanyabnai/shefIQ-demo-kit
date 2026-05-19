// Minimal canvas/draft-plans store.
// Full editor state machine (selection, heatmap, history) lands in Session 3.
import { create } from "zustand";
import type { Plan } from "@/lib/types";

interface CanvasState {
  draftPlans: Record<string, Plan>;
  createPlan: (plan: Plan) => void;
  getDraft: (id: string) => Plan | undefined;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  draftPlans: {},
  createPlan: (plan) =>
    set((state) => ({
      draftPlans: { ...state.draftPlans, [plan.id]: plan },
    })),
  getDraft: (id) => get().draftPlans[id],
}));
