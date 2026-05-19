"use client";
import * as React from "react";
import { Bell, AlertTriangle, Inbox, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface NotifItem {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  detail: string;
  ago: string;
}

const NOTIFICATIONS: NotifItem[] = [
  {
    icon: AlertTriangle,
    iconColor: "text-destructive",
    title: "Store #1102 deviation detected",
    detail: "Tobacco Gantry — 3 SKUs missing facings",
    ago: "3h ago",
  },
  {
    icon: Inbox,
    iconColor: "text-info",
    title: "Red Bull submitted a vendor POG",
    detail: "Awaiting your review — Urban Premium cluster",
    ago: "1h ago",
  },
  {
    icon: CheckCircle2,
    iconColor: "text-success",
    title: "Energy Reset Q1 v2.3 approved",
    detail: "Approved by Maria Chen for Urban Premium",
    ago: "12m ago",
  },
];

export function NotificationsBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 grid h-3.5 min-w-[14px] place-items-center rounded-full border-2 border-card bg-destructive px-1 text-[9px] font-bold leading-none text-destructive-foreground">
            3
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="text-[13px] font-semibold">Notifications</div>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11.5px]">
            Mark all read
          </Button>
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {NOTIFICATIONS.map((n, i) => {
            const Icon = n.icon;
            return (
              <div
                key={i}
                className="flex cursor-pointer gap-2.5 px-4 py-2.5 hover:bg-muted/40 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border"
              >
                <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted ${n.iconColor}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{n.title}</div>
                  <div className="truncate text-[12px] text-muted-foreground">{n.detail}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground/70">{n.ago}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border bg-muted/40 px-2 py-1.5 text-center">
          <Button variant="ghost" size="sm" className="h-7 text-[12px]">
            View all activity
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
