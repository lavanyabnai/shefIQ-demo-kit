"use client";
import * as React from "react";

interface PaletteCtx {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const Ctx = React.createContext<PaletteCtx | null>(null);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const value = React.useMemo<PaletteCtx>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    }),
    [isOpen]
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCommandPalette() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCommandPalette must be used inside CommandPaletteProvider");
  return ctx;
}
