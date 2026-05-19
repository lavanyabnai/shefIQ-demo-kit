import * as React from "react";
import { type LucideIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon }: ComingSoonProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-14 text-muted-foreground">
        <div className="grid h-16 w-16 place-items-center rounded-xl bg-muted">
          <Icon className="h-7 w-7" />
        </div>
        <div className="text-[15px] font-semibold text-foreground">{title} coming soon</div>
        <p className="max-w-[400px] text-center text-[13px]">
          This area is part of the ShelfIQ roadmap. The demo focuses on the planogram editor,
          list, stores, products, fixtures, version compare, and reports.
        </p>
      </div>
    </div>
  );
}
