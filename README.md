# Guide-2026-Herpes-Zoster: 근거를 보여주는 대상포진 임상결정지원(CDS)

> **설계 원칙**: *"최소 정보를 브라우저 안에서만 쓰고, 저장하거나 외부로 보내지 않도록 설계"*  
> **시스템 정체성**: 단순 문서작성 보조를 넘어 처방 권고의 계산 공식(Cockcroft-Gault), 신기능 컷오프 구간, 가이드라인 출처를 화면에 공개하는 임상결정지원 도구. 비의료기기 CDS를 지향하여 설계 (식약처·FDA 확인 전).

## 개요 (Overview)
본 시스템은 내과 전문의(고재준)가 설계한 대상포진 특화 근거공개형 임상결정지원 웹 애플리케이션입니다. 피부 소견(병변 형태·피부분절 분포)은 김영걸(피부과 전문의)의 자문을 받았습니다.

- **투명한 계산 근거 공개 (Evidence-Revealing CDS)**: 환자별 Cockcroft-Gault CrCl 대입 공식 및 컷오프 구간, 가이드라인 출처(FDA, CDC, IDSA)를 화면에 상시 공개하여 의사가 권고를 독립적으로 검토할 수 있도록 함.
- **최소 정보 브라우저 전용 연산**: 환자 인적사항과 진료 데이터는 브라우저 메모리 안에서만 연산하며, 외부 서버나 브라우저 저장소에 저장·전송하지 않도록 설계되었습니다(EMR 연동 시에는 설정된 EMR로만 노트를 전달).
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
- **Testing**: Vitest, React Testing Library (테스트 78개)

---

## 실행 방법 (Getting Started)

```bash
# UI 디렉터리로 이동 (저장소 루트 기준)
cd ui
npm install

# 개발 서버 실행 → http://localhost:5173/
npm run dev

# 같은 네트워크의 다른 기기에서 접속 (터미널에 표시되는 Network 주소 사용)
npm run dev -- --host

# 단위/컴포넌트 테스트 실행
npm test

# 프로덕션 빌드
npm run build
```


## 라이선스 (License)

- **소스 코드**: [Apache License 2.0](LICENSE) — Copyright 2026 JAE JOON KOH (고재준, 지디스내과). 재배포 시 [NOTICE](NOTICE) 파일을 함께 포함해야 합니다.
- **피부분절 일러스트** (`ui/src/assets/dermatome_map.webp`): Apache 라이선스 대상이 아니며 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)을 따릅니다. 원작자 Goran_tek-en, [Wikimedia Commons 원본](https://commons.wikimedia.org/wiki/File:Dermatomes_labeled,_female_front-back_3d-shaded.svg).
