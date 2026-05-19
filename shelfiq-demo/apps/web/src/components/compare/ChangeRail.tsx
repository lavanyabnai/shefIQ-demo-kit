"use client";
import * as React from "react";
import { Plus, Minus, ArrowRight, GitCompare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Change, DiffResult } from "@/lib/calc/diff";
import { findProduct } from "@/lib/seed";
import { cn } from "@/lib/utils";

interface Props {
  diff: DiffResult;
  hoveredPositionId: string | null;
  onHoverChange: (positionId: string | null) => void;
}

export function ChangeRail({ diff, hoveredPositionId, onHoverChange }: Props) {
  const positive = diff.totalDRevenue >= 0;
  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
          <GitCompare className="h-3 w-3" /> Change summary
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span
            className={cn(
              "text-[22px] font-semibold tabular-nums",
              positive ? "text-success" : "text-destructive"
            )}
          >
            {positive ? "+" : "−"}${Math.abs(diff.totalDRevenue).toFixed(0)}
          </span>
          <span className="text-[11.5px] text-muted-foreground">/ wk projected</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {diff.added.length > 0 && (
            <Badge variant="success" className="text-[10px]">
              +{diff.added.length} added
            </Badge>
          )}
          {diff.modified.length > 0 && (
            <Badge variant="info" className="text-[10px]">
              {diff.modified.length} modified
            </Badge>
          )}
          {diff.removed.length > 0 && (
            <Badge variant="destructive" className="text-[10px]">
              −{diff.removed.length} removed
            </Badge>
          )}
          {diff.all.length === 0 && (
            <Badge variant="secondary" className="text-[10px]">
              No changes
            </Badge>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {diff.all.length === 0 ? (
          <div className="grid h-full place-items-center px-6 text-center text-[12.5px] text-muted-foreground">
            The two versions are identical.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {diff.all.map((change) => (
              <ChangeRow
                key={changeKey(change)}
                change={change}
                hovered={
                  hoveredPositionId === getChangePositionId(change)
                }
                onHover={(hover) =>
                  onHoverChange(hover ? getChangePositionId(change) : null)
                }
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function getChangePositionId(change: Change): string {
  if (change.kind === "modified") return change.positionId;
  return change.position.id;
}

function changeKey(change: Change): string {
  if (change.kind === "modified") return `m:${change.positionId}`;
  return `${change.kind[0]}:${change.position.id}`;
}

function ChangeRow({
  change,
  hovered,
  onHover,
}: {
  change: Change;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  const product = findProduct(
    change.kind === "modified" ? change.newPosition.productId : change.position.productId
  );
  const positive = change.dRevenue >= 0;
  return (
    <Card
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "flex cursor-default flex-col gap-1.5 p-2.5 transition-colors",
        hovered && "border-yellow-400 bg-yellow-400/10"
      )}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-0.5 h-7 w-1.5 shrink-0 rounded-sm"
          style={{ background: product?.swatchColor ?? "#94a3b8" }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-semibold leading-tight">
            {product?.brand ?? change.kind}
          </div>
          <div className="text-[10.5px] text-muted-foreground">
            <ChangeLabel change={change} />
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 text-[11.5px] font-semibold tabular-nums",
            positive ? "text-success" : "text-destructive"
          )}
        >
          {positive ? "+" : "−"}${Math.abs(change.dRevenue).toFixed(0)}/wk
        </span>
      </div>
      {change.kind === "modified" && (
        <div className="ml-3.5 inline-flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
          <span className="tabular-nums">×{change.oldPosition.facings} facings</span>
          <ArrowRight className="h-3 w-3 opacity-70" />
          <span
            className={cn(
              "tabular-nums",
              positive ? "text-success" : "text-destructive"
            )}
          >
            ×{change.newPosition.facings}
          </span>
          <span className="ml-1.5 opacity-70">
            (Door {change.newPosition.doorIndex + 1} · Shelf {change.newPosition.shelfIndex + 1})
          </span>
        </div>
      )}
    </Card>
  );
}

function ChangeLabel({ change }: { change: Change }) {
  switch (change.kind) {
    case "added":
      return (
        <span className="text-success">
          <Plus className="-mt-0.5 mr-0.5 inline h-2.5 w-2.5" />
          Added at Door {change.position.doorIndex + 1} · Shelf {change.position.shelfIndex + 1}
        </span>
      );
    case "removed":
      return (
        <span className="text-destructive">
          <Minus className="-mt-0.5 mr-0.5 inline h-2.5 w-2.5" />
          Removed from Door {change.position.doorIndex + 1} · Shelf {change.position.shelfIndex + 1}
        </span>
      );
    case "modified":
      return (
        <span>
          Facings {change.deltaFacings > 0 ? "+" : ""}
          {change.deltaFacings} · {change.kind}
        </span>
      );
  }
}
