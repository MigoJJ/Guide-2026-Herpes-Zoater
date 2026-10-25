# Guide-2026-Herpes-Zoater

 gemini --resume d52a6eb0-0045-4da4-b59a-ac84333e147d

대상포진(Herpes Zoster, Shingles) 임상 진료 지원 및 EMR 표준 차팅 자동 생성 시스템 (2026)

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
# UI 디렉터리 이동
cd ui

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 단위/컴포넌트 테스트 실행
npm test

# 프로덕션 빌드
npm run build
```
