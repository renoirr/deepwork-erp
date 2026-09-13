// 딥워크 ERP 백엔드 (Google Apps Script 웹앱)
//
// 이 파일과 Prompt.gs를 앱스크립트 편집기에 붙여넣고 "배포 > 새 배포 > 웹 앱"으로 배포합니다.
//   - 실행 계정: 나
//   - 액세스 권한: 모든 사용자
// 배포 후 나오는 /exec 주소를 GitHub 저장소의 APPS_SCRIPT_URL 시크릿에 넣습니다.
//
// API 키는 코드에 적지 말고 [프로젝트 설정 > 스크립트 속성]에 저장합니다.
//   ANTHROPIC_API_KEY : 원고 생성용
//   APP_TOKEN         : 화면에서 보내는 값과 대조하는 공용 토큰 (아무 문자열)

var ANTHROPIC_MODEL = "claude-sonnet-5";

function doPost(e) {
  var out;
  try {
    var req = JSON.parse(e.postData.contents);
    var expected = prop_("APP_TOKEN");
    if (expected && req.token !== expected) {
      out = { error: "토큰이 올바르지 않습니다." };
    } else if (req.action === "generateScript") {
      out = generateScript_(req);
    } else if (req.action === "ping") {
      out = { ok: true };
    } else {
      out = { error: "알 수 없는 요청입니다: " + req.action };
    }
  } catch (err) {
    out = { error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function prop_(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}

function generateScript_(req) {
  var key = prop_("ANTHROPIC_API_KEY");
  if (!key) return { error: "스크립트 속성에 ANTHROPIC_API_KEY가 없습니다." };

  var topic = (req.topic || "").trim();
  if (!topic) return { error: "주제를 입력해주세요." };

  var notes = (req.notes || "").trim();
  var userMessage = notes
    ? "주제: " + topic + "\n\n참고 자료/메모:\n" + notes
    : "주제: " + topic;

  var res = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {
    method: "post",
    contentType: "application/json",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 8000,
      system: YOUTUBE_SCRIPT_SYSTEM_PROMPT,
      tools: [YOUTUBE_SCRIPT_TOOL],
      tool_choice: { type: "tool", name: YOUTUBE_SCRIPT_TOOL.name },
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (res.getResponseCode() !== 200) {
    return { error: "Claude API 오류 (" + res.getResponseCode() + "): " + res.getContentText().slice(0, 300) };
  }

  var blocks = JSON.parse(res.getContentText()).content || [];
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].type === "tool_use") return blocks[i].input;
  }
  return { error: "AI 응답에서 원고를 추출하지 못했습니다." };
}
