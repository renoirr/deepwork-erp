"use client";

import { usePathname } from "next/navigation";
import { NAV, normalize } from "./nav";
import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  const pathname = normalize(usePathname());
  const current = NAV.find((n) => n.href === pathname) ?? NAV[0];

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-8 py-4">
      <div>
        <div className="text-xs text-muted-fg">{current.group}</div>
        <h1 className="mt-0.5 text-[19px] font-bold tracking-tight">{current.label}</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
