"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { products, plans } from "@/lib/seed";
import type { Product } from "@/lib/types";

function usageMap(): Map<string, number> {
  const m = new Map<string, number>();
  for (const plan of Object.values(plans)) {
    const inPlan = new Set<string>();
    for (const pos of plan.positions) inPlan.add(pos.productId);
    inPlan.forEach((pid) => m.set(pid, (m.get(pid) ?? 0) + 1));
  }
  return m;
}

export function ProductsScreen() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [vendor, setVendor] = React.useState("all");
  const [selected, setSelected] = React.useState<Product | null>(null);
  const usage = React.useMemo(usageMap, []);

  const categories = React.useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    []
  );
  const vendors = React.useMemo(
    () => Array.from(new Set(products.map((p) => p.vendor))).sort(),
    []
  );

  const filtered = React.useMemo(() => {
    let rows = [...products];
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.upc.includes(q)
      );
    }
    if (category !== "all") rows = rows.filter((p) => p.category === category);
    if (vendor !== "all")   rows = rows.filter((p) => p.vendor === vendor);
    return rows;
  }, [query, category, vendor]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {products.length} SKUs across {categories.length} categories · {vendors.length} vendors
          </p>
        </div>
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              className="h-9 pl-8"
              placeholder="Search name, brand, UPC…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <FilterSelect value={category} onChange={setCategory} placeholder="All categories" items={categories} />
          <FilterSelect value={vendor}   onChange={setVendor}   placeholder="All vendors"    items={vendors}    />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            usage={usage.get(p.id) ?? 0}
            onClick={() => setSelected(p)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed border-border bg-card p-8 text-center text-[13px] text-muted-foreground">
            No SKUs match the current filters.
          </div>
        )}
      </div>

      <ProductDetailSheet product={selected} usage={selected ? usage.get(selected.id) ?? 0 : 0} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  items,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  items: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 min-w-[160px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {items.map((it) => (
          <SelectItem key={it} value={it}>{it}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ProductCard({ product, usage, onClick }: { product: Product; usage: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
    >
      <div className="h-2 w-full" style={{ background: product.swatchColor }} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[13.5px] font-semibold leading-tight">{product.name}</div>
            <div className="mt-0.5 text-[11.5px] text-muted-foreground">{product.brand} · {product.vendor}</div>
          </div>
          <Badge variant="secondary" className="shrink-0">{product.category}</Badge>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11.5px]">
          <div>
            <div className="text-muted-foreground/80">Dimensions</div>
            <div className="font-medium tabular-nums">
              {product.dimensions.w}″W × {product.dimensions.h}″H × {product.dimensions.d}″D
            </div>
          </div>
          <div>
            <div className="text-muted-foreground/80">Retail</div>
            <div className="font-medium tabular-nums">${product.retailPrice.toFixed(2)}</div>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
          <span>UPC <span className="tabular-nums">{product.upc}</span></span>
          <span>
            Used in <span className="font-semibold text-foreground">{usage}</span>{" "}
            {usage === 1 ? "plan" : "plans"}
          </span>
        </div>
      </div>
    </button>
  );
}

function ProductDetailSheet({
  product,
  usage,
  onOpenChange,
}: {
  product: Product | null;
  usage: number;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Sheet open={!!product} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        {product && (
          <>
            <div className="h-2 w-full rounded-md" style={{ background: product.swatchColor }} />
            <SheetHeader className="mt-4">
              <SheetTitle>{product.name}</SheetTitle>
              <SheetDescription>
                {product.brand} · {product.vendor}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Category"        value={product.category} />
                <Stat label="Subcategory"     value={product.subcategory} />
                <Stat label="UPC"             value={product.upc} mono />
                <Stat label="Retail"          value={`$${product.retailPrice.toFixed(2)}`} mono />
                <Stat label="Margin"          value={`${product.marginPct}%`} />
                <Stat label="Days of supply"  value={`${product.daysOfSupply}d`} />
              </div>

              <Separator />

              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Dimensions
                </div>
                <div className="mt-1.5 font-medium tabular-nums">
                  {product.dimensions.w}″W × {product.dimensions.h}″H × {product.dimensions.d}″D
                </div>
              </div>

              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Velocity (current planograms)
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-[18px] font-semibold tabular-nums">{product.unitsPerWeek}</span>
                  <span className="text-[12px] text-muted-foreground">units / week</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">{product.subcategory}</Badge>
                <Badge variant="info">
                  Used in {usage} {usage === 1 ? "plan" : "plans"}
                </Badge>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1 font-medium ${mono ? "tabular-nums" : ""}`}>{value}</div>
    </div>
  );
}
