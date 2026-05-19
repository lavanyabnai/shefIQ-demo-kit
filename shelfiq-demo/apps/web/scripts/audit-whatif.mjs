// Verify the What-If projection lands close to the demo brief's "+$342/wk"
// for the canonical scenario: beer-v41 with [Stella 4→2, White Claw 3→5].
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const products = JSON.parse(readFileSync(resolve(here, "../src/lib/seed/products.json"), "utf8"));
const plan = JSON.parse(readFileSync(resolve(here, "../src/lib/seed/plans/beer-v41.json"), "utf8"));

const ELASTICITY = 0.15;
const byId = Object.fromEntries(products.map((p) => [p.id, p]));

// --- helpers mirroring lib/calc/whatif.ts ---
function weightedAvgDOS(positions) {
  let total = 0, weighted = 0;
  for (const pos of positions) {
    const p = byId[pos.productId];
    if (!p) continue;
    total += pos.facings;
    weighted += p.daysOfSupply * pos.facings;
  }
  return total > 0 ? weighted / total : 0;
}
function planRevenue(positions) {
  const seen = new Set();
  let rev = 0;
  for (const pos of positions) {
    if (seen.has(pos.productId)) continue;
    seen.add(pos.productId);
    const p = byId[pos.productId];
    if (p) rev += p.unitsPerWeek * p.retailPrice;
  }
  return rev;
}

// --- Build modifications for the canonical scenario ---
// Stella has 2 positions on Door 5 (s3 + s4), each 2 facings → drop each to 1.
// White Claw is 1 position on Door 4 s2, 3 facings → bump to 5.
const stellaPositions = plan.positions.filter((p) => p.productId === "p-stella");
const whiteClawPositions = plan.positions.filter((p) => p.productId === "p-white-claw");
const mods = [
  ...stellaPositions.map((p) => ({ positionId: p.id, oldFacings: p.facings, newFacings: 1 })),
  ...whiteClawPositions.map((p) => ({ positionId: p.id, oldFacings: p.facings, newFacings: 5 })),
];

// --- Compute projection ---
let dRevenue = 0;
let dMarginSignal = 0;
const posById = Object.fromEntries(plan.positions.map((p) => [p.id, p]));
for (const m of mods) {
  const pos = posById[m.positionId];
  const product = byId[pos.productId];
  const delta = m.newFacings - m.oldFacings;
  dRevenue += delta * product.unitsPerWeek * product.retailPrice * ELASTICITY;
  dMarginSignal += delta * (product.marginPct / 100) * product.unitsPerWeek * ELASTICITY;
}
const dGmroi = dMarginSignal / 25;
const baselineDOS = weightedAvgDOS(plan.positions);
const baselineRevenue = planRevenue(plan.positions);
const projectedDOS = baselineDOS * (1 - (dRevenue / baselineRevenue) * 1.2);

console.log("What-If projection · beer-v41 · [Stella 4→2, White Claw 3→5]");
console.table({
  elasticity: ELASTICITY.toFixed(2),
  baselineRevenue: `$${baselineRevenue.toFixed(2)}/wk`,
  dRevenue: `$${dRevenue.toFixed(2)}/wk`,
  dGmroi: dGmroi.toFixed(3),
  baselineDOS: `${baselineDOS.toFixed(1)}d`,
  projectedDOS: `${projectedDOS.toFixed(1)}d`,
});

// Demo target band: $300 – $360/wk (brief says +$342, we're flexible)
const pass =
  dRevenue >= 300 && dRevenue <= 360 &&
  dGmroi >= 0.12 && dGmroi <= 0.28 &&
  projectedDOS < baselineDOS;
console.log(`OVERALL: ${pass ? "PASS" : "FAIL"}`);
process.exit(pass ? 0 : 1);
