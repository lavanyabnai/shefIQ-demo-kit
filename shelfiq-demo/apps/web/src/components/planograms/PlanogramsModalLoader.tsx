"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NewPlanogramDialog } from "./NewPlanogramDialog";

export function PlanogramsModalLoader() {
  const router = useRouter();
  const params = useSearchParams();
  const shouldOpen = params.get("new") === "true" || params.get("demo") === "create";
  const [open, setOpen] = React.useState(shouldOpen);

  React.useEffect(() => {
    setOpen(shouldOpen);
  }, [shouldOpen]);

  return (
    <NewPlanogramDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && shouldOpen) {
          // Clear ?new from the URL on close so reopening works.
          router.replace("/planograms");
        }
      }}
    />
  );
}
