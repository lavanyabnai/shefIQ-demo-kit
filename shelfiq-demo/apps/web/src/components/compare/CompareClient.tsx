"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, MessageSquareText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/planograms/StatusPill";
import { toast } from "@/components/ui/toast";
import { CompareCanvas } from "./CompareCanvas";
import { ChangeRail } from "./ChangeRail";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { plans as seedPlans } from "@/lib/seed";
import { diffPlans } from "@/lib/calc/diff";
import type { Plan } from "@/lib/types";

export function CompareClient({ baseId, vsId }: { baseId: string; vsId: string }) {
  const router = useRouter();
  const draftPlans = useCanvasStore((s) => s.draftPlans);

  // Resolve plans: drafts override seed.
  const baseline: Plan | undefined = draftPlans[baseId] ?? seedPlans[baseId];
  const candidate: Plan | undefined = draftPlans[vsId] ?? seedPlans[vsId];

  const [hoveredPositionId, setHoveredPositionId] = React.useState<string | null>(null);

  const diff = React.useMemo(
    () => (baseline && candidate ? diffPlans(baseline, candidate) : null),
    [baseline, candidate]
  );

  if (!baseline || !candidate) {
    return (
      <div className="-mx-6 -my-6 flex min-h-[calc(100vh-56px)] flex-col bg-background lg:-mx-8">
        <div className="grid flex-1 place-items-center p-12">
          <Card className="flex max-w-md flex-col items-center gap-3 p-10 text-center">
            <div className="text-[15px] font-semibold">One of the versions is missing</div>
            <p className="text-[13px] text-muted-foreground">
              We couldn&rsquo;t resolve{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[11px]">{baseId}</code>{" "}
              or{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[11px]">{vsId}</code>.
            </p>
            <Button onClick={() => router.push("/planograms")} className="mt-2">
              Back to planograms
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const sharedViewportId = `compare:${baseId}:${vsId}`;

  return (
    <div className="-mx-6 -my-6 flex min-h-[calc(100vh-56px)] flex-col bg-background lg:-mx-8">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-card/70 px-4">
        <Link
          href={`/planograms/${baseId}`}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Back to editor"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
        <div className="text-[13.5px] font-semibold">Compare versions</div>
        <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
          <span className="font-medium text-foreground">{baseline.name}</span>
          <span className="tabular-nums">{baseline.version}</span>
          <StatusPill status={baseline.status} />
          <span className="px-1.5 text-muted-foreground/60">vs</span>
          <span className="font-medium text-foreground">{candidate.version}</span>
          <StatusPill status={candidate.status} />
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() =>
              toast.message("Change requested", {
                description: "Reviewer notes shipped to the plan owner.",
              })
            }
          >
            <MessageSquareText className="h-3.5 w-3.5" /> Request changes
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => toast.message("Rejected", { description: "v4.2 marked rejected." })}
          >
            <X className="h-3.5 w-3.5" /> Reject
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5"
            onClick={() =>
              toast.success("Approved", { description: `${candidate.version} is now Live in this view.` })
            }
          >
            <Check className="h-3.5 w-3.5" /> Approve
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <CompareCanvas
          plan={baseline}
          viewportId={sharedViewportId}
          highlightedPositionId={hoveredPositionId}
          label={`${baseline.version} · ${labelFor(baseline.status)}`}
          sublabel="Baseline"
        />
        <CompareCanvas
          plan={candidate}
          viewportId={sharedViewportId}
          highlightedPositionId={hoveredPositionId}
          label={`${candidate.version} · ${labelFor(candidate.status)}`}
          sublabel="Candidate"
        />
        {diff && (
          <ChangeRail
            diff={diff}
            hoveredPositionId={hoveredPositionId}
            onHoverChange={setHoveredPositionId}
          />
        )}
      </div>
    </div>
  );
}

function labelFor(status: Plan["status"]): string {
  switch (status) {
    case "live": return "Live";
    case "in-review": return "In Review";
    case "draft": return "Draft";
    case "approved": return "Approved";
    case "archived": return "Archived";
  }
}
