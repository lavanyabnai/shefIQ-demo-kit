"use client";
import * as React from "react";
import {
  BarChart3,
  ShieldCheck,
  Gauge,
  PieChart as PieIcon,
  Clock,
  Truck,
  Network,
  AlertTriangle,
  Download,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

type ChartKind = "bar" | "line" | "donut" | "stacked" | "scatter" | "heat";

interface Report {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  updated: string;
  chart: ChartKind;
}

const REPORTS: Report[] = [
  { id: "sts",      name: "Space-to-Sales Index",  description: "Linear-foot share vs. revenue share, ranked by deviation.",   icon: BarChart3,     updated: "2h ago",  chart: "bar"    },
  { id: "comp",     name: "Compliance Trend",      description: "Weekly compliance % across all banners over the last 12 weeks.", icon: ShieldCheck, updated: "1d ago",  chart: "line"   },
  { id: "reset",    name: "Reset Velocity",        description: "Avg days from PSA receipt to live planogram, by category.",   icon: Gauge,         updated: "3d ago",  chart: "bar"    },
  { id: "category", name: "Category Performance",  description: "Share of sales and margin across the top 6 categories.",      icon: PieIcon,       updated: "1h ago",  chart: "donut"  },
  { id: "daypart",  name: "Daypart Mix",           description: "Morning / afternoon / late-night sales split by category.",   icon: Clock,         updated: "5h ago",  chart: "stacked"},
  { id: "vendor",   name: "Vendor Scorecard",      description: "On-time delivery, fill-rate, and disputes by vendor.",        icon: Truck,         updated: "2d ago",  chart: "bar"    },
  { id: "cluster",  name: "Cluster Comparison",    description: "Sales / linear ft scattered against compliance % per store.", icon: Network,       updated: "6h ago",  chart: "scatter"},
  { id: "oos",      name: "OOS Risk",              description: "Days-of-supply heatmap across high-velocity SKUs.",          icon: AlertTriangle, updated: "12h ago", chart: "heat"   },
];

export function ReportsScreen() {
  const [active, setActive] = React.useState<Report | null>(null);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Reports</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Standard category-management reports · click any card to open.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {REPORTS.map((r) => (
          <ReportCard key={r.id} report={r} onClick={() => setActive(r)} />
        ))}
      </div>

      <ReportModal report={active} onClose={() => setActive(null)} />
    </div>
  );
}

function ReportCard({ report, onClick }: { report: Report; onClick: () => void }) {
  const Icon = report.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
    >
      <div className="grid h-20 place-items-center overflow-hidden rounded-md bg-muted/40">
        <Thumb kind={report.chart} />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <div>
        <div className="text-[14px] font-semibold leading-tight">{report.name}</div>
        <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{report.description}</p>
      </div>
      <div className="mt-auto border-t border-border pt-2 text-[11px] text-muted-foreground">
        Updated {report.updated}
      </div>
    </button>
  );
}

function ReportModal({ report, onClose }: { report: Report | null; onClose: () => void }) {
  return (
    <Dialog open={!!report} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl gap-0 p-0">
        {report && (
          <>
            <DialogHeader className="border-b border-border p-5 text-left">
              <DialogTitle>{report.name}</DialogTitle>
              <DialogDescription>{report.description}</DialogDescription>
            </DialogHeader>
            <div className="p-5">
              <div className="h-[360px] w-full">
                <ChartFor kind={report.chart} />
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-5 py-3 sm:flex-row">
              <span className="text-[11.5px] text-muted-foreground">
                Sample report · live data binds in production
              </span>
              <div className="flex gap-2">
                <a href="/samples/store-pack.pdf" download="ShelfIQ-Sample-Report.pdf">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5">
                    <Download className="h-3.5 w-3.5" /> Export PDF
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() =>
                    toast.success("CSV export queued", {
                      description: `${report.name} will arrive in your downloads in a moment.`,
                    })
                  }
                >
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </Button>
                <Button size="sm" className="h-8" onClick={onClose}>
                  Done
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Charts ---------- */

const TOOLTIP_STYLE = {
  background: "hsl(var(--popover))",
  borderRadius: 6,
  border: "1px solid hsl(var(--border))",
  fontSize: 12,
  color: "hsl(var(--popover-foreground))",
};

function ChartFor({ kind }: { kind: ChartKind }) {
  switch (kind) {
    case "bar":     return <BarSample />;
    case "line":    return <LineSample />;
    case "donut":   return <DonutSample />;
    case "stacked": return <StackedSample />;
    case "scatter": return <ScatterSample />;
    case "heat":    return <HeatSample />;
  }
}

function BarSample() {
  const data = [
    { name: "Tobacco",       v: 124.8 },
    { name: "Energy",        v: 58.4  },
    { name: "Hard Seltzer",  v: 51.2  },
    { name: "Beer",          v: 42.2  },
    { name: "Cold Bev",      v: 38.1  },
    { name: "Snacks",        v: 29.5  },
    { name: "Candy",         v: 24.1  },
    { name: "Sports Drinks", v: 21.8  },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 12 }}>
        <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} axisLine={false} tickLine={false} />
        <RTooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `$${Number(v).toFixed(2)}`} />
        <Bar dataKey="v" radius={[0, 3, 3, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i < 3 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineSample() {
  const data = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    pct: Math.round((84 + Math.sin(i / 2) * 4 + i * 0.3) * 10) / 10,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} unit="%" />
        <RTooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${v}%`} />
        <Line type="monotone" dataKey="pct" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function DonutSample() {
  const data = [
    { name: "Beer",      value: 32 },
    { name: "Energy",    value: 21 },
    { name: "Snacks",    value: 14 },
    { name: "Cold Bev",  value: 19 },
    { name: "Tobacco",   value: 8 },
    { name: "Candy",     value: 6 },
  ];
  const colors = ["#0f766e", "#2563eb", "#ea580c", "#a16207", "#7c3aed", "#db2777"];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={70} outerRadius={120} stroke="hsl(var(--card))" strokeWidth={2}>
          {data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
        </Pie>
        <RTooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${v}%`} />
        <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function StackedSample() {
  const data = [
    { cat: "Energy",   morning: 38, afternoon: 32, late: 30 },
    { cat: "Beer",     morning: 8,  afternoon: 30, late: 62 },
    { cat: "Snacks",   morning: 25, afternoon: 45, late: 30 },
    { cat: "Cold Bev", morning: 28, afternoon: 40, late: 32 },
    { cat: "Seltzer",  morning: 14, afternoon: 36, late: 50 },
    { cat: "Coffee",   morning: 68, afternoon: 22, late: 10 },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="cat" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} unit="%" />
        <RTooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="morning"   stackId="a" fill="hsl(var(--primary))" />
        <Bar dataKey="afternoon" stackId="a" fill="#2563eb" />
        <Bar dataKey="late"      stackId="a" fill="#7c3aed" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ScatterSample() {
  const data = [
    { compliance: 96, spl: 48, name: "#1247" },
    { compliance: 94, spl: 44, name: "#0312" },
    { compliance: 87, spl: 39, name: "#0488" },
    { compliance: 92, spl: 41, name: "#0521" },
    { compliance: 81, spl: 33, name: "#0894" },
    { compliance: 78, spl: 28, name: "#1102" },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 24, bottom: 16, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" dataKey="compliance" name="Compliance" unit="%" domain={[70, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis type="number" dataKey="spl" name="Sales / lin ft" unit="$" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <ZAxis type="number" range={[100, 320]} />
        <RTooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="hsl(var(--primary))" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function HeatSample() {
  const rows = ["#1247", "#0312", "#0488", "#0521", "#0894", "#1102"];
  const cols = ["Red Bull", "Monster", "Coke", "Doritos", "Bud Light", "White Claw"];
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <table style={{ borderCollapse: "separate", borderSpacing: 6 }}>
        <thead>
          <tr>
            <th />
            {cols.map((c) => (
              <th key={c} className="px-1 text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r}>
              <td className="pr-2 text-right text-[12px] font-medium text-muted-foreground">{r}</td>
              {cols.map((_, ci) => {
                const v = (Math.sin(ri * 1.3 + ci * 0.6) + 1) / 2;
                return (
                  <td key={ci} className="p-0">
                    <div
                      className="grid h-9 w-16 place-items-center rounded-md text-[11.5px] font-semibold tabular-nums"
                      style={{
                        background: `color-mix(in srgb, hsl(var(--destructive)) ${Math.round(v * 70)}%, hsl(var(--muted)))`,
                        color: v > 0.5 ? "hsl(var(--destructive))" : "hsl(var(--foreground))",
                      }}
                    >
                      {(v * 14).toFixed(1)}d
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Thumb({ kind }: { kind: ChartKind }) {
  switch (kind) {
    case "bar":     return <svg viewBox="0 0 220 60" className="h-12 w-3/4">{[0.42, 0.78, 0.62, 0.88, 0.54, 0.71, 0.49, 0.66].map((v, i) => (<rect key={i} x={6 + i * 26} y={56 - v * 50} width={18} height={v * 50} rx={2} fill={i % 2 ? "hsl(var(--primary) / 0.5)" : "hsl(var(--primary))"} />))}</svg>;
    case "line":    return <svg viewBox="0 0 220 60" className="h-12 w-3/4"><path d="M0 50 Q 30 45 50 38 T 100 22 T 160 14 T 220 8" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" /><path d="M0 50 Q 30 45 50 38 T 100 22 T 160 14 T 220 8 L 220 60 L 0 60 Z" fill="hsl(var(--primary) / 0.18)" /></svg>;
    case "donut":   return <svg viewBox="0 0 60 60" className="h-12 w-12"><circle cx="30" cy="30" r="22" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" /><circle cx="30" cy="30" r="22" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray="100 200" transform="rotate(-90 30 30)" /></svg>;
    case "stacked": return <svg viewBox="0 0 220 60" className="h-12 w-3/4">{[[20, 28, 12], [16, 30, 14], [22, 22, 16], [24, 26, 10], [18, 24, 18], [20, 28, 14]].map((row, i) => { const x = 8 + i * 36; let y = 60; const cs = ["hsl(var(--primary))", "#2563eb", "#7c3aed"]; return row.map((v, j) => { y -= v; return <rect key={`${i}-${j}`} x={x} y={y} width={24} height={v - 1} fill={cs[j]} rx={1} />; }); })}</svg>;
    case "scatter": return <svg viewBox="0 0 220 60" className="h-12 w-3/4">{[[40, 40], [70, 25], [110, 32], [150, 15], [190, 38], [40, 18], [180, 28], [130, 45], [170, 32]].map((pt, i) => <circle key={i} cx={pt[0]} cy={pt[1]} r="3" fill="hsl(var(--primary))" />)}</svg>;
    case "heat":    return <svg viewBox="0 0 220 60" className="h-12 w-3/4">{Array.from({ length: 4 }).map((_, r) => Array.from({ length: 11 }).map((_, c) => { const v = (Math.sin(r * 1.3 + c * 0.6) + 1) / 2; return <rect key={`${r}-${c}`} x={4 + c * 20} y={4 + r * 14} width={18} height={11} fill={`color-mix(in srgb, hsl(var(--primary)) ${Math.round(v * 80)}%, hsl(var(--muted)))`} rx={1.5} />; }))}</svg>;
  }
}
