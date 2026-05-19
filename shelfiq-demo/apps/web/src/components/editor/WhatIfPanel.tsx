"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Sparkles, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/toast";
import { useWhatIfStore } from "@/lib/stores/whatIfStore";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { applyModifications } from "@/lib/calc/whatif";
import { findProduct } from "@/lib/seed";
import type { Plan, Position } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Distribute a target SKU-level facing count across N positions as evenly
 * as possible, clamped to [1, 8] per position.
 */
function distributeFacings(numPositions: number, totalTarget: number): number[] {
  if (numPositions === 0) return [];
  const min = numPositions;
  const max = numPositions * 8;
  const total = Math.max(min, Math.min(max, totalTarget));
  const base = Math.floor(total / numPositions);
  const extra = total - base * numPositions;
  return Array.from({ length: numPositions }, (_, i) => (i < extra ? base + 1 : base));
}

/**
 * Pick a deterministic derivative plan id. For beer-v41 the convention is
 * beer-v42 (matches the pre-seeded file and planograms.json). For other
 * baselines we append "-v<next>".
 */
function derivativeId(baselineId: string): string {
  if (baselineId === "beer-v41") return "beer-v42";
  const m = baselineId.match(/^(.*)-v(\d+)$/);
  if (m) return `${m[1]}-v${Number(m[2]) + 1}`;
  return `${baselineId}-revised`;
}

function nextVersion(currentVersion: string): string {
  const m = currentVersion.match(/^v(\d+)\.(\d+)$/);
  if (m) return `v${m[1]}.${Number(m[2]) + 1}`;
  return `${currentVersion}.1`;
}

export function WhatIfPanel() {
  const router = useRouter();
  const isOpen = useWhatIfStore((s) => s.isOpen);
  const baseline = useWhatIfStore((s) => s.baseline);
  const modifications = useWhatIfStore((s) => s.modifications);
  const projection = useWhatIfStore((s) => s.projection);
  const setFacings = useWhatIfStore((s) => s.setFacings);
  const close = useWhatIfStore((s) => s.close);
  const reset = useWhatIfStore((s) => s.reset);
  const createPlan = useCanvasStore((s) => s.createPlan);
  const [applying, setApplying] = React.useState(false);

  // Group baseline positions by productId so the user adjusts at SKU level,
  // not per-position. Stella has 2 positions on Door 5 — both move together.
  const groups = React.useMemo(() => {
    if (!baseline) return [];
    const m = new Map<string, Position[]>();
    for (const p of baseline.positions) {
      const arr = m.get(p.productId);
      if (arr) arr.push(p);
      else m.set(p.productId, [p]);
    }
    return Array.from(m.entries()).map(([productId, positions]) => ({
      productId,
      positions,
      product: findProduct(productId),
    }));
  }, [baseline]);

  const getCurrentTotal = (positions: Position[]) =>
    positions.reduce((sum, p) => {
      const mod = modifications.get(p.id);
      return sum + (mod ? mod.newFacings : p.facings);
    }, 0);

  const getBaselineTotal = (positions: Position[]) =>
    positions.reduce((sum, p) => sum + p.facings, 0);

  const adjustGroup = (positions: Position[], newTotal: number) => {
    const distributed = distributeFacings(positions.length, newTotal);
    positions.forEach((p, i) => setFacings(p.id, distributed[i]));
  };

  const onApply = () => {
    if (!baseline || !projection) return;
    setApplying(true);
    const modsList = Array.from(modifications.values());
    const updated = applyModifications(baseline, modsList);
    const newId = derivativeId(baseline.id);
    const newPlan: Plan = {
      ...updated,
      id: newId,
      version: nextVersion(baseline.version),
      status: "in-review",
      parentVersionId: baseline.id,
      updatedAt: new Date().toISOString(),
    };
    createPlan(newPlan);
    toast.success(`Changes applied · ${newPlan.version} draft created`, {
      description: `${modsList.length} ${modsList.length === 1 ? "change" : "changes"} · projected +$${projection.dRevenue.toFixed(0)}/wk`,
    });
    reset();
    router.push(`/planograms/${baseline.id}/compare/${newId}`);
    setTimeout(() => setApplying(false), 0);
  };

  const onDiscard = () => {
    close();
    toast.message("What-If discarded");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : close())}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[420px]">
        <SheetHeader className="border-b border-border p-5 text-left">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            What-If Simulator
          </SheetTitle>
          <SheetDescription>
            Adjust facings per SKU. The projection updates live with linear
            elasticity (0.15) — MNL model in production.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1.5 p-3">
            {groups.map((g) => (
              <SkuRow
                key={g.productId}
                productName={g.product?.brand ?? g.productId}
                swatch={g.product?.swatchColor ?? "#94a3b8"}
                baselineTotal={getBaselineTotal(g.positions)}
                currentTotal={getCurrentTotal(g.positions)}
                positionCount={g.positions.length}
                onChange={(next) => adjustGroup(g.positions, next)}
              />
            ))}
          </div>
        </ScrollArea>

        {projection && (
          <ProjectionCard
            dRevenue={projection.dRevenue}
            dGmroi={projection.dGmroi}
            baselineDOS={projection.baselineDOS}
            projectedDOS={projection.projectedDOS}
            modCount={modifications.size}
          />
        )}

        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-5 py-3">
          <Button variant="ghost" size="sm" className="h-8" onClick={onDiscard}>
            Discard
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5"
            disabled={modifications.size === 0 || applying}
            onClick={onApply}
          >
            {applying && <Loader2 className="h-3 w-3 animate-spin" />}
            Apply to Plan
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SkuRow({
  productName,
  swatch,
  baselineTotal,
  currentTotal,
  positionCount,
  onChange,
}: {
  productName: string;
  swatch: string;
  baselineTotal: number;
  currentTotal: number;
  positionCount: number;
  onChange: (next: number) => void;
}) {
  const dirty = currentTotal !== baselineTotal;
  const min = positionCount;
  const max = positionCount * 8;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border bg-card px-2.5 py-2 transition-colors",
        dirty ? "border-primary bg-primary/5" : "border-border"
      )}
    >
      <span className="h-8 w-1.5 shrink-0 rounded-sm" style={{ background: swatch }} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-semibold leading-tight">{productName}</div>
        <div className="mt-0.5 text-[10.5px] text-muted-foreground">
          {positionCount} {positionCount === 1 ? "position" : "positions"}
          {dirty && (
            <span className="ml-1.5 text-primary">
              · was {baselineTotal} → {currentTotal}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onChange(currentTotal - 1)}
          disabled={currentTotal <= min}
          aria-label={`Decrease facings for ${productName}`}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <div className="grid h-7 w-9 place-items-center rounded-md border border-input bg-background text-[12.5px] font-semibold tabular-nums">
          {currentTotal}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onChange(currentTotal + 1)}
          disabled={currentTotal >= max}
          aria-label={`Increase facings for ${productName}`}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function ProjectionCard({
  dRevenue,
  dGmroi,
  baselineDOS,
  projectedDOS,
  modCount,
}: {
  dRevenue: number;
  dGmroi: number;
  baselineDOS: number;
  projectedDOS: number;
  modCount: number;
}) {
  const fmtCurrency = (n: number) => `${n >= 0 ? "+" : "−"}$${Math.abs(n).toFixed(0)}`;
  const fmtGmroi = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(2)}`;
  const trendColor = (positive: boolean) =>
    positive ? "text-success" : "text-destructive";
  const revPositive = dRevenue > 0;
  const gmroiPositive = dGmroi > 0;
  const dosPositive = projectedDOS < baselineDOS; // shorter DOS = better

  return (
    <div className="border-t border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
          Projection
        </div>
        <Badge variant={modCount > 0 ? "default" : "secondary"} className="text-[10px]">
          {modCount} {modCount === 1 ? "change" : "changes"}
        </Badge>
      </div>
      <div className="flex flex-col gap-2.5">
        <ProjRow
          label="Projected weekly sales"
          value={fmtCurrency(dRevenue)}
          tone={modCount === 0 ? "text-muted-foreground" : trendColor(revPositive)}
        />
        <ProjRow
          label="Projected GMROI"
          value={fmtGmroi(dGmroi)}
          tone={modCount === 0 ? "text-muted-foreground" : trendColor(gmroiPositive)}
        />
        <ProjRow
          label="Projected DOS"
          value={`${baselineDOS.toFixed(1)}d → ${projectedDOS.toFixed(1)}d`}
          tone={modCount === 0 ? "text-muted-foreground" : trendColor(dosPositive)}
        />
      </div>
      <Separator className="my-3" />
      <p className="text-[10.5px] leading-relaxed text-muted-foreground">
        Linear elasticity estimate, calibrated against historical Quikstop
        velocity data. Production uses a non-linear MNL choice model.
      </p>
    </div>
  );
}

function ProjRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[13px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold tabular-nums", tone)}>{value}</span>
    </div>
  );
}
