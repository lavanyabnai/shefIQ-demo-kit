"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { dashboard } from "@/lib/seed";

function colorFor(v: number): { bg: string; tone: string } {
  if (v >= 0.95) return { bg: "hsl(var(--success) / 0.22)", tone: "text-success" };
  if (v >= 0.9)  return { bg: "hsl(var(--success) / 0.12)", tone: "text-success" };
  if (v >= 0.85) return { bg: "hsl(var(--warning) / 0.18)", tone: "text-warning" };
  return { bg: "hsl(var(--destructive) / 0.18)", tone: "text-destructive" };
}

export function ComplianceHeatmap() {
  const { stores, categories, values } = dashboard.compliance;
  return (
    <Card className="flex h-full flex-col p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[14px] font-semibold">Compliance heatmap</div>
          <div className="text-[12px] text-muted-foreground">
            Store × category · % on latest planogram
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="More">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="overflow-x-auto p-5">
        <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 4 }}>
          <thead>
            <tr>
              <th />
              {categories.map((c) => (
                <th
                  key={c}
                  className="px-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stores.map((s, ri) => (
              <tr key={s}>
                <td className="whitespace-nowrap pr-2 text-right text-[12px] font-medium text-muted-foreground">
                  {s}
                </td>
                {values[ri].map((v, ci) => {
                  const c = colorFor(v);
                  return (
                    <td key={ci} className="p-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            role="img"
                            aria-label={`${s} ${categories[ci]} ${(v * 100).toFixed(0)}%`}
                            className={`grid h-9 w-14 cursor-default place-items-center rounded-md border text-[12px] font-semibold tabular-nums ${c.tone}`}
                            style={{
                              background: c.bg,
                              borderColor: "color-mix(in srgb, currentColor 24%, transparent)",
                            }}
                          >
                            {Math.round(v * 100)}%
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-[12px] font-semibold">
                            {s} · {categories[ci]}
                          </div>
                          <div className="text-[11px] opacity-80">
                            {(v * 100).toFixed(1)}% on latest planogram
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
          <Legend tone="text-success"     label="≥ 95%" />
          <Legend tone="text-success/80"  label="90–94%" />
          <Legend tone="text-warning"     label="85–89%" />
          <Legend tone="text-destructive" label="&lt; 85%" />
        </div>
      </div>
    </Card>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <span className={`flex items-center gap-1.5 ${tone}`}>
      <span className="h-2 w-2 rounded-sm bg-current opacity-60" />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
