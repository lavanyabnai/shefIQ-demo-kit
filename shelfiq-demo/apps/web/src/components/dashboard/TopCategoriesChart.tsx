"use client";
import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RTooltip,
  Cell,
  LabelList,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { dashboard } from "@/lib/seed";

export function TopCategoriesChart() {
  const data = React.useMemo(
    () =>
      [...dashboard.topCategories].sort((a, b) => b.salesPerLinearFt - a.salesPerLinearFt),
    []
  );

  return (
    <Card className="flex h-full flex-col p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[14px] font-semibold">Top performing categories</div>
          <div className="text-[12px] text-muted-foreground">
            Sales per linear foot · last 30 days
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="h-7 text-[12px]">
            All banners
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="More">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4 pl-2">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 64, bottom: 8, left: 12 }}
          >
            <XAxis type="number" hide domain={[0, "dataMax + 15"]} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
            />
            <RTooltip
              cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
              contentStyle={{
                background: "hsl(var(--popover))",
                borderRadius: 6,
                border: "1px solid hsl(var(--border))",
                fontSize: 12,
                color: "hsl(var(--popover-foreground))",
              }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(v) => [`$${Number(v).toFixed(2)}`, "Sales / lin ft"]}
            />
            <Bar dataKey="salesPerLinearFt" radius={[3, 3, 3, 3]}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={i < 3 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)"}
                />
              ))}
              <LabelList
                dataKey="salesPerLinearFt"
                position="right"
                formatter={(v: unknown) => `$${Number(v).toFixed(2)}`}
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  fill: "hsl(var(--foreground))",
                  fontVariantNumeric: "tabular-nums",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
