"use client";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCanvasStore, type RightRailTab } from "@/lib/stores/canvasStore";
import { PropertiesPanel } from "./PropertiesPanel";

export function RightRail() {
  const selectedId = useCanvasStore((s) => s.selectedPositionId);
  const tab = useCanvasStore((s) => s.rightRailTab);
  const setTab = useCanvasStore((s) => s.setRightRailTab);

  // When a position is selected, jump the user to the Properties tab.
  React.useEffect(() => {
    if (selectedId) setTab("properties");
  }, [selectedId, setTab]);

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-card">
      <Tabs value={tab} onValueChange={(v) => setTab(v as RightRailTab)} className="flex flex-1 flex-col">
        <div className="border-b border-border px-3 pt-3">
          <TabsList className="h-9 w-full">
            <TabsTrigger value="properties" className="flex-1 text-[12px]">
              Properties
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex-1 text-[12px]">
              Rules
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 text-[12px]">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="agent" className="flex-1 text-[12px]">
              AI Agent
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="properties" className="m-0 flex-1 overflow-hidden">
          <PropertiesPanel />
        </TabsContent>
        <TabsContent value="rules" className="m-0 flex-1 overflow-y-auto px-4 py-6 text-[12px] text-muted-foreground">
          Plan-level rules — capability arrives in a later session.
        </TabsContent>
        <TabsContent value="analytics" className="m-0 flex-1 overflow-y-auto px-4 py-6 text-[12px] text-muted-foreground">
          Live aggregates (top over-/under-spaced, subcategory breakdown) ship in Session 4.
        </TabsContent>
        <TabsContent value="agent" className="m-0 flex-1 overflow-y-auto px-4 py-6 text-[12px] text-muted-foreground">
          The AI agent panel ships in Session 5.
        </TabsContent>
      </Tabs>
    </aside>
  );
}
