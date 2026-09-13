"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      className="cursor-pointer rounded-lg border border-border-strong px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-muted"
    >
      {theme === "light" ? "다크 모드" : "라이트 모드"}
    </button>
  );
}
