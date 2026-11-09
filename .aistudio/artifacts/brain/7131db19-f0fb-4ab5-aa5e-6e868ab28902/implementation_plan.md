# GitHub Actions `package-lock.json` 캐시 에러 해결 및 배포 안정화 계획

방금 발생한 `Error: Dependencies lock file is not found ... Supported file patterns: package-lock.json` 에러의 직접적인 원인을 제거하고, 의존성 정리 및 GitHub Pages 404 방지 처리를 통해 배포가 한 번에 성공하도록 구성합니다.

### User Review & Critical Decisions

> [!IMPORTANT]
> 방금 캡처 화면(`Set up Node.js 22` 단계 실패)의 정확한 원인과 확정된 해결책입니다.

- **직접적인 실패 원인 (`cache: 'npm'` 옵션 문제)**:
  - AI Studio에서 GitHub로 내보내기(Push)할 때는 `package.json`만 전송되고 `package-lock.json` 파일은 생성·전송되지 않습니다.
  - 그런데 `deploy.yml`의 `actions/setup-node@v4`에 **`cache: 'npm'`** 줄이 들어가 있으면, GitHub Actions가 캐시 해시를 계산하기 위해 무조건 `package-lock.json` 파일을 찾다가 파일이 없으면 `Install and Build` 단계로 넘어가지도 못하고 1초 만에 에러(`Dependencies lock file is not found`)를 내며 멈춥니다.
- **확정 결정 1 (`cache: 'npm'` 제거 및 `package.json` 경량화)**:
  - `deploy.yml`에서 `cache: 'npm'` 줄을 제거하여 `package-lock.json` 없이도 `Set up Node.js 22` 단계가 즉시 통과되도록 수정합니다.
  - `package.json`에서 실제 앱에서 쓰지 않는 템플릿용 서버 패키지(`express`, `@google/genai`, `dotenv`, `motion` 등)를 모두 제거하고 필수 프론트엔드 패키지만 남겨 설치 속도와 안정성을 극대화합니다.
- **확정 결정 2 (GitHub Pages `404.html` 및 `.nojekyll` 처리)**:
  - 빌드 직후 `dist/index.html`을 `dist/404.html`로 복제하고 `dist/.nojekyll` 파일을 생성하여 GitHub Pages에서 새로고침하거나 정적 파일을 불러올 때 404 에러가 발생하지 않도록 보장합니다.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. `actions/setup-node@v4`에서 락파일 검사를 유발하는 `cache: 'npm'`을 제거합니다.
  2. `package.json`을 순수 Vite + React + TypeScript + Tailwind CSS 구성으로 정리하고, 환경 변수(`.env`) 의존성이 전혀 없는 정적 웹앱 구조를 검증합니다.
  3. 빌드 산출물(`dist/`)에 `404.html`과 `.nojekyll`을 자동 포함시켜 GitHub Pages 배포 품질을 완성합니다.
- **Target Audience / Persona**: GitHub Actions를 통해 GitHub Pages로 시험 연습 웹앱을 무결점으로 배포하려는 사용자.
- **Key Value**: `Set up Node.js 22` → `Install and Build` → `Deploy to GitHub Pages` 전 과정이 중단 없이 통과됩니다.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. AI Studio에서 GitHub로 내보내기(Push) 실행.
  2. GitHub Actions에서 `Set up Node.js 22` 단계가 락파일 검사 없이 1초 만에 통과됨.
  3. `Install and Build` 단계에서 경량화된 패키지들이 충돌 없이 설치되고 `vite build` 및 `404.html` 생성이 완료됨.
  4. `Deploy to GitHub Pages` 단계가 완료되어 배포 사이트가 정상 작동함.
- **Visual Identity & Theme**:
  - 기존 한국어·스페인어 시험 연습 화면과 채점 효과음, 만점 폭죽, 고급학습기능(암기팁 노트 및 노트 모아보기)이 그대로 유지됩니다.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: `actions/setup-node@v4`에서 `cache: 'npm'` 제거**
  - *Chosen Approach*: `with: node-version: '22'`만 단독으로 지정합니다.
  - *Why*: `package-lock.json`이 없는 저장소에서 `cache: 'npm'`은 100% 에러를 발생시키므로 반드시 제거해야 합니다.
- **Decision 2: 사전 점검 3대 항목(환경변수, 대소문자, TS 엄격 검사) 완비**
  - *Chosen Approach*:
    - 환경변수(`.env`): 앱 내부에서 외부 API 키를 전혀 참조하지 않도록 100% 클라이언트 코드로 유지.
    - 대소문자 구분(Linux): 모든 `import` 경로의 파일명 대소문자를 리눅스 기준으로 검증 완료.
    - TypeScript 검사: `tsc --noEmit` 및 `vite build`를 사전 통과시켜 미사용 변수나 타입 에러가 없음을 보장.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **GitHub Actions Pipeline Diagram**:
```
┌──────────────────────┐
│ 1. Checkout (@v4)    │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ 2. Setup Node 22     │  ◄── cache: 'npm' 제거 (package-lock.json 불필요)
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ 3. Install & Build   │  ◄── npm install + vite build + 404.html 생성
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ 4. Upload & Deploy   │  ◄── actions/upload-pages-artifact@v3 & deploy-pages@v4
└──────────────────────┘
```
