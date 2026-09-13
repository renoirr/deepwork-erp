import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  YOUTUBE_SCRIPT_SYSTEM_PROMPT,
  YOUTUBE_SCRIPT_TOOL,
} from "@/lib/prompts/youtube-script";

export const runtime = "nodejs";

type GenerateRequestBody = {
  topic?: string;
  notes?: string;
};

type ScriptResult = {
  introOptions: {
    templateNumber: number;
    reason: string;
    text: string;
  }[];
  body: string;
  actionCta: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "서버에 ANTHROPIC_API_KEY가 설정되어 있지 않습니다." },
      { status: 500 }
    );
  }

  const body: GenerateRequestBody = await request.json();
  const topic = body.topic?.trim();
  if (!topic) {
    return NextResponse.json({ error: "주제를 입력해주세요." }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  const userMessage = body.notes?.trim()
    ? `주제: ${topic}\n\n참고 자료/메모:\n${body.notes.trim()}`
    : `주제: ${topic}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 8000,
      system: YOUTUBE_SCRIPT_SYSTEM_PROMPT,
      tools: [YOUTUBE_SCRIPT_TOOL],
      tool_choice: { type: "tool", name: YOUTUBE_SCRIPT_TOOL.name },
      messages: [{ role: "user", content: userMessage }],
    });

    const toolUse = message.content.find(
      (block) => block.type === "tool_use"
    );

    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json(
        { error: "AI 응답에서 원고를 추출하지 못했습니다." },
        { status: 502 }
      );
    }

    const result = toolUse.input as ScriptResult;
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `원고 생성 중 오류가 발생했습니다: ${message}` },
      { status: 500 }
    );
  }
}
