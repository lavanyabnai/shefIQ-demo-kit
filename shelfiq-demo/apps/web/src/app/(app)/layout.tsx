import * as React from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { CommandPaletteProvider } from "@/components/shell/CommandPaletteProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="min-w-0 flex-1 px-6 py-6 lg:px-8">{children}</main>
        </div>
      </div>
      <CommandPalette />
    </CommandPaletteProvider>
  );
}
