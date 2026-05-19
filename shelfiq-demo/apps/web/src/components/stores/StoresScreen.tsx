"use client";
import * as React from "react";
import { MapPin, LayoutGrid, Download, Search, ChevronUp, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { stores as allStores } from "@/lib/seed";
import type { Store } from "@/lib/types";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const CLUSTER_COLORS: Record<string, string> = {
  "Urban Premium":   "hsl(var(--primary))",
  "Suburban Family": "#2563eb",
  "Highway Travel":  "#ea580c",
};

function lngToX(lng: number) { return (lng + 125) * 17.24; }
function latToY(lat: number) { return (49 - lat) * 20.83; }

export function StoresScreen() {
  const [view, setView] = React.useState<"map" | "table">("map");
  const [query, setQuery] = React.useState("");
  const [banner, setBanner] = React.useState("all");
  const [cluster, setCluster] = React.useState("all");
  const [format, setFormat] = React.useState("all");
  const [selected, setSelected] = React.useState<Store | null>(null);

  const banners = React.useMemo(() => Array.from(new Set(allStores.map((s) => s.banner))), []);
  const clusters = React.useMemo(() => Array.from(new Set(allStores.map((s) => s.cluster))), []);
  const formats = React.useMemo(() => Array.from(new Set(allStores.map((s) => s.format))), []);

  const filtered = React.useMemo(() => {
    let rows = [...allStores];
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (s) =>
          s.number.includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.address.city.toLowerCase().includes(q)
      );
    }
    if (banner !== "all")  rows = rows.filter((s) => s.banner === banner);
    if (cluster !== "all") rows = rows.filter((s) => s.cluster === cluster);
    if (format !== "all")  rows = rows.filter((s) => s.format === format);
    return rows;
  }, [query, banner, cluster, format]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Stores</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {allStores.length} stores across {banners.length} banners and {clusters.length} clusters
          </p>
        </div>
        <div className="flex gap-2">
          <ToggleGroup
            value={view}
            onChange={(v) => setView(v as "map" | "table")}
            options={[
              { value: "map",   label: "Map",   icon: MapPin },
              { value: "table", label: "Table", icon: LayoutGrid },
            ]}
          />
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={() => toast.success("CSV export queued")}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              className="h-9 pl-8"
              placeholder="Search store #, name, city…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <FilterSelect value={banner}  onChange={setBanner}  placeholder="All banners"  items={banners}  />
          <FilterSelect value={cluster} onChange={setCluster} placeholder="All clusters" items={clusters} />
          <FilterSelect value={format}  onChange={setFormat}  placeholder="All formats"  items={formats}  />
        </div>
      </Card>

      {view === "map" ? (
        <MapView stores={filtered} onSelect={setSelected} />
      ) : (
        <TableView stores={filtered} onSelect={setSelected} />
      )}

      <StoreDetailSheet store={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}

function ToggleGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <div className="inline-flex h-9 items-center gap-0.5 rounded-md border border-border bg-card p-0.5">
      {options.map((o) => {
        const Icon = o.icon;
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-sm px-2.5 text-[12.5px] transition-colors",
              active
                ? "bg-background font-semibold text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" /> {o.label}
          </button>
        );
      })}
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

/* ---------- Map view ---------- */

const US_PATH =
  "M70 150 L 100 130 L 130 130 L 150 110 L 200 100 L 260 110 L 300 130 L 320 120 L 360 130 L 400 145 L 450 150 L 520 130 L 580 125 L 640 130 L 700 140 L 760 160 L 820 170 L 870 185 L 900 220 L 905 270 L 870 320 L 820 360 L 760 390 L 700 410 L 640 410 L 570 405 L 500 410 L 430 420 L 360 410 L 290 395 L 230 375 L 180 350 L 130 320 L 90 280 L 75 220 Z";
const FLORIDA = "M780 380 Q 830 410 850 440 L 830 440 Q 800 420 770 400 Z";
const TEXAS = "M450 380 L 510 430 L 480 440 L 430 420 Z";

function MapView({ stores, onSelect }: { stores: Store[]; onSelect: (s: Store) => void }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid min-h-[540px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative bg-muted/30">
          <svg viewBox="0 0 1000 500" className="block h-full w-full">
            <defs>
              <pattern id="grid-map" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40 L 40 40 L 40 0" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="1000" height="500" fill="url(#grid-map)" />
            <path d={US_PATH}  fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" opacity="0.9" />
            <path d={FLORIDA}  fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
            <path d={TEXAS}    fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />

            {stores.map((s) => {
              const cx = lngToX(s.address.lng);
              const cy = latToY(s.address.lat);
              const fill = CLUSTER_COLORS[s.cluster] ?? "hsl(var(--primary))";
              return (
                <g key={s.id} style={{ cursor: "pointer" }} onClick={() => onSelect(s)}>
                  <circle cx={cx} cy={cy} r={12} fill={fill} opacity={0.18} />
                  <circle cx={cx} cy={cy} r={5} fill={fill} stroke="hsl(var(--card))" strokeWidth={2} />
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 left-3 rounded-md border border-border bg-card p-3 text-[11.5px] shadow-sm">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cluster
            </div>
            {Object.entries(CLUSTER_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2 py-0.5">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                <span className="text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel — summary */}
        <div className="flex flex-col gap-4 border-t border-border p-5 lg:border-l lg:border-t-0">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cluster mix
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => {
                const list = stores.filter((s) => s.cluster === cluster);
                const pct = stores.length ? Math.round((list.length / stores.length) * 100) : 0;
                return (
                  <div key={cluster} className="grid grid-cols-[1fr_60px_36px] items-center gap-2 text-[12.5px]">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                      {cluster}
                    </span>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-right tabular-nums text-muted-foreground">{list.length}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              Compliance issues
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {stores
                .filter((s) => s.compliancePct < 0.85)
                .map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelect(s)}
                    className="rounded-md border border-border border-l-[3px] border-l-destructive bg-card p-2 text-left text-[12.5px] hover:bg-muted/40"
                  >
                    <div className="font-semibold">
                      #{s.number} · {Math.round(s.compliancePct * 100)}%
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {s.address.city}, {s.address.state}
                    </div>
                  </button>
                ))}
              {stores.filter((s) => s.compliancePct < 0.85).length === 0 && (
                <div className="text-[12px] text-muted-foreground">No stores below 85%.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Table view ---------- */

type SortKey = "number" | "name" | "banner" | "cluster" | "sqft" | "compliancePct";
type SortDir = "asc" | "desc";

function TableView({ stores, onSelect }: { stores: Store[]; onSelect: (s: Store) => void }) {
  const [sort, setSort] = React.useState<{ key: SortKey; dir: SortDir }>({ key: "number", dir: "asc" });
  const sorted = React.useMemo(() => {
    const rows = [...stores];
    rows.sort((a, b) => {
      let av: number | string = "", bv: number | string = "";
      switch (sort.key) {
        case "sqft":          av = a.sqft; bv = b.sqft; break;
        case "compliancePct": av = a.compliancePct; bv = b.compliancePct; break;
        default:              av = (a as unknown as Record<string, string>)[sort.key]; bv = (b as unknown as Record<string, string>)[sort.key];
      }
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [stores, sort]);

  const Th = ({ k, children }: { k: SortKey; children: React.ReactNode }) => {
    const active = sort.key === k;
    return (
      <th
        className="cursor-pointer select-none px-4 py-2.5 text-left"
        onClick={() => setSort({ key: k, dir: active && sort.dir === "asc" ? "desc" : "asc" })}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          {active && (sort.dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
        </span>
      </th>
    );
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
              <Th k="number">Store #</Th>
              <Th k="name">Name</Th>
              <Th k="banner">Banner</Th>
              <Th k="cluster">Cluster</Th>
              <th className="px-4 py-2.5 text-left">Format</th>
              <Th k="sqft">Sq Ft</Th>
              <Th k="compliancePct">Compliance</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr
                key={s.id}
                onClick={() => onSelect(s)}
                className="cursor-pointer border-b border-border last:border-b-0 hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-semibold tabular-nums">#{s.number}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">
                    {s.address.city}, {s.address.state}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.banner}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.cluster}</td>
                <td className="px-4 py-3 text-muted-foreground capitalize">{s.format}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {s.sqft.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <CompliancePct value={s.compliancePct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function CompliancePct({ value }: { value: number }) {
  const color =
    value >= 0.95 ? "hsl(var(--success))" :
    value >= 0.85 ? "hsl(var(--warning))" :
    "hsl(var(--destructive))";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 min-w-[80px] flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${value * 100}%`, background: color }} />
      </div>
      <span className="w-9 text-right text-[12px] font-semibold tabular-nums" style={{ color }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

/* ---------- Store detail sheet ---------- */

function StoreDetailSheet({ store, onOpenChange }: { store: Store | null; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={!!store} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        {store && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </span>
                Store #{store.number}
              </SheetTitle>
              <SheetDescription>{store.name}</SheetDescription>
            </SheetHeader>

            <div className="mt-5 flex flex-col gap-4">
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Compliance
                </div>
                <div className="mt-2"><CompliancePct value={store.compliancePct} /></div>
              </div>

              <DetailGrid
                rows={[
                  ["Address",       `${store.address.city}, ${store.address.state}`],
                  ["Banner",        store.banner],
                  ["Cluster",       store.cluster],
                  ["Format",        store.format[0].toUpperCase() + store.format.slice(1)],
                  ["Square footage", `${store.sqft.toLocaleString()} sqft`],
                  ["Coordinates",   `${store.address.lat.toFixed(3)}, ${store.address.lng.toFixed(3)}`],
                ]}
              />

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{store.banner}</Badge>
                <Badge variant="outline">{store.cluster}</Badge>
                <Badge
                  variant={store.compliancePct >= 0.9 ? "success" : store.compliancePct >= 0.85 ? "warning" : "destructive"}
                >
                  {Math.round(store.compliancePct * 100)}% compliant
                </Badge>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailGrid({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-[13px]">
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="font-medium text-foreground">{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
