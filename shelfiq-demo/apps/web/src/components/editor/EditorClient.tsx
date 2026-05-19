"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EditorHeader } from "./EditorHeader";
import { ProductLibrary } from "./ProductLibrary";
import { Toolbar } from "./Toolbar";
import { CanvasStage } from "./CanvasStage";
import { RightRail } from "./RightRail";
import { DragGhost } from "./DragGhost";
import { WhatIfPanel } from "./WhatIfPanel";
import { useEditorShortcuts } from "./useEditorShortcuts";
import { useCanvasStore } from "@/lib/stores/canvasStore";

export function EditorClient({ planId }: { planId: string }) {
  const router = useRouter();
  const plan = useCanvasStore((s) => s.plan);
  const loadPlan = useCanvasStore((s) => s.loadPlan);
  const unloadPlan = useCanvasStore((s) => s.unloadPlan);
  const [loaded, setLoaded] = React.useState(false);
  const [missing, setMissing] = React.useState(false);
  useEditorShortcuts();

  React.useEffect(() => {
    const ok = loadPlan(planId);
    setMissing(!ok);
    setLoaded(true);
    return () => {
      unloadPlan();
    };
  }, [planId, loadPlan, unloadPlan]);

  if (!loaded) return null;

  if (missing || !plan) {
    return (
      <div className="-mx-6 -my-6 flex min-h-[calc(100vh-56px)] flex-col lg:-mx-8">
        <div className="grid flex-1 place-items-center p-12">
          <Card className="flex max-w-md flex-col items-center gap-3 p-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
              <Layers className="h-6 w-6" />
            </div>
            <div className="text-[15px] font-semibold">Planogram not found</div>
            <p className="text-[13px] text-muted-foreground">
              We couldn&rsquo;t locate plan{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-[11.5px]">
                {planId}
              </code>{" "}
              in the seed or in your draft registry.
            </p>
            <Button onClick={() => router.push("/planograms")} className="mt-2">
              Back to planograms
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-6 -my-6 flex min-h-[calc(100vh-56px)] flex-col bg-background lg:-mx-8">
      <EditorHeader />
      <div className="flex min-h-0 flex-1">
        <ProductLibrary />
        <section className="flex min-w-0 flex-1 flex-col">
          <Toolbar />
          <CanvasStage />
        </section>
        <RightRail />
      </div>
      <DragGhost />
      <WhatIfPanel />
    </div>
  );
}
