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
      title: '🚨 안부 대상포진 (Herpes Zoster Ophthalmicus) 긴급',
      message: `${reasons.join(', ')}이(가) 확인되었습니다. 비섬모신경 침범으로 인한 각막염, 포도막염, 녹내장 및 영구적 시력 손실 위험이 있습니다.`,
      recommendation:
        '당일 즉시 안과 응급 협진/의뢰 및 고용량 항바이러스제(발라시클로버 1g TID 또는 IV 아시클로버 10mg/kg) 투여를 개시하십시오.',
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
        '내과 입원 치료(음압/공기·접촉 격리 병실) 및 정맥 항바이러스제(IV Acyclovir 10 mg/kg q8h) 투여를 강력히 권고합니다.',
    });
  }

  // 4. Immunocompromised Status & Extended Therapy
  const isImmunocompromised = history.riskFactors.includes('immunocompromised');
  if (isImmunocompromised) {
    alerts.push({
      id: 'redflag-immunocompromised',
      severity: 'warning',
      title: '⚠️ 면역저하자 대상포진 (치료 기간 연장 필요)',
      message:
        '면역저하 상태(항암, 면역억제제 투여, 장기이식, HIV 등) 환자는 중증 진행 및 내장 파종의 고위험군입니다.',
      recommendation:
        '발병 후 경과 시간과 무관하게 즉시 항바이러스제를 투여하며, 모든 수포 병변이 완전히 가피(딱지)화될 때까지(통상 10~14일 이상) 투여 기간을 연장하십시오.',
    });
  }

  // 5. Onset Time Evaluation & 72-Hour Golden Window Exception Rules
  if (history.onsetDate) {
    try {
      const onset = parseISO(history.onsetDate);
      const daysSince = differenceInDays(todayDate, onset);

      if (daysSince > 3) {
        // Evaluate clinical exceptions to 72h limit
        const exceptionReasons: string[] = [];
        if (history.newVesiclesEmerging) exceptionReasons.push('새로운 수포가 지속 생성 중');
        if (hasV1 || history.hutchinsonSign || history.ocularSymptoms) exceptionReasons.push('안부 대상포진(HZO)');
        if (isImmunocompromised) exceptionReasons.push('면역저하자');
        if ((history.age !== null && history.age >= 50) || history.riskFactors.includes('age_ge_50')) {
          exceptionReasons.push('50세 이상 고령자');
        }
        if (history.painNrs !== null && history.painNrs >= 7) exceptionReasons.push('중증 급성 통증(NRS≥7)');

        if (exceptionReasons.length > 0) {
          alerts.push({
            id: 'info-72h-exception',
            severity: 'info',
            title: 'ℹ️ 72시간 경과 환자의 항바이러스제 투여 적응증 해당',
            message: `발병 후 ${daysSince}일 경과하였으나 [${exceptionReasons.join(', ')}] 사유에 해당합니다.`,
            recommendation:
              '가이드라인에 따라 72시간이 지났더라도 항바이러스제 전량 투여를 강력히 권고합니다.',
          });
        } else {
          alerts.push({
            id: 'info-delayed-presentation',
            severity: 'info',
            title: 'ℹ️ 발병 후 72시간 경과 안내',
            message: `증상 발현 후 약 ${daysSince}일 경과하였습니다. 새로운 수포가 추가로 생기지 않는 경증 환자는 통상적 항바이러스제의 임상적 득실을 평가하십시오.`,
            recommendation:
              '새로운 수포 생성 여부를 재확인하고, 신경염 통증 조절 및 대상포진 후 신경통(PHN) 관리에 집중하십시오.',
          });
        }
      }
    } catch {
      // Date parse error ignored
    }
  }

  // 6. Renal Impairment & CrCl vs eGFR Distinction
  const effectiveRenal = history.crcl ?? history.egfr;
  if (effectiveRenal !== null && effectiveRenal < 60) {
    const hasAntiviral = treatments.some((t) =>
      ['valacyclovir', 'famciclovir', 'famvir_kr_250', 'acyclovir_oral', 'acyclovir_iv', 'foscarnet_iv'].includes(
        t.drugId
      )
    );
    const metricUsed = history.crcl !== null ? 'CrCl (Cockcroft-Gault)' : 'eGFR';
    if (hasAntiviral) {
      alerts.push({
        id: 'warning-renal-adjustment',
        severity: 'warning',
        title: `⚠️ 신기능 저하 (${metricUsed} ${effectiveRenal} mL/min) 약물 감량 필수`,
        message: `환자의 ${metricUsed} 수치가 60 mL/min 미만입니다. 항바이러스제 축적으로 인한 신경독성(섬망, 환각, 진전, 뇌증) 및 결정뇨 급성 신손상 위험이 있습니다.`,
        recommendation:
          '미국 FDA 기준 약제는 CrCl 기준으로 감량하십시오. 특히 고령·저체중 환자는 eGFR보다 CrCl이 낮게 나오므로 CrCl 수치를 우선 적용하십시오.',
      });
    }
  }

  // 7. Drug-Drug Interaction Safety Warnings
  const hasTramadol = treatments.some((t) => t.drugId === 'tramadol_apap');
  const hasGabapentinoid = treatments.some((t) =>
    ['pregabalin', 'gabapentin'].includes(t.drugId)
  );
  if (hasTramadol && hasGabapentinoid) {
    alerts.push({
      id: 'warning-tramadol-gabapentinoid',
      severity: 'warning',
      title: '⚠️ 트라마돌 + 가바펜티노이드 병용 시 중추신경/호흡 억제 주의 (FDA 2019 경고)',
      message:
        '트라마돌과 가바펜티노이드(프레가발린/가바펜틴) 병용 투여 시 심한 졸림, 어지럼 및 치명적인 호흡 억제 위험이 증가합니다.',
      recommendation:
        '고령자, 만성 폐질환(COPD), 수면무호흡증 환자는 저용량으로 시작하고 호흡 상태 및 진정 수준을 주의 깊게 모니터링하십시오.',
    });
  }

  if (hasTramadol) {
    alerts.push({
      id: 'info-tramadol-serotonin',
      severity: 'info',
      title: 'ℹ️ 트라마돌 복용 안전 수칙 (세로토닌 증후군 및 APAP 총량)',
      message:
        '1) SSRI, SNRI, TCA 항우울제 병용 시 세로토닌 증후군 및 경련 위험. 2) 복합제(325mg APAP) 포함 타 아세트아미노펜 제제와 합산하여 1일 4,000mg을 초과하지 않도록 점검하십시오.',
    });
  }

  // 8. Severe Acute Pain (NRS >= 7)
  if (history.painNrs !== null && history.painNrs >= 7) {
    alerts.push({
      id: 'warning-severe-pain',
      severity: 'warning',
      title: '⚠️ 중증 급성 통증 (NRS 7점 이상)',
      message: `통증 점수가 NRS ${history.painNrs}/10점으로 심각합니다. 급성기 중증 통증은 만성 대상포진 후 신경통(PHN)으로의 이행 위험을 현저히 높입니다.`,
      recommendation:
        '신경병증성 진통제(프레가발린/가바펜틴) 조기 투여 및 통증클리닉 경막외/신경차단술(Nerve block) 의뢰를 적극 검토하십시오.',
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
