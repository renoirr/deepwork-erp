export default function SalesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="card">
        <p className="mb-3 text-[13px] text-muted-fg">데이터 파이프라인</p>
        <ol className="flex flex-col gap-2.5 text-[13px]">
          <li>1. 네이버 커머스 API로 스마트스토어 주문·정산 데이터 조회</li>
          <li>2. 구글 스프레드시트(DB)에 일자별로 누적 적재</li>
          <li>3. Apps Script 시간 기반 트리거로 매일 18:00 자동 실행</li>
          <li>4. 이 화면에서 집계·차트로 표시</li>
        </ol>
        <p className="mt-4 text-[12px] text-muted-fg">
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11.5px] text-fg">COMMERCE_CLIENT_ID</code>{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11.5px] text-fg">COMMERCE_CLIENT_SECRET</code>{" "}
          발급과 스프레드시트 생성 후 연결 예정입니다.
        </p>
      </div>
    </div>
  );
}
