import {
  Layers,
  Store as StoreIcon,
  TrendingUp,
  AlertTriangle,
  Plus,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboard } from "@/lib/seed";

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  store: StoreIcon,
  "trending-up": TrendingUp,
  "alert-triangle": AlertTriangle,
};

function formatDateHeader(iso: string): string {
  const d = new Date(iso);
  const dow = d.toLocaleDateString("en-US", { weekday: "long" });
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const day = d.getDate();
  const quarter = Math.floor(d.getMonth() / 3) + 1;
  const year = d.getFullYear();
  return `${dow}, ${month} ${day} · Q${quarter} ${year}`;
}

export default function DashboardPage() {
  const dateHeader = formatDateHeader(dashboard.date);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
            {dateHeader}
          </div>
          <h1 className="mt-1 text-[24px] font-semibold tracking-tight">
            {dashboard.greeting}
          </h1>
          <p className="mt-1 max-w-prose text-[13.5px] text-muted-foreground">
            {dashboard.headline}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Import PSA
          </Button>
          <Button size="sm" className="h-9 gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New planogram
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboard.kpis.map((kpi) => {
          const Icon = ICONS[kpi.icon] ?? Layers;
          return (
            <Card key={kpi.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[12px] font-medium text-muted-foreground">
                  {kpi.label}
                </div>
                <div className="grid h-7 w-7 place-items-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <Skeleton className="h-7 w-24" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Skeleton className="h-3 w-32" />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="min-h-[280px] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold">Reset calendar</div>
              <div className="text-[12px] text-muted-foreground">
                Scheduled resets · next 8 weeks
              </div>
            </div>
            <Skeleton className="h-7 w-24" />
          </div>
          <div className="mt-5 grid grid-cols-8 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-3" />
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, lane) => (
              <div key={lane} className="grid grid-cols-8 gap-2">
                {Array.from({ length: 8 }).map((_, w) => (
                  <Skeleton key={w} className="h-10" />
                ))}
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div>
            <div className="text-[14px] font-semibold">Recent activity</div>
            <div className="text-[12px] text-muted-foreground">Across all banners</div>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-7 w-7 shrink-0 rounded-md" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
