"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Upload, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusPill } from "./StatusPill";
import { planograms } from "@/lib/seed";
import type { PlanStatus } from "@/lib/types";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { value: "all" | PlanStatus; label: string }[] = [
  { value: "all",        label: "All" },
  { value: "live",       label: "Live" },
  { value: "in-review",  label: "In Review" },
  { value: "draft",      label: "Draft" },
  { value: "approved",   label: "Approved" },
  { value: "archived",   label: "Archived" },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function PlanogramsTable({
  NewPlanogramButton,
}: {
  NewPlanogramButton?: React.ComponentType;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | PlanStatus>("all");
  const [banner, setBanner] = React.useState("all");
  const [cluster, setCluster] = React.useState("all");
  const [category, setCategory] = React.useState("all");

  const banners = React.useMemo(
    () => Array.from(new Set(planograms.map((p) => p.banner))),
    []
  );
  const clusters = React.useMemo(
    () => Array.from(new Set(planograms.map((p) => p.cluster))),
    []
  );
  const categories = React.useMemo(
    () => Array.from(new Set(planograms.map((p) => p.category))),
    []
  );

  const filtered = React.useMemo(() => {
    let rows = [...planograms];
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.owner.name.toLowerCase().includes(q) ||
          p.cluster.toLowerCase().includes(q) ||
          p.version.toLowerCase().includes(q)
      );
    }
    if (status !== "all")   rows = rows.filter((p) => p.status === status);
    if (banner !== "all")   rows = rows.filter((p) => p.banner === banner);
    if (cluster !== "all")  rows = rows.filter((p) => p.cluster === cluster);
    if (category !== "all") rows = rows.filter((p) => p.category === category);
    return rows;
  }, [query, status, banner, cluster, category]);

  const statusCounts = React.useMemo(() => {
    const out: Partial<Record<PlanStatus | "all", number>> = { all: planograms.length };
    for (const p of planograms) out[p.status] = (out[p.status] ?? 0) + 1;
    return out;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Planograms</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {planograms.length} planograms across {banners.length} banners and {clusters.length} clusters
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={() => toast.success("Export queued")}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={() => toast.success("PSA import queued")}>
            <Upload className="h-3.5 w-3.5" /> Import .psa
          </Button>
          {NewPlanogramButton ? <NewPlanogramButton /> : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((s) => {
          const active = status === s.value;
          const count = statusCounts[s.value] ?? 0;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(s.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-[12px] transition-colors",
                active
                  ? "border-primary bg-primary/10 font-semibold text-primary"
                  : "border-border bg-card text-foreground hover:bg-muted/40"
              )}
            >
              {s.label}
              <span className={cn("tabular-nums", active ? "text-primary" : "text-muted-foreground/70")}>
                · {count}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              className="h-9 pl-8"
              placeholder="Search by name, owner, cluster, version…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <FilterSelect value={banner}   onChange={setBanner}   placeholder="All banners"    items={banners}   />
          <FilterSelect value={cluster}  onChange={setCluster}  placeholder="All clusters"   items={clusters}  />
          <FilterSelect value={category} onChange={setCategory} placeholder="All categories" items={categories} />
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Banner</th>
                <th className="px-4 py-2.5">Cluster</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Effective</th>
                <th className="px-4 py-2.5">Modified</th>
                <th className="px-4 py-2.5">Owner</th>
                <th className="w-10 px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-[13px] text-muted-foreground">
                    No planograms match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/planograms/${p.id}`)}
                    className="cursor-pointer border-b border-border last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="mt-0.5 text-[11.5px] tabular-nums text-muted-foreground/80">
                        {p.version}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.banner}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.cluster}</td>
                    <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{fmtDate(p.effectiveDate)}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{fmtDate(p.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={p.owner.avatar} alt={p.owner.name} />
                          <AvatarFallback className="text-[9px]">{initials(p.owner.name)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate text-[12.5px]">{p.owner.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-[12px] text-muted-foreground">
          <div>
            Showing {filtered.length} of {planograms.length}
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span>Page 1 of 1</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
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
          <SelectItem key={it} value={it}>
            {it}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
