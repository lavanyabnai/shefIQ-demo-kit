// Verify the heatmap color assignments end up where the demo brief needs
// them: Stella red, White Claw cyan (under-spaced), others green/balanced.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const products = JSON.parse(readFileSync(resolve(here, "../src/lib/seed/products.json"), "utf8"));
const plan = JSON.parse(readFileSync(resolve(here, "../src/lib/seed/plans/beer-v41.json"), "utf8"));

const byId = Object.fromEntries(products.map((p) => [p.id, p]));

const PALETTE = {
  underStrong: "#22d3ee",
  under:       "#34d399",
  balanced:    "#86efac",
  mildOver:    "#f59e0b",
  over:        "#dc2626",
};

function heatmapColor(ratio) {
  if (ratio < 0.7) return PALETTE.underStrong;
  if (ratio < 0.85) return PALETTE.under;
  if (ratio < 1.15) return PALETTE.balanced;
  if (ratio < 1.3) return PALETTE.mildOver;
  return PALETTE.over;
}

function band(ratio) {
  if (ratio < 0.7) return "under-strong";
  if (ratio < 0.85) return "under";
  if (ratio < 1.15) return "balanced";
  if (ratio < 1.3) return "mild-over";
  return "over";
}

// Aggregate per SKU then compute ratios.
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
  s.lin = s.facings * s.w;
  s.rev = s.units * s.price;
  totalLin += s.lin;
  totalRev += s.rev;
}

let pass = true;
const rows = [];
for (const s of Object.values(agg)) {
  s.ratio = (s.lin / totalLin) / (s.rev / totalRev);
  s.band = band(s.ratio);
  s.color = heatmapColor(s.ratio);

  let want;
  let expects;
  if (s.name.startsWith("Stella")) {
    want = s.band === "over";
    expects = "over (red)";
  } else if (s.name.startsWith("White Claw")) {
    want = s.band === "under-strong";
    expects = "under-strong (cyan)";
  } else {
    want = s.band === "balanced" || s.band === "under";
    expects = "balanced / under";
  }
  if (!want) pass = false;
  rows.push({
    sku: s.name,
    ratio: s.ratio.toFixed(2),
    band: s.band,
    color: s.color,
    expects,
    result: want ? "PASS" : "FAIL",
  });
}

console.log("Beer Cooler v4.1 · space-to-sales heatmap audit");
console.table(rows);
console.log(`OVERALL: ${pass ? "PASS" : "FAIL"}`);
process.exit(pass ? 0 : 1);
