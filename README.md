# 딥워크 ERP

딥워크의 업무를 한 곳에서 관리하는 웹앱입니다.

| 축 | 내용 | 상태 |
| --- | --- | --- |
| 업무 자동화툴 | 유튜브 원고 자동화 | 코드 완성, 키 연결 대기 |
| | 이미지 생성 (1000×1000, Gemini) | 준비중 |
| | 상세페이지 자동화 | 준비중 |
| 매출관리 | 스마트스토어 → 스프레드시트 → 대시보드 (매일 18시) | 커머스 API 승인 대기 |
| 광고 지표관리 | 네이버 검색광고 · 유튜브(Google Ads) | 개발자 토큰 승인 대기 |

## 구조

GitHub Pages는 서버가 없어서 API 키를 숨길 수 없습니다. 그래서 **화면과 백엔드를 나눠 둡니다.**

```
브라우저 (GitHub Pages)  ──POST──▶  Apps Script 웹앱  ──▶  Claude / Gemini / 네이버 API
   Next.js 정적 빌드                  API 키 보관              구글 스프레드시트 (DB)
```

- 화면: Next.js 정적 빌드(`output: "export"`) → GitHub Actions가 GitHub Pages로 배포
- 백엔드: `apps-script/` 폴더의 코드를 구글 앱스크립트에 붙여넣어 웹앱으로 배포
- **API 키는 앱스크립트 [스크립트 속성]에만 저장합니다.** 저장소에도, 화면 코드에도 들어가지 않습니다.

## 1. 앱스크립트 백엔드 배포 (먼저)

1. 매출용 구글 스프레드시트를 열고 **확장 프로그램 → Apps Script**.
2. `apps-script/Code.gs`와 `apps-script/Prompt.gs` 내용을 각각 같은 이름의 파일로 붙여넣습니다.
3. **프로젝트 설정 → 스크립트 속성**에 아래를 추가합니다.
   | 속성 이름 | 값 |
   | --- | --- |
   | `ANTHROPIC_API_KEY` | console.anthropic.com에서 발급한 키 |
   | `APP_TOKEN` | 아무 문자열 (화면과 맞추기만 하면 됨) |
4. **배포 → 새 배포 → 유형: 웹 앱**
   - 실행 계정: **나**
   - 액세스 권한: **모든 사용자**
5. 나온 `.../exec` 주소를 복사해 둡니다.

## 2. GitHub 저장소 설정

1. **Settings → Pages → Source** 를 **GitHub Actions** 로 바꿉니다.
2. **Settings → Secrets and variables → Actions** 에 2개를 추가합니다.
   | 시크릿 이름 | 값 |
   | --- | --- |
   | `APPS_SCRIPT_URL` | 위에서 복사한 `/exec` 주소 |
   | `APP_TOKEN` | 앱스크립트에 넣은 것과 **같은 값** |
3. `main` 브랜치에 push하면 자동으로 빌드·배포됩니다.

## 3. 로컬에서 실행하기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속. 원고 생성까지 테스트하려면 `.env.local`에 아래를 넣습니다.

```
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
NEXT_PUBLIC_APP_TOKEN=앱스크립트에_넣은_것과_같은_값
```

## 원고 작성 규칙 수정

`apps-script/Prompt.gs` 한 파일에 원고 작성 원칙과 도입부 템플릿 30종이 모두 들어 있습니다. 규칙을 바꾸려면 이 파일을 고치고 앱스크립트에 다시 붙여넣은 뒤 **새 버전으로 배포**하면 됩니다.

## 알아두실 점

앱스크립트 웹앱 주소는 화면 코드에 들어가므로 마음먹고 찾으면 볼 수 있습니다. `APP_TOKEN`이 1차로 막아주지만 완전한 잠금장치는 아니므로, Anthropic 콘솔에서 **월 사용 한도**를 걸어두시는 걸 권합니다. 문제가 생기면 앱스크립트를 새 배포로 바꾸면 기존 주소는 무효가 됩니다.
