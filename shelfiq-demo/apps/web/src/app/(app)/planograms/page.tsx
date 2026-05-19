import * as React from "react";
import { PlanogramsTable } from "@/components/planograms/PlanogramsTable";
import { PlanogramsModalLoader } from "@/components/planograms/PlanogramsModalLoader";
import { PlanogramsNewButton } from "@/components/planograms/PlanogramsNewButton";

export default function PlanogramsPage() {
  return (
    <>
      <PlanogramsTable NewPlanogramButton={PlanogramsNewButton} />
      <React.Suspense fallback={null}>
        <PlanogramsModalLoader />
      </React.Suspense>
    </>
  );
}
