"use client";
import * as React from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/seed";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER: Category[] = [
  "Beer",
  "Energy",
  "Cold Beverages",
  "Salty Snacks",
  "Candy",
  "Sports Drinks",
];

export function recommendedFacings(p: Product): number {
  return Math.max(1, Math.min(6, Math.ceil(p.unitsPerWeek / 12)));
}

export function ProductLibrary() {
  const [query, setQuery] = React.useState("");
  const [collapsed, setCollapsed] = React.useState<Set<Category>>(new Set());
  const draggedProductId = useCanvasStore((s) => s.draggedProductId);
  const setDraggedProduct = useCanvasStore((s) => s.setDraggedProduct);

  const grouped = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = (p: Product) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.upc.includes(q);
    const map = new Map<Category, Product[]>();
    for (const c of CATEGORY_ORDER) map.set(c, []);
    for (const p of products) {
      if (!matches(p)) continue;
      map.get(p.category)?.push(p);
    }
    return Array.from(map.entries()).filter(([, list]) => list.length > 0);
  }, [query]);

  const toggle = (cat: Category) => {
    setCollapsed((s) => {
      const next = new Set(s);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <div className="text-[13.5px] font-semibold">Product Library</div>
        <div className="mt-0.5 text-[11.5px] text-muted-foreground">
          {products.length} SKUs · drag onto the canvas
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand, UPC"
            className="h-8 pl-8 text-[12.5px]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {grouped.length === 0 && (
          <div className="px-4 py-8 text-center text-[12px] text-muted-foreground">
            No SKUs match &ldquo;{query}&rdquo;
          </div>
        )}
        {grouped.map(([category, list]) => {
          const isCollapsed = collapsed.has(category);
          return (
            <div key={category} className="mb-1 px-2">
              <button
                type="button"
                onClick={() => toggle(category)}
                className="flex h-7 w-full items-center gap-1.5 rounded-sm px-1.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/40"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                {category}
                <span className="ml-auto tabular-nums text-muted-foreground/70">
                  {list.length}
                </span>
              </button>
              {!isCollapsed && (
                <div className="mt-1 flex flex-col gap-1">
                  {list.map((p) => (
                    <ProductTile
                      key={p.id}
                      product={p}
                      isDragging={draggedProductId === p.id}
                      onStart={() => setDraggedProduct(p.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function ProductTile({
  product,
  isDragging,
  onStart,
}: {
  product: Product;
  isDragging: boolean;
  onStart: () => void;
}) {
  const facings = recommendedFacings(product);
  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={(e) => {
        // Only left mouse / primary touch
        if (e.button !== 0) return;
        e.preventDefault();
        onStart();
      }}
      className={cn(
        "group flex cursor-grab select-none items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:border-primary/50 hover:bg-muted/40 active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <span
        className="h-9 w-2 shrink-0 rounded-sm"
        style={{ background: product.swatchColor }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-semibold leading-tight">
          {product.brand}
        </div>
        <div className="truncate text-[11px] text-muted-foreground">
          {product.dimensions.w}″W · ${product.retailPrice.toFixed(2)}
        </div>
      </div>
      <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-primary">
        ×{facings}
      </span>
    </div>
  );
}
