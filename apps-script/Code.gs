// 딥워크 ERP 백엔드 (Google Apps Script 웹앱)
//
// 원고는 Claude API가 아니라 선생님의 Claude Code 세션이 씁니다.
// 이 스크립트는 그 사이의 "주문서 통"만 담당합니다.
//   ERP 화면 → enqueue(대기) → Claude Code가 listPending으로 가져가 작성 → submitResult(완료) → ERP가 getJob으로 표시
//
// 배포: 배포 > 새 배포 > 웹 앱 (실행: 나 / 액세스: 모든 사용자)
// 스크립트 속성: APP_TOKEN (화면·세션과 맞추는 공용 토큰)

var SHEET_NAME = "원고요청";
var HEADERS = ["id", "등록시각", "주제", "참고자료", "상태", "도입부후보", "본문", "행동제안", "완료시각"];
var COL = { id: 1, at: 2, topic: 3, notes: 4, status: 5, intros: 6, body: 7, cta: 8, doneAt: 9 };

// 최초 1회 편집기에서 실행해 시트 접근 권한을 승인하고 "원고요청" 시트를 만든다.
function setup() {
  var sh = sheet_();
  Logger.log("준비 완료: " + sh.getName() + " (행 " + sh.getLastRow() + ")");
}

function doPost(e) {
  var out;
  try {
    var req = JSON.parse(e.postData.contents);
    var expected = prop_("APP_TOKEN");
    if (expected && req.token !== expected) {
      out = { error: "토큰이 올바르지 않습니다." };
    } else if (req.action === "enqueue") {
      out = enqueue_(req);
    } else if (req.action === "getJob") {
      out = getJob_(req);
    } else if (req.action === "listPending") {
      out = listPending_();
    } else if (req.action === "submitResult") {
      out = submitResult_(req);
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

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.setColumnWidth(COL.topic, 320);
  }
  return sh;
}

function findRow_(sh, id) {
  var ids = sh.getRange(2, COL.id, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return 0;
}

function enqueue_(req) {
  var topic = (req.topic || "").trim();
  if (!topic) return { error: "주제를 입력해주세요." };

  var id = "J" + Date.now();
  sheet_().appendRow([id, new Date(), topic, (req.notes || "").trim(), "대기", "", "", "", ""]);
  return { id: id, status: "대기" };
}

function getJob_(req) {
  var sh = sheet_();
  var row = findRow_(sh, req.id);
  if (!row) return { error: "요청을 찾을 수 없습니다." };

  var v = sh.getRange(row, 1, 1, HEADERS.length).getValues()[0];
  var job = { id: v[0], topic: v[2], notes: v[3], status: v[4] };
  if (job.status === "완료") {
    job.introOptions = v[5] ? JSON.parse(v[5]) : [];
    job.body = v[6];
    job.actionCta = v[7];
  }
  return job;
}

// Claude Code 세션이 가져갈 대기/작업중 목록
function listPending_() {
  var sh = sheet_();
  if (sh.getLastRow() < 2) return { jobs: [] };

  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues();
  var jobs = [];
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][4] === "대기") {
      jobs.push({ id: rows[i][0], topic: rows[i][2], notes: rows[i][3] });
    }
  }
  return { jobs: jobs };
}

function submitResult_(req) {
  var sh = sheet_();
  var row = findRow_(sh, req.id);
  if (!row) return { error: "요청을 찾을 수 없습니다." };

  if (req.status === "작업중") {
    sh.getRange(row, COL.status).setValue("작업중");
    return { ok: true, status: "작업중" };
  }

  sh.getRange(row, COL.intros).setValue(JSON.stringify(req.introOptions || []));
  sh.getRange(row, COL.body).setValue(req.body || "");
  sh.getRange(row, COL.cta).setValue(req.actionCta || "");
  sh.getRange(row, COL.status).setValue("완료");
  sh.getRange(row, COL.doneAt).setValue(new Date());
  return { ok: true, status: "완료" };
}
