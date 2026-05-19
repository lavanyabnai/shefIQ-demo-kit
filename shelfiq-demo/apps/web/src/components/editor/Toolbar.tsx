"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3,
  Magnet,
  Ruler,
  Box,
  Square,
  Sparkles,
  GitCompare,
  Thermometer,
  ChevronDown,
  Check,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { useWhatIfStore } from "@/lib/stores/whatIfStore";
import type { HeatmapMode } from "@/lib/types";
import { cn } from "@/lib/utils";

const HEATMAP_LABELS: Record<HeatmapMode, string> = {
  none: "Off",
  "space-to-sales": "Space-to-Sales",
  velocity: "Velocity",
  gmroi: "GMROI",
  dos: "Days of Supply",
  margin: "Margin %",
};

export function Toolbar() {
  const router = useRouter();
  const plan = useCanvasStore((s) => s.plan);
  const heatmapMode = useCanvasStore((s) => s.heatmapMode);
  const setHeatmap = useCanvasStore((s) => s.setHeatmap);
  const viewSettings = useCanvasStore((s) => s.viewSettings);
  const setViewSetting = useCanvasStore((s) => s.setViewSetting);
  const requestZoom = useCanvasStore((s) => s.requestZoom);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const history = useCanvasStore((s) => s.history);
  const setRightRailTab = useCanvasStore((s) => s.setRightRailTab);
  const openWhatIf = useWhatIfStore((s) => s.open);

  return (
    <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border bg-card/60 px-3">
      <ToolGroup>
        <ToolButton
          icon={Undo2}
          label="Undo (Cmd+Z)"
          onClick={() => undo() && toast.message("Undid the last change")}
          disabled={history.past.length === 0}
        />
        <ToolButton
          icon={Redo2}
          label="Redo (Cmd+Shift+Z)"
          onClick={() => redo() && toast.message("Redid the last change")}
          disabled={history.future.length === 0}
        />
      </ToolGroup>

      <Sep />

      <ToolGroup>
        <ToolButton icon={ZoomIn} label="Zoom in" onClick={() => requestZoom("in")} />
        <ToolButton icon={ZoomOut} label="Zoom out" onClick={() => requestZoom("out")} />
        <ToolButton icon={Maximize} label="Fit to view" onClick={() => requestZoom("fit")} />
      </ToolGroup>

      <Sep />

      <ToolGroup>
        <ToolToggle
          icon={Grid3X3}
          label="Grid"
          active={viewSettings.grid}
          onToggle={() => setViewSetting("grid", !viewSettings.grid)}
        />
        <ToolToggle
          icon={Magnet}
          label="Snap"
          active={viewSettings.snap}
          onToggle={() => setViewSetting("snap", !viewSettings.snap)}
        />
        <ToolToggle
          icon={Ruler}
          label="Ruler"
          active={viewSettings.ruler}
          onToggle={() => setViewSetting("ruler", !viewSettings.ruler)}
        />
      </ToolGroup>

      <Sep />

      <ToolGroup>
        <ToolToggle
          icon={Square}
          label="2D"
          active={viewSettings.mode === "2d"}
          onToggle={() => setViewSetting("mode", "2d")}
        />
        <ToolToggle
          icon={Box}
          label="3D"
          active={viewSettings.mode === "3d"}
          onToggle={() => setViewSetting("mode", "3d")}
        />
      </ToolGroup>

      <Sep />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={heatmapMode === "none" ? "outline" : "default"}
            size="sm"
            className="h-8 gap-1.5"
          >
            <Thermometer className="h-3.5 w-3.5" />
            Heatmap: {HEATMAP_LABELS[heatmapMode]}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Heatmap mode</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(Object.keys(HEATMAP_LABELS) as HeatmapMode[]).map((mode) => (
            <DropdownMenuItem
              key={mode}
              onClick={() => setHeatmap(mode)}
              className="flex items-center justify-between"
            >
              <span>{HEATMAP_LABELS[mode]}</span>
              {heatmapMode === mode && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => {
            if (plan) openWhatIf(plan);
          }}
          disabled={!plan}
        >
          <Calculator className="h-3.5 w-3.5" /> What-If
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => {
            if (!plan) return;
            // If the loaded plan is itself a derivative, compare it against
            // its parent. Otherwise default to the known v4.1 → v4.2 demo pair.
            const baseId = plan.parentVersionId ?? plan.id;
            const vsId =
              plan.parentVersionId ? plan.id : plan.id === "beer-v41" ? "beer-v42" : plan.id;
            if (baseId === vsId) {
              toast.message("No companion version yet", {
                description: "Create a What-If apply, then come back to compare.",
              });
              return;
            }
            router.push(`/planograms/${baseId}/compare/${vsId}`);
          }}
        >
          <GitCompare className="h-3.5 w-3.5" /> Compare versions
        </Button>
        <Button
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => {
            setRightRailTab("agent");
            toast.message("Asking the AI agent for suggestions", {
              description: "The full agent panel ships in Session 5.",
            });
          }}
        >
          <Sparkles className="h-3.5 w-3.5" /> Auto-optimize
        </Button>
      </div>
    </div>
  );
}

function ToolGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}
function Sep() {
  return <Separator orientation="vertical" className="mx-1 h-5" />;
}

function ToolButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

function ToolToggle({
  icon: Icon,
  label,
  active,
  onToggle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8",
            active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
          )}
          onClick={onToggle}
          aria-label={label}
          aria-pressed={active}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
