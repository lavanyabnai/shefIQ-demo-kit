import { EditorClient } from "@/components/editor/EditorClient";

export default function PlanEditorPage({ params }: { params: { id: string } }) {
  return <EditorClient planId={params.id} />;
}
