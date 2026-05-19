"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Layers,
  Store,
  Package,
  Boxes,
  FileBarChart2,
  Plus,
  Upload,
  GitCompare,
  ArrowUpRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { useCommandPalette } from "./CommandPaletteProvider";
import { cn } from "@/lib/utils";

interface PaletteAction {
  id: string;
  group: "Recent" | "Go to" | "Actions";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
}

export function CommandPalette() {
  const palette = useCommandPalette();
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const actions = React.useMemo<PaletteAction[]>(
    () => [
      {
        id: "recent-beer-v41",
        group: "Recent",
        label: "Open Beer Cooler v4.1 — Urban Premium",
        icon: Layers,
        run: () => router.push("/planograms/beer-v41"),
      },
      {
        id: "recent-compare",
        group: "Recent",
        label: "Compare Beer Cooler v4.1 → v4.2",
        icon: GitCompare,
        run: () => router.push("/planograms/beer-v41/compare/beer-v42"),
      },
      {
        id: "goto-dashboard",
        group: "Go to",
        label: "Dashboard",
        icon: LayoutDashboard,
        run: () => router.push("/dashboard"),
      },
      {
        id: "goto-planograms",
        group: "Go to",
        label: "Planograms",
        icon: Layers,
        run: () => router.push("/planograms"),
      },
      {
        id: "goto-stores",
        group: "Go to",
        label: "Stores",
        icon: Store,
        run: () => router.push("/stores"),
      },
      {
        id: "goto-products",
        group: "Go to",
        label: "Products",
        icon: Package,
        run: () => router.push("/products"),
      },
      {
        id: "goto-fixtures",
        group: "Go to",
        label: "Fixtures",
        icon: Boxes,
        run: () => router.push("/fixtures"),
      },
      {
        id: "goto-reports",
        group: "Go to",
        label: "Reports",
        icon: FileBarChart2,
        run: () => router.push("/reports"),
      },
      {
        id: "action-new",
        group: "Actions",
        label: "New planogram",
        icon: Plus,
        run: () => {
          router.push("/planograms?demo=create");
          toast.success("New planogram", { description: "Pick a fixture template to begin." });
        },
      },
      {
        id: "action-import",
        group: "Actions",
        label: "Import .psa file",
        icon: Upload,
        run: () => toast.success("PSA import queued", { description: "We'll notify you when parsing completes." }),
      },
    ],
    [router]
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q)
    );
  }, [actions, query]);

  const grouped = React.useMemo(() => {
    const m = new Map<string, PaletteAction[]>();
    for (const a of filtered) {
      if (!m.has(a.group)) m.set(a.group, []);
      m.get(a.group)!.push(a);
    }
    return Array.from(m.entries());
  }, [filtered]);

  React.useEffect(() => {
    if (palette.isOpen) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [palette.isOpen]);

  React.useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const a = filtered[activeIdx];
      if (a) {
        a.run();
        palette.close();
      }
    }
  };

  let runningIdx = -1;

  return (
    <Dialog open={palette.isOpen} onOpenChange={(o) => (o ? palette.open() : palette.close())}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="top-[18vh] max-w-[560px] translate-y-0 gap-0 p-0">
          <DialogTitle className="sr-only">Command palette</DialogTitle>
          <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              placeholder="Search planograms, SKUs, stores, actions…"
              className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <span className="siq-kbd">esc</span>
          </div>
          <div className="max-h-[380px] overflow-y-auto p-1.5">
            {grouped.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : (
              grouped.map(([group, items]) => (
                <div key={group} className="mb-1">
                  <div className="px-3 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {group}
                  </div>
                  {items.map((a) => {
                    runningIdx += 1;
                    const Icon = a.icon;
                    const isActive = runningIdx === activeIdx;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          a.run();
                          palette.close();
                        }}
                        onMouseEnter={() => {
                          setActiveIdx(filtered.indexOf(a));
                        }}
                        className={cn(
                          "flex h-8 w-full items-center gap-2.5 rounded-sm px-2.5 text-left text-[13px]",
                          isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="flex-1 truncate">{a.label}</span>
                        <ArrowUpRight className="h-3 w-3 text-muted-foreground/70" />
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
          <div className="flex gap-3.5 border-t border-border bg-muted/40 px-3.5 py-2 text-[11px] text-muted-foreground">
            <span>
              <span className="siq-kbd">↑</span> <span className="siq-kbd">↓</span> Navigate
            </span>
            <span>
              <span className="siq-kbd">↵</span> Open
            </span>
            <span className="ml-auto">Powered by ShelfIQ Spotlight</span>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
