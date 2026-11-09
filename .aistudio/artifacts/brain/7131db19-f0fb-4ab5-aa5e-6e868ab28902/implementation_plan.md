# GitHub Actions 빌드 및 GitHub Pages 자동 배포 오류 수정 계획

외부 가이드의 `deploy.yml` 설정(`node-version: 18` 및 `peaceiris` 브랜치 배포 액션)으로 인해 발생한 `node:util styleText` 문법 에러와 배포 방식 불일치를 해결하고, AI Studio에서 GitHub로 내보내기(Push)만 하면 즉시 **GitHub Actions 직접 배포 방식(`deploy-pages`)**으로 정상 배포되도록 구성합니다.

### User Review & Critical Decisions

> [!IMPORTANT]
> 이전 빌드가 실패한 정확한 원인과 확정된 해결 방식입니다.

- **원인 분석 (왜 이전 `deploy.yml`이 실패했는가?)**:
  1. **잘못된 Node.js 18 버전 지정 (`node-version: 18`)**: 외부 안내 코드에서 `node-version: 18`로 낮추면서, 최신 `Vite 8`(`rolldown` 번들러)이 요구하는 `import { styleText } from "node:util"`(Node 20.19+ / 22+ 전용 기능)을 찾지 못해 `SyntaxError`로 빌드가 중단되었습니다.
  2. **배포 액션 불일치 (`peaceiris` vs `deploy-pages`)**: 저장소의 GitHub Pages 설정은 **GitHub Actions 직접 배포 방식**인데, 외부 안내 코드는 브랜치 푸시 방식(`peaceiris/actions-gh-pages`)을 사용하고 있었습니다.
- **확정 결정 1**: GitHub 저장소의 `Settings > Pages > Build and deployment > Source: GitHub Actions` 설정에 맞춰 공식 `actions/upload-pages-artifact` + `actions/deploy-pages@v4` 파이프라인으로 통일합니다.
- **확정 결정 2**: GitHub Actions의 Node.js 환경을 **`Node.js 22 LTS`**로 지정하고 상대 경로(`base: './'`) 빌드를 적용하여 AI Studio에서 GitHub로 Push 즉시 배포가 완료되도록 설정합니다.

---

### 1. Overview & Core Concept

- **What It Does**:
  - `main` (또는 `master`) 브랜치에 코드가 Push되면 GitHub Actions가 **Node.js 22** 환경을 구성하고, 의존성 충돌 없이(`--legacy-peer-deps`) 앱을 빌드한 뒤 `./dist` 결과물을 **GitHub Pages**에 직접 배포합니다.
- **Target Audience / Persona**: AI Studio에서 GitHub 저장소로 코드를 내보내어(Export/Push) GitHub Pages로 시험 연습 웹앱을 배포하려는 사용자.
- **Key Value**: GitHub 웹사이트에서 번거롭게 YML 파일을 수동 수정할 필요 없이, AI Studio에서 GitHub로 Push하는 것만으로 빌드부터 페이지 게시까지 한 번에 성공합니다.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. AI Studio에서 GitHub 저장소로 내보내기(Push) 실행.
  2. GitHub 저장소의 `Actions` 탭에서 `Deploy to GitHub Pages` 워크플로우가 자동 실행됨.
  3. `Install and Build` 단계가 Node.js 22 환경에서 에러 없이 완료(`vite build` 성공)되고, `Deploy to GitHub Pages` 단계를 거쳐 배포 URL(`https://yoan-kim.github.io/Examen-de-Verificaci-n/`)이 활성화됨.
- **Visual Identity & Theme**:
  - 기존 한국어·스페인어 시험 연습 인터페이스, 채점 효과음, 만점 폭죽 연출, 고급학습기능(암기팁 노트 및 노트 모아보기)이 서브경로에서도 스타일이나 스크립트 깨짐 없이 100% 동일하게 렌더링됩니다.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: `Node.js 22` 고정 및 `.npmrc` 연동**
  - *Chosen Approach*: `actions/setup-node@v4`에서 `node-version: '22'`를 명시하고 `npm install --legacy-peer-deps`로 설치합니다.
  - *Why*: `Vite 8` 및 `Rolldown`의 `node:util`(`styleText`) 호환성을 100% 충족하며 피어 의존성 충돌을 방지합니다.
- **Decision 2: 공식 GitHub Pages 직접 배포 액션(`actions/deploy-pages@v4`) 및 권한(`permissions`) 명시**
  - *Chosen Approach*: 워크플로우 최상단에 `pages: write`, `id-token: write`, `contents: read` 권한을 부여하고 공식 아티팩트 배포 액션을 사용합니다.
  - *Why*: 별도의 토큰 설정이나 `gh-pages` 브랜치 생성 없이 GitHub Pages의 `GitHub Actions` 소스 모드와 완벽히 연동됩니다.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Deployment Pipeline Diagram**:
```
┌────────────────────────┐     Push / Export     ┌──────────────────────────────┐
│   Google AI Studio     │ ────────────────────► │     GitHub Repository        │
│  (Vite + React + TS)   │                       │ (.github/workflows/deploy)   │
└────────────────────────┘                       └──────────────┬───────────────┘
                                                                │
                                                                ▼
┌────────────────────────┐    Deploy Artifact    ┌──────────────────────────────┐
│     GitHub Pages       │ ◄──────────────────── │   GitHub Actions Runner      │
│  (Live Web App URL)    │   (deploy-pages@v4)   │  Node.js 22 + vite build     │
└────────────────────────┘                       └──────────────────────────────┘
```

- **Configuration Verification**:
  - Vite 상대 경로(`base: './'`) 설정으로 루트 도메인(Vercel)과 서브경로 도메인(GitHub Pages `/Examen-de-Verificaci-n/`) 양쪽에서 정적 에셋 경로가 깨지지 않도록 보장합니다.
