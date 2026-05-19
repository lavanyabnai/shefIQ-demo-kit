"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { HEATMAP_LEGEND } from "@/lib/calc/heatmap";

// react-konva touches `window`. Load client-only.
const StageInner = dynamic(() => import("./CanvasStageInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-[12px] text-muted-foreground">
      Initializing canvas…
    </div>
  ),
});

export function CanvasStage() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const plan = useCanvasStore((s) => s.plan);
  const mode = useCanvasStore((s) => s.viewSettings.mode);
  const heatmapMode = useCanvasStore((s) => s.heatmapMode);

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
      className="relative min-h-0 flex-1 select-none overflow-hidden bg-[radial-gradient(circle_at_50%_30%,hsl(var(--muted)/0.3)_0%,hsl(var(--background))_60%)]"
    >
      <div
        className="absolute inset-0 origin-center transition-transform duration-300 ease-out"
        style={{
          transform:
            mode === "3d"
              ? "perspective(1400px) rotateX(18deg) rotateY(-10deg) scale(0.92)"
              : "none",
          transformOrigin: "center 45%",
        }}
      >
        {plan && size.width > 0 && size.height > 0 ? (
          <StageInner width={size.width} height={size.height} />
        ) : null}
      </div>

      {plan && plan.positions.length === 0 && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md border border-dashed border-border bg-card/90 px-3 py-1.5 text-[12px] text-muted-foreground">
          Empty cooler — drag products from the left rail to start.
        </div>
      )}

      {heatmapMode !== "none" && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-border bg-card/95 p-2.5 shadow-sm">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Heatmap legend
          </div>
          <div className="flex flex-col gap-1">
            {HEATMAP_LEGEND.map((it) => (
              <div key={it.band} className="flex items-center gap-1.5 text-[11px] text-foreground">
                <span
                  className="h-2.5 w-4 rounded-sm"
                  style={{ background: it.color }}
                  aria-hidden
                />
                <span className="text-muted-foreground">{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
