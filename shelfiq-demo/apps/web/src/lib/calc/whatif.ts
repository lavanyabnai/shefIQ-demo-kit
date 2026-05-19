// What-If projection math.
//
// Pure functions over a baseline Plan + a list of facing modifications.
// The formulas are deliberately simple linear approximations — accurate
// enough to feel right in a 90-second demo, transparent enough that the
// audience can reason about them. The production version uses an MNL
// choice model; we surface that distinction in the simulator tooltip.
//
// Calibration:
//   elasticity = 0.15 — tuned so [Stella 4→2, White Claw 3→5] on beer-v41
//   yields ≈ +$329/wk (demo brief targets "+$342"; off by 4% — well within
//   audience tolerance and the agent's prose can say "≈$330").

import type { Plan, Product } from "@/lib/types";

export const WHATIF_ELASTICITY = 0.15;

export interface FacingMod {
  positionId: string;
  oldFacings: number;
  newFacings: number;
}

export interface Projection {
  dRevenue: number;            // delta weekly revenue, $/wk
  dGmroi: number;              // delta GMROI (unitless)
  baselineDOS: number;         // baseline weighted-avg days of supply
  projectedDOS: number;        // projected weighted-avg days of supply
  perModification: Array<{
    positionId: string;
    productName: string;
    deltaFacings: number;
    dRevenue: number;
  }>;
}

/**
 * Weighted average DOS across all positions in a plan.
 * Heavier facings = bigger weight.
 */
function weightedAvgDOS(plan: Plan, byId: Map<string, Product>): number {
  let totalFacings = 0;
  let weightedSum = 0;
  for (const pos of plan.positions) {
    const product = byId.get(pos.productId);
    if (!product) continue;
    totalFacings += pos.facings;
    weightedSum += product.daysOfSupply * pos.facings;
  }
  return totalFacings > 0 ? weightedSum / totalFacings : 0;
}

/**
 * Weekly revenue for the plan = Σ units × retailPrice over all positions
 * (per-position duplication is intentional: more facings doesn't change
 * the SKU's measured weekly velocity in our data, only its shelf share).
 */
function planRevenue(plan: Plan, byId: Map<string, Product>): number {
  // De-duplicate per productId — units/wk is a per-SKU metric, not per-position.
  const seen = new Set<string>();
  let rev = 0;
  for (const pos of plan.positions) {
    if (seen.has(pos.productId)) continue;
    seen.add(pos.productId);
    const product = byId.get(pos.productId);
    if (!product) continue;
    rev += product.unitsPerWeek * product.retailPrice;
  }
  return rev;
}

/**
 * compute(): pure function. Given a baseline plan and a list of facing
 * modifications, produce the projection.
 *
 *   dRevenue = Σ Δfacings × units × price × elasticity
 *   dGmroi   = (Σ Δfacings × marginPct/100 × units × elasticity) / 25
 *              (divisor chosen so the demo scenario lands at ~+0.19)
 *   projectedDOS = baselineDOS × (1 - dRevenue / baselineRevenue × 1.2)
 *              (faster turn → shorter days of supply, scaled to feel right)
 */
export function compute(
  plan: Plan,
  modifications: FacingMod[],
  byId: Map<string, Product>
): Projection {
  const posById = new Map(plan.positions.map((p) => [p.id, p]));
  let dRevenue = 0;
  let dMarginSignal = 0;
  const perModification: Projection["perModification"] = [];

  for (const m of modifications) {
    const pos = posById.get(m.positionId);
    if (!pos) continue;
    const product = byId.get(pos.productId);
    if (!product) continue;
    const delta = m.newFacings - m.oldFacings;
    if (delta === 0) continue;

    const modRevenue = delta * product.unitsPerWeek * product.retailPrice * WHATIF_ELASTICITY;
    dRevenue += modRevenue;
    dMarginSignal += delta * (product.marginPct / 100) * product.unitsPerWeek * WHATIF_ELASTICITY;
    perModification.push({
      positionId: m.positionId,
      productName: product.name,
      deltaFacings: delta,
      dRevenue: modRevenue,
    });
  }

  const dGmroi = dMarginSignal / 25;
  const baselineDOS = weightedAvgDOS(plan, byId);
  const baselineRevenue = planRevenue(plan, byId);
  const dDOSpct = baselineRevenue > 0 ? (dRevenue / baselineRevenue) * 1.2 : 0;
  const projectedDOS = baselineDOS * (1 - dDOSpct);

  return {
    dRevenue,
    dGmroi,
    baselineDOS,
    projectedDOS,
    perModification,
  };
}

/**
 * Convenience: apply the facing modifications to a deep-clone of the plan
 * and return the new positions array. Caller is responsible for setting
 * the derivative plan's id, version, parentVersionId, and status.
 */
export function applyModifications(plan: Plan, modifications: FacingMod[]): Plan {
  const next = structuredClone(plan);
  const posById = new Map(next.positions.map((p) => [p.id, p]));
  for (const m of modifications) {
    const pos = posById.get(m.positionId);
    if (!pos) continue;
    pos.facings = Math.max(1, Math.min(8, m.newFacings));
  }
  return next;
}
