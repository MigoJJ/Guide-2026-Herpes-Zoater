import type { DrugRegimen, IvIndication } from './types';

export const REGIMEN_METADATA = {
  reviewedBy: 'Infectious Disease, Clinical Pharmacology & CDS Board',
  reviewedAt: '2026-10-26',
  sources: [
    'CDC/ACIP Guidelines for Prevention and Management of Herpes Zoster',
    'IDSA Clinical Practice Guidelines for Management of Herpes Zoster',
    'FDA Package Inserts: Valtrex (valacyclovir), Famvir (famciclovir), Zovirax (acyclovir)',
    'MFDS (식품의약품안전처) 의약품 허가사항: 팜비어정 250mg (famciclovir)',
    'FDA Drug Safety Communication (2019): Gabapentinoids & Opioid Respiratory Depression Warning',
    'Cockcroft-Gault Creatinine Clearance Estimation Standards',
  ],
  disclaimer:
    '본 처방 가이드는 보조 정보 제공을 목적으로 하며, 환자의 신기능(CrCl/eGFR), 체중, 동반 질환 및 약물 상호작용에 따른 최종 처방 및 용량 결정 책임은 처방의에게 있습니다.',
};

/**
 * Calculates Creatinine Clearance (CrCl) via Cockcroft-Gault Equation.
 * CrCl (mL/min) = [(140 - Age) * Weight(kg)] / [72 * SerumCr(mg/dL)] * (0.85 if Female)
 */
export function calculateCockcroftGault(
  age: number | null,
  sex: 'M' | 'F' | null,
  weightKg: number | null,
  serumCreatinine: number | null
): number | null {
  if (
    age === null ||
    sex === null ||
    weightKg === null ||
    serumCreatinine === null ||
    age <= 0 ||
    weightKg <= 0 ||
    serumCreatinine <= 0
  ) {
    return null;
  }

  const base = ((140 - age) * weightKg) / (72 * serumCreatinine);
  const crcl = sex === 'F' ? base * 0.85 : base;
  return Math.round(crcl * 10) / 10;
}

export const DRUG_REGIMENS: Record<string, DrugRegimen> = {
  valacyclovir: {
    id: 'valacyclovir',
    nameKo: '발라시클로버 (Valacyclovir 1g)',
    nameEn: 'Valacyclovir (Valtrex 1g)',
    category: 'antiviral_oral',
    standardDose: '1000 mg',
    standardFrequency: 'PO TID (하루 3회)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '신기능 정상 성인 표준 요법 (1000mg TID × 7일). 발병 72시간 이내 투여 시 최상의 효과.',
  },
  famciclovir: {
    id: 'famciclovir',
    nameKo: '팜시클로버 500mg (Famciclovir FDA 용량)',
    nameEn: 'Famciclovir 500mg (FDA Approved)',
    category: 'antiviral_oral',
    standardDose: '500 mg',
    standardFrequency: 'PO TID (하루 3회)',
    standardDurationDays: 7,
    route: 'PO',
    notes: 'FDA 표준 요법 (500mg TID × 7일). CrCl에 따라 500mg BID, 500mg QD로 감량.',
  },
  famvir_kr_250: {
    id: 'famvir_kr_250',
    nameKo: '팜비어 250mg (Famvir 국내 허가 용량)',
    nameEn: 'Famvir 250mg (Korean MFDS Approved)',
    category: 'antiviral_oral',
    standardDose: '250 mg',
    standardFrequency: 'PO TID (하루 3회)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '국내 허가 기준 (250mg TID × 7일). 신기능 감량 기준 단위가 mL/min/1.73m²로 eGFR 적용 가능.',
  },
  acyclovir_oral: {
    id: 'acyclovir_oral',
    nameKo: '아시클로버 경구 (Acyclovir Oral 800mg)',
    nameEn: 'Acyclovir Oral (Zovirax 800mg)',
    category: 'antiviral_oral',
    standardDose: '800 mg',
    standardFrequency: 'PO 5 times/day (하루 5회, 약 4시간 간격)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '하루 5회 복용(취침 시간 제외). CrCl ≤ 25 mL/min 시 800mg q8h 또는 q12h로 감량.',
  },
  acyclovir_iv: {
    id: 'acyclovir_iv',
    nameKo: '아시클로버 정맥주사 (Acyclovir IV 10mg/kg)',
    nameEn: 'Acyclovir IV (Zovirax IV)',
    category: 'antiviral_iv',
    standardDose: '10 mg/kg',
    standardFrequency: 'IV q8h (8시간마다 1시간 이상 점적)',
    standardDurationDays: 7,
    route: 'IV',
    notes: '면역저하자, 파종성, 중추신경계(수막뇌염), 급성망막괴사, 중증 안부 대상포진 입원 치료. 충분한 수액 공급 필수.',
  },
  foscarnet_iv: {
    id: 'foscarnet_iv',
    nameKo: '포스카넷 정맥주사 (Foscarnet IV)',
    nameEn: 'Foscarnet IV (Foscavir)',
    category: 'antiviral_iv',
    standardDose: '40-60 mg/kg',
    standardFrequency: 'IV q8h (1-2시간 점적 투여)',
    standardDurationDays: 14,
    route: 'IV',
    notes: '아시클로버 내성/치료 불응 시 2차 치료제. 신기능 감량 필수(mL/min/kg 기준), 전해질(Ca, Mg, K, P) 및 QT 연장 모니터링.',
  },
  pregabalin: {
    id: 'pregabalin',
    nameKo: '프레가발린 (Pregabalin)',
    nameEn: 'Pregabalin (Lyrica)',
    category: 'neuropathic_analgesic',
    standardDose: '75 mg/day',
    standardFrequency: 'PO BID (37.5mg BID 또는 25mg TID 분할)',
    standardDurationDays: 14,
    route: 'PO',
    notes: '급성기 신경병증성 통증 조절 (최대 300mg/day). 14일 투여 후 효과 재평가 및 점진적 감량(tapering) 필요.',
  },
  gabapentin: {
    id: 'gabapentin',
    nameKo: '가바펜틴 (Gabapentin)',
    nameEn: 'Gabapentin (Neurontin)',
    category: 'neuropathic_analgesic',
    standardDose: '300 mg',
    standardFrequency: 'PO QHS (취침 전 1회 시작, 300mg TID 적정)',
    standardDurationDays: 14,
    route: 'PO',
    notes: '급성기 신경병증성 통증 조절 (취침 전 300mg 시작, 신기능 저하시 최대 1400mg/day 분할 투여). 14일 후 재평가.',
  },
  tramadol_apap: {
    id: 'tramadol_apap',
    nameKo: '트라마돌/아세트아미노펜 (Tramadol 37.5mg / APAP 325mg)',
    nameEn: 'Tramadol 37.5mg / APAP 325mg',
    category: 'nsaid_analgesic',
    standardDose: '1 tab',
    standardFrequency: 'PO TID pc (또는 필요시 PRN, 최대 8정/일)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '급성기 중등도-중증 통증. 가바펜티노이드 병용 시 중추신경계/호흡 억제 주의 (FDA 2019 경고).',
  },
  nsaid_ibuprofen: {
    id: 'nsaid_ibuprofen',
    nameKo: '이부프로펜 (Ibuprofen 400mg)',
    nameEn: 'Ibuprofen 400mg',
    category: 'nsaid_analgesic',
    standardDose: '400 mg',
    standardFrequency: 'PO TID pc (하루 3회 식후)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '급성 염증 및 경증 통증 완화. 신기능 저하(CrCl/eGFR < 60) 시 신독성 위험으로 사용 주의(아세트아미노펜 대체 권고).',
  },
  calamine_lotion: {
    id: 'calamine_lotion',
    nameKo: '칼라민 로션 (Calamine Lotion)',
    nameEn: 'Calamine Topical Lotion',
    category: 'topical',
    standardDose: '적당량',
    standardFrequency: 'Topical BID-TID (하루 2-3회 도포)',
    standardDurationDays: 7,
    route: 'TOPICAL',
    notes: '수포 및 소양감 완화. 안구 주위 도포 금기.',
  },
  lidocaine_patch: {
    id: 'lidocaine_patch',
    nameKo: '리도카인 5% 패치 (Lidocaine 5% Patch)',
    nameEn: 'Lidocaine 5% Topical Patch',
    category: 'topical',
    standardDose: '1-3매',
    standardFrequency: 'Topical 12시간 부착 후 12시간 휴약 (하루 1회)',
    standardDurationDays: 14,
    route: 'TOPICAL',
    notes: '수포가 완전히 아물고 가피화된 후 국소 신경통에 사용 (개방성 수포 부착 금기).',
  },
};

export interface AdjustedRegimenResult {
  dose: string;
  frequency: string;
  durationDays: number;
  isAdjusted: boolean;
  renalMetricUsed: 'CrCl' | 'eGFR' | 'Standard';
  renalWarning?: string;
  weightAdjustedMg?: number;
}

export interface RenalContext {
  crcl: number | null;
  egfr: number | null;
  weightKg?: number | null;
  age?: number | null;
  ivIndication?: IvIndication;
}

export function calculateAdjustedDose(
  drugId: string,
  renalContext: RenalContext | number | null
): AdjustedRegimenResult {
  // Backwards compatibility if passed just a number (eGFR/CrCl)
  const ctx: RenalContext =
    typeof renalContext === 'number' || renalContext === null
      ? { crcl: null, egfr: renalContext }
      : renalContext;

  const drug = DRUG_REGIMENS[drugId];
  if (!drug) {
    return {
      dose: '미정',
      frequency: '미정',
      durationDays: 7,
      isAdjusted: false,
      renalMetricUsed: 'Standard',
    };
  }

  // Priority metric: CrCl for US FDA drugs; eGFR for domestic Korean Famvir 250mg
  const usesEgfrFirst = drugId === 'famvir_kr_250';
  const primaryRenalValue = usesEgfrFirst
    ? ctx.egfr ?? ctx.crcl
    : ctx.crcl ?? ctx.egfr;
  const metricName: 'CrCl' | 'eGFR' | 'Standard' =
    primaryRenalValue === null
      ? 'Standard'
      : usesEgfrFirst && ctx.egfr !== null
        ? 'eGFR'
        : ctx.crcl !== null
          ? 'CrCl'
          : 'eGFR';

  // 1. Valacyclovir (Valtrex)
  if (drugId === 'valacyclovir') {
    if (primaryRenalValue === null || primaryRenalValue >= 50) {
      const nearThreshold =
        primaryRenalValue !== null &&
        primaryRenalValue >= 50 &&
        primaryRenalValue <= 59;
      return {
        dose: '1000 mg',
        frequency: 'PO TID (하루 3회)',
        durationDays: 7,
        isAdjusted: false,
        renalMetricUsed: metricName,
        renalWarning:
          nearThreshold || (ctx.age !== null && ctx.age !== undefined && ctx.age >= 65)
            ? `신기능 수치(${metricName} ${primaryRenalValue} mL/min)가 감량 기준(50)에 근접하거나 고령자이므로 신경독성(섬망, 환각, 혼돈) 모니터링이 필요합니다.`
            : undefined,
      };
    } else if (primaryRenalValue >= 30) {
      return {
        dose: '1000 mg',
        frequency: 'PO BID (하루 2회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (30~49): 표준 TID → 감량 1000mg BID 권장.`,
      };
    } else if (primaryRenalValue >= 10) {
      return {
        dose: '1000 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (10~29): 표준 TID → 감량 1000mg QD 권장.`,
      };
    } else {
      return {
        dose: '500 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<10, 말기): 표준 TID → 감량 500mg QD 권장.`,
      };
    }
  }

  // 2. Famciclovir 500mg (FDA Approved)
  if (drugId === 'famciclovir') {
    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: '500 mg',
        frequency: 'PO TID (하루 3회)',
        durationDays: 7,
        isAdjusted: false,
        renalMetricUsed: metricName,
      };
    } else if (primaryRenalValue >= 40) {
      return {
        dose: '500 mg',
        frequency: 'PO BID (하루 2회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (40~59): 표준 TID → 감량 500mg BID 권장.`,
      };
    } else if (primaryRenalValue >= 20) {
      return {
        dose: '500 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (20~39): 표준 TID → 감량 500mg QD 권장.`,
      };
    } else {
      return {
        dose: '250 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<20): 표준 TID → 감량 250mg QD 권장.`,
      };
    }
  }

  // 3. Famvir 250mg (Korean MFDS Approved)
  if (drugId === 'famvir_kr_250') {
    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: '250 mg',
        frequency: 'PO TID (하루 3회)',
        durationDays: 7,
        isAdjusted: false,
        renalMetricUsed: metricName,
      };
    } else if (primaryRenalValue >= 30) {
      return {
        dose: '250 mg',
        frequency: 'PO BID (하루 2회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (30~59): 표준 TID → 감량 250mg BID 권장.`,
      };
    } else if (primaryRenalValue >= 10) {
      return {
        dose: '250 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (10~29): 표준 TID → 감량 250mg QD 권장.`,
      };
    } else {
      return {
        dose: '250 mg',
        frequency: '혈액투석 직후 단회 투여',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (혈액투석): 250mg을 투석 직후 단회 투여.`,
      };
    }
  }

  // 4. Acyclovir Oral (Zovirax 800mg)
  if (drugId === 'acyclovir_oral') {
    if (primaryRenalValue === null || primaryRenalValue > 25) {
      return {
        dose: '800 mg',
        frequency: 'PO 5 times/day (하루 5회)',
        durationDays: 7,
        isAdjusted: false,
        renalMetricUsed: metricName,
      };
    } else if (primaryRenalValue >= 10) {
      return {
        dose: '800 mg',
        frequency: 'PO q8h (TID, 하루 3회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (10~25): 표준 5회 → 감량 800mg q8h(TID) 권장.`,
      };
    } else {
      return {
        dose: '800 mg',
        frequency: 'PO q12h (BID, 하루 2회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<10): 표준 5회 → 감량 800mg q12h(BID) 권장.`,
      };
    }
  }

  // 5. Acyclovir IV
  if (drugId === 'acyclovir_iv') {
    const weight = ctx.weightKg && ctx.weightKg > 0 ? ctx.weightKg : 60; // Default 60kg if not entered
    const calculatedMg = Math.round(weight * 10);

    // Duration based on indication
    let defaultDuration = 7;
    let indicationNote = '';
    if (ctx.ivIndication === 'cns_involvement') {
      defaultDuration = 14;
      indicationNote = '중추신경계 침범: 10~15 mg/kg × 10~14일';
    } else if (ctx.ivIndication === 'acute_retinal_necrosis') {
      defaultDuration = 14;
      indicationNote = '급성망막괴사(ARN): 10~15 mg/kg × 10~14일 후 경구 수주간 유지';
    } else if (ctx.ivIndication === 'disseminated_immunocompromised') {
      defaultDuration = 7;
      indicationNote = '면역저하/파종성: 7~10일 투여 후 경구 전환';
    }

    if (primaryRenalValue === null || primaryRenalValue > 50) {
      return {
        dose: `${calculatedMg} mg (10 mg/kg)`,
        frequency: 'IV q8h (1시간 이상 점적)',
        durationDays: defaultDuration,
        isAdjusted: false,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
        renalWarning: indicationNote || undefined,
      };
    } else if (primaryRenalValue >= 25) {
      return {
        dose: `${calculatedMg} mg (10 mg/kg)`,
        frequency: 'IV q12h (12시간마다 점적)',
        durationDays: defaultDuration,
        isAdjusted: true,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (25~50): 아시클로버 IV 간격을 q12h로 연장 권장. ${indicationNote}`,
      };
    } else if (primaryRenalValue >= 10) {
      return {
        dose: `${calculatedMg} mg (10 mg/kg)`,
        frequency: 'IV q24h (24시간마다 점적)',
        durationDays: defaultDuration,
        isAdjusted: true,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (10~24): 아시클로버 IV 간격을 q24h로 연장 권장. ${indicationNote}`,
      };
    } else {
      const halvedMg = Math.round(weight * 5);
      return {
        dose: `${halvedMg} mg (5 mg/kg)`,
        frequency: 'IV q24h (24시간마다 점적)',
        durationDays: defaultDuration,
        isAdjusted: true,
        renalMetricUsed: metricName,
        weightAdjustedMg: halvedMg,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<10): 용량 5mg/kg q24h로 감량 권장. ${indicationNote}`,
      };
    }
  }

  // 6. Foscarnet IV
  if (drugId === 'foscarnet_iv') {
    const weight = ctx.weightKg && ctx.weightKg > 0 ? ctx.weightKg : 60;
    const calculatedMg = Math.round(weight * 40);

    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: `${calculatedMg} mg (40 mg/kg)`,
        frequency: 'IV q8h (1-2시간 점적)',
        durationDays: 14,
        isAdjusted: false,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
      };
    } else {
      return {
        dose: `${calculatedMg} mg`,
        frequency: '원내 약제부 신기능 환산 협진 필수',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min: 포스카넷은 mL/min/kg 단위의 복잡한 감량표가 적용되므로 약제부 임상 협진을 의뢰하십시오. 전해질(칼슘, 마그네슘, 칼륨, 인) 및 QT 연장 모니터링 필수.`,
      };
    }
  }

  // 7. Pregabalin (Lyrica)
  if (drugId === 'pregabalin') {
    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: '75 mg/day',
        frequency: 'PO BID (37.5mg BID 또는 25mg TID)',
        durationDays: 14,
        isAdjusted: false,
        renalMetricUsed: metricName,
      };
    } else if (primaryRenalValue >= 30) {
      return {
        dose: '75 mg/day',
        frequency: 'PO QD at bedtime (또는 37.5mg BID)',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (30~59): 프레가발린 초기 75mg QD(취침 전) 또는 37.5mg BID 분할 권장. (최대 300mg/day)`,
      };
    } else if (primaryRenalValue >= 15) {
      return {
        dose: '25-50 mg/day',
        frequency: 'PO QD at bedtime',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (15~29): 프레가발린 25~50mg QD 감량 권장.`,
      };
    } else {
      return {
        dose: '25 mg',
        frequency: 'PO QD (투석 후 단회)',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<15): 프레가발린 25mg QD 감량 권장.`,
      };
    }
  }

  // 8. Gabapentin (Neurontin)
  if (drugId === 'gabapentin') {
    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: '300 mg',
        frequency: 'PO QHS (취침 전 1회 시작, 300mg TID 증량)',
        durationDays: 14,
        isAdjusted: false,
        renalMetricUsed: metricName,
      };
    } else if (primaryRenalValue >= 30) {
      return {
        dose: '200-700 mg/day',
        frequency: 'PO BID (나눠 투여, 초기 300mg QHS 시작)',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (30~59): 가바펜틴 초기 300mg QHS로 시작, 증량 시 최대 1400mg/day(BID 분할) 상한 준수.`,
      };
    } else if (primaryRenalValue >= 15) {
      return {
        dose: '200-700 mg/day',
        frequency: 'PO QD (하루 1회)',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (15~29): 가바펜틴 하루 최대 700mg QD 상한 준수.`,
      };
    } else {
      return {
        dose: '100-300 mg',
        frequency: '투석 후 단회 투여',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<15): 투석 직후 100~300mg 단회 투여.`,
      };
    }
  }

  // 9. Tramadol / APAP
  if (drugId === 'tramadol_apap') {
    if (primaryRenalValue !== null && primaryRenalValue < 30) {
      return {
        dose: '1 tab',
        frequency: 'PO q12h (하루 최대 4정)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<30): 트라마돌/APAP 투여 간격 12시간으로 연장 및 하루 최대 4정 제한.`,
      };
    }
    return {
      dose: '1 tab',
      frequency: 'PO TID pc 또는 PRN (필요시, 최대 8정/일)',
      durationDays: 7,
      isAdjusted: false,
      renalMetricUsed: metricName,
    };
  }

  // 10. NSAID (Ibuprofen)
  if (drugId === 'nsaid_ibuprofen') {
    if (primaryRenalValue !== null && primaryRenalValue < 60) {
      return {
        dose: '400 mg',
        frequency: 'PO TID pc',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min: 신기능 저하 환자에서 NSAID 사용은 급성 신손상(AKI) 위험이 높으므로 아세트아미노펜 단독 제제 대체 권고.`,
      };
    }
  }

  return {
    dose: drug.standardDose,
    frequency: drug.standardFrequency,
    durationDays: drug.standardDurationDays,
    isAdjusted: false,
    renalMetricUsed: metricName,
  };
}
