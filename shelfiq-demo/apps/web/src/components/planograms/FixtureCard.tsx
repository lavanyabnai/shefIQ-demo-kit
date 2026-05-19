"use client";
import * as React from "react";
import {
  Refrigerator,
  Boxes,
  Flame,
  Wallet,
  PanelsTopLeft,
  Square,
  Check,
  type LucideIcon,
} from "lucide-react";
import type { Fixture, FixtureType } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<FixtureType, LucideIcon> = {
  "cold-vault":     Refrigerator,
  gondola:          PanelsTopLeft,
  endcap:           Square,
  rollergrill:      Flame,
  "tobacco-gantry": Wallet,
  counter:          Boxes,
};

interface Props {
  fixture: Fixture;
  selected?: boolean;
  onClick?: () => void;
  usage?: number;
}

export function FixtureCard({ fixture, selected, onClick, usage }: Props) {
  const Icon = ICONS[fixture.type] ?? Boxes;
  const meta =
    fixture.doors && fixture.shelvesPerDoor
      ? `${fixture.doors} doors · ${fixture.shelvesPerDoor} shelves`
      : fixture.shelvesPerDoor
      ? `${fixture.shelvesPerDoor} shelves`
      : prettyType(fixture.type);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border bg-card p-3 text-left transition-all",
        "hover:-translate-y-0.5 hover:shadow-sm",
        selected ? "border-primary ring-2 ring-primary/40" : "border-border"
      )}
    >
      {selected && (
        <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </span>
      )}
      <div className="grid h-20 place-items-center rounded-md bg-muted/50 text-muted-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <div className="text-[13px] font-semibold leading-tight">{fixture.name}</div>
      <div className="text-[11.5px] tabular-nums text-muted-foreground">
        {fixture.dimensions.w}″W × {fixture.dimensions.h}″H × {fixture.dimensions.d}″D
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
        <span>{meta}</span>
        {typeof usage === "number" && (
          <span>{usage} {usage === 1 ? "plan" : "plans"}</span>
        )}
      </div>
    </button>
  );
}

function prettyType(t: FixtureType): string {
  return t
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(" ");
}
