import {
  CheckCircle2,
  Package,
  AlertTriangle,
  Plus,
  Pencil,
  Send,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dashboard } from "@/lib/seed";

const KIND_STYLE: Record<
  string,
  { icon: LucideIcon; iconClass: string; bg: string }
> = {
  approve: { icon: CheckCircle2,   iconClass: "text-success",          bg: "bg-success/15" },
  vendor:  { icon: Package,        iconClass: "text-info",             bg: "bg-info/15" },
  alert:   { icon: AlertTriangle,  iconClass: "text-destructive",      bg: "bg-destructive/15" },
  create:  { icon: Plus,           iconClass: "text-muted-foreground", bg: "bg-muted" },
  review:  { icon: Pencil,         iconClass: "text-warning",          bg: "bg-warning/15" },
  publish: { icon: Send,           iconClass: "text-primary",          bg: "bg-primary/15" },
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function ActivityFeed() {
  return (
    <Card className="flex flex-col p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[14px] font-semibold">Recent activity</div>
          <div className="text-[12px] text-muted-foreground">Across all banners</div>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-[12px]">
          View all
        </Button>
      </div>
      <div>
        {dashboard.activity.map((a, i) => {
          const s = KIND_STYLE[a.kind] ?? KIND_STYLE.create;
          const Icon = s.icon;
          const last = i === dashboard.activity.length - 1;
          return (
            <div
              key={a.id}
              className={`flex gap-3 px-5 py-3 ${last ? "" : "border-b border-border"}`}
            >
              <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${s.bg} ${s.iconClass}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  {a.actorAvatar && (
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={a.actorAvatar} alt={a.actor} />
                      <AvatarFallback className="text-[8px]">{initials(a.actor)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="min-w-0 truncate text-[12.5px] leading-tight">
                    <span className="font-semibold">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.verb}</span>{" "}
                    <span className="text-foreground">{a.object}</span>
                  </div>
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground/80">{a.ago}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
