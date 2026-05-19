import { Network } from "lucide-react";
import { ComingSoon } from "@/components/shell/ComingSoon";

export default function ClustersPage() {
  return (
    <ComingSoon
      icon={Network}
      title="Clusters"
      description="Define and manage store clusters for cluster-specific planogramming."
    />
  );
}
