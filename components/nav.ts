export type NavEntry = {
  href: string;
  label: string;
  group: string;
  icon: "home" | "file" | "image" | "layout" | "chart" | "target" | "check";
};

// trailingSlash 설정 때문에 usePathname()이 "/sales/"처럼 돌아온다.
export const normalize = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

export const NAV: NavEntry[] = [
  { href: "/", label: "홈", group: "딥워크 ERP", icon: "home" },
  { href: "/automation/youtube-script", label: "유튜브 원고", group: "업무 자동화툴", icon: "file" },
  { href: "/automation/image", label: "이미지 생성", group: "업무 자동화툴", icon: "image" },
  { href: "/automation/detail-page", label: "상세페이지", group: "업무 자동화툴", icon: "layout" },
  { href: "/sales", label: "매출 대시보드", group: "매출관리", icon: "chart" },
  { href: "/ads", label: "광고 지표", group: "광고 지표관리", icon: "target" },
];
