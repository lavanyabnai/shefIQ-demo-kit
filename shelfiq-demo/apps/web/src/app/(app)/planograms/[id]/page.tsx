// Editor stub — replaced in Session 3.
import { Card } from "@/components/ui/card";
import { Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PlanEditorStubPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight">Editor preview</h1>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            Plan ID <code className="rounded bg-muted px-1.5 py-0.5 text-[11.5px]">{params.id}</code> ·
            full Konva editor lands in Session 3.
          </p>
        </div>
        <Link href="/planograms">
          <Button variant="outline" size="sm" className="h-9">Back to planograms</Button>
        </Link>
      </div>
      <Card className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-12 text-muted-foreground">
        <div className="grid h-16 w-16 place-items-center rounded-xl bg-muted">
          <Layers className="h-7 w-7" />
        </div>
        <div className="text-[15px] font-semibold text-foreground">
          Editor will load here for {params.id}
        </div>
        <p className="max-w-[420px] text-center text-[13px]">
          The three-pane Konva editor — product library, canvas, properties/agent rail —
          is built in Session 3.
        </p>
      </Card>
    </div>
  );
}
