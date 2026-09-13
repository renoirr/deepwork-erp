const ENDPOINT = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "";
const TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN ?? "";

// Content-Type을 text/plain으로 보내야 브라우저가 preflight를 생략한다.
// 앱스크립트 웹앱은 preflight(OPTIONS)에 응답하지 못하기 때문.
export async function callBackend<T>(action: string, payload: object): Promise<T> {
  if (!ENDPOINT) {
    throw new Error("백엔드 주소(NEXT_PUBLIC_APPS_SCRIPT_URL)가 설정되지 않았습니다.");
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, token: TOKEN, ...payload }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as T;
}
