"use client";
// Konva canvas stage for cold-vault fixtures. Fixture-agnostic — reads
// doors / shelvesPerDoor / dimensions from the resolved fixture and lays
// out positions in inch-space with a px-per-inch scale.
//
// Coordinate system: world units = inches. Fixture origin (0,0) is the
// top-left of the cold-vault frame. Stage scale converts inches to screen
// pixels.

import * as React from "react";
import { Stage, Layer, Rect, Line, Text, Group } from "react-konva";
import type Konva from "konva";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { findFixture, findProduct, products as allProducts } from "@/lib/seed";
import { toast } from "@/components/ui/toast";
import { recommendedFacings } from "./ProductLibrary";
import { computeHeatmap, type HeatmapDatum } from "@/lib/calc/heatmap";
import type { Position, Product } from "@/lib/types";

const INITIAL_PX_PER_INCH = 6;
const MIN_SCALE = 0.4;
const MAX_SCALE = 3;
const RULER_HEIGHT = 28;
const TEMP_PILL_HEIGHT = 22;
const PADDING_TOP = TEMP_PILL_HEIGHT + RULER_HEIGHT + 12;
const PADDING_LEFT = 56;
const PADDING_RIGHT = 16;
const PADDING_BOTTOM = 24;
const SHELF_PADDING_X = 2;
const SHELF_PADDING_Y = 2;

interface CanvasStageInnerProps {
  width: number;
  height: number;
}

interface Slot {
  doorIndex: number;
  shelfIndex: number;
  slotIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SlotTarget {
  doorIndex: number;
  shelfIndex: number;
  slotIndex: number;
}

export default function CanvasStageInner({ width, height }: CanvasStageInnerProps) {
  const plan = useCanvasStore((s) => s.plan);
  const selectedId = useCanvasStore((s) => s.selectedPositionId);
  const draggedProductId = useCanvasStore((s) => s.draggedProductId);
  const viewSettings = useCanvasStore((s) => s.viewSettings);
  const heatmapMode = useCanvasStore((s) => s.heatmapMode);
  const zoomCommand = useCanvasStore((s) => s.zoomCommand);
  const setSelection = useCanvasStore((s) => s.setSelection);
  const setDraggedProduct = useCanvasStore((s) => s.setDraggedProduct);
  const placeProduct = useCanvasStore((s) => s.placeProduct);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const [hoveredPositionId, setHoveredPositionId] = React.useState<string | null>(null);
  const [hoverPoint, setHoverPoint] = React.useState<{ x: number; y: number } | null>(null);

  const productById = React.useMemo(
    () => new Map(allProducts.map((p) => [p.id, p])),
    []
  );
  const heatmap = React.useMemo(
    () => (plan ? computeHeatmap(heatmapMode, plan, productById) : null),
    [plan, heatmapMode, productById]
  );

  const [scale, setScale] = React.useState(INITIAL_PX_PER_INCH);
  const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const panStart = React.useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [hoverSlot, setHoverSlot] = React.useState<SlotTarget | null>(null);

  const fixture = plan ? findFixture(plan.fixtureId) : undefined;

  const fitToView = React.useCallback(() => {
    if (!fixture) return;
    const fixtureW = fixture.dimensions.w;
    const fixtureH = fixture.dimensions.h;
    const usableW = width - PADDING_LEFT - PADDING_RIGHT;
    const usableH = height - PADDING_TOP - PADDING_BOTTOM;
    const fitScale = Math.min(usableW / fixtureW, usableH / fixtureH);
    const safeScale =
      Number.isFinite(fitScale) && fitScale > 0 ? fitScale * 0.95 : INITIAL_PX_PER_INCH;
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, safeScale));
    const renderedW = fixtureW * clampedScale;
    const renderedH = fixtureH * clampedScale;
    setScale(clampedScale);
    setOrigin({
      x: (width - renderedW) / 2,
      y: PADDING_TOP + (height - PADDING_TOP - PADDING_BOTTOM - renderedH) / 2,
    });
  }, [fixture, width, height]);

  // Initial fit on plan / size change.
  React.useEffect(() => {
    fitToView();
  }, [fitToView]);

  // Toolbar zoom commands.
  React.useEffect(() => {
    if (!zoomCommand) return;
    if (zoomCommand.kind === "fit") {
      fitToView();
      return;
    }
    const factor = zoomCommand.kind === "in" ? 1.2 : 1 / 1.2;
    const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * factor));
    // Zoom around viewport center.
    const cx = width / 2;
    const cy = height / 2;
    const worldX = (cx - origin.x) / scale;
    const worldY = (cy - origin.y) / scale;
    setScale(next);
    setOrigin({ x: cx - worldX * next, y: cy - worldY * next });
  }, [zoomCommand, fitToView, scale, origin, width, height]);

  // Suppress browser context menu on stage container.
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const container = stage.container();
    const preventContext = (e: MouseEvent) => e.preventDefault();
    container.addEventListener("contextmenu", preventContext);
    return () => container.removeEventListener("contextmenu", preventContext);
  }, []);

  // Clear hover slot when drag ends.
  React.useEffect(() => {
    if (!draggedProductId) setHoverSlot(null);
  }, [draggedProductId]);

  const worldFromPointer = React.useCallback(
    (pointerX: number, pointerY: number) => ({
      x: (pointerX - origin.x) / scale,
      y: (pointerY - origin.y) / scale,
    }),
    [origin, scale]
  );

  const computeTarget = React.useCallback(
    (pointerX: number, pointerY: number): SlotTarget | null => {
      if (!fixture || !plan) return null;
      const w = worldFromPointer(pointerX, pointerY);
      if (w.x < 0 || w.y < 0 || w.x > fixture.dimensions.w || w.y > fixture.dimensions.h) {
        return null;
      }
      const doors = fixture.doors ?? 1;
      const shelves = fixture.shelvesPerDoor ?? 1;
      const doorWidth = fixture.dimensions.w / doors;
      const shelfHeight = fixture.dimensions.h / shelves;
      const doorIndex = Math.min(doors - 1, Math.max(0, Math.floor(w.x / doorWidth)));
      const shelfIndex = Math.min(shelves - 1, Math.max(0, Math.floor(w.y / shelfHeight)));
      const existing = plan.positions.filter(
        (p) => p.doorIndex === doorIndex && p.shelfIndex === shelfIndex
      );
      const slotIndex = existing.length;
      return { doorIndex, shelfIndex, slotIndex };
    },
    [fixture, plan, worldFromPointer]
  );

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 2) {
      setIsPanning(true);
      panStart.current = { x: e.evt.clientX, y: e.evt.clientY, ox: origin.x, oy: origin.y };
      return;
    }
    if (e.evt.button === 0) {
      // Left-click on empty canvas deselects.
      if (e.target === e.target.getStage()) {
        setSelection(null);
      }
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanning && panStart.current) {
      const dx = e.evt.clientX - panStart.current.x;
      const dy = e.evt.clientY - panStart.current.y;
      setOrigin({ x: panStart.current.ox + dx, y: panStart.current.oy + dy });
      return;
    }
    if (draggedProductId) {
      const stage = stageRef.current;
      if (!stage) return;
      const ptr = stage.getPointerPosition();
      if (!ptr) return;
      setHoverSlot(computeTarget(ptr.x, ptr.y));
    }
  };

  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setIsPanning(false);
    panStart.current = null;

    if (draggedProductId && hoverSlot) {
      const product = findProduct(draggedProductId);
      if (!product) {
        setDraggedProduct(null);
        return;
      }
      const facings = recommendedFacings(product);
      const ok = placeProduct(
        product.id,
        hoverSlot.doorIndex,
        hoverSlot.shelfIndex,
        hoverSlot.slotIndex,
        facings
      );
      if (ok) {
        toast.success(`${product.brand} placed`, {
          description: `Door ${hoverSlot.doorIndex + 1} · Shelf ${hoverSlot.shelfIndex + 1} · ×${facings}`,
        });
      } else {
        toast.warning("Slot already occupied", {
          description: "Try another shelf or remove the existing SKU first.",
        });
      }
      setDraggedProduct(null);
      setHoverSlot(null);
    } else if (draggedProductId && !hoverSlot) {
      // Drop outside any door — silent cancel.
      setDraggedProduct(null);
    }
    void e;
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - origin.x) / oldScale,
      y: (pointer.y - origin.y) / oldScale,
    };
    const scaleBy = 1.08;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const next = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
    setScale(clamped);
    setOrigin({
      x: pointer.x - mousePointTo.x * clamped,
      y: pointer.y - mousePointTo.y * clamped,
    });
  };

  const slotsByDoorShelf = React.useMemo(() => {
    const map = new Map<string, Slot[]>();
    if (!plan || !fixture) return map;
    const doors = fixture.doors ?? 1;
    const shelves = fixture.shelvesPerDoor ?? 1;
    const doorWidth = fixture.dimensions.w / doors;
    const shelfHeight = fixture.dimensions.h / shelves;

    for (let d = 0; d < doors; d++) {
      for (let s = 0; s < shelves; s++) {
        const key = `${d}:${s}`;
        const positions = plan.positions
          .filter((p) => p.doorIndex === d && p.shelfIndex === s)
          .sort((a, b) => a.slotIndex - b.slotIndex);
        const slots: Slot[] = [];
        let cursor = SHELF_PADDING_X;
        for (const pos of positions) {
          const product = findProduct(pos.productId);
          if (!product) continue;
          const w = product.dimensions.w * pos.facings;
          const h = product.dimensions.h;
          slots.push({
            doorIndex: d,
            shelfIndex: s,
            slotIndex: pos.slotIndex,
            x: d * doorWidth + cursor,
            y: s * shelfHeight + SHELF_PADDING_Y,
            width: w,
            height: h,
          });
          cursor += w;
        }
        // Pass void to suppress unused vars
        void doorWidth;
        void shelfHeight;
        map.set(key, slots);
      }
    }
    return map;
  }, [plan, fixture]);

  const hoveredProductName = React.useMemo(() => {
    if (!hoveredPositionId || !plan) return "";
    const pos = plan.positions.find((p) => p.id === hoveredPositionId);
    if (!pos) return "";
    return findProduct(pos.productId)?.brand ?? "";
  }, [hoveredPositionId, plan]);

  if (!plan || !fixture) return null;

  const doors = fixture.doors ?? 1;
  const shelves = fixture.shelvesPerDoor ?? 1;
  const doorWidth = fixture.dimensions.w / doors;
  const shelfHeight = fixture.dimensions.h / shelves;
  const tempPills = Array.from({ length: doors }, (_, i) => ({
    doorIndex: i,
    temp: fixture.temperature ?? 34,
  }));

  const hoveredDatum =
    heatmap && hoveredPositionId ? heatmap.byPositionId.get(hoveredPositionId) ?? null : null;

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsPanning(false);
        panStart.current = null;
        if (draggedProductId) setHoverSlot(null);
        setHoveredPositionId(null);
      }}
      onWheel={handleWheel}
      style={{
        cursor: isPanning
          ? "grabbing"
          : draggedProductId
          ? "copy"
          : "default",
      }}
    >
      {/* Static fixture frame */}
      <Layer listening={false}>
        {/* Optional grid overlay (toggleable) */}
        {viewSettings.grid && (() => {
          const lines: React.ReactNode[] = [];
          for (let i = 0; i <= fixture.dimensions.w; i += 6) {
            const x = origin.x + i * scale;
            lines.push(
              <Line
                key={`gv-${i}`}
                points={[x, origin.y, x, origin.y + fixture.dimensions.h * scale]}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={0.5}
              />
            );
          }
          for (let i = 0; i <= fixture.dimensions.h; i += 6) {
            const y = origin.y + i * scale;
            lines.push(
              <Line
                key={`gh-${i}`}
                points={[origin.x, y, origin.x + fixture.dimensions.w * scale, y]}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={0.5}
              />
            );
          }
          return <>{lines}</>;
        })()}

        {tempPills.map((p) => {
          const cx = origin.x + (p.doorIndex + 0.5) * doorWidth * scale;
          const y = origin.y - TEMP_PILL_HEIGHT - RULER_HEIGHT - 6;
          return (
            <Group key={`temp-${p.doorIndex}`}>
              <Rect
                x={cx - 32}
                y={y}
                width={64}
                height={TEMP_PILL_HEIGHT}
                cornerRadius={11}
                fill="#0c4a6e"
                opacity={0.85}
              />
              <Text
                x={cx - 32}
                y={y + 4}
                width={64}
                align="center"
                text={`${p.temp}°F`}
                fontSize={12}
                fontStyle="600"
                fill="#bae6fd"
                fontFamily="system-ui, -apple-system, Segoe UI, Inter, sans-serif"
              />
            </Group>
          );
        })}

        {viewSettings.ruler && (
          <RulerLayer
            originX={origin.x}
            originY={origin.y - RULER_HEIGHT - 2}
            totalInches={fixture.dimensions.w}
            scale={scale}
          />
        )}

        <Rect
          x={origin.x - 4}
          y={origin.y - 4}
          width={fixture.dimensions.w * scale + 8}
          height={fixture.dimensions.h * scale + 8}
          stroke="#475569"
          strokeWidth={2}
          cornerRadius={4}
          fill="#1e293b"
        />

        {Array.from({ length: doors }, (_, d) => (
          <Group key={`door-${d}`}>
            <Rect
              x={origin.x + d * doorWidth * scale}
              y={origin.y}
              width={doorWidth * scale}
              height={fixture.dimensions.h * scale}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: doorWidth * scale, y: fixture.dimensions.h * scale }}
              fillLinearGradientColorStops={[
                0,
                "rgba(186, 230, 253, 0.18)",
                0.5,
                "rgba(125, 211, 252, 0.08)",
                1,
                "rgba(56, 189, 248, 0.14)",
              ]}
              stroke="#334155"
              strokeWidth={1.5}
            />
            <Line
              points={[
                origin.x + d * doorWidth * scale + 4,
                origin.y + 6,
                origin.x + d * doorWidth * scale + 4,
                origin.y + fixture.dimensions.h * scale - 6,
              ]}
              stroke="#94a3b8"
              strokeWidth={1.5}
              opacity={0.55}
            />
            {Array.from({ length: shelves - 1 }, (_, s) => (
              <Line
                key={`shelf-${d}-${s}`}
                points={[
                  origin.x + d * doorWidth * scale,
                  origin.y + (s + 1) * shelfHeight * scale,
                  origin.x + (d + 1) * doorWidth * scale,
                  origin.y + (s + 1) * shelfHeight * scale,
                ]}
                stroke="#475569"
                strokeWidth={1}
                opacity={0.7}
              />
            ))}
          </Group>
        ))}
      </Layer>

      {/* Snap-guide highlight while dragging */}
      {draggedProductId && hoverSlot && (
        <Layer listening={false}>
          <Rect
            x={origin.x + hoverSlot.doorIndex * doorWidth * scale + 1}
            y={origin.y + hoverSlot.shelfIndex * shelfHeight * scale + 1}
            width={doorWidth * scale - 2}
            height={shelfHeight * scale - 2}
            fill="rgba(15, 118, 110, 0.18)"
            stroke="#0f766e"
            strokeWidth={2}
            dash={[6, 4]}
            cornerRadius={2}
          />
        </Layer>
      )}

      {/* Heatmap hover tooltip */}
      {hoveredDatum && hoverPoint && (
        <Layer listening={false}>
          <HoverTooltip
            point={hoverPoint}
            title={hoveredProductName}
            body={hoveredDatum.label}
          />
        </Layer>
      )}

      {/* Position rectangles */}
      <Layer>
        {Array.from(slotsByDoorShelf.entries()).flatMap(([key, slots]) =>
          slots.map((slot, idx) => {
            const [d, s] = key.split(":").map(Number);
            const positions = plan.positions
              .filter((p) => p.doorIndex === d && p.shelfIndex === s)
              .sort((a, b) => a.slotIndex - b.slotIndex);
            const pos = positions[idx];
            if (!pos) return null;
            const product = findProduct(pos.productId);
            if (!product) return null;
            const datum = heatmap?.byPositionId.get(pos.id) ?? null;
            return (
              <PositionRect
                key={pos.id}
                position={pos}
                product={product}
                slot={slot}
                scale={scale}
                originX={origin.x}
                originY={origin.y}
                selected={selectedId === pos.id}
                heatmapDatum={datum}
                onSelect={() => setSelection(pos.id)}
                onHover={(point) => {
                  setHoveredPositionId(pos.id);
                  setHoverPoint(point);
                }}
                onHoverLeave={() => {
                  setHoveredPositionId((id) => (id === pos.id ? null : id));
                }}
              />
            );
          })
        )}
      </Layer>
    </Stage>
  );
}

function PositionRect({
  position,
  product,
  slot,
  scale,
  originX,
  originY,
  selected,
  heatmapDatum,
  onSelect,
  onHover,
  onHoverLeave,
}: {
  position: Position;
  product: Product;
  slot: Slot;
  scale: number;
  originX: number;
  originY: number;
  selected: boolean;
  heatmapDatum: HeatmapDatum | null;
  onSelect: () => void;
  onHover: (point: { x: number; y: number }) => void;
  onHoverLeave: () => void;
}) {
  const x = originX + slot.x * scale;
  const y = originY + slot.y * scale;
  const w = slot.width * scale;
  const h = slot.height * scale;
  const fill = heatmapDatum?.fill ?? product.swatchColor;
  return (
    <Group
      onMouseDown={(e) => {
        if (e.evt.button === 0) {
          e.cancelBubble = true;
          onSelect();
        }
      }}
      onMouseEnter={(e) => {
        const stage = e.target.getStage();
        const ptr = stage?.getPointerPosition();
        if (ptr) onHover(ptr);
      }}
      onMouseMove={(e) => {
        const stage = e.target.getStage();
        const ptr = stage?.getPointerPosition();
        if (ptr) onHover(ptr);
      }}
      onMouseLeave={onHoverLeave}
    >
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={selected ? "#0f766e" : "rgba(15, 23, 42, 0.35)"}
        strokeWidth={selected ? 2.5 : 1}
        cornerRadius={2}
        shadowColor={selected ? "#0f766e" : undefined}
        shadowBlur={selected ? 8 : 0}
        shadowOpacity={selected ? 0.35 : 0}
      />
      {w > 32 && h > 18 && (
        <Text
          x={x + 4}
          y={y + 3}
          width={w - 8}
          text={product.brand}
          fontSize={Math.max(9, Math.min(11, h * 0.22))}
          fontStyle="600"
          fill="rgba(15, 23, 42, 0.9)"
          ellipsis
          wrap="none"
          listening={false}
          fontFamily="system-ui, -apple-system, Segoe UI, Inter, sans-serif"
        />
      )}
      {w > 22 && (
        <Text
          x={x + w - 18}
          y={y + h - 14}
          text={`×${position.facings}`}
          fontSize={10}
          fontStyle="700"
          fill="rgba(15, 23, 42, 0.7)"
          align="right"
          listening={false}
          fontFamily="system-ui, -apple-system, Segoe UI, Inter, sans-serif"
        />
      )}
      {position.facings > 1 &&
        Array.from({ length: position.facings - 1 }, (_, i) => {
          const dividerX = x + ((i + 1) * w) / position.facings;
          return (
            <Line
              key={i}
              points={[dividerX, y + 1, dividerX, y + h - 1]}
              stroke="rgba(15, 23, 42, 0.25)"
              strokeWidth={0.5}
              dash={[2, 2]}
              listening={false}
            />
          );
        })}
    </Group>
  );
}

function HoverTooltip({
  point,
  title,
  body,
}: {
  point: { x: number; y: number };
  title: string;
  body: string;
}) {
  const width = Math.max(180, Math.min(280, body.length * 5.5));
  const height = title ? 42 : 28;
  const offsetX = 12;
  const offsetY = 12;
  return (
    <Group x={point.x + offsetX} y={point.y + offsetY} listening={false}>
      <Rect
        width={width}
        height={height}
        fill="rgba(2, 6, 23, 0.92)"
        cornerRadius={4}
        stroke="rgba(148, 163, 184, 0.25)"
        strokeWidth={0.5}
      />
      {title && (
        <Text
          x={10}
          y={6}
          text={title}
          fontSize={11.5}
          fontStyle="700"
          fill="#f8fafc"
          fontFamily="system-ui, -apple-system, Segoe UI, Inter, sans-serif"
        />
      )}
      <Text
        x={10}
        y={title ? 22 : 7}
        text={body}
        fontSize={11}
        fill="#cbd5e1"
        width={width - 20}
        wrap="word"
        fontFamily="system-ui, -apple-system, Segoe UI, Inter, sans-serif"
      />
    </Group>
  );
}

function RulerLayer({
  originX,
  originY,
  totalInches,
  scale,
}: {
  originX: number;
  originY: number;
  totalInches: number;
  scale: number;
}) {
  const ticks: React.ReactNode[] = [];
  const major = 12;
  for (let i = 0; i <= totalInches; i += 2) {
    const x = originX + i * scale;
    const isMajor = i % major === 0;
    ticks.push(
      <Line
        key={`tick-${i}`}
        points={[x, originY + RULER_HEIGHT - (isMajor ? 12 : 6), x, originY + RULER_HEIGHT]}
        stroke="#94a3b8"
        strokeWidth={isMajor ? 1 : 0.6}
        opacity={isMajor ? 0.9 : 0.5}
      />
    );
    if (isMajor) {
      ticks.push(
        <Text
          key={`label-${i}`}
          x={x - 12}
          y={originY + 2}
          width={24}
          align="center"
          text={`${i}"`}
          fontSize={9}
          fill="#94a3b8"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        />
      );
    }
  }
  return (
    <Group>
      <Rect
        x={originX}
        y={originY}
        width={totalInches * scale}
        height={RULER_HEIGHT}
        fill="rgba(2, 6, 23, 0.35)"
        cornerRadius={3}
      />
      {ticks}
    </Group>
  );
}
