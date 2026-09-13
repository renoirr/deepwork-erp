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
      ? [
          result.introOptions[selectedIntro].text,
          result.body,
          result.actionCta,
        ]
          .filter(Boolean)
          .join("\n\n")
      : "";

  async function handleCopy() {
    await navigator.clipboard.writeText(finalScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold">유튜브 원고 자동화</h1>
      <p className="mb-6 text-neutral-500">
        주제를 입력하면 도입부 후보 3개 + 본문 초안을 생성합니다.
      </p>

      <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-5">
        <label className="mb-1 block text-sm font-medium">주제</label>
        <input
          className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          placeholder="예: 아이패드 200% 활용법"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <label className="mb-1 block text-sm font-medium">참고 자료/메모 (선택)</label>
        <textarea
          className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          rows={4}
          placeholder="영상에 꼭 들어갔으면 하는 정보, 개인 경험, 근거 자료 등을 적어주세요."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "생성 중..." : "원고 생성"}
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {result && (
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">도입부 후보 (하나를 선택하세요)</h2>
          <div className="grid gap-3">
            {result.introOptions.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelectedIntro(i)}
                className={`rounded-lg border p-4 text-left text-sm ${
                  selectedIntro === i
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200 bg-white hover:border-neutral-400"
                }`}
              >
                <div className="mb-1 text-xs font-medium text-neutral-500">
                  템플릿 {option.templateNumber} · {option.reason}
                </div>
                <div>{option.text}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {result && selectedIntro !== null && (
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">완성 원고</h2>
            <button
              onClick={handleCopy}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
          <textarea
            readOnly
            className="h-96 w-full whitespace-pre-wrap rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm"
            value={finalScript}
          />
        </div>
      )}
    </div>
  );
}
