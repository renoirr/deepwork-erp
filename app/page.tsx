import Link from "next/link";
import { NAV } from "@/components/nav";

const READY = new Set(["/automation/youtube-script"]);

const DESCRIPTIONS: Record<string, string> = {
  "/automation/youtube-script": "Claude Code 세션에서 작성 — 적용되는 원고 규칙 보기",
  "/automation/image": "1000×1000 규격 이미지 자동 생성 (Google Gemini)",
  "/automation/detail-page": "제품 자료 → 섹션 구성 → 카피 초안",
  "/sales": "스마트스토어 주문·정산을 스프레드시트에 모아 매일 18시 자동 갱신",
  "/ads": "네이버 검색광고 · 유튜브(Google Ads) 광고비와 ROAS 추적",
};

export default function Home() {
  const groups = NAV.filter((n) => n.href !== "/");
  const groupNames = [...new Set(groups.map((g) => g.group))];

  return (
    <div className="mx-auto max-w-4xl">
      {groupNames.map((name) => (
        <section key={name} className="mb-7">
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
            {name}
          </h2>
          <div className="grid gap-3">
            {groups
              .filter((g) => g.group === name)
              .map((entry) =>
                READY.has(entry.href) ? (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className="card cursor-pointer transition-colors hover:border-border-strong"
                  >
                    <div className="font-semibold">{entry.label}</div>
                    <p className="mt-1 text-[13px] text-muted-fg">{DESCRIPTIONS[entry.href]}</p>
                  </Link>
                ) : (
                  <div key={entry.href} className="card border-dashed opacity-60">
                    <div className="font-semibold">
                      {entry.label}
                      <span className="ml-2 text-[11px] font-normal text-muted-fg">준비중</span>
                    </div>
                    <p className="mt-1 text-[13px] text-muted-fg">{DESCRIPTIONS[entry.href]}</p>
                  </div>
                )
              )}
          </div>
        </section>
      ))}
    </div>
  );
}
