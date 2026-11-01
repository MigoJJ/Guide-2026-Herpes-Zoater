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

  // Check if encounter is completely empty
  const hasHistoryData =
    history.onsetDate !== null ||
    history.rashStage !== null ||
    history.painNrs !== null ||
    history.prodrome.length > 0 ||
    history.riskFactors.length > 0 ||
    history.age !== null ||
    history.sex !== null ||
    history.weightKg !== null ||
    history.serumCreatinine !== null ||
    history.egfr !== null ||
    history.crcl !== null ||
    history.newVesiclesEmerging ||
    history.ocularSymptoms ||
    history.hutchinsonSign ||
    history.hearingSymptoms ||
    history.facialPalsy;

  const hasAnyData = hasHistoryData || lesions.length > 0 || treatments.length > 0;
  if (!hasAnyData) {
    return '';
  }

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

  // Patient Demographic summary
  const demoParts: string[] = [];
  if (history.age !== null) demoParts.push(`${history.age}세`);
  if (history.sex !== null) demoParts.push(history.sex === 'M' ? '남성' : '여성');
  if (history.weightKg !== null) demoParts.push(`${history.weightKg}kg`);
  const demoPrefix = demoParts.length > 0 ? `[환자: ${demoParts.join('/')}] ` : '';

  // 1. Onset & Duration
  if (history.onsetDate) {
    try {
      const onset = parseISO(history.onsetDate);
      const days = differenceInDays(referenceDate, onset);
      const daysText = days === 0 ? '당일' : `${days}일 전`;

      if (locale === 'ko') {
        const sites = lesions.map((l) => `${formatSideKo(l.side)} ${l.dermatome}`).join(', ');
        const siteStr = sites ? `${sites} 부위 ` : '';
        const vesicleNote = history.newVesiclesEmerging ? ' (새로운 수포 지속 형성 중)' : '';
        parts.push(
          `${demoPrefix}${daysText}(${history.onsetDate}) 발현된 ${siteStr}피부 병변 및 통증을 주소로 내원${vesicleNote}.`
        );
      } else {
        const sites = lesions.map((l) => `${l.side} ${l.dermatome}`).join(', ');
        parts.push(
          `${demoPrefix}Patient presents with painful lesions on ${sites || 'skin'}, onset ${days} days ago (${history.onsetDate}).`
        );
      }
    } catch {
      parts.push(locale === 'ko' ? `발병일: ${history.onsetDate}` : `Onset date: ${history.onsetDate}`);
    }
  } else if (lesions.length > 0 || history.painNrs !== null || history.prodrome.length > 0) {
    parts.push(locale === 'ko' ? `${demoPrefix}수일 전 발현된 피부 병변 및 통증으로 내원.` : 'Presents with skin rash and pain.');
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
        ? `동반 특수 징후: ${special.join(', ')}.`
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

  if (parts.length === 0) return '';
  return `[S]\n${parts.join(' ')}`;
}

function buildObjective(
  history: History,
  lesions: LesionSelection[],
  locale: 'ko' | 'en'
): string {
  const parts: string[] = [];

  // Stage description (only when rashStage is selected by the doctor)
  const stageKoMap: Record<string, string> = {
    erythema: '초기 홍반 및 구진(Erythematous papules)',
    vesicular: '군집성 수포(Clustered vesicles on erythematous base)',
    pustular: '농포 형성(Pustules)',
    crusted: '가피 형성기(Crusted lesions)',
  };

  const stageText = history.rashStage ? stageKoMap[history.rashStage] || history.rashStage : null;

  if (lesions.length > 0) {
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

    if (stageText) {
      parts.push(
        locale === 'ko'
          ? `피부 소견: ${lesionDesc} 피부분절을 따라 ${stageText} 관찰됨. ${midlineNote}`
          : `Physical exam: ${lesionDesc} dermatomal pattern with ${stageText}. ${midlineNote}`
      );
    } else {
      parts.push(
        locale === 'ko'
          ? `피부 소견: ${lesionDesc} 피부분절에 병변 관찰됨. ${midlineNote}`
          : `Physical exam: ${lesionDesc} dermatomal pattern lesions observed. ${midlineNote}`
      );
    }
  } else if (stageText) {
    parts.push(
      locale === 'ko'
        ? `피부 소견: ${stageText} 관찰됨 (피부분절 미선택).`
        : `Physical exam: ${stageText} observed (dermatome unspecified).`
    );
  }

  // Renal function panel (CrCl vs eGFR)
  const renalItems: string[] = [];
  if (history.crcl !== null) {
    renalItems.push(`CrCl(Cockcroft-Gault): ${history.crcl} mL/min`);
  }
  if (history.egfr !== null) {
    renalItems.push(`eGFR: ${history.egfr} mL/min/1.73m²`);
  }
  if (history.serumCreatinine !== null) {
    renalItems.push(`sCr: ${history.serumCreatinine} mg/dL`);
  }

  if (renalItems.length > 0) {
    const isImpaired = (history.crcl !== null && history.crcl < 60) || (history.egfr !== null && history.egfr < 60);
    const statusNote = isImpaired ? ' (신기능 저하 상태, 약제별 감량 기준 적용)' : ' (신기능 정상 범위)';
    parts.push(
      locale === 'ko'
        ? `신장 기능 평가: ${renalItems.join(', ')}${statusNote}.`
        : `Renal panel: ${renalItems.join(', ')}.`
    );
  }

  if (parts.length === 0) return '';
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

  parts.push(`1. ${primaryName}${siteSuffix} (${icdCode})`);

  // Time window status & Golden Time Exception
  if (history.onsetDate) {
    try {
      const onset = parseISO(history.onsetDate);
      const days = differenceInDays(referenceDate, onset);

      if (days <= 3) {
        parts.push(
          locale === 'ko'
            ? '  - 발병 72시간 이내 골든타임 내원: 조기 항바이러스제 치료를 통해 병변 치유 촉진 및 급성 신경염 통증 조절.'
            : '  - Presented within 72h window: prompt antiviral therapy indicated.'
        );
      } else {
        const exceptionReasons: string[] = [];
        if (history.newVesiclesEmerging) exceptionReasons.push('새로운 수포 지속 형성');
        if (hasV1 || history.hutchinsonSign || history.ocularSymptoms) exceptionReasons.push('안부 침범');
        if (history.riskFactors.includes('immunocompromised')) exceptionReasons.push('면역저하자');
        if ((history.age !== null && history.age >= 50) || history.riskFactors.includes('age_ge_50')) exceptionReasons.push('50세 이상 고령');
        if (history.painNrs !== null && history.painNrs >= 7) exceptionReasons.push('중증 통증(NRS≥7)');

        if (exceptionReasons.length > 0) {
          parts.push(
            locale === 'ko'
              ? `  - 발병 ${days}일 경과하였으나 [${exceptionReasons.join(', ')}] 예외 적응증에 해당하여 적극적 항바이러스 요법 개시.`
              : `  - Presented ${days} days after onset, but antiviral therapy indicated due to: ${exceptionReasons.join(', ')}.`
          );
        } else {
          parts.push(
            locale === 'ko'
              ? `  - 발병 약 ${days}일 경과: 급성기 신경통 조절 및 합병증 모니터링 중심 관리.`
              : `  - Presented ${days} days after onset: focus on pain management and complication monitoring.`
          );
        }
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

      const adj = calculateAdjustedDose(tx.drugId, {
        crcl: history.crcl,
        egfr: history.egfr,
        weightKg: history.weightKg,
        age: history.age,
        ivIndication: tx.ivIndication,
      });

      const dose = tx.doseOverride || adj.dose;
      const freq = tx.frequencyOverride || adj.frequency;
      const duration = tx.durationDays || adj.durationDays;
      const prnText = tx.isPrn ? ' (필요시 PRN)' : '';

      const note = adj.isAdjusted
        ? ` [${adj.renalMetricUsed} 기준 용량 감량됨]`
        : adj.renalWarning && tx.drugId === 'nsaid_ibuprofen'
          ? ' [신기능 주의: 신독성 위험]'
          : '';
      rxLines.push(`  ${idx + 1}) ${base.nameKo}: ${dose} ${freq}${prnText} × ${duration}일${note}`);
    });

    if (rxLines.length > 0) {
      parts.push(locale === 'ko' ? '1. 처방 약제 (Rx):' : '1. Medications (Rx):');
      parts.push(...rxLines);
    }
  } else {
    parts.push(locale === 'ko' ? '1. 처방 약제: 미선택 (처방 선택 대기 또는 보존적 치료)' : '1. Medications: None selected.');
  }

  // 2. Referrals / Red flag interventions
  const referrals: string[] = [];
  const hasV1 = lesions.some((l) => l.dermatome === 'V1');
  if (hasV1 || history.ocularSymptoms || history.hutchinsonSign) {
    referrals.push('안과(Ophthalmology) 당일 즉시 응급 협진 의뢰 (각막염, 포도막염, 망막괴사 배제).');
  }
  if (history.hearingSymptoms || history.facialPalsy) {
    referrals.push('이비인후과/신경과 협진 (안면신경 감압 및 고용량 스테로이드 병용 요법 협의).');
  }
  const uniqueDermatomes = new Set(lesions.map((l) => l.dermatome));
  if (uniqueDermatomes.size >= 3 || lesions.some((l) => l.side === 'Bilateral')) {
    referrals.push('내과 입원(공기/접촉 격리 병실) 및 정맥주사(IV Acyclovir 10 mg/kg q8h) 치료.');
  }
  if (history.painNrs !== null && history.painNrs >= 7) {
    referrals.push('심한 급성 통증 지속 시 마취통증의학과 신경차단술(Nerve block) 의뢰 고려.');
  }

  if (referrals.length > 0) {
    parts.push(locale === 'ko' ? '\n2. 협진 및 특수 조치:' : '\n2. Referrals & Interventions:');
    referrals.forEach((r) => parts.push(`  - ${r}`));
  }

  // 3. Clinical Guidelines & Patient Education
  parts.push(locale === 'ko' ? '\n3. 임상 관리 지침 및 복약 지도:' : '\n3. Patient Education:');

  const antiviralTx = treatments.find((t) =>
    ['valacyclovir', 'famciclovir', 'famvir_kr_250', 'acyclovir_oral', 'acyclovir_iv', 'foscarnet_iv'].includes(
      t.drugId
    )
  );
  if (antiviralTx) {
    const base = DRUG_REGIMENS[antiviralTx.drugId];
    const adj = calculateAdjustedDose(antiviralTx.drugId, {
      crcl: history.crcl,
      egfr: history.egfr,
      weightKg: history.weightKg,
      age: history.age,
      ivIndication: antiviralTx.ivIndication,
    });
    const antiviralDays = antiviralTx.durationDays || adj.durationDays || base?.standardDurationDays || 7;
    parts.push(`  - 항바이러스제는 임의 중단 없이 처방된 전 기간(${antiviralDays}일 전량)을 규칙적으로 끝까지 복용하도록 설명함.`);
  }

  if (history.riskFactors.includes('immunocompromised')) {
    parts.push('  - [면역저하자] 모든 병변이 완전히 가피(딱지)화될 때까지 항바이러스제 치료 기간을 연장하여 지속 투여함.');
  }

  const hasGabapentinoid = treatments.some((t) => ['pregabalin', 'gabapentin'].includes(t.drugId));
  if (hasGabapentinoid) {
    parts.push('  - [신경통 조절제] 14일 투여 후 급성 통증 완화 정도를 재평가하며, 투약 중단 시 금단 증상 예방을 위해 점진적 감량(Tapering)을 진행함.');
  }

  const hasTramadol = treatments.some((t) => t.drugId === 'tramadol_apap');
  if (hasTramadol && hasGabapentinoid) {
    parts.push('  - [병용 주의] 트라마돌과 신경통 조절제 병용 시 졸림 및 호흡 억제 가능성에 대해 환자 및 보호자에게 교육함.');
  }

  parts.push('  - 수포 부위를 긁거나 터뜨리지 말고 청결과 건조를 유지하며, 이차 세균 감염 예방 지도.');
  parts.push('  - 모든 수포가 마르고 가피가 앉을 때까지 영유아, 임산부, 수두 미감염자 접촉 금지.');
  parts.push('  - 시력 저하, 안통 충혈, 극심한 두통, 목 경직, 의식 저하 등 위험 징후 발생 시 즉시 응급실 내원 안내.');
  parts.push('  - 급성기 호전 후 대상포진 재발 및 만성 신경통(PHN) 예방을 위해 유전자재조합 대상포진 백신(싱그릭스 2회 접종, 2~6개월 간격) 접종 강력 권고.');

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
