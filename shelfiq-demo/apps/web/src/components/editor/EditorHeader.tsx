"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Share2, MoreHorizontal, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/planograms/StatusPill";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { useCanvasStore } from "@/lib/stores/canvasStore";

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function EditorHeader() {
  const plan = useCanvasStore((s) => s.plan);
  const isDirty = useCanvasStore((s) => s.isDirty);
  const save = useCanvasStore((s) => s.save);

  if (!plan) return null;

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-card/70 px-4">
      <Link
        href="/planograms"
        className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Back to planograms"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
      </Link>

      <div className="flex min-w-0 items-center gap-2">
        <div className="truncate text-[13.5px] font-semibold">{plan.name}</div>
        <span className="text-[11.5px] tabular-nums text-muted-foreground">
          {plan.version}
        </span>
        <StatusPill status={plan.status} />
        {isDirty && (
          <span className="inline-flex items-center text-[11px] text-warning">
            <Dot className="-mx-1 h-4 w-4" />
            Unsaved changes
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-6 w-6">
            <AvatarImage src={plan.owner.avatar} alt={plan.owner.name} />
            <AvatarFallback className="text-[9px]">
              {initials(plan.owner.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-[12px] text-muted-foreground md:inline">
            {plan.owner.name}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() =>
            toast.success("Share link copied", {
              description: "Anyone with this link can view the planogram.",
            })
          }
        >
          <Share2 className="h-3.5 w-3.5" /> Share
        </Button>
        <Button
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => {
            save();
            toast.success(`${plan.name} saved as ${plan.version}`, {
              description: `${plan.positions.length} positions · status: draft`,
            });
          }}
          disabled={!isDirty}
        >
          <Save className="h-3.5 w-3.5" /> Save
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  );
}
