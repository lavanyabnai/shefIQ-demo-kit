"use client";
import * as React from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "./Breadcrumb";
import { BannerSelector } from "./BannerSelector";
import { NotificationsBell } from "./NotificationsBell";
import { ThemeToggle } from "./ThemeToggle";
import { useCommandPalette } from "./CommandPaletteProvider";
import { users } from "@/lib/seed";

export function Topbar() {
  const palette = useCommandPalette();
  const maria = users.find((u) => u.id === "user-maria-chen")!;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/70 px-5 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex min-w-0 flex-1 items-center">
        <Breadcrumb />
      </div>

      <button
        type="button"
        onClick={palette.open}
        className="flex h-8 w-[280px] items-center gap-2 rounded-md border border-input bg-background px-3 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted/40"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search planograms, SKUs, stores…</span>
        <span className="flex gap-1">
          <span className="siq-kbd">⌘</span>
          <span className="siq-kbd">K</span>
        </span>
      </button>

      <BannerSelector />

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationsBell />
        <Button variant="ghost" className="h-8 gap-1.5 pl-1 pr-1.5">
          <Avatar className="h-6 w-6">
            <AvatarImage src={maria.avatar} alt={maria.name} />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
