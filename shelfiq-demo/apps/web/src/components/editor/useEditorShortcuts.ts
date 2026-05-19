"use client";
import * as React from "react";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { toast } from "@/components/ui/toast";
import { findProduct } from "@/lib/seed";

// Global keyboard shortcuts that only fire when the editor is mounted.
// Ignores events that originate from text inputs / contenteditable.
export function useEditorShortcuts() {
  const selectedId = useCanvasStore((s) => s.selectedPositionId);
  const plan = useCanvasStore((s) => s.plan);
  const setSelection = useCanvasStore((s) => s.setSelection);
  const setDraggedProduct = useCanvasStore((s) => s.setDraggedProduct);
  const removePosition = useCanvasStore((s) => s.removePosition);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);

  React.useEffect(() => {
    const isEditable = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return el.isContentEditable;
    };

    const onKey = (e: KeyboardEvent) => {
      // Always-on cancellation actions.
      if (e.key === "Escape") {
        setSelection(null);
        setDraggedProduct(null);
        return;
      }
      if (isEditable(e.target)) return;

      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          if (redo()) toast.message("Redid the last change");
        } else {
          if (undo()) toast.message("Undid the last change");
        }
        return;
      }
      if (cmd && e.key.toLowerCase() === "y") {
        e.preventDefault();
        if (redo()) toast.message("Redid the last change");
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && plan) {
        e.preventDefault();
        const pos = plan.positions.find((p) => p.id === selectedId);
        if (pos) {
          const product = findProduct(pos.productId);
          removePosition(selectedId);
          toast.success(`${product?.brand ?? "Position"} removed`);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, plan, setSelection, setDraggedProduct, removePosition, undo, redo]);
}
