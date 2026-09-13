# 서희 ERP

서희가 담당하는 자동화 프로젝트를 한 곳에 모으는 웹앱입니다. 현재는 "유튜브 원고 자동화" 모듈 하나만 동작하고, 나머지(상세페이지 자동화, 쇼츠 자동화)는 준비중 상태입니다.

## 로컬에서 실행하기

```bash
npm install
cp .env.example .env.local   # .env.local에 ANTHROPIC_API_KEY=발급받은키 입력
npm run dev
```

브라우저에서 http://localhost:3000 접속.

Anthropic API 키는 https://console.anthropic.com 에서 발급받습니다. `.env.local`은 git에 올라가지 않습니다(`.gitignore` 처리됨).

## 배포 (GitHub + Vercel)

1. GitHub에 새 저장소를 만듭니다 (README 없이 빈 저장소로).
2. 아래 명령으로 push 합니다.
   ```bash
   git remote add origin <저장소 주소>
   git push -u origin main
   ```
3. https://vercel.com 에 GitHub 계정으로 로그인 → "Add New Project" → 방금 만든 저장소 선택 → Import.
4. Vercel 프로젝트 설정 화면에서 Environment Variables에 `ANTHROPIC_API_KEY`를 추가합니다 (콘솔에서 발급받은 키 값).
5. Deploy를 누르면 몇 분 내로 배포된 URL이 나옵니다.

이후 로컬에서 코드를 수정하고 `git push`만 하면 Vercel이 자동으로 재배포합니다.

## 유튜브 원고 자동화 모듈

- 위치: `app/youtube-script/page.tsx` (화면), `app/api/generate-script/route.ts` (서버 로직)
- 원고 작성 규칙과 도입부 템플릿 30종은 `lib/prompts/youtube-script.ts`에 있습니다. 규칙을 바꾸고 싶으면 이 파일만 수정하면 됩니다.
- 사용법: 주제와 참고 자료(선택)를 입력하고 "원고 생성" 클릭 → 도입부 후보 3개 중 하나 선택 → 완성 원고를 복사해서 사용.
