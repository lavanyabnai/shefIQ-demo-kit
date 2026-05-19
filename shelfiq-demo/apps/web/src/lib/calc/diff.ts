// Plan diff — pure function over two plans.
//
// Categories changes into added / removed / modified. Two positions are
// "the same" if they share an id OR if they share (doorIndex, shelfIndex,
// slotIndex). The first wins when both apply (e.g., the same id has moved
// shelves — treat as modified, not added/removed). For the demo, the
// pre-seeded v4.2 keeps every id from v4.1, so all changes land as
// modifications.

import type { Plan, Position } from "@/lib/types";
import { WHATIF_ELASTICITY } from "./whatif";
import { findProduct } from "@/lib/seed";

export interface AddedChange {
  kind: "added";
  position: Position;
  productName: string;
  dRevenue: number;
}
export interface RemovedChange {
  kind: "removed";
  position: Position;
  productName: string;
  dRevenue: number;
}
export interface ModifiedChange {
  kind: "modified";
  positionId: string;
  oldPosition: Position;
  newPosition: Position;
  productName: string;
  deltaFacings: number;
  dRevenue: number;
}
export type Change = AddedChange | RemovedChange | ModifiedChange;

export interface DiffResult {
  added: AddedChange[];
  removed: RemovedChange[];
  modified: ModifiedChange[];
  all: Change[];
  totalDRevenue: number;
}

function coordKey(p: Position): string {
  return `${p.doorIndex}:${p.shelfIndex}:${p.slotIndex}`;
}

function changeRevenue(position: Position, deltaFacings: number): number {
  const product = findProduct(position.productId);
  if (!product) return 0;
  return deltaFacings * product.unitsPerWeek * product.retailPrice * WHATIF_ELASTICITY;
}

export function diffPlans(baseline: Plan, candidate: Plan): DiffResult {
  const baselineById = new Map(baseline.positions.map((p) => [p.id, p]));
  const baselineByCoord = new Map(baseline.positions.map((p) => [coordKey(p), p]));
  const candidateById = new Map(candidate.positions.map((p) => [p.id, p]));
  const candidateByCoord = new Map(candidate.positions.map((p) => [coordKey(p), p]));

  const added: AddedChange[] = [];
  const removed: RemovedChange[] = [];
  const modified: ModifiedChange[] = [];
  const seen = new Set<string>();

  // Walk baseline first: anything missing from candidate is removed; anything
  // with the same id (or same coord) but different facings is modified.
  for (const old of baseline.positions) {
    const matchById = candidateById.get(old.id);
    const matchByCoord = candidateByCoord.get(coordKey(old));
    const candidatePos = matchById ?? matchByCoord;
    if (!candidatePos) {
      const productName = findProduct(old.productId)?.name ?? old.productId;
      removed.push({
        kind: "removed",
        position: old,
        productName,
        dRevenue: changeRevenue(old, -old.facings),
      });
      continue;
    }
    seen.add(candidatePos.id);
    if (
      candidatePos.productId !== old.productId ||
      candidatePos.facings !== old.facings
    ) {
      const productName = findProduct(old.productId)?.name ?? old.productId;
      const delta = candidatePos.facings - old.facings;
      modified.push({
        kind: "modified",
        positionId: candidatePos.id,
        oldPosition: old,
        newPosition: candidatePos,
        productName,
        deltaFacings: delta,
        dRevenue: changeRevenue(old, delta),
      });
    }
  }
  // Anything in candidate not yet accounted for is added.
  for (const cand of candidate.positions) {
    if (seen.has(cand.id)) continue;
    if (baselineById.has(cand.id) || baselineByCoord.has(coordKey(cand))) continue;
    const productName = findProduct(cand.productId)?.name ?? cand.productId;
    added.push({
      kind: "added",
      position: cand,
      productName,
      dRevenue: changeRevenue(cand, cand.facings),
    });
  }

  const all: Change[] = [...added, ...modified, ...removed];
  const totalDRevenue = all.reduce((a, c) => a + c.dRevenue, 0);
  return { added, removed, modified, all, totalDRevenue };
}
