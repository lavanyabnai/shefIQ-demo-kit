"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { findProduct } from "@/lib/seed";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { recommendedFacings } from "./ProductLibrary";

export function DragGhost() {
  const draggedProductId = useCanvasStore((s) => s.draggedProductId);
  const setDraggedProduct = useCanvasStore((s) => s.setDraggedProduct);
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!draggedProductId) {
      setPos(null);
      return;
    }
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onUp = () => {
      // Global cancel — canvas drop handler clears state first if successful.
      setDraggedProduct(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDraggedProduct(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, [draggedProductId, setDraggedProduct]);

  if (!mounted || !draggedProductId || !pos) return null;
  const product = findProduct(draggedProductId);
  if (!product) return null;
  const facings = recommendedFacings(product);

  return createPortal(
    <div
      className="pointer-events-none fixed z-[1000] flex items-center gap-2 rounded-md border border-primary bg-card/95 px-2 py-1.5 text-[12px] shadow-lg"
      style={{
        left: pos.x + 12,
        top: pos.y + 12,
      }}
    >
      <span
        className="h-7 w-1.5 rounded-sm"
        style={{ background: product.swatchColor }}
      />
      <div className="leading-tight">
        <div className="font-semibold">{product.brand}</div>
        <div className="text-[10.5px] text-muted-foreground">
          {product.dimensions.w}″W · ×{facings} facings
        </div>
      </div>
    </div>,
    document.body
  );
}
