"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; children: NavLink[] };

const NAV: (NavLink | NavGroup)[] = [
  { href: "/", label: "홈" },
  {
    label: "업무 자동화툴",
    children: [
      { href: "/automation/youtube-script", label: "유튜브 원고 자동화" },
      { href: "/automation/image", label: "이미지 생성" },
      { href: "/automation/detail-page", label: "상세페이지 자동화" },
    ],
  },
  { href: "/sales", label: "매출관리" },
  { href: "/ads", label: "광고 지표관리" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `block rounded-md px-3 py-2 text-sm ${
      pathname === href
        ? "bg-neutral-900 font-medium text-white"
        : "font-medium text-neutral-700 hover:bg-neutral-100"
    }`;

  return (
    <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white px-4 py-6">
      <div className="mb-8 px-2 text-lg font-bold">딥워크 ERP</div>
      <nav className="flex flex-col gap-1">
        {NAV.map((entry) =>
          "children" in entry ? (
            <div key={entry.label} className="my-2">
              <div className="px-3 py-1 text-xs font-semibold tracking-wide text-neutral-400">
                {entry.label}
              </div>
              <div className="ml-3 border-l border-neutral-200 pl-1">
                {entry.children.map((child) => (
                  <Link key={child.href} href={child.href} className={linkClass(child.href)}>
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={entry.href} href={entry.href} className={linkClass(entry.href)}>
              {entry.label}
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}
