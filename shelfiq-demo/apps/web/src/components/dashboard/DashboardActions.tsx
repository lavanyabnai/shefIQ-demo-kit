"use client";
import { useRouter } from "next/navigation";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function DashboardActions() {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5"
        onClick={() => toast.success("PSA import queued", { description: "We'll notify you when parsing completes." })}
      >
        <Upload className="h-3.5 w-3.5" /> Import PSA
      </Button>
      <Button
        size="sm"
        className="h-9 gap-1.5"
        onClick={() => router.push("/planograms?new=true")}
      >
        <Plus className="h-3.5 w-3.5" /> New planogram
      </Button>
    </div>
  );
}
