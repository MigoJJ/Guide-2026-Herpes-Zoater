# Guide-2026-Herpes-Zoster: 근거를 보여주는 대상포진 임상결정지원(CDS)

> **핵심 가치**: *"최소 정보를 브라우저 안에서만 쓰고 아무것도 가져가지 않는다" (Zero-Storage / Zero-Egress)*  
> **시스템 정체성**: 단순 문서작성 보조를 넘어 처방 권고의 계산 공식(Cockcroft-Gault), 신기능 컷오프 구간, 글로벌 가이드라인 출처를 화면에 투명하게 공개하는 **비의료기기 CDS(Non-Device Clinical Decision Support)**

## 개요 (Overview)
본 시스템은 내과 전문의가 설계한 대상포진 특화 근거공개형 임상결정지원 웹 애플리케이션입니다.

- **투명한 계산 근거 공개 (Evidence-Revealing CDS)**: 환자별 Cockcroft-Gault CrCl 대입 공식 및 컷오프 구간, 가이드라인 출처(FDA, CDC, IDSA)를 화면에 상시 공개하여 의사의 독립적 검토(Independent Review) 보장.
- **최소 정보 브라우저 전용 연산 (Zero-Storage PHI)**: 환자 인적사항과 진료 데이터는 브라우저 메모리 안에서만 즉시 연산되며, 외부 서버나 클라우드로 일절 전송되거나 보관되지 않음.
- **대화형 피부분절 지도 (Dermatome Map)**: 전면(Anterior), 후면(Posterior), 안면(Face - 삼차신경 V1/V2/V3 및 Hutchinson sign 코끝 부위) 고해상도 임상 일러스트(CC BY-SA 4.0) 기반 인터랙티브 매핑.
- **구조화된 문진 (History Taking)**: 발병일자 골든타임(72시간) 예외 규정 평가, 급성 통증 NRS 슬라이더, 전구증상, 병기, 체중(kg/lb 환산 지원), sCr 검사일자 추적 및 과거 수치 경고.
- **임상 Red Flag 규칙 엔진**: 안부 대상포진(HZO, B02.30), 람세이 헌트 증후군(B02.21), 파종성 대상포진(B02.7), 트라마돌-가바펜티노이드 병용 호흡억제(FDA 2019 경고), 스테로이드 단독/면역저하자 금기 등 조기 감지.
- **근거 기반 처방 및 신기능(CrCl/eGFR) 감량 자동 계산**: 발라시클로버, 팜시클로버, 아시클로버(경구/주사 체중 환산), 프레드니솔론 테이퍼링 등의 성분명 중심 표준 요법.
- **실시간 EMR 표준 SOAP 노트 생성**: 입력과 동시에 표준 SOAP 형식의 진료 기록 생성, 의사 직접 편집 감지(dirty flag) 및 EMR 세션 키 연동 원클릭 전송.

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


# 단위/컴포넌트 테스트 실행
npm test

# 프로덕션 빌드
npm run build
---------------------------------------

