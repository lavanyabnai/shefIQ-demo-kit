import { Package } from "lucide-react";
import { ComingSoon } from "@/components/shell/ComingSoon";

export default function ProductsPage() {
  return (
    <ComingSoon
      icon={Package}
      title="Products"
      description="Catalog of SKUs with dimensions, velocity, and vendor metadata."
    />
  );
}
