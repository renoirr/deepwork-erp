"use client";

import { useState } from "react";

type IntroOption = {
  templateNumber: number;
  reason: string;
  text: string;
};

type ScriptResult = {
  introOptions: IntroOption[];
  body: string;
  actionCta: string;
};

export default function YoutubeScriptPage() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [selectedIntro, setSelectedIntro] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) {
      setError("주제를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedIntro(null);

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "원고 생성에 실패했습니다.");
        return;
      }
      setResult(data);
      setSelectedIntro(0);
    } catch {
      setError("네트워크 오류로 원고 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const finalScript =
    result && selectedIntro !== null
      ? [result.introOptions[selectedIntro].text, result.body, result.actionCta]
          .filter(Boolean)
          .join("\n\n")
      : "";

  async function handleCopy() {
    await navigator.clipboard.writeText(finalScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">원고 생성</h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-fg">
            Claude API
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="topic" className="mb-1.5 block text-[12.5px] font-semibold">
              주제
            </label>
            <input
              id="topic"
              className="field"
              placeholder="예: 돈 안 쓰고 집 비싸 보이게 만드는 법"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <p className="mt-1.5 text-[11.5px] text-muted-fg">썸네일·제목에 쓸 한 줄 주제를 적습니다.</p>
          </div>
          <div>
            <label htmlFor="notes" className="mb-1.5 block text-[12.5px] font-semibold">
              참고 자료 / 메모 (선택)
            </label>
            <textarea
              id="notes"
              className="field"
              rows={3}
              placeholder="영상에 꼭 들어갔으면 하는 정보, 개인 경험, 근거 자료"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-[13px] font-semibold text-on-accent transition-[filter] hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "생성 중..." : "원고 생성"}
          </button>
          <button
            onClick={() => {
              setTopic("");
              setNotes("");
              setResult(null);
              setError(null);
            }}
            className="cursor-pointer rounded-lg border border-border-strong px-4 py-2 text-[13px] font-medium transition-colors hover:bg-muted"
          >
            초기화
          </button>
        </div>
        {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
      </section>

      {result && (
        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">도입부 후보 — 하나를 고르세요</h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-fg">
              템플릿 30종 기반
            </span>
          </div>
          <div className="grid gap-2.5">
            {result.introOptions.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelectedIntro(i)}
                aria-pressed={selectedIntro === i}
                className={`cursor-pointer rounded-[10px] border bg-bg p-3 text-left transition-colors ${
                  selectedIntro === i
                    ? "border-accent"
                    : "border-border-strong hover:border-muted-fg"
                }`}
              >
                <div className="mb-1.5 text-[11px] font-semibold text-accent">
                  템플릿 {option.templateNumber} · {option.reason}
                </div>
                <p className="text-[13px] leading-relaxed">{option.text}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {result && selectedIntro !== null && (
        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">완성 원고</h2>
            <button
              onClick={handleCopy}
              className="cursor-pointer rounded-lg border border-border-strong px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-muted"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
          <div className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-bg p-4 text-[13px] leading-[1.8]">
            {finalScript}
          </div>
        </section>
      )}
    </div>
  );
}
