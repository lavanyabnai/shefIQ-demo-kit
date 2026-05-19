"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  planograms: "Planograms",
  stores: "Stores",
  products: "Products",
  fixtures: "Fixture library",
  clusters: "Clusters",
  reports: "Reports",
  settings: "Settings",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const trail = ["ShelfIQ", ...segments.map((s) => TITLES[s] ?? prettify(s))];
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      {trail.map((t, i) => {
        const isLast = i === trail.length - 1;
        return (
          <React.Fragment key={i}>
            <span
              className={`truncate text-[13.5px] ${
                isLast ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
              }`}
            >
              {t}
            </span>
            {!isLast && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function prettify(seg: string): string {
  return seg
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
