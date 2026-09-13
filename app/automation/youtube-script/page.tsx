"use client";

import { useEffect, useRef, useState } from "react";
import { callBackend } from "@/lib/backend";

type IntroOption = { templateNumber: number; reason: string; text: string };

type Job = {
  id: string;
  status: "대기" | "작업중" | "완료";
  introOptions?: IntroOption[];
  body?: string;
  actionCta?: string;
};

const STATUS_TEXT: Record<Job["status"], string> = {
  대기: "요청이 등록됐습니다. Claude Code 세션이 가져가기를 기다리는 중…",
  작업중: "원고를 쓰고 있습니다…",
  완료: "완료",
};

export default function YoutubeScriptPage() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [selectedIntro, setSelectedIntro] = useState(0);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 완료될 때까지 3초마다 상태를 확인한다.
  useEffect(() => {
    if (!job || job.status === "완료") return;

    timer.current = setTimeout(async () => {
      try {
        const next = await callBackend<Job>("getJob", { id: job.id });
        setJob(next);
      } catch {
        // 일시적인 실패는 무시하고 다음 주기에 다시 확인한다.
      }
    }, 3000);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [job]);

  async function handleSubmit() {
    if (!topic.trim()) {
      setError("주제를 입력해주세요.");
      return;
    }
    setSending(true);
    setError(null);
    setJob(null);
    setSelectedIntro(0);

    try {
      const created = await callBackend<Job>("enqueue", { topic, notes });
      setJob({ ...created, status: "대기" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "요청 등록에 실패했습니다.");
    } finally {
      setSending(false);
    }
  }

  const intros = job?.introOptions ?? [];
  const finalScript =
    job?.status === "완료" && intros[selectedIntro]
      ? [intros[selectedIntro].text, job.body, job.actionCta].filter(Boolean).join("\n\n")
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
          <h2 className="text-sm font-semibold">원고 요청</h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-fg">
            Claude Code 세션이 작성
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
              placeholder="예: 공부의자 3개 비교"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="notes" className="mb-1.5 block text-[12.5px] font-semibold">
              참고 자료 / 메모 (선택)
            </label>
            <textarea
              id="notes"
              className="field"
              rows={3}
              placeholder="가격·치수처럼 원고에 꼭 들어가야 할 수치를 적어주세요. 없으면 비워둔 채로 옵니다."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-[13px] font-semibold text-on-accent transition-[filter] hover:brightness-110 disabled:opacity-50"
          >
            {sending ? "등록 중..." : "원고 요청"}
          </button>
          <span className="text-[11.5px] text-muted-fg">
            터미널의 Claude Code 세션이 켜져 있어야 작성됩니다.
          </span>
        </div>
        {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
      </section>

      {job && job.status !== "완료" && (
        <section className="card flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <div>
            <p className="text-[13px]">{STATUS_TEXT[job.status]}</p>
            <p className="mt-0.5 text-[11.5px] text-muted-fg">요청번호 {job.id}</p>
          </div>
        </section>
      )}

      {job?.status === "완료" && intros.length > 0 && (
        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">도입부 후보 — 하나를 고르세요</h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-fg">
              템플릿 30종 기반
            </span>
          </div>
          <div className="grid gap-2.5">
            {intros.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelectedIntro(i)}
                aria-pressed={selectedIntro === i}
                className={`cursor-pointer rounded-[10px] border bg-bg p-3 text-left transition-colors ${
                  selectedIntro === i ? "border-accent" : "border-border-strong hover:border-muted-fg"
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

      {finalScript && (
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
