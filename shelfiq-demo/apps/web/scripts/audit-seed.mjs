// Re-run space-to-sales math against the seed and assert demo narrative invariants.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const products = JSON.parse(readFileSync(resolve(here, "../src/lib/seed/products.json"), "utf8"));
const plan = JSON.parse(readFileSync(resolve(here, "../src/lib/seed/plans/beer-v41.json"), "utf8"));

const byId = Object.fromEntries(products.map((p) => [p.id, p]));
const agg = {};
for (const pos of plan.positions) {
  const p = byId[pos.productId];
  if (!agg[p.id]) {
    agg[p.id] = { name: p.name, facings: 0, w: p.dimensions.w, units: p.unitsPerWeek, price: p.retailPrice };
  }
  agg[p.id].facings += pos.facings;
}

let totalLin = 0;
let totalRev = 0;
for (const s of Object.values(agg)) {
  s.linear = s.facings * s.w;
  s.revenue = s.units * s.price;
  totalLin += s.linear;
  totalRev += s.revenue;
}

let overallPass = true;
const rows = [];
for (const s of Object.values(agg)) {
  const ratio = (s.linear / totalLin) / (s.revenue / totalRev);
  let want;
  let rule;
  if (s.name.startsWith("Stella")) {
    want = ratio > 1.3;
    rule = "> 1.30 (over)";
  } else if (s.name.startsWith("White Claw")) {
    want = ratio < 0.7;
    rule = "< 0.70 (under)";
  } else {
    want = ratio >= 0.85 && ratio <= 1.15;
    rule = "0.85–1.15 (green)";
  }
  if (!want) overallPass = false;
  rows.push({
    sku: s.name,
    facings: s.facings,
    spaceShare: ((s.linear / totalLin) * 100).toFixed(1) + "%",
    salesShare: ((s.revenue / totalRev) * 100).toFixed(1) + "%",
    ratio: ratio.toFixed(2),
    expects: rule,
    result: want ? "PASS" : "FAIL",
  });
}

console.log(
  `positions=${plan.positions.length} facings=${Object.values(agg).reduce((a, s) => a + s.facings, 0)} linear=${totalLin.toFixed(1)}″ revenue=$${totalRev.toFixed(2)}`
);
console.table(rows);
console.log(`OVERALL: ${overallPass ? "PASS" : "FAIL"}`);
process.exit(overallPass ? 0 : 1);
