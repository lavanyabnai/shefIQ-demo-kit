"use client";
import * as React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";
import { findProduct } from "@/lib/seed";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import type { Daypart } from "@/lib/types";
import { cn } from "@/lib/utils";

const DAYPARTS: { id: Daypart; label: string; sub: string }[] = [
  { id: "morning",    label: "Morning",    sub: "6 AM – 11 AM" },
  { id: "afternoon",  label: "Afternoon",  sub: "11 AM – 6 PM" },
  { id: "late-night", label: "Late Night", sub: "6 PM – close" },
];

export function PropertiesPanel() {
  const plan = useCanvasStore((s) => s.plan);
  const selectedId = useCanvasStore((s) => s.selectedPositionId);
  const updateFacings = useCanvasStore((s) => s.updateFacings);
  const updateDaypart = useCanvasStore((s) => s.updateDaypart);
  const removePosition = useCanvasStore((s) => s.removePosition);

  const position = React.useMemo(
    () => plan?.positions.find((p) => p.id === selectedId),
    [plan, selectedId]
  );
  const product = position ? findProduct(position.productId) : null;

  if (!position || !product) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 py-12 text-center text-[12.5px] text-muted-foreground">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-muted text-muted-foreground/70">
          ?
        </span>
        <div className="font-semibold text-foreground">No selection</div>
        <p className="max-w-[220px]">
          Click any product on the canvas to inspect and tune its placement,
          facings, and daypart.
        </p>
      </div>
    );
  }

  const toggleDaypart = (d: Daypart) => {
    const has = position.daypart.includes(d);
    const next = has ? position.daypart.filter((x) => x !== d) : [...position.daypart, d];
    updateDaypart(position.id, next);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-border p-4">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 h-9 w-2 shrink-0 rounded-sm"
            style={{ background: product.swatchColor }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold leading-tight">
              {product.name}
            </div>
            <div className="mt-0.5 text-[11.5px] text-muted-foreground">
              {product.brand} · {product.vendor}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary">{product.category}</Badge>
          <Badge variant="outline">{product.subcategory}</Badge>
        </div>
      </div>

      <div className="space-y-5 p-4">
        <Section title="Facings">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateFacings(position.id, position.facings - 1)}
              disabled={position.facings <= 1}
              aria-label="Decrease facings"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <div className="grid h-8 flex-1 place-items-center rounded-md border border-input bg-card text-[14px] font-semibold tabular-nums">
              ×{position.facings}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateFacings(position.id, position.facings + 1)}
              disabled={position.facings >= 8}
              aria-label="Increase facings"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Range 1–8 · linear width{" "}
            <span className="font-medium tabular-nums">
              {(product.dimensions.w * position.facings).toFixed(1)}″
            </span>
          </p>
        </Section>

        <Section title="Daypart">
          <div className="flex flex-col gap-2">
            {DAYPARTS.map((d) => {
              const checked = position.daypart.includes(d.id);
              return (
                <label
                  key={d.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-1.5 transition-colors hover:bg-muted/40",
                    checked && "border-primary/40 bg-primary/5"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleDaypart(d.id)}
                  />
                  <div className="flex-1">
                    <div className="text-[12.5px] font-semibold">{d.label}</div>
                    <div className="text-[10.5px] text-muted-foreground">{d.sub}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </Section>

        <Separator />

        <Section title="Specs">
          <Spec label="UPC" value={product.upc} mono />
          <Spec
            label="Dimensions"
            value={`${product.dimensions.w}″W × ${product.dimensions.h}″H × ${product.dimensions.d}″D`}
            mono
          />
          <Spec label="Retail" value={`$${product.retailPrice.toFixed(2)}`} mono />
          <Spec label="Margin" value={`${product.marginPct}%`} mono />
          <Spec label="Days of supply" value={`${product.daysOfSupply}d`} mono />
          <Spec
            label="Velocity"
            value={`${product.unitsPerWeek} units/wk`}
            mono
          />
        </Section>

        <Section title="Placement">
          <Spec
            label="Door / Shelf"
            value={`Door ${position.doorIndex + 1} · Shelf ${position.shelfIndex + 1}`}
          />
          <Spec label="Slot" value={`${position.slotIndex + 1}`} />
        </Section>

        <Separator />

        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            removePosition(position.id);
            toast.success(`${product.brand} removed`);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove from planogram
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function Spec({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1 text-[12.5px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", mono && "tabular-nums")}>{value}</span>
    </div>
  );
}
