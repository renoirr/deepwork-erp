import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "서희 ERP",
  description: "서희 담당 자동화 프로젝트 모음",
};

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/youtube-script", label: "유튜브 원고 자동화" },
  { href: "/detail-page", label: "상세페이지 자동화", disabled: true },
  { href: "/shorts", label: "쇼츠 자동화", disabled: true },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-neutral-50 text-neutral-900">
        <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white px-4 py-6">
          <div className="mb-8 px-2 text-lg font-bold">서희 ERP</div>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) =>
              item.disabled ? (
                <span
                  key={item.href}
                  className="rounded-md px-3 py-2 text-sm text-neutral-400"
                >
                  {item.label}
                  <span className="ml-1 text-xs">(준비중)</span>
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </aside>
        <main className="min-h-screen flex-1 px-8 py-8">{children}</main>
      </body>
    </html>
  );
}
