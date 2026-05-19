"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Store,
  Package,
  Boxes,
  Network,
  FileBarChart2,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/seed";

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const NAV: NavItem[] = [
  { id: "dashboard",  href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { id: "planograms", href: "/planograms", label: "Planograms", icon: Layers, badge: 12 },
  { id: "stores",     href: "/stores",     label: "Stores",     icon: Store },
  { id: "products",   href: "/products",   label: "Products",   icon: Package },
  { id: "fixtures",   href: "/fixtures",   label: "Fixtures",   icon: Boxes },
  { id: "clusters",   href: "/clusters",   label: "Clusters",   icon: Network },
  { id: "reports",    href: "/reports",    label: "Reports",    icon: FileBarChart2 },
  { id: "settings",   href: "/settings",   label: "Settings",   icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const maria = users.find((u) => u.id === "user-maria-chen")!;

  return (
    <aside className="hidden h-screen w-[232px] shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-14 items-center px-4">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group relative mb-0.5 flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13.5px] font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-primary" />
              )}
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-border px-3 py-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={maria.avatar} alt={maria.name} />
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[13px] font-semibold">{maria.name}</div>
          <div className="truncate text-[11.5px] text-muted-foreground">
            Quikstop Inc. · {maria.role}
          </div>
        </div>
        <button
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Account menu"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
