"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, type NavEntry } from "./nav";

const ICONS: Record<NavEntry["icon"], React.ReactNode> = {
  home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
  file: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="1.8" /><path d="m21 15-4.5-4.5L6 21" /></>,
  layout: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  check: <><path d="M9 11l2 2 4-4" /><rect x="3" y="3" width="18" height="18" rx="2" /></>,
};

export default function Sidebar() {
  const pathname = usePathname();
  const groups = NAV.filter((n) => n.group !== "딥워크 ERP");
  const groupNames = [...new Set(groups.map((g) => g.group))];
  const home = NAV[0];

  function item(entry: NavEntry) {
    const active = pathname === entry.href;
    return (
      <Link
        key={entry.href}
        href={entry.href}
        aria-current={active ? "page" : undefined}
        className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors ${
          active
            ? "bg-muted font-semibold text-fg shadow-[inset_2px_0_0_var(--accent)]"
            : "font-medium text-muted-fg hover:bg-muted hover:text-fg"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          {ICONS[entry.icon]}
        </svg>
        {entry.label}
      </Link>
    );
  }

  return (
    <aside className="sticky top-0 h-screen w-[236px] shrink-0 overflow-y-auto border-r border-border bg-card px-3 py-6">
      <div className="mb-6 flex items-center gap-2 px-3">
        <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-accent font-mono text-[13px] font-bold text-on-accent">
          D
        </span>
        <span className="text-[15px] font-bold tracking-tight">딥워크 ERP</span>
      </div>

      <nav className="flex flex-col gap-1">
        {item(home)}
        {groupNames.map((name) => (
          <div key={name} className="my-2">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
              {name}
            </div>
            <div className="ml-3 border-l border-border pl-1">
              {groups.filter((g) => g.group === name).map(item)}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
