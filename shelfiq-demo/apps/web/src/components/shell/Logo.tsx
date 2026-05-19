import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-primary-foreground shadow-sm"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #0c5e58 100%)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3"    y="4"  width="18"  height="3.5" rx="0.5" fill="currentColor" opacity="0.95" />
          <rect x="3"    y="10" width="13"  height="3.5" rx="0.5" fill="currentColor" opacity="0.65" />
          <rect x="3"    y="16" width="18"  height="3.5" rx="0.5" fill="currentColor" opacity="0.95" />
          <rect x="17.5" y="10" width="3.5" height="3.5" rx="0.5" fill="#2dd4bf" />
        </svg>
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight">ShelfIQ</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            by BlueNorth
          </div>
        </div>
      )}
    </div>
  );
}
