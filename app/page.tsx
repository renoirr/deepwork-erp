import Link from "next/link";

const SECTIONS = [
  {
    title: "업무 자동화툴",
    items: [
      {
        href: "/automation/youtube-script",
        title: "유튜브 원고 자동화",
        description: "주제 입력 → 도입부 후보 3개 → 공감·정보·개인가치·질문 구조의 원고 초안",
        ready: true,
      },
      {
        href: "/automation/image",
        title: "이미지 생성",
        description: "1000×1000 이미지 자동 생성",
        ready: false,
      },
      {
        href: "/automation/detail-page",
        title: "상세페이지 자동화",
        description: "제품 자료 → 섹션 구성 → 카피 초안",
        ready: false,
      },
    ],
  },
  {
    title: "매출관리",
    items: [
      {
        href: "/sales",
        title: "매출 현황",
        description: "채널별 매출 집계와 리포트",
        ready: false,
      },
    ],
  },
  {
    title: "광고 지표관리",
    items: [
      {
        href: "/ads",
        title: "광고 지표",
        description: "광고비·ROAS·전환 지표 추적",
        ready: false,
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold">딥워크 ERP</h1>
      <p className="mb-8 text-neutral-500">업무 자동화툴 · 매출관리 · 광고 지표관리</p>

      {SECTIONS.map((section) => (
        <section key={section.title} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-400">
            {section.title}
          </h2>
          <div className="grid gap-3">
            {section.items.map((item) =>
              item.ready ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
                >
                  <div className="font-semibold">{item.title}</div>
                  <div className="mt-1 text-sm text-neutral-500">{item.description}</div>
                </Link>
              ) : (
                <div
                  key={item.href}
                  className="rounded-lg border border-dashed border-neutral-200 bg-neutral-100 p-5 opacity-60"
                >
                  <div className="font-semibold">
                    {item.title}
                    <span className="ml-2 text-xs font-normal text-neutral-500">준비중</span>
                  </div>
                  <div className="mt-1 text-sm text-neutral-500">{item.description}</div>
                </div>
              )
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
