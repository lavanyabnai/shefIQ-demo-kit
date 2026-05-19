"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlanogramsNewButton() {
  const router = useRouter();
  return (
    <Button size="sm" className="h-9 gap-1.5" onClick={() => router.push("/planograms?new=true")}>
      <Plus className="h-3.5 w-3.5" /> New planogram
    </Button>
  );
}
