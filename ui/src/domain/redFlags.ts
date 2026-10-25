import { differenceInDays, parseISO } from 'date-fns';
import type { Alert, Encounter } from './types';

export function evaluateRedFlags(encounter: Encounter, todayDate = new Date()): Alert[] {
  const alerts: Alert[] = [];
  const { history, lesions, treatments } = encounter;

  // 1. Herpes Zoster Ophthalmicus (HZO) Evaluation
  const hasV1 = lesions.some((l) => l.dermatome === 'V1');
  if (hasV1 || history.hutchinsonSign || history.ocularSymptoms) {
    const reasons: string[] = [];
    if (hasV1) reasons.push('삼차신경 V1 분절 침범');
    if (history.hutchinsonSign) reasons.push('허친슨 징후(코끝/측면 수포) 양성');
    if (history.ocularSymptoms) reasons.push('안구 증상(충혈/안통/시력저하)');

    alerts.push({
      id: 'redflag-hzo',
      severity: 'critical',
      title: '🚨 안부 대상포진 (Herpes Zoster Ophthalmicus) 의심',
      message: `${reasons.join(', ')}이(가) 확인되었습니다. 비섬모신경 침범으로 인한 각막염, 포도막염, 녹내장 및 영구적 시력 손실 위험이 있습니다.`,
      recommendation:
        '즉시 안과 응급 협진/의뢰 및 고용량 항바이러스제(발라시클로버 1g TID 또는 IV 아시클로버) 투여를 개시하십시오.',
    });
  }

  // 2. Ramsay Hunt Syndrome (Herpes Zoster Oticus) Evaluation
  if (history.hearingSymptoms || history.facialPalsy) {
    const reasons: string[] = [];
    if (history.hearingSymptoms) reasons.push('이과 증상(이명/어지럼/난청)');
    if (history.facialPalsy) reasons.push('안면마비');

    alerts.push({
      id: 'redflag-ramsay-hunt',
      severity: 'critical',
      title: '🚨 람세이 헌트 증후군 (Ramsay Hunt Syndrome) 의심',
      message: `${reasons.join(', ')}이(가) 동반되었습니다. 7/8번 뇌신경 침범에 의한 영구적 안면마비 및 청력 손실 위험이 있습니다.`,
      recommendation:
        '이비인후과/신경과 즉시 협진 및 고용량 항바이러스제와 전신 스테로이드(예: 프레드니솔론 1mg/kg) 조기 병용을 검토하십시오.',
    });
  }

  // 3. Disseminated Herpes Zoster Evaluation
  const uniqueDermatomes = new Set(lesions.map((l) => l.dermatome));
  const hasBilateral = lesions.some((l) => l.side === 'Bilateral');
  if (uniqueDermatomes.size >= 3 || hasBilateral) {
    alerts.push({
      id: 'redflag-disseminated',
      severity: 'critical',
      title: '🚨 파종성 대상포진 (Disseminated Zoster) 의심',
      message: `3개 이상의 피부분절(${uniqueDermatomes.size}개) 침범 또는 양측성 침범이 확인되었습니다. 바이러스혈증 및 내장 침범(뇌염, 간염, 폐렴) 위험이 있습니다.`,
      recommendation:
        '내과 입원 치료(공기/접촉 격리 병실) 및 정맥 항바이러스제(IV Acyclovir 10 mg/kg q8h) 투여를 강력히 권고합니다.',
    });
  }

  // 4. Immunocompromised Status
  const isImmunocompromised = history.riskFactors.includes('immunocompromised');
  if (isImmunocompromised) {
    alerts.push({
      id: 'redflag-immunocompromised',
      severity: 'warning',
      title: '⚠️ 면역저하자 대상포진 주의',
      message:
        '면역저하 상태(항암, 면역억제제 투여, HIV, 장기이식 등) 환자는 중증 진행 및 파종성 감염의 고위험군입니다.',
      recommendation:
        '발병 후 72시간 경과 여부와 무관하게 즉시 항바이러스제를 투여하고, 치료 반응이 불충분할 경우 IV 아시클로버 전환을 고려하십시오.',
    });
  }

  // 5. Onset Time Evaluation (> 72 hours) in Immunocompetent
  if (history.onsetDate) {
    try {
      const onset = parseISO(history.onsetDate);
      const daysSince = differenceInDays(todayDate, onset);

      if (daysSince > 3 && !isImmunocompromised) {
        alerts.push({
          id: 'info-delayed-presentation',
          severity: 'info',
          title: 'ℹ️ 발병 후 72시간 경과 안내',
          message: `증상 발현 후 약 ${daysSince}일 경과하였습니다. 새로운 수포가 지속적으로 생성되지 않는 한 통상적 항바이러스제의 임상적 이득은 제한적일 수 있습니다.`,
          recommendation:
            '새로운 병변의 생성 여부를 확인하고, 급성 통증 조절 및 대상포진 후 신경통(PHN) 예방 치료에 집중하십시오.',
        });
      }
    } catch {
      // Date parse error ignored
    }
  }

  // 6. Renal Impairment & Dose Adjustment Warning
  if (history.egfr !== null && history.egfr < 60) {
    const hasAntiviral = treatments.some((t) =>
      ['valacyclovir', 'famciclovir', 'acyclovir_oral', 'acyclovir_iv'].includes(t.drugId)
    );
    if (hasAntiviral) {
      alerts.push({
        id: 'warning-renal-adjustment',
        severity: 'warning',
        title: '⚠️ 신기능 저하 (eGFR < 60 mL/min) 약물 용량 감량 필수',
        message: `환자의 eGFR이 ${history.egfr} mL/min으로 감소되어 있습니다. 항바이러스제 축적으로 인한 신경독성(혼돈, 환각, 진전) 및 결정성 급성 신손상 위험이 있습니다.`,
        recommendation:
          '신장 용량 조절 가이드를 확인하여 항바이러스제 및 가바펜티노이드 용량을 반드시 감량 처방하십시오.',
      });
    }
  }

  // 7. Severe Acute Pain (NRS >= 7)
  if (history.painNrs !== null && history.painNrs >= 7) {
    alerts.push({
      id: 'warning-severe-pain',
      severity: 'warning',
      title: '⚠️ 중증 급성 통증 (NRS 7 이상)',
      message: `통증 점수가 NRS ${history.painNrs}/10점으로 심각합니다. 급성기 고통증은 만성 대상포진 후 신경통(PHN)으로의 이행 위험을 크게 증가시킵니다.`,
      recommendation:
        '단순 진통제 외에 프레가발린/가바펜틴 등 신경병증성 진통제 조기 병용 및 통증클리닉 신경차단술(Nerve block) 의뢰를 적극 고려하십시오.',
    });
  }

  // Sort: critical first, then warning, then info
  const severityWeight: Record<Alert['severity'], number> = {
    critical: 0,
    warning: 1,
    info: 2,
  };

  return alerts.sort((a, b) => severityWeight[a.severity] - severityWeight[b.severity]);
}
