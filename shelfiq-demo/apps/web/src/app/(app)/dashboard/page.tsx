import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { KpiTiles } from "@/components/dashboard/KpiTiles";
import { ResetCalendar } from "@/components/dashboard/ResetCalendar";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { TopCategoriesChart } from "@/components/dashboard/TopCategoriesChart";
import { ComplianceHeatmap } from "@/components/dashboard/ComplianceHeatmap";
import { dashboard } from "@/lib/seed";

function formatDateHeader(iso: string): string {
  const d = new Date(iso);
  const dow = d.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
  const month = d.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
  const day = d.getUTCDate();
  const quarter = Math.floor(d.getUTCMonth() / 3) + 1;
  const year = d.getUTCFullYear();
  return `${dow}, ${month} ${day} · Q${quarter} ${year}`;
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
            {formatDateHeader(dashboard.date)}
          </div>
          <h1 className="mt-1 text-[24px] font-semibold tracking-tight">
            {dashboard.greeting}
          </h1>
          <p className="mt-1 max-w-prose text-[13.5px] text-muted-foreground">
            {dashboard.headline}
          </p>
        </div>
        <DashboardActions />
      </div>

      <KpiTiles />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ResetCalendar />
        <ActivityFeed />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <TopCategoriesChart />
        <ComplianceHeatmap />
      </div>
    </div>
  );
}
