"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { dashboard } from "@/lib/seed";

const WEEK_LABELS = ["May 19", "May 26", "Jun 2", "Jun 9", "Jun 16", "Jun 23", "Jun 30", "Jul 7"];
const LANES = 3;
const WEEKS = 8;

export function ResetCalendar() {
  const grid: (typeof dashboard.resets[number] | null)[][] = Array.from({ length: LANES }, () =>
    Array.from({ length: WEEKS }, () => null)
  );
  for (const r of dashboard.resets) {
    if (r.lane < LANES && r.week < WEEKS) grid[r.lane][r.week] = r;
  }

  const colorFor = (cat: string) =>
    (dashboard.resetCategoryColors as Record<string, string>)[cat] ?? "#475569";

  return (
    <Card className="flex min-h-[280px] flex-col p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[14px] font-semibold">Reset calendar</div>
          <div className="text-[12px] text-muted-foreground">Scheduled resets · next 8 weeks</div>
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[12px]">
            <Calendar className="h-3 w-3" /> Week view
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Previous week">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Next week">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-8 gap-2">
          {WEEK_LABELS.map((w) => (
            <div key={w} className="text-center text-[11px] font-medium text-muted-foreground">
              {w}
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {grid.map((lane, li) => (
            <div key={li} className="grid grid-cols-8 gap-2">
              {lane.map((cell, wi) => {
                if (!cell) {
                  return <div key={wi} className="h-12 rounded-md bg-muted/40" />;
                }
                const color = colorFor(cell.category);
                return (
                  <Tooltip key={wi}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "h-12 rounded-md border px-2 py-1.5 text-left transition-colors",
                          "hover:translate-y-[-1px] hover:shadow-sm"
                        )}
                        style={{
                          background: `color-mix(in srgb, ${color} 14%, hsl(var(--card)))`,
                          borderColor: `color-mix(in srgb, ${color} 36%, transparent)`,
                          borderLeft: `3px solid ${color}`,
                        }}
                      >
                        <div className="truncate text-[11.5px] font-semibold leading-tight text-foreground">
                          {cell.name}
                        </div>
                        <div className="mt-0.5 truncate text-[10.5px] text-muted-foreground">
                          {cell.category} · {cell.days}d
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[220px]">
                      <div className="text-[12px] font-semibold">{cell.name}</div>
                      <div className="text-[11px] opacity-80">
                        {cell.category} · {cell.days}-day reset · {cell.owner}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-3 text-[11.5px] text-muted-foreground">
          {Object.entries(dashboard.resetCategoryColors)
            .slice(0, 6)
            .map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: color as string }}
                />
                {cat}
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}
