# 근거를 보여주는 대상포진 CDS 웹 위젯 EMR 연동 기술 명세서 (INTEGRATION.md)

> **버전**: v1.0.0 (2026-11)  
> **저작권자**: 고재준 원장 (JAE JOON KOH, 지디스내과)  
> **핵심 가치**: "최소 정보를 브라우저 안에서만 쓰고 아무것도 가져가지 않는다" (Zero-Storage / Zero-Egress)  
> **목적**: 오름차트, 트루닥 등 웹 기반 EMR 및 웹뷰 연동을 위한 양방향 표준 통신 프로토콜 명세

---

## 1. 개요 및 연동 핵심 가치

본 시스템은 단순한 진료기록 작성보조를 넘어, **"근거를 보여주는 비의료기기 CDS(Evidence-Revealing Clinical Decision Support)"**로서 의사가 권고의 의학적 근거(Cockcroft-Gault 수식, 신기능 컷오프 구간, 가이드라인 출처)를 즉시 독립적으로 검토할 수 있는 투명한 임상 결정 지원 시스템입니다.

### EMR 제조사 도입 이점
1. **Zero-Storage / Zero-Egress 무부하 구조**: **"최소 정보를 브라우저 안에서만 쓰고 아무것도 가져가지 않는다"**는 원칙 하에 환자 식별 정보(PHI)를 서버나 브라우저 스토리지에 일절 보관·전송하지 않는 순수 인메모리 클라이언트 구조로, 개인정보보호법 및 HIPAA 감사 리스크 제로.
2. **초경량 웹 임베딩 (100KB 수준)**: EMR 내부의 IFrame 또는 웹뷰(WebView)에 10분 만에 탑재 가능.
3. **정밀 신기능(CrCl Cockcroft-Gault) 감량 자동 계산 & 근거 공개**: eGFR만으로는 감지하기 어려운 고령·저체중 환자의 신기능 저하를 정밀 평가하며, 환자별 수식을 화면에 투명하게 공개.

---

## 1-1. 규제 포지셔닝 및 독립성 원칙 (Regulatory Positioning & Editorial Independence)

### ① 비의료기기 임상결정지원 (Non-Device CDS) 준수
* 본 시스템은 미국 **21st Century Cures Act § 3060(FDA Non-Device Clinical Decision Support Guidance)** 및 대한민국 식품의약품안전처 기준에 따른 **"문서작성 보조 및 계산 근거를 공개하는 비의료기기 CDS"**로 포지셔닝됩니다.
* **계산 근거의 완전한 투명성**: 의료진이 시스템의 권고를 맹목적으로 따르지 않고 독립적으로 검토(Independent Review)할 수 있도록, 화면에 **CrCl 산출 공식 수식, 적용된 신기능 컷오프 구간, 가이드라인 출처 문헌**을 상시 공개합니다.
* 진료 및 처방에 대한 최종 판단과 법적 책임은 독립된 면허 처방의에게 있습니다.

### ② 편집권 독립 및 성분명 처방 원칙
* 모든 권고 내용, 감량 기준, 약물 상호작용 알림 로직은 **원장(독립 의학 자문단)의 임상적 판단에 의해서만 결정**되며, 제약사 및 상업적 후원사는 권고 내용과 로직에 일절 관여할 수 없습니다.
* 모든 약제는 특정 상표명이 아닌 **공인 성분명(Generic name)** 및 표준 가이드라인(FDA, CDC, IDSA, UpToDate, Cochrane)을 기준으로 기술됩니다.
* 학술 후원이나 스폰서십이 존재할 경우 위젯 화면에 이를 100% 투명하게 공시합니다.

---

## 2. 🚨 환자 세션 안전성 프로토콜 (Patient Session Safety Protocol)

> **임상 안전 원칙**: 진료실에서 의사가 환자를 전환했을 때 위젯에 이전 환자의 병변이나 처방이 남아있으면 **타인 진료기록 오기재 및 오처방으로 인한 중대한 의료사고**로 이어집니다.  
> 따라서 본 시스템은 **'임시 세션 키(patientSessionKey)' 기반의 강제 상태 소멸(Purge) 아키텍처**를 필수 규칙으로 적용합니다.

### 2-1. 임시 세션 키 규칙
* **주민등록번호나 차트번호(Patient ID)는 절대 전송하지 않습니다.**
* EMR 호스트는 환자 차트를 열 때마다 고유한 난수/UUID 기반의 **임시 세션 키(`patientSessionKey`)**를 생성하여 전달합니다. (예: `sess_20261102_a8f9b2`)

### 2-2. 자동 위젯 초기화 (Auto-Purge Lifecycle)
```
[ 호스트 EMR ]                                      [ 대상포진 CDSS 위젯 ]
      │                                                         │
      │ 1. 환자 B 진료 시작                                     │
      │── HZ_SET_PATIENT (patientSessionKey: 'B') ────────────>│ • [안전 조치 1] 환자 A의 모든 병변, 통증,
      │   { age: 60, sex: 'M', weight: 70, sCr: 0.9 }          │   처방 데이터 메모리에서 즉시 영구 삭제!
      │                                                         │ • 환자 B 신규 기본정보 세팅 & CrCl 계산
      │<── HZ_PATIENT_LOADED (sessionKey: 'B') ─────────────────│ • 세션 연동 배지 초록색 전환
      │                                                         │
      │ 2. 의사: 병변 클릭 및 처방 조율 후 "EMR 전송" 클릭     │
      │<── HZ_SAVE_NOTE (sessionKey: 'B', soapNote: '...') ─────│ • 완성된 SOAP 차트 전송
      │                                                         │
[ EMR 검증 및 저장 ]
• EMR은 회신된 sessionKey가
  현재 진료 중인 환자 B의 키와
  일치하는지 확인 후 차트에 기입!
```

* **Stale Note 거부 장치**: 의사가 위젯을 띄워둔 채 EMR에서 환자 C로 화면을 전환한 뒤 과거 위젯의 전송을 누르더라도, EMR 단에서 `sessionKey` 불일치를 확인하여 **엉뚱한 환자 차트에 붙여넣어지는 사고를 100% 방지**합니다.

---

## 3. postMessage 메시지 상세 규격 (API Specification)

모든 통신은 HTML5 표준 `window.postMessage` API를 통해 이루어집니다.

### 3-1. EMR → 위젯: 환자 정보 로드 (`HZ_SET_PATIENT`)
환자 선택 또는 환자 전환 시 EMR이 위젯으로 발송합니다.

```json
{
  "type": "HZ_SET_PATIENT",
  "patientSessionKey": "sess_20261102_987654",
  "payload": {
    "age": 75,
    "sex": "F",
    "weight": 110.0,
    "weightUnit": "lb",
    "serumCreatinine": 1.0,
    "serumCreatinineDate": "2026-10-15",
    "egfr": 56.0,
    "egfrDate": "2026-10-15"
  }
}
```
| 필드명 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `type` | string | **필수** | `"HZ_SET_PATIENT"` 고정 |
| `patientSessionKey` | string | **필수** | EMR에서 발급한 해당 진료 세션 고유 식별자 |
| `payload.age` | number | 선택 | 환자 만 나이 (세) |
| `payload.sex` | string | 선택 | 생물학적 성별 (`"M"` 또는 `"F"`) |
| `payload.weight` | number | 선택 | 환자 체중 수치 (kg 또는 lb) |
| `payload.weightUnit` | string | 선택 | 체중 단위 (`"kg"` 또는 `"lb"`, 미국 EMR 호환; 누락 시 기본값 kg) |
| `payload.serumCreatinine` | number | 선택 | 최근 혈청 크레아티닌 검사값 (mg/dL) |
| `payload.serumCreatinineDate` | string | 선택 | Cr 검사 시행일자 (YYYY-MM-DD; 30일 초과 시 과거 수치 경고) |
| `payload.egfr` | number | 선택 | 최근 eGFR 검사 수치 (mL/min/1.73m²) |
| `payload.egfrDate` | string | 선택 | eGFR 검사 시행일자 (YYYY-MM-DD) |

---

### 3-2. 위젯 → EMR: 환자 로드 완료 응답 (`HZ_PATIENT_LOADED`)
위젯이 이전 데이터를 성공적으로 소멸시키고 신규 환자를 세팅했을 때 EMR로 회신합니다.

```json
{
  "type": "HZ_PATIENT_LOADED",
  "patientSessionKey": "sess_20261102_987654",
  "timestamp": "2026-11-02T10:15:30.123Z"
}
```

---

### 3-3. EMR → 위젯: 환자 세션 종료 (`HZ_CLEAR_PATIENT`)
환자 진료가 끝나 차트가 닫혔을 때 위젯을 초기 공백 상태로 리셋합니다.

```json
{
  "type": "HZ_CLEAR_PATIENT"
}
```

---

### 3-4. 위젯 → EMR: SOAP 차트 및 처방 전송 (`HZ_SAVE_NOTE`)
의사가 위젯에서 **[🚀 EMR 차트 전송]** 버튼을 누르거나, EMR이 요청했을 때 발송됩니다.

```json
{
  "type": "HZ_SAVE_NOTE",
  "patientSessionKey": "sess_20261102_987654",
  "timestamp": "2026-11-02T10:18:45.000Z",
  "soapNote": "[S]\n[환자: 75세/여성/50kg] 2일 전(2026-10-31) 발현된 우측(Right) T4 부위 피부 병변 및 통증을 주소로 내원. 통증 강도: NRS 6/10.\n\n[O]\n피부 소견: 우측(Right) T4 (흉추 4번) 피부분절을 따라 군집성 수포(Clustered vesicles on erythematous base) 관찰됨. 신경절을 따라 편측성으로 분포하며 정중선(midline)을 넘지 않음.\n신장 기능 평가: CrCl(Cockcroft-Gault): 38.4 mL/min, eGFR: 56 mL/min/1.73m², sCr: 1.0 mg/dL (신기능 저하 상태, 약제별 감량 기준 적용).\n\n[A]\n1. Herpes zoster without complications [R T4] (B02.9)\n  - 발병 72시간 이내 골든타임 내원: 조기 항바이러스제 치료를 통해 병변 치유 촉진 및 급성 신경염 통증 조절.\n\n[P]\n1. 처방 약제 (Rx):\n  1) 발라시클로버 (Valacyclovir 1g): 1000 mg PO BID (하루 2회) × 7일 [CrCl 기준 용량 감량됨]\n  2) 프레가발린 (Pregabalin): 75 mg/day PO QD at bedtime (또는 37.5mg BID) × 14일 [CrCl 기준 용량 감량됨]\n\n3. 임상 관리 지침 및 복약 지도:\n  - 항바이러스제는 임의 중단 없이 처방된 전 기간(7일 전량)을 규칙적으로 끝까지 복용하도록 설명함.\n  - [신경통 조절제] 14일 투여 후 급성 통증 완화 정도를 재평가하며, 투약 중단 시 금단 증상 예방을 위해 점진적 감량(Tapering)을 진행함.\n  - 급성기 호전 후 대상포진 재발 및 만성 신경통(PHN) 예방을 위해 유전자재조합 대상포진 백신(싱그릭스 2회 접종, 2~6개월 간격) 접종 강력 권고."
}
```

---

## 4. EMR 개발팀을 위한 5분 연동 샘플 코드 (React / TS)

호스트 EMR 개발팀에서는 다음 간단한 코드로 즉시 위젯을 띄우고 연동할 수 있습니다:

```tsx
import React, { useEffect, useRef } from 'react';

interface EmrHerpesZosterWidgetProps {
  activePatient: {
    chartSessionId: string; // EMR 진료 세션 난수 키
    age: number;
    gender: 'M' | 'F';
    weight: number;
    creatinine: number;
    egfr: number;
  } | null;
  onSaveToChart: (soapNote: string) => void;
}

export const EmrHerpesZosterWidget: React.FC<EmrHerpesZosterWidgetProps> = ({
  activePatient,
  onSaveToChart,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. 환자가 바뀌면 위젯에 새 세션 키와 함께 환자 정보 전달 (위젯은 이전 데이터 자동 소멸)
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    if (activePatient) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'HZ_SET_PATIENT',
          patientSessionKey: activePatient.chartSessionId,
          payload: {
            age: activePatient.age,
            sex: activePatient.gender,
            weightKg: activePatient.weight,
            serumCreatinine: activePatient.creatinine,
            egfr: activePatient.egfr,
          },
        },
        '*'
      );
    } else {
      // 차트가 닫힌 경우 위젯 데이터 완전 초기화
      iframeRef.current.contentWindow.postMessage({ type: 'HZ_CLEAR_PATIENT' }, '*');
    }
  }, [activePatient]);

  // 2. 위젯으로부터 완성된 SOAP 차트 수신
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'HZ_SAVE_NOTE') {
        // [임상 안전 검증] 현재 차트의 환자 세션 키와 일치할 때만 저장!
        if (event.data.patientSessionKey === activePatient?.chartSessionId) {
          onSaveToChart(event.data.soapNote);
          alert('대상포진 진료기록이 EMR 차트에 자동 반영되었습니다.');
        } else {
          console.error('환자 세션 불일치: 다른 환자의 진료기록 저장이 차단되었습니다.');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activePatient, onSaveToChart]);

  return (
    <iframe
      ref={iframeRef}
      src="https://[YOUR_HOSTED_URL]/"
      style={{ width: '100%', height: '800px', border: 'none' }}
      title="대상포진 EMR 보조 솔루션"
    />
  );
};
```

---

## 5. 결론 및 기술 지원
본 연동 프로토콜은 의사의 업무 피로도를 획기적으로 낮추는 동시에, EMR 소프트웨어의 의료 안전성 표준을 한 단계 격상시킵니다.

* **기술 문의 및 제휴**: 지디스내과 고재준 원장 (JAE JOON KOH)
