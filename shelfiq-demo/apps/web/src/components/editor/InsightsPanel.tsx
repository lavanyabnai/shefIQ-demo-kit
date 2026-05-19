"use client";
import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { products as allProducts, findProduct } from "@/lib/seed";
import { computeSpaceToSales, heatmapColor } from "@/lib/calc/heatmap";
import { cn } from "@/lib/utils";

const SUBCATEGORY_COLORS = [
  "#0f766e",
  "#2563eb",
  "#ea580c",
  "#a16207",
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#65a30d",
];

export function InsightsPanel() {
  const plan = useCanvasStore((s) => s.plan);

  const productById = React.useMemo(
    () => new Map(allProducts.map((p) => [p.id, p])),
    []
  );

  const stats = React.useMemo(() => {
    if (!plan) return null;
    const seenProducts = new Set<string>();
    let revenue = 0;
    let marginDollars = 0;
    let linearInches = 0;
    let facings = 0;
    for (const pos of plan.positions) {
      const product = productById.get(pos.productId);
      if (!product) continue;
      linearInches += pos.facings * product.dimensions.w;
      facings += pos.facings;
      if (!seenProducts.has(product.id)) {
        seenProducts.add(product.id);
        const rev = product.unitsPerWeek * product.retailPrice;
        revenue += rev;
        marginDollars += rev * (product.marginPct / 100);
      }
    }
    return {
      revenue,
      marginDollars,
      marginPct: revenue > 0 ? (marginDollars / revenue) * 100 : 0,
      linearFt: linearInches / 12,
      facings,
      positions: plan.positions.length,
      skuCount: seenProducts.size,
    };
  }, [plan, productById]);

  const heatmap = React.useMemo(
    () => (plan ? computeSpaceToSales(plan, productById) : null),
    [plan, productById]
  );

  const ranked = React.useMemo(() => {
    if (!plan || !heatmap) return [];
    return plan.positions
      .map((pos) => {
        const datum = heatmap.byPositionId.get(pos.id);
        const product = findProduct(pos.productId);
        if (!datum || !product) return null;
        return {
          positionId: pos.id,
          productName: product.brand,
          swatch: product.swatchColor,
          ratio: datum.ratio,
          facings: pos.facings,
          doorIndex: pos.doorIndex,
          shelfIndex: pos.shelfIndex,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [plan, heatmap]);

  const overSpaced = React.useMemo(
    () => [...ranked].sort((a, b) => b.ratio - a.ratio).slice(0, 5),
    [ranked]
  );
  const underSpaced = React.useMemo(
    () => [...ranked].sort((a, b) => a.ratio - b.ratio).slice(0, 5),
    [ranked]
  );

  const subcategoryData = React.useMemo(() => {
    if (!plan) return [];
    const totals = new Map<string, number>();
    for (const pos of plan.positions) {
      const product = productById.get(pos.productId);
      if (!product) continue;
      const sub = product.subcategory;
      totals.set(sub, (totals.get(sub) ?? 0) + pos.facings * product.dimensions.w);
    }
    return Array.from(totals.entries())
      .map(([name, linear]) => ({ name, value: linear }))
      .sort((a, b) => b.value - a.value);
  }, [plan, productById]);

  const totalLinearInches = subcategoryData.reduce((a, s) => a + s.value, 0);

  const setSelection = useCanvasStore((s) => s.setSelection);

  if (!plan || !stats) {
    return (
      <div className="grid h-full place-items-center px-6 py-12 text-center text-[12.5px] text-muted-foreground">
        Load a plan to see live aggregates.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="grid grid-cols-2 gap-2 border-b border-border p-4">
        <Stat label="Weekly revenue" value={`$${stats.revenue.toFixed(0)}`} sub="across all SKUs" />
        <Stat label="Avg margin" value={`${stats.marginPct.toFixed(1)}%`} sub={`$${stats.marginDollars.toFixed(0)}/wk`} />
        <Stat label="Linear ft" value={stats.linearFt.toFixed(1)} sub={`${stats.facings} facings`} />
        <Stat label="SKUs · positions" value={`${stats.skuCount} · ${stats.positions}`} />
      </div>

      <section className="border-b border-border p-4">
        <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
          Subcategory breakdown
        </div>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subcategoryData}
                dataKey="value"
                innerRadius={42}
                outerRadius={72}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              >
                {subcategoryData.map((_, i) => (
                  <Cell key={i} fill={SUBCATEGORY_COLORS[i % SUBCATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <RTooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  borderRadius: 6,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(v: unknown) => {
                  const n = Number(v);
                  return [
                    `${(n / 12).toFixed(1)}ft (${((n / totalLinearInches) * 100).toFixed(1)}%)`,
                    "linear",
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
          {subcategoryData.map((s, i) => (
            <div key={s.name} className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ background: SUBCATEGORY_COLORS[i % SUBCATEGORY_COLORS.length] }}
              />
              {s.name}
              <span className="tabular-nums opacity-70">
                {((s.value / totalLinearInches) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      <RankList
        title="Top over-spaced"
        icon={<TrendingUp className="h-3 w-3 text-destructive" />}
        items={overSpaced}
        direction="over"
        onPick={setSelection}
      />
      <RankList
        title="Top under-spaced"
        icon={<TrendingDown className="h-3 w-3 text-info" />}
        items={underSpaced}
        direction="under"
        onPick={setSelection}
      />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 p-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-[15px] font-semibold tabular-nums">{value}</div>
      {sub && <div className="text-[10.5px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function RankList({
  title,
  icon,
  items,
  direction,
  onPick,
}: {
  title: string;
  icon: React.ReactNode;
  items: Array<{
    positionId: string;
    productName: string;
    swatch: string;
    ratio: number;
    facings: number;
    doorIndex: number;
    shelfIndex: number;
  }>;
  direction: "over" | "under";
  onPick: (positionId: string) => void;
}) {
  return (
    <section className="border-b border-border p-4 last:border-b-0">
      <div className="mb-2 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {title}
      </div>
      {items.length === 0 ? (
        <div className="text-[11.5px] text-muted-foreground">No positions match.</div>
      ) : (
        <div className="flex flex-col gap-1">
          {items.map((it) => {
            const color = heatmapColor(it.ratio);
            return (
              <button
                key={it.positionId}
                type="button"
                onClick={() => onPick(it.positionId)}
                className="flex items-center gap-2 rounded-md border border-border bg-card p-1.5 text-left transition-colors hover:bg-muted/40"
              >
                <span
                  className="h-7 w-1.5 shrink-0 rounded-sm"
                  style={{ background: it.swatch }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-semibold leading-tight">
                    {it.productName}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Door {it.doorIndex + 1} · Shelf {it.shelfIndex + 1} · ×{it.facings}
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums"
                  )}
                  style={{ background: `${color}30`, color }}
                >
                  {it.ratio.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {direction === "over" && items[0] && items[0].ratio > 1.3 && (
        <div className="mt-2 rounded-md bg-destructive/10 px-2 py-1.5 text-[10.5px] text-destructive">
          <strong>{items[0].productName}</strong> is taking{" "}
          {(items[0].ratio * 100).toFixed(0)}% of its earned share — biggest
          over-spaced waste in this plan.
        </div>
      )}
      {direction === "under" && items[0] && items[0].ratio < 0.7 && (
        <div className="mt-2 rounded-md bg-info/10 px-2 py-1.5 text-[10.5px] text-info">
          <strong>{items[0].productName}</strong> is at{" "}
          {(items[0].ratio * 100).toFixed(0)}% of its earned share — biggest
          under-spaced opportunity.
        </div>
      )}
    </section>
  );
}
