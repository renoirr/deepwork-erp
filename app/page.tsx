import Link from "next/link";

const MODULES = [
  {
    href: "/youtube-script",
    title: "유튜브 원고 자동화",
    description: "주제만 입력하면 공감→정보→개인가치→질문 구조의 원고 초안을 생성합니다.",
    ready: true,
  },
  {
    href: "/detail-page",
    title: "상세페이지 자동화",
    description: "스킬 이미지 자동화 + 카피라이팅 자동화 (준비중)",
    ready: false,
  },
  {
    href: "/shorts",
    title: "쇼츠 자동화",
    description: "쇼츠 제작 공식화 및 자동화 (준비중)",
    ready: false,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold">서희 ERP</h1>
      <p className="mb-8 text-neutral-500">서희가 담당하는 자동화 프로젝트 모음입니다.</p>
      <div className="grid gap-4">
        {MODULES.map((m) =>
          m.ready ? (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
            >
              <div className="font-semibold">{m.title}</div>
              <div className="mt-1 text-sm text-neutral-500">{m.description}</div>
            </Link>
          ) : (
            <div
              key={m.href}
              className="rounded-lg border border-dashed border-neutral-200 bg-neutral-100 p-5 opacity-60"
            >
              <div className="font-semibold">{m.title}</div>
              <div className="mt-1 text-sm text-neutral-500">{m.description}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
