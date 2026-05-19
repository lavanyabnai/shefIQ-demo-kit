import { Store } from "lucide-react";
import { ComingSoon } from "@/components/shell/ComingSoon";

export default function StoresPage() {
  return (
    <ComingSoon
      icon={Store}
      title="Stores"
      description="Compliance, banners, and cluster assignments across the chain."
    />
  );
}
