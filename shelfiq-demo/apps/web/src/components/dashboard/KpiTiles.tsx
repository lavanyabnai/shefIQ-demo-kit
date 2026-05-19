import {
  Layers,
  Store as StoreIcon,
  TrendingUp,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { dashboard } from "@/lib/seed";

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  store: StoreIcon,
  "trending-up": TrendingUp,
  "alert-triangle": AlertTriangle,
};

export function KpiTiles() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {dashboard.kpis.map((kpi) => {
        const Icon = ICONS[kpi.icon] ?? Layers;
        const trend = (kpi as { trend?: string }).trend ?? "neutral";
        const progress = (kpi as { progress?: number }).progress;
        const deltaColor =
          trend === "up"
            ? "text-success"
            : trend === "down"
            ? "text-destructive"
            : "text-muted-foreground";
        const DeltaIcon =
          trend === "up" ? TrendingUp : trend === "down" ? AlertTriangle : null;

        return (
          <Card key={kpi.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-[12px] font-medium leading-tight text-muted-foreground">
                {kpi.label}
              </div>
              <div className="grid h-7 w-7 place-items-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-[28px] font-semibold leading-none tracking-tight tabular-nums">
              {kpi.value}
            </div>
            {typeof progress === "number" && (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            )}
            <div className={cn("mt-3 flex items-center gap-1 text-[12px] font-medium", deltaColor)}>
              {DeltaIcon && <DeltaIcon className="h-3 w-3" />}
              <span>{kpi.delta}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
