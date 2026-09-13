export default function AdsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="card">
        <p className="mb-3 text-[13px] text-muted-fg">연결 예정 매체</p>
        <ul className="flex flex-col gap-2.5 text-[13px]">
          <li>
            네이버 검색광고 — 도구 → API 사용 관리에서 발급{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11.5px] text-fg">NAVER_AD_API_KEY</code>
          </li>
          <li>
            유튜브 광고 — Google Ads API. 개발자 토큰 승인에 며칠 걸리므로 먼저 신청해두고 네이버부터 연결합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
