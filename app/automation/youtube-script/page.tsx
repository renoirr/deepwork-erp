export default function YoutubeScriptPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="card">
        <p className="mb-3 text-[13px]">
          원고는 이 화면이 아니라 <b>Claude Code 세션에서 직접 작성</b>합니다. 구독에 포함되어 있어 추가 비용이 없고, 대화하면서 바로 고칠 수 있습니다.
        </p>
        <p className="mb-4 text-[13px] text-muted-fg">
          터미널에 주제를 말하면 도입부 후보 3개와 본문 초안이 나옵니다. 예: &ldquo;돈 안 쓰고 집 비싸 보이게 만드는 법으로 원고 써줘&rdquo;
        </p>
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="mb-2 text-[12px] font-semibold text-muted-fg">적용되는 규칙</p>
          <ul className="flex flex-col gap-1.5 text-[13px]">
            <li>공감이 정보보다 우선 — 도입부(첫 30초)가 원고의 50%</li>
            <li>도입부 3요소: 문제 제기 · 유인 · 사례 (순서 무관)</li>
            <li>도입부 템플릿 30종 중 주제에 맞는 후보 3개 제시</li>
            <li>본문 순서: 공감 → 정보 → 개인가치 → 질문</li>
            <li>말미에 실제로 해볼 수 있는 행동 제안</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
