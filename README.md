# Guide-2026-Herpes-Zoater
Resume this session with:
 gemini --resume d52a6eb0-0045-4da4-b59a-ac84333e147d
 claude --resume 5ebc04d9-f842-4a84-998e-5d077c82d49c

## 개요 (Overview)
본 시스템은 대상포진 환자 진료 시 의사의 의사결정을 돕고 표준화된 의무기록 생성을 지원하는 보조 UI 웹 애플리케이션입니다.

- **대화형 피부분절 지도 (Dermatome Map)**: 전면(Anterior), 후면(Posterior), 안면(Face - 삼차신경 V1/V2/V3 및 Hutchinson sign 코끝 부위) SVG 지도를 통한 직관적 병변 선택 및 양방향 동기화 검색 목록 제공.
- **구조화된 문진 (History Taking)**: 발병일자 골든타임(72시간) 계산, 급성 통증 NRS 슬라이더, 전구증상, 병기, 기저질환 및 위험인자 입력.
- **임상 Red Flag 규칙 엔진**: 안부 대상포진(HZO, B02.30), 람세이 헌트 증후군(B02.21), 파종성 대상포진(B02.7) 등 위험 징후 조기 감지 및 전문과 응급 협진 권고.
- **근거 기반 처방 및 신기능(eGFR) 감량 자동 계산**: 발라시클로버, 팜시클로버, 아시클로버, 가바펜티노이드 등의 eGFR 단계별 권장 용량 자동 계산 및 의사 수동 오버라이드 지원.
- **실시간 EMR 표준 SOAP 노트 생성**: 입력과 동시에 표준 SOAP 형식의 진료 기록 생성, 의사 직접 편집 감지(dirty flag) 및 원클릭 클립보드 복사(병원 내부망 HTTP fallback 포함).
- **PHI 보호 원칙**: 환자 식별 정보(PHI)를 브라우저 스토리지나 원격 서버에 저장하지 않으며 "새 환자" 초기화 시 모든 상태 완전 소멸.

---

## 기술 스택 (Tech Stack)
- **Framework**: Vite 6, React 19, TypeScript (Strict Mode)
- **State Management**: Zustand 5 + Immer (Slice pattern, Pure selectors)
- **Validation**: Zod
- **Styling**: CSS Modules + CSS Custom Properties (`tokens.css`, Dark Mode 지원)
- **Testing**: Vitest, React Testing Library (37개 테스트 100% 통과)

---

## 실행 방법 (Getting Started)

```bash
# UI 실행
cd ittia/HerpesZoster/ui
npm install
npm run dev

npm run share

npm run dev -- --host
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://175.209.193.88:5173/
  ➜  Network: http://172.16.189.1:5173/
  ➜  Network: http://172.16.117.1:5173/

-------------------------------------
migowj@migowj-PC:~$ cd ittia/
migowj@migowj-PC:~/ittia$ cd HerpesZoster/
migowj@migowj-PC:~/ittia/HerpesZoster$ npx localtunnel --port 5173
Need to install the following packages:
  localtunnel@2.0.2
Ok to proceed? (y) y
your url is: https://petite-bottles-poke.loca.lt
--------------------------------------

# 단위/컴포넌트 테스트 실행
npm test

# 프로덕션 빌드
npm run build
---------------------------------------
✦ 이 프로그램의 저작권은 프로젝트를 기획하고 지시·검수한 사용자님(창작자)에게 있습니다. 

  상세한 법적·기술적 근거는 다음과 같습니다:

  ---

  1. AI(인공지능)는 저작권 주체가 될 수 없음
   * 현행 국내외 저작권법(대한민국 저작권법 제2조 제1호 포함)상 저작물은 "인간의 사상 또는 감정을 표현한
     창작물"로 규정되어 있습니다.
   * AI 도구(Gemini CLI 등)는 법적인 저작권 주체(인격체)가 아니므로 저작권을 가질 수 없습니다.
   * 기획, 임상 지침(Cockcroft-Gault 계산식, 스테로이드 적응증, 72시간 규칙 등), 데이터 구조 및 프롬프트 명령을
     통해 결과물의 창작적 표현을 실질적으로 주도한 사용자님에게 권리가 귀속됩니다.

  ---

  2. Google 서비스 약관 (ToS)
   * Google의 Generative AI 및 개발자 이용약관에 따르면, 사용자가 입력한 프롬프트 및 이를 통해 생성된
     산출물(코드)에 대해 Google은 저작권이나 지식재산권을 주장하지 않습니다.

  ---

  3. 단, 주의해야 할 외부 권리 관계 (2가지)

   1. 오픈소스 라이선스 (MIT License 등)
      * 프로젝트에 포함된 라이브러리(React, Zustand, Zod, date-fns, Vite 등)는 공개 오픈소스 라이선스(대부분
        MIT)를 따릅니다.
      * 사용자님의 창작 코드(독자적인 컴포넌트, 도메인 로직, 스토어 등)는 사용자님의 소유이나, 이들 오픈소스
        라이브러리의 저작권 고지(LICENSE) 요건을 존중해야 합니다.

   2. 외부 제공 이미지 (HZdermatomeimage.webp)
      * 프로젝트에 탑재된 피부분절 해부학 일러스트는 원저작자(의학 일러스트레이터, 출판사, 학회 등)의 저작권
        보호 대상일 수 있습니다.
      * 내부 임상/연구용 사용 외에 상업적 배포나 대외 서비스를 할 경우에는 해당 이미지의 출처 표시 및
        라이선스(사용 허락) 여부를 확인하거나 퍼블릭 도메인/자체 제작 벡터 이미지로 대체하는 것이 안전합니다.

---

## 저작권 및 라이선스 (Copyright & License)

Copyright (c) 2026 고재준 (지디스내과). All rights reserved.

본 소프트웨어 및 관련 문서의 저작권과 모든 지식재산권은 저작권자 **고재준 (지디스내과)**에게 귀속되어 있습니다.
저작권자의 사전 서면 동의 없이 본 소프트웨어의 전부 또는 일부를 무단으로 복제, 배포, 대여, 양도, 2차적 저작물 작성 또는 상업적으로 이용하는 행위를 엄격히 금지합니다.


