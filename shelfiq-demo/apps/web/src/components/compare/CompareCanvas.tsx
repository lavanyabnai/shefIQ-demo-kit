"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import type { Plan } from "@/lib/types";

const StageInner = dynamic(
  () => import("@/components/editor/CanvasStageInner"),
  { ssr: false, loading: () => (
      <div className="grid h-full place-items-center text-[12px] text-muted-foreground">
        Initializing canvas…
      </div>
    ),
  }
);

interface Props {
  plan: Plan;
  viewportId: string;
  highlightedPositionId?: string | null;
  label: string;
  sublabel?: string;
}

export function CompareCanvas({ plan, viewportId, highlightedPositionId, label, sublabel }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setSize({ width: rect.width, height: rect.height });
    });
    observer.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-0 flex-1 select-none flex-col overflow-hidden border-r border-border bg-[radial-gradient(circle_at_50%_30%,hsl(var(--muted)/0.3)_0%,hsl(var(--background))_60%)] last:border-r-0"
    >
      <div className="absolute left-3 top-3 z-10 rounded-md border border-border bg-card/95 px-2.5 py-1.5 shadow-sm">
        <div className="text-[11.5px] font-semibold leading-tight">{label}</div>
        {sublabel && (
          <div className="text-[10.5px] text-muted-foreground">{sublabel}</div>
        )}
      </div>
      {size.width > 0 && size.height > 0 ? (
        <StageInner
          width={size.width}
          height={size.height}
          viewportId={viewportId}
          readOnly
          highlightedPositionId={highlightedPositionId}
          planOverride={plan}
        />
      ) : null}
    </div>
  );
}
