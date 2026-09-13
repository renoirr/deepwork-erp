const ENDPOINT = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "";
const TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN ?? "";

// Content-Type을 text/plain으로 보내야 브라우저가 preflight를 생략한다.
// 앱스크립트 웹앱은 preflight(OPTIONS)에 응답하지 못하기 때문.
export async function callBackend<T>(action: string, payload: object): Promise<T> {
  if (!ENDPOINT) {
    throw new Error("백엔드 주소(NEXT_PUBLIC_APPS_SCRIPT_URL)가 설정되지 않았습니다.");
  }

  const body = JSON.stringify({ action, token: TOKEN, ...payload });

  // 앱스크립트는 POST를 googleusercontent로 리다이렉트해 결과를 돌려주는데,
  // 이 단계가 5번에 1번꼴로 404 HTML을 반환한다(스크립트 자체는 정상 실행됨).
  // 다시 보내는 것 말고는 방법이 없어 최대 3번 시도한다.
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
    const text = await res.text();

    if (text.trimStart().startsWith("{")) {
      const data = JSON.parse(text);
      if (data.error) throw new Error(data.error);
      return data as T;
    }
  }

  throw new Error("백엔드 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.");
}
