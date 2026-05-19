import { cn } from "@/lib/utils";
import type { PlanStatus } from "@/lib/types";

const STYLE: Record<PlanStatus, { dot: string; bg: string; text: string; label: string }> = {
  live:        { dot: "bg-success",      bg: "bg-success/12",      text: "text-success",      label: "Live" },
  "in-review": { dot: "bg-warning",      bg: "bg-warning/14",      text: "text-warning",      label: "In Review" },
  draft:       { dot: "bg-muted-foreground", bg: "bg-muted",       text: "text-foreground",   label: "Draft" },
  approved:    { dot: "bg-primary",      bg: "bg-primary/12",      text: "text-primary",      label: "Approved" },
  archived:    { dot: "bg-muted-foreground/60", bg: "bg-muted",    text: "text-muted-foreground", label: "Archived" },
};

export function StatusPill({ status }: { status: PlanStatus }) {
  const s = STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        s.bg,
        s.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
