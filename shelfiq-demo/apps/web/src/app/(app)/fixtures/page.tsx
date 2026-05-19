import {
  Refrigerator,
  Flame,
  Wallet,
  PanelsTopLeft,
  Square,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fixtures, plans } from "@/lib/seed";
import type { FixtureType, Fixture } from "@/lib/types";

const ICONS: Record<FixtureType, LucideIcon> = {
  "cold-vault":     Refrigerator,
  gondola:          PanelsTopLeft,
  endcap:           Square,
  rollergrill:      Flame,
  "tobacco-gantry": Wallet,
  counter:          Boxes,
};

const TYPE_LABEL: Record<FixtureType, string> = {
  "cold-vault":     "Cold vault",
  gondola:          "Gondola",
  endcap:           "Endcap",
  rollergrill:      "Roller grill",
  "tobacco-gantry": "Tobacco gantry",
  counter:          "Counter",
};

function usageByFixture(): Map<string, number> {
  const m = new Map<string, number>();
  for (const p of Object.values(plans)) m.set(p.fixtureId, (m.get(p.fixtureId) ?? 0) + 1);
  return m;
}

function attributes(f: Fixture): { label: string; value: string }[] {
  const attrs: { label: string; value: string }[] = [];
  if (f.doors) attrs.push({ label: "Doors", value: `${f.doors}` });
  if (f.shelvesPerDoor)
    attrs.push({
      label: f.doors ? "Shelves / door" : "Shelves",
      value: `${f.shelvesPerDoor}`,
    });
  if (typeof f.temperature === "number")
    attrs.push({ label: "Temp", value: `${f.temperature}°F` });
  if (f.swingDirection)
    attrs.push({
      label: "Swing",
      value: f.swingDirection[0].toUpperCase() + f.swingDirection.slice(1),
    });
  return attrs;
}

export default function FixturesPage() {
  const usage = usageByFixture();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Fixture library</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          C-store native fixtures · {fixtures.length} types
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {fixtures.map((f) => {
          const Icon = ICONS[f.type] ?? Boxes;
          const used = usage.get(f.id) ?? 0;
          return (
            <div
              key={f.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-[10.5px]">
                  {TYPE_LABEL[f.type]}
                </Badge>
              </div>
              <div>
                <div className="text-[14px] font-semibold leading-tight">{f.name}</div>
                <div className="mt-1 text-[11.5px] tabular-nums text-muted-foreground">
                  {f.dimensions.w}″W × {f.dimensions.h}″H × {f.dimensions.d}″D
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11.5px]">
                {attributes(f).map((a) => (
                  <div key={a.label}>
                    <div className="text-muted-foreground">{a.label}</div>
                    <div className="font-medium tabular-nums">{a.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-auto border-t border-border pt-2 text-[11px] text-muted-foreground">
                Used in <span className="font-semibold text-foreground">{used}</span>{" "}
                {used === 1 ? "planogram" : "planograms"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
