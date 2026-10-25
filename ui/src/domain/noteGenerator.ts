import { differenceInDays, parseISO } from 'date-fns';
import type { Encounter, History, LesionSelection, RegimenSelection } from './types';
import { DRUG_REGIMENS, calculateAdjustedDose } from './regimens';
import { DERMATOMES } from './dermatomes';

export interface NoteGeneratorOptions {
  locale?: 'ko' | 'en';
  referenceDate?: Date;
}

export function generateNote(
  encounter: Encounter,
  options: NoteGeneratorOptions = {}
): string {
  const { locale = 'ko', referenceDate = new Date() } = options;
  const { history, lesions, treatments } = encounter;

  const sSection = buildSubjective(history, lesions, referenceDate, locale);
  const oSection = buildObjective(history, lesions, locale);
  const aSection = buildAssessment(history, lesions, referenceDate, locale);
  const pSection = buildPlan(history, lesions, treatments, locale);

  return [sSection, oSection, aSection, pSection].filter(Boolean).join('\n\n');
}

function buildSubjective(
  history: History,
  lesions: LesionSelection[],
  referenceDate: Date,
  locale: 'ko' | 'en'
): string {
  const parts: string[] = [];

  // 1. Onset & Duration
  if (history.onsetDate) {
    try {
      const onset = parseISO(history.onsetDate);
      const days = differenceInDays(referenceDate, onset);
      const daysText = days === 0 ? '당일' : `${days}일 전`;

      if (locale === 'ko') {
        const sites = lesions.map((l) => `${formatSideKo(l.side)} ${l.dermatome}`).join(', ');
        const siteStr = sites ? `${sites} 부위 ` : '';
        parts.push(`${daysText}(${history.onsetDate}) 발현된 ${siteStr}피부 병변 및 통증을 주소로 내원.`);
      } else {
        const sites = lesions.map((l) => `${l.side} ${l.dermatome}`).join(', ');
        parts.push(`Patient presents with painful lesions on ${sites || 'skin'}, onset ${days} days ago (${history.onsetDate}).`);
      }
    } catch {
      parts.push(locale === 'ko' ? `발병일: ${history.onsetDate}` : `Onset date: ${history.onsetDate}`);
    }
  } else {
    parts.push(locale === 'ko' ? '수일 전 발현된 피부 병변 및 통증으로 내원.' : 'Presents with skin rash and pain.');
  }

  // 2. Pain NRS
  if (history.painNrs !== null) {
    parts.push(
      locale === 'ko'
        ? `통증 강도: NRS ${history.painNrs}/10.`
        : `Pain scale: NRS ${history.painNrs}/10.`
    );
  }

  // 3. Prodrome
  if (history.prodrome.length > 0) {
    const prodromeKoMap: Record<string, string> = {
      fever: '발열',
      malaise: '전신 쇠약감',
      itching: '가려움증',
      tingling: '저림/따끔거림',
      burning: '작열감(화끈거림)',
      headache: '두통',
    };
    const symptoms = history.prodrome.map((p) => prodromeKoMap[p] || p).join(', ');
    parts.push(locale === 'ko' ? `전구증상: ${symptoms}.` : `Prodromal symptoms: ${history.prodrome.join(', ')}.`);
  }

  // 4. Red Flag / Special symptoms
  const special: string[] = [];
  if (history.ocularSymptoms) {
    special.push(locale === 'ko' ? '안구 증상(충혈/안통/시력저하)' : 'ocular symptoms');
  }
  if (history.hutchinsonSign) {
    special.push(locale === 'ko' ? '허친슨 징후(코끝 수포)' : "Hutchinson's sign");
  }
  if (history.hearingSymptoms) {
    special.push(locale === 'ko' ? '이과 증상(이명/난청/어지럼)' : 'auditory symptoms');
  }
  if (history.facialPalsy) {
    special.push(locale === 'ko' ? '안면 마비' : 'facial palsy');
  }
  if (special.length > 0) {
    parts.push(
      locale === 'ko'
        ? `동반 증상: ${special.join(', ')}.`
        : `Associated features: ${special.join(', ')}.`
    );
  }

  // 5. Risk Factors
  if (history.riskFactors.length > 0) {
    const rfKoMap: Record<string, string> = {
      immunocompromised: '면역저하자',
      ckd: '만성 신장질환(CKD)',
      age_ge_50: '50세 이상',
      pregnancy: '임신',
      diabetes: '당뇨병',
    };
    const rfs = history.riskFactors.map((r) => rfKoMap[r] || r).join(', ');
    parts.push(locale === 'ko' ? `기저질환/위험인자: ${rfs}.` : `Underlying conditions: ${history.riskFactors.join(', ')}.`);
  }

  return `[S]\n${parts.join(' ')}`;
}

function buildObjective(
  history: History,
  lesions: LesionSelection[],
  locale: 'ko' | 'en'
): string {
  const parts: string[] = [];

  // Stage description
  const stageKoMap: Record<string, string> = {
    erythema: '초기 홍반 및 구진(Erythematous papules)',
    vesicular: '군집성 수포(Clustered vesicles on erythematous base)',
    pustular: '농포 형성(Pustules)',
    crusted: '가피 형성기(Crusted lesions)',
  };

  const stageText = history.rashStage ? stageKoMap[history.rashStage] || history.rashStage : '수포성 병변';

  if (lesions.length === 0) {
    parts.push(locale === 'ko' ? `피부 소견: 특정 분절 미선택, ${stageText}.` : `Physical exam: ${stageText}.`);
  } else {
    const lesionDesc = lesions
      .map((l) => {
        const meta = DERMATOMES[l.dermatome];
        const sideKo = formatSideKo(l.side);
        return `${sideKo} ${l.dermatome} (${meta.labelKo.split(' (')[0]})`;
      })
      .join(', ');

    const bilateral = lesions.some((l) => l.side === 'Bilateral');
    const midlineNote = bilateral
      ? locale === 'ko' ? '정중선을 침범하여 양측성으로 분포.' : 'Bilateral distribution crossing midline.'
      : locale === 'ko' ? '신경절을 따라 편측성으로 분포하며 정중선(midline)을 넘지 않음.' : 'Unilateral dermatomal distribution, does not cross midline.';

    parts.push(
      locale === 'ko'
        ? `피부 소견: ${lesionDesc} 피부분절을 따라 ${stageText} 관찰됨. ${midlineNote}`
        : `Physical exam: ${lesionDesc} dermatomal pattern with ${stageText}. ${midlineNote}`
    );
  }

  // eGFR note if available
  if (history.egfr !== null) {
    parts.push(
      locale === 'ko'
        ? `신장 기능: eGFR ${history.egfr} mL/min/1.73m² ${history.egfr < 60 ? '(신기능 저하 상태)' : '(정상 범위)'}.`
        : `Renal panel: eGFR ${history.egfr} mL/min/1.73m².`
    );
  }

  return `[O]\n${parts.join(' ')}`;
}

function buildAssessment(
  history: History,
  lesions: LesionSelection[],
  referenceDate: Date,
  locale: 'ko' | 'en'
): string {
  const parts: string[] = [];

  // Determine ICD-10 Code and Primary Assessment
  let icdCode = 'B02.9';
  let primaryName = 'Herpes zoster without complications (합병증을 동반하지 않은 대상포진)';

  const hasV1 = lesions.some((l) => l.dermatome === 'V1');
  const uniqueDermatomes = new Set(lesions.map((l) => l.dermatome));

  if (hasV1 || history.ocularSymptoms || history.hutchinsonSign) {
    icdCode = 'B02.30';
    primaryName = 'Herpes zoster ophthalmicus (안부 대상포진)';
  } else if (history.hearingSymptoms || history.facialPalsy) {
    icdCode = 'B02.21';
    primaryName = 'Herpes zoster oticus / Ramsay Hunt syndrome (람세이 헌트 증후군 / 귀 대상포진)';
  } else if (uniqueDermatomes.size >= 3 || lesions.some((l) => l.side === 'Bilateral')) {
    icdCode = 'B02.7';
    primaryName = 'Disseminated herpes zoster (파종성 대상포진)';
  }

  const siteList = lesions.map((l) => `${l.side} ${l.dermatome}`).join(', ');
  const siteSuffix = siteList ? ` [${siteList}]` : '';

  parts.push(
    locale === 'ko'
      ? `1. ${primaryName}${siteSuffix} (${icdCode})`
      : `1. ${primaryName}${siteSuffix} (${icdCode})`
  );

  // Time window status
  if (history.onsetDate) {
    try {
      const onset = parseISO(history.onsetDate);
      const days = differenceInDays(referenceDate, onset);
      if (days <= 3) {
        parts.push(
          locale === 'ko'
            ? '  - 발병 72시간 이내 골든타임 내 내원: 즉각적인 항바이러스제 조기 치료를 통해 치유 촉진 및 PHN 예방 도모.'
            : '  - Presented within 72h window: prompt antiviral therapy indicated.'
        );
      } else {
        parts.push(
          locale === 'ko'
            ? `  - 발병 약 ${days}일 경과: 활성 수포 여부 확인 및 통증/신경염 집중 관리 필요.`
            : `  - Presented ${days} days after onset: focus on pain management and complication monitoring.`
        );
      }
    } catch {
      // ignore
    }
  }

  return `[A]\n${parts.join('\n')}`;
}

function buildPlan(
  history: History,
  lesions: LesionSelection[],
  treatments: RegimenSelection[],
  locale: 'ko' | 'en'
): string {
  const parts: string[] = [];

  // 1. Medication Orders
  if (treatments.length > 0) {
    const rxLines: string[] = [];
    treatments.forEach((tx, idx) => {
      const base = DRUG_REGIMENS[tx.drugId];
      if (!base) return;

      const adj = calculateAdjustedDose(tx.drugId, history.egfr);
      const dose = tx.doseOverride || adj.dose;
      const freq = tx.frequencyOverride || adj.frequency;
      const duration = tx.durationDays || adj.durationDays;

      const note = adj.isAdjusted ? ' [신기능 용량 조절됨]' : '';
      rxLines.push(`  ${idx + 1}) ${base.nameKo}: ${dose} ${freq} × ${duration}일${note}`);
    });

    if (rxLines.length > 0) {
      parts.push(locale === 'ko' ? '1. 처방 약제 (Rx):' : '1. Medications (Rx):');
      parts.push(...rxLines);
    }
  } else {
    parts.push(locale === 'ko' ? '1. 처방: 보존적 치료 및 경과 관찰.' : '1. Plan: Conservative management.');
  }

  // 2. Referrals / Red flag interventions
  const referrals: string[] = [];
  const hasV1 = lesions.some((l) => l.dermatome === 'V1');
  if (hasV1 || history.ocularSymptoms || history.hutchinsonSign) {
    referrals.push('안과(Ophthalmology) 당일 긴급 협진 의뢰 (각막/망막 침범 여부 평가).');
  }
  if (history.hearingSymptoms || history.facialPalsy) {
    referrals.push('이비인후과/신경과 협진 (안면신경 감압 및 전신 스테로이드 요법 협의).');
  }
  const uniqueDermatomes = new Set(lesions.map((l) => l.dermatome));
  if (uniqueDermatomes.size >= 3 || lesions.some((l) => l.side === 'Bilateral')) {
    referrals.push('내과 입원 격리 및 IV Acyclovir 전환 치료 권고.');
  }
  if (history.painNrs !== null && history.painNrs >= 7) {
    referrals.push('심한 급성 통증 지속 시 마취통증의학과 신경차단술(Nerve block) 의뢰 고려.');
  }

  if (referrals.length > 0) {
    parts.push(locale === 'ko' ? '\n2. 협진 및 특수 조치:' : '\n2. Referrals & Interventions:');
    referrals.forEach((r) => parts.push(`  - ${r}`));
  }

  // 3. Patient Education
  parts.push(locale === 'ko' ? '\n3. 환자 복약 지도 및 주의사항 안내:' : '\n3. Patient Education:');
  parts.push('  - 약물 복용을 임의로 중단하지 말고 7일 전량을 끝까지 복용하도록 설명함.');
  parts.push('  - 수포 부위를 긁거나 터뜨리지 말고 청결과 건조를 유지하도록 지도함.');
  parts.push('  - 수포 진물이 마르고 딱지가 앉을 때까지 영유아, 임산부, 면역저하자와의 접촉을 피하도록 감염 예방 교육.');
  parts.push('  - 시력 저하, 안통 충혈, 심한 두통, 목 경직, 의식 저하 등 위험 징후 발생 시 즉시 응급실 내원 안내.');
  parts.push('  - 급성기 완치 후 대상포진 재발 및 PHN 예방을 위해 유전자재조합 대상포진 백신(싱그릭스 2회) 접종 권고.');

  return `[P]\n${parts.join('\n')}`;
}

function formatSideKo(side: 'L' | 'R' | 'Bilateral'): string {
  switch (side) {
    case 'L':
      return '좌측(Left)';
    case 'R':
      return '우측(Right)';
    case 'Bilateral':
      return '양측(Bilateral)';
  }
}
