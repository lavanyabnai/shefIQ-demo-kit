"use client";
import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BANNERS = [
  "All banners",
  "Quikstop Core",
  "Quikstop Express",
  "Quikstop Fuel",
];

export function BannerSelector() {
  const [banner, setBanner] = React.useState("All banners");
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 min-w-[170px] justify-between">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {banner}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[200px] p-1">
        {BANNERS.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => {
              setBanner(b);
              setOpen(false);
            }}
            className="flex h-8 w-full items-center justify-between rounded-sm px-2 text-sm hover:bg-accent"
          >
            <span>{b}</span>
            {b === banner && <Check className="h-3.5 w-3.5 text-primary" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
