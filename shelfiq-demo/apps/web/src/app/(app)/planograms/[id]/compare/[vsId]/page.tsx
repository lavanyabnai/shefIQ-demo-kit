import { CompareClient } from "@/components/compare/CompareClient";

export default function ComparePage({
  params,
}: {
  params: { id: string; vsId: string };
}) {
  return <CompareClient baseId={params.id} vsId={params.vsId} />;
}
