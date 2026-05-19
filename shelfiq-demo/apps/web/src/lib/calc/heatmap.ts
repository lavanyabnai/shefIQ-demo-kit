// Heatmap math — pure functions over a Plan + product catalog.
// Each metric returns a unitless "signal" in roughly [0, 2] where 1 is
// balanced/neutral, < 1 is "under" and > 1 is "over". The diverging palette
// (`heatmapColor`) maps signals to tints — cyan/green for under/balanced,
// amber/red for over. This intentionally diverges from the symmetric red/
// red-at-both-extremes rule in spec.md so the demo can show Stella as red
// (over-spaced waste) and White Claw as cyan (under-spaced opportunity).

import type { HeatmapMode, Plan, Position, Product } from "@/lib/types";

export interface HeatmapDatum {
  positionId: string;
  metric: number;        // raw metric value (ratio, units, etc.)
  ratio: number;         // normalized signal: 1 = balanced
  fill: string;          // hex color from the diverging palette
  label: string;         // tooltip text ("ratio 2.79 — over-spaced")
}

export interface HeatmapResult {
  mode: HeatmapMode;
  byPositionId: Map<string, HeatmapDatum>;
}

const PALETTE = {
  underStrong: "#22d3ee", // cyan-400  (ratio < 0.7)
  under:       "#34d399", // emerald-400 (0.7–0.85)
  balanced:    "#86efac", // emerald-300 (0.85–1.15)
  mildOver:    "#f59e0b", // amber-500 (1.15–1.3)
  over:        "#dc2626", // red-600  (1.3+)
};

export function heatmapColor(ratio: number): string {
  if (!Number.isFinite(ratio)) return PALETTE.balanced;
  if (ratio < 0.7) return PALETTE.underStrong;
  if (ratio < 0.85) return PALETTE.under;
  if (ratio < 1.15) return PALETTE.balanced;
  if (ratio < 1.3) return PALETTE.mildOver;
  return PALETTE.over;
}

export function heatmapBand(ratio: number): "under-strong" | "under" | "balanced" | "mild-over" | "over" {
  if (!Number.isFinite(ratio)) return "balanced";
  if (ratio < 0.7) return "under-strong";
  if (ratio < 0.85) return "under";
  if (ratio < 1.15) return "balanced";
  if (ratio < 1.3) return "mild-over";
  return "over";
}

export const HEATMAP_LEGEND = [
  { band: "under-strong", color: PALETTE.underStrong, label: "Under-spaced" },
  { band: "under",        color: PALETTE.under,       label: "Slight under" },
  { band: "balanced",     color: PALETTE.balanced,    label: "Balanced" },
  { band: "mild-over",    color: PALETTE.mildOver,    label: "Slight over" },
  { band: "over",         color: PALETTE.over,        label: "Over-spaced" },
] as const;

/**
 * space-to-sales ratio = spaceShare / salesShare.
 *
 *   spaceShare = (facings × product.width) / Σ(facings × width)
 *   salesShare = (units × retailPrice)     / Σ(units × retailPrice)
 *
 * 1.0 = balanced. Red > 1.3 (over-spaced waste). Cyan < 0.7 (under-spaced
 * opportunity). Mirrors the formula in spec.md but uses a diverging palette.
 */
export function computeSpaceToSales(plan: Plan, productById: Map<string, Product>): HeatmapResult {
  let totalLinear = 0;
  let totalRevenue = 0;
  const metrics: { position: Position; product: Product; linear: number; revenue: number }[] = [];

  for (const pos of plan.positions) {
    const product = productById.get(pos.productId);
    if (!product) continue;
    const linear = pos.facings * product.dimensions.w;
    const revenue = product.unitsPerWeek * product.retailPrice;
    metrics.push({ position: pos, product, linear, revenue });
    totalLinear += linear;
    totalRevenue += revenue;
  }

  const byPositionId = new Map<string, HeatmapDatum>();
  for (const m of metrics) {
    const spaceShare = totalLinear > 0 ? m.linear / totalLinear : 0;
    const salesShare = totalRevenue > 0 ? m.revenue / totalRevenue : 0;
    const ratio = salesShare > 0 ? spaceShare / salesShare : 1;
    byPositionId.set(m.position.id, {
      positionId: m.position.id,
      metric: ratio,
      ratio,
      fill: heatmapColor(ratio),
      label: formatSpaceToSalesLabel(ratio, spaceShare, salesShare),
    });
  }
  return { mode: "space-to-sales", byPositionId };
}

function formatSpaceToSalesLabel(ratio: number, spaceShare: number, salesShare: number): string {
  const band = heatmapBand(ratio);
  const verdict =
    band === "over" ? "over-spaced"
    : band === "mild-over" ? "slightly over"
    : band === "balanced" ? "balanced"
    : band === "under" ? "slightly under"
    : "under-spaced";
  return `Ratio ${ratio.toFixed(2)} · ${(spaceShare * 100).toFixed(1)}% space / ${(salesShare * 100).toFixed(1)}% sales · ${verdict}`;
}

/**
 * Generic ratio-style metric for the other modes (velocity, gmroi, dos,
 * margin). Each computes a per-position metric, then divides by the plan's
 * mean to produce a "vs. average" ratio. Some metrics are inverted so that
 * a higher metric value reads as the "good" direction (cyan-green) and a
 * lower value reads as "stale/risk" (amber-red). DOS is the obvious inverted
 * case — high DOS = stale inventory, so we invert.
 */
export function computeMetricRatio(
  mode: Exclude<HeatmapMode, "none" | "space-to-sales">,
  plan: Plan,
  productById: Map<string, Product>
): HeatmapResult {
  const samples: { position: Position; product: Product; value: number }[] = [];
  for (const pos of plan.positions) {
    const product = productById.get(pos.productId);
    if (!product) continue;
    let v = 0;
    switch (mode) {
      case "velocity":
        v = product.unitsPerWeek;
        break;
      case "gmroi":
        // GMROI ≈ marginPct × (sales / linear) — simplified for the demo.
        v = (product.marginPct / 100) * (product.unitsPerWeek * product.retailPrice) / (product.dimensions.w * pos.facings);
        break;
      case "dos":
        v = product.daysOfSupply;
        break;
      case "margin":
        v = product.marginPct;
        break;
    }
    samples.push({ position: pos, product, value: v });
  }
  const mean = samples.length
    ? samples.reduce((a, s) => a + s.value, 0) / samples.length
    : 0;

  const byPositionId = new Map<string, HeatmapDatum>();
  for (const s of samples) {
    let ratio = mean > 0 ? s.value / mean : 1;
    if (mode === "dos") ratio = 1 / Math.max(0.1, ratio); // higher DOS = worse
    if (mode === "margin") ratio = 1 / Math.max(0.1, ratio); // lower margin = warmer
    byPositionId.set(s.position.id, {
      positionId: s.position.id,
      metric: s.value,
      ratio,
      fill: heatmapColor(ratio),
      label: `${labelFor(mode)} ${formatValue(mode, s.value)} · ${(ratio * 100).toFixed(0)}% vs avg`,
    });
  }
  return { mode, byPositionId };
}

function labelFor(mode: HeatmapMode): string {
  switch (mode) {
    case "velocity": return "Velocity";
    case "gmroi": return "GMROI";
    case "dos": return "Days of supply";
    case "margin": return "Margin";
    case "space-to-sales": return "Space-to-sales";
    default: return mode;
  }
}

function formatValue(mode: HeatmapMode, v: number): string {
  switch (mode) {
    case "velocity": return `${Math.round(v)} units/wk`;
    case "gmroi": return v.toFixed(2);
    case "dos": return `${Math.round(v)}d`;
    case "margin": return `${Math.round(v)}%`;
    default: return v.toFixed(2);
  }
}

export function computeHeatmap(
  mode: HeatmapMode,
  plan: Plan,
  productById: Map<string, Product>
): HeatmapResult | null {
  if (mode === "none") return null;
  if (mode === "space-to-sales") return computeSpaceToSales(plan, productById);
  return computeMetricRatio(mode, plan, productById);
}
