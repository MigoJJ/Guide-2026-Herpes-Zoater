import { differenceInDays, parseISO } from 'date-fns';
import type { DrugRegimen, IvIndication } from './types';

export const REGIMEN_METADATA = {
  reviewedBy: 'JAE JOON KOH, MD (GDS Internal Medicine Clinic) & Clinical Advisory Board',
  reviewedAt: '2026-11-02',
  regulatoryPosition:
    '본 소프트웨어는 미국 21st Century Cures Act § 3060(FDA Non-Device Clinical Decision Support Guidance) 및 대한민국 식품의약품안전처 의료기기 품목 및 임상 소프트웨어 기준에 따른 "비의료기기(Non-Device CDS) 임상 의사결정 지원 및 문서작성 보조" 시스템입니다.',
  editorialIndependence:
    '본 시스템의 모든 권고 내용, 컷오프 구간, 감량 알고리즘 및 안전성 알림 로직은 원장(독립 의학 자문단)의 임상적 판단에 따라 독자적으로 결정되며, 외부 제약사 및 후원사는 어떠한 권고 내용에도 관여하지 않습니다.',
  genericPrescribingPolicy:
    '모든 의약품 권고는 특정 상표명이 아닌 공인 성분명(Generic name) 및 공식 가이드라인 표준을 우선으로 표기합니다.',
  sponsorshipDisclosure:
    '현재 본 시스템은 어떠한 상업적 후원도 받지 않고 독립적으로 운영되고 있으며, 향후 학술 지원 발생 시 화면에 스폰서십 내역을 100% 투명하게 공시합니다.',
  sources: [
    'CDC/ACIP Guidelines for Prevention and Management of Herpes Zoster',
    'IDSA Clinical Practice Guidelines for Management of Herpes Zoster',
    'FDA Package Inserts: Valtrex (valacyclovir), Famvir (famciclovir), Zovirax (acyclovir)',
    'MFDS (식품의약품안전처) 의약품 허가사항: 팜비어정 250mg (famciclovir)',
    'FDA Drug Safety Communication (2019): Gabapentinoids & Opioid Respiratory Depression Warning',
    'Cockcroft-Gault Creatinine Clearance Estimation Standards',
    'UpToDate: Treatment of herpes zoster - Corticosteroids in acute herpes zoster (Grade 2C)',
    'NICE CKS: Shingles - Oral Corticosteroids for severe acute pain',
    'Cochrane Systematic Review (2023): Corticosteroids for preventing postherpetic neuralgia',
  ],
  disclaimer:
    '본 시스템은 독립적인 임상 판단을 보조하는 비의료기기 CDS 도구입니다. 최종 처방 및 치료 결정의 책임은 면허를 소지한 처방의에게 있습니다.',
};

/**
 * Normalizes weight to kilograms (1 lb = 0.45359237 kg)
 */
export function convertWeightToKg(value: number | null, unit: 'kg' | 'lb'): number | null {
  if (value === null || value <= 0) return null;
  if (unit === 'lb') {
    return Math.round(value * 0.45359237 * 10) / 10;
  }
  return Math.round(value * 10) / 10;
}

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

/**
 * Returns formatted Cockcroft-Gault formula substitution for transparent CDS independent review
 */
export function getCockcroftGaultFormulaString(
  age: number | null,
  sex: 'M' | 'F' | null,
  weightKg: number | null,
  serumCreatinine: number | null
): string | null {
  if (!age || !sex || !weightKg || !serumCreatinine || serumCreatinine <= 0) {
    return null;
  }
  const crcl = calculateCockcroftGault(age, sex, weightKg, serumCreatinine);
  const sexFactor = sex === 'F' ? ' × 0.85 (여성 보정)' : ' × 1.0 (남성)';
  return `[(140 - ${age}) × ${weightKg}kg] / [72 × ${serumCreatinine}mg/dL]${sexFactor} = ${crcl} mL/min`;
}

/**
 * Checks if a lab date is stale (> 30 days) and provides clinical reminder
 */
export function getStaleLabWarning(
  dateString: string | null,
  referenceDate = new Date()
): string | null {
  if (!dateString) return null;
  try {
    const labDate = parseISO(dateString);
    const days = differenceInDays(referenceDate, labDate);
    if (days > 30) {
      const months = Math.floor(days / 30);
      return `검사일: ${dateString} (${days}일 전 - 약 ${months}개월 전 수치, 급성기 신기능 재확인 권장)`;
    }
  } catch {
    // ignore
  }
  return null;
}

export const DRUG_REGIMENS: Record<string, DrugRegimen> = {
  valacyclovir: {
    id: 'valacyclovir',
    nameKo: '발라시클로버 (Valacyclovir 1000mg)',
    nameEn: 'Valacyclovir (Valtrex 1000mg)',
    category: 'antiviral_oral',
    standardDose: '1000 mg',
    standardFrequency: 'PO TID (하루 3회)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '표준 1000mg TID × 7일 (발병 72시간 이내 투여 시 최상의 효과). CrCl 50 미만 시 감량.',
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
    nameKo: '팜시클로버 250mg (Famciclovir 국내 허가 용량)',
    nameEn: 'Famciclovir 250mg (Korean MFDS Approved)',
    category: 'antiviral_oral',
    standardDose: '250 mg',
    standardFrequency: 'PO TID (하루 3회)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '국내 허가 기준 (250mg TID × 7일). 신기능 감량 기준 단위가 mL/min/1.73m²로 eGFR 적용 가능.',
  },
  acyclovir_oral: {
    id: 'acyclovir_oral',
    nameKo: '아시클로버 800mg 경구 (Acyclovir Oral 800mg)',
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
    nameKo: '아시클로버 주사 10mg/kg (Acyclovir IV 10mg/kg)',
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
    nameKo: '포스카넷 주사 (Foscarnet IV)',
    nameEn: 'Foscarnet IV (Foscavir)',
    category: 'antiviral_iv',
    standardDose: '40-60 mg/kg',
    standardFrequency: 'IV q8h (1-2시간 점적 투여)',
    standardDurationDays: 14,
    route: 'IV',
    notes: '아시클로버 내성/치료 불응 시 2차 치료제. 신기능 감량 필수(mL/min/kg 기준), 전해질(Ca, Mg, K, P) 및 QT 연장 모니터링.',
  },
  steroid_prednisolone: {
    id: 'steroid_prednisolone',
    nameKo: '프레드니솔론 경구 (Prednisolone 50mg → 감량)',
    nameEn: 'Prednisolone Oral (Glucocorticoid 50mg/d Tapering)',
    category: 'steroid',
    standardDose: '50 mg → 감량',
    standardFrequency: 'PO QD 아침 식후 (1주차 50mg → 2주차 25mg 후 중단)',
    standardDurationDays: 14,
    route: 'PO',
    notes: '일상적 권장 안 됨. Ramsay Hunt 증후군(안면마비) 또는 면역정상인의 극심한 급성 통증 시 항바이러스제와 병용하여 1~2주 단기 사용. (면역저하자/파종성/단독투여 금기, PHN 예방 효과 없음).',
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
  // Non-device CDS: Transparent Clinical Calculation Basis
  calculationBasis?: string;
  appliedTier?: string;
  guidelineSource?: string;
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
    const guideline = 'FDA Valtrex Label / CDC / IDSA Guidelines';
    if (primaryRenalValue === null || primaryRenalValue >= 50) {
      const nearThreshold =
        primaryRenalValue !== null &&
        primaryRenalValue >= 50 &&
        primaryRenalValue <= 59;

      let warning: string | undefined = undefined;
      if (nearThreshold) {
        warning = `신기능 수치(${metricName} ${primaryRenalValue} mL/min)가 감량 기준(50)에 근접하므로 신경독성(섬망, 환각, 혼돈) 모니터링이 필요합니다.`;
      } else if (ctx.age !== null && ctx.age !== undefined && ctx.age >= 65) {
        warning =
          primaryRenalValue !== null
            ? `고령자(${ctx.age}세, ${metricName} ${primaryRenalValue} mL/min)이므로 발라시클로버 신경독성(섬망, 환각) 모니터링이 필요합니다.`
            : `고령자(${ctx.age}세)이므로 신기능(CrCl/eGFR) 확인 및 발라시클로버 신경독성(섬망, 환각) 모니터링이 필요합니다.`;
      }

      return {
        dose: '1000 mg',
        frequency: 'PO TID (하루 3회)',
        durationDays: 7,
        isAdjusted: false,
        renalMetricUsed: metricName,
        renalWarning: warning,
        calculationBasis: primaryRenalValue ? `${metricName} ${primaryRenalValue} mL/min ≥ 50` : '표준 용량',
        appliedTier: 'CrCl ≥ 50 mL/min: 표준 1000 mg TID',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 30) {
      return {
        dose: '1000 mg',
        frequency: 'PO BID (하루 2회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (30~49): 표준 TID → 감량 1000mg BID 권장.`,
        calculationBasis: `${metricName} ${primaryRenalValue} mL/min (구간: 30~49)`,
        appliedTier: 'CrCl 30–49 mL/min: 감량 1000 mg BID',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 10) {
      return {
        dose: '1000 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (10~29): 표준 TID → 감량 1000mg QD 권장.`,
        calculationBasis: `${metricName} ${primaryRenalValue} mL/min (구간: 10~29)`,
        appliedTier: 'CrCl 10–29 mL/min: 감량 1000 mg QD',
        guidelineSource: guideline,
      };
    } else {
      return {
        dose: '500 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<10): 500mg QD로 감량 권장 (혈액투석 환자는 투석 후 투여).`,
        calculationBasis: `${metricName} ${primaryRenalValue} mL/min (구간: <10, ESRD)`,
        appliedTier: 'CrCl < 10 mL/min: 감량 500 mg QD',
        guidelineSource: guideline,
      };
    }
  }

  // 2. Famciclovir 500mg (FDA Approved)
  if (drugId === 'famciclovir') {
    const guideline = 'FDA Famvir Label (500mg TID baseline)';
    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: '500 mg',
        frequency: 'PO TID (하루 3회)',
        durationDays: 7,
        isAdjusted: false,
        renalMetricUsed: metricName,
        appliedTier: 'CrCl ≥ 60 mL/min: 표준 500 mg TID',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 40) {
      return {
        dose: '500 mg',
        frequency: 'PO BID (하루 2회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (40~59): 표준 TID → 감량 500mg BID 권장.`,
        appliedTier: 'CrCl 40–59 mL/min: 감량 500 mg BID',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 20) {
      return {
        dose: '500 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (20~39): 표준 TID → 감량 500mg QD 권장.`,
        appliedTier: 'CrCl 20–39 mL/min: 감량 500 mg QD',
        guidelineSource: guideline,
      };
    } else {
      return {
        dose: '250 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<20): 표준 TID → 감량 250mg QD 권장.`,
        appliedTier: 'CrCl < 20 mL/min: 감량 250 mg QD',
        guidelineSource: guideline,
      };
    }
  }

  // 3. Famvir 250mg (Korean MFDS Approved)
  if (drugId === 'famvir_kr_250') {
    const guideline = '식품의약품안전처 팜비어정 250mg 허가사항';
    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: '250 mg',
        frequency: 'PO TID (하루 3회)',
        durationDays: 7,
        isAdjusted: false,
        renalMetricUsed: metricName,
        appliedTier: 'eGFR/CrCl ≥ 60 mL/min: 표준 250 mg TID',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 30) {
      return {
        dose: '250 mg',
        frequency: 'PO BID (하루 2회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (30~59): 표준 TID → 감량 250mg BID 권장.`,
        appliedTier: 'eGFR/CrCl 30–59 mL/min: 감량 250 mg BID',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 10) {
      return {
        dose: '250 mg',
        frequency: 'PO QD (하루 1회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (10~29): 표준 TID → 감량 250mg QD 권장.`,
        appliedTier: 'eGFR/CrCl 10–29 mL/min: 감량 250 mg QD',
        guidelineSource: guideline,
      };
    } else {
      return {
        dose: '250 mg',
        frequency: 'PO q48h 또는 혈액투석 직후 단회 투여',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<10): 250mg q48h 또는 투석 직후 단회 투여.`,
        appliedTier: '말기 신부전/투석: 250 mg q48h 또는 투석 직후 단회 투여',
        guidelineSource: guideline,
      };
    }
  }

  // 4. Acyclovir Oral (Zovirax 800mg)
  if (drugId === 'acyclovir_oral') {
    const guideline = 'FDA Zovirax Oral Label';
    if (primaryRenalValue === null || primaryRenalValue > 25) {
      return {
        dose: '800 mg',
        frequency: 'PO 5 times/day (하루 5회)',
        durationDays: 7,
        isAdjusted: false,
        renalMetricUsed: metricName,
        appliedTier: 'CrCl > 25 mL/min: 표준 800 mg 하루 5회',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 10) {
      return {
        dose: '800 mg',
        frequency: 'PO q8h (TID, 하루 3회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (10~25): 표준 5회 → 감량 800mg q8h(TID) 권장.`,
        appliedTier: 'CrCl 10–25 mL/min: 감량 800 mg q8h (TID)',
        guidelineSource: guideline,
      };
    } else {
      return {
        dose: '800 mg',
        frequency: 'PO q12h (BID, 하루 2회)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<10): 표준 5회 → 감량 800mg q12h(BID) 권장.`,
        appliedTier: 'CrCl < 10 mL/min: 감량 800 mg q12h (BID)',
        guidelineSource: guideline,
      };
    }
  }

  // 5. Acyclovir IV
  if (drugId === 'acyclovir_iv') {
    const guideline = 'CDC / IDSA / UpToDate IV Acyclovir Guidelines';
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

    const hasWeight = ctx.weightKg !== null && ctx.weightKg !== undefined && ctx.weightKg > 0;
    const calculatedMg = hasWeight ? Math.round(ctx.weightKg! * 10) : undefined;
    const doseText = hasWeight ? `${calculatedMg} mg (10 mg/kg)` : '10 mg/kg (체중 입력 필요)';

    let warningPrefix = '';
    if (!hasWeight) {
      warningPrefix = '환자 체중(kg)을 입력하면 1회 투여량(mg)이 자동 계산됩니다. ';
    }

    if (primaryRenalValue === null || primaryRenalValue > 50) {
      return {
        dose: doseText,
        frequency: 'IV q8h (1시간 이상 점적)',
        durationDays: defaultDuration,
        isAdjusted: false,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
        renalWarning: (warningPrefix + indicationNote).trim() || undefined,
        appliedTier: 'CrCl > 50 mL/min: 10 mg/kg IV q8h',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 25) {
      return {
        dose: doseText,
        frequency: 'IV q12h (12시간마다 점적)',
        durationDays: defaultDuration,
        isAdjusted: true,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
        renalWarning: `${warningPrefix}${metricName} ${primaryRenalValue} mL/min (25~50): 아시클로버 IV 간격을 q12h로 연장 권장. ${indicationNote}`.trim(),
        appliedTier: 'CrCl 25–50 mL/min: 간격 연장 q12h',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 10) {
      return {
        dose: doseText,
        frequency: 'IV q24h (24시간마다 점적)',
        durationDays: defaultDuration,
        isAdjusted: true,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
        renalWarning: `${warningPrefix}${metricName} ${primaryRenalValue} mL/min (10~24): 아시클로버 IV 간격을 q24h로 연장 권장. ${indicationNote}`.trim(),
        appliedTier: 'CrCl 10–24 mL/min: 간격 연장 q24h',
        guidelineSource: guideline,
      };
    } else {
      const halvedMg = hasWeight ? Math.round(ctx.weightKg! * 5) : undefined;
      const halvedDoseText = hasWeight ? `${halvedMg} mg (5 mg/kg)` : '5 mg/kg (체중 입력 필요)';
      return {
        dose: halvedDoseText,
        frequency: 'IV q24h (24시간마다 점적)',
        durationDays: defaultDuration,
        isAdjusted: true,
        renalMetricUsed: metricName,
        weightAdjustedMg: halvedMg,
        renalWarning: `${warningPrefix}${metricName} ${primaryRenalValue} mL/min (<10): 용량 5mg/kg q24h로 감량 권장. ${indicationNote}`.trim(),
        appliedTier: 'CrCl < 10 mL/min: 감량 5 mg/kg q24h',
        guidelineSource: guideline,
      };
    }
  }

  // 6. Foscarnet IV
  if (drugId === 'foscarnet_iv') {
    const guideline = 'IDSA / FDA Foscavir Label';
    const hasWeight = ctx.weightKg !== null && ctx.weightKg !== undefined && ctx.weightKg > 0;
    const calculatedMg = hasWeight ? Math.round(ctx.weightKg! * 40) : undefined;
    const doseText = hasWeight ? `${calculatedMg} mg (40 mg/kg)` : '40-60 mg/kg (체중 입력 필요)';

    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: doseText,
        frequency: 'IV q8h (1-2시간 점적)',
        durationDays: 14,
        isAdjusted: false,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
        appliedTier: 'CrCl ≥ 60 mL/min: 40 mg/kg IV q8h',
        guidelineSource: guideline,
      };
    } else {
      return {
        dose: doseText,
        frequency: '원내 약제부 신기능 환산 협진 필수',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        weightAdjustedMg: calculatedMg,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min: 포스카넷은 mL/min/kg 단위의 복잡한 감량표가 적용되므로 약제부 임상 협진을 의뢰하십시오. 전해질(칼슘, 마그네슘, 칼륨, 인) 및 QT 연장 모니터링 필수.`,
        appliedTier: 'CrCl < 60 mL/min: 약제부 환산 협진 필수',
        guidelineSource: guideline,
      };
    }
  }

  // 7. Pregabalin (Lyrica)
  if (drugId === 'pregabalin') {
    const guideline = 'FDA Lyrica Label (Neuropathic Pain)';
    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: '75 mg/day',
        frequency: 'PO BID (37.5mg BID 또는 25mg TID)',
        durationDays: 14,
        isAdjusted: false,
        renalMetricUsed: metricName,
        appliedTier: 'CrCl ≥ 60 mL/min: 75 mg/day 분할 투여',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 30) {
      return {
        dose: '75 mg/day',
        frequency: 'PO QD at bedtime (또는 37.5mg BID)',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (30~59): 프레가발린 초기 75mg QD(취침 전) 또는 37.5mg BID 분할 권장. (최대 300mg/day)`,
        appliedTier: 'CrCl 30–59 mL/min: 75 mg/day (최대 300mg/d)',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 15) {
      return {
        dose: '25-50 mg/day',
        frequency: 'PO QD at bedtime',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (15~29): 프레가발린 25~50mg QD 감량 권장.`,
        appliedTier: 'CrCl 15–29 mL/min: 감량 25~50 mg/day QD',
        guidelineSource: guideline,
      };
    } else {
      return {
        dose: '25 mg',
        frequency: 'PO QD (하루 1회; 혈액투석 환자는 투석 후 보충)',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<15): 프레가발린 25mg QD 감량 권장.`,
        appliedTier: 'CrCl < 15 mL/min: 감량 25 mg QD',
        guidelineSource: guideline,
      };
    }
  }

  // 8. Gabapentin (Neurontin)
  if (drugId === 'gabapentin') {
    const guideline = 'FDA Neurontin Label / Clinical Pharmacology';
    if (primaryRenalValue === null || primaryRenalValue >= 60) {
      return {
        dose: '300 mg',
        frequency: 'PO QHS (취침 전 1회 시작, 300mg TID 증량)',
        durationDays: 14,
        isAdjusted: false,
        renalMetricUsed: metricName,
        appliedTier: 'CrCl ≥ 60 mL/min: 300 mg QHS 시작 (최대 1800mg/d)',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 30) {
      return {
        dose: '300 mg',
        frequency: 'PO QHS (취침 전 1회 시작, 점진적 증량)',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (30~59): 가바펜틴 초기 300mg QHS로 시작하며, 신기능 저하 시 증량 상한은 최대 1400mg/day(BID 분할)입니다.`,
        appliedTier: 'CrCl 30–59 mL/min: 300 mg QHS 시작, 최대 1400 mg/d',
        guidelineSource: guideline,
      };
    } else if (primaryRenalValue >= 15) {
      return {
        dose: '200-300 mg',
        frequency: 'PO QD (하루 1회, 최대 700mg/day)',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (15~29): 가바펜틴 200~700mg/day QD 범위, 하루 최대 700mg 상한 준수.`,
        appliedTier: 'CrCl 15–29 mL/min: 200~300 mg QD 시작, 최대 700 mg/d',
        guidelineSource: guideline,
      };
    } else {
      return {
        dose: '100-300 mg',
        frequency: 'PO QD (하루 1회; 혈액투석 환자는 투석 후 보충 투여)',
        durationDays: 14,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<15): 가바펜틴 100~300mg/day QD 투여하며, 혈액투석 환자는 투석 직후 보충 투여(125~350mg).`,
        appliedTier: 'CrCl < 15 mL/min: 100~300 mg QD',
        guidelineSource: guideline,
      };
    }
  }

  // 9. Tramadol / APAP
  if (drugId === 'tramadol_apap') {
    const guideline = 'FDA Ultracet Label';
    if (primaryRenalValue !== null && primaryRenalValue < 30) {
      return {
        dose: '1 tab',
        frequency: 'PO q12h (하루 최대 4정)',
        durationDays: 7,
        isAdjusted: true,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min (<30): 트라마돌/APAP 투여 간격 12시간으로 연장 및 하루 최대 4정 제한.`,
        appliedTier: 'CrCl < 30 mL/min: 투여 간격 q12h, 최대 4정/일',
        guidelineSource: guideline,
      };
    }
    return {
      dose: '1 tab',
      frequency: 'PO TID pc 또는 PRN (필요시, 최대 8정/일)',
      durationDays: 7,
      isAdjusted: false,
      renalMetricUsed: metricName,
      appliedTier: 'CrCl ≥ 30 mL/min: 1정 TID (최대 8정/일)',
      guidelineSource: guideline,
    };
  }

  // 10. NSAID (Ibuprofen)
  if (drugId === 'nsaid_ibuprofen') {
    const guideline = 'KDIGO AKI / NSAID Clinical Guidelines';
    if (primaryRenalValue !== null && primaryRenalValue < 60) {
      return {
        dose: '400 mg',
        frequency: 'PO TID pc',
        durationDays: 7,
        isAdjusted: false,
        renalMetricUsed: metricName,
        renalWarning: `${metricName} ${primaryRenalValue} mL/min: 신기능 저하 환자에서 NSAID 사용은 신독성 및 급성 신손상(AKI) 위험이 높으므로 아세트아미노펜 단독 제제 대체 권고.`,
        appliedTier: 'CrCl < 60 mL/min: 신독성 주의 / 피처방 권고',
        guidelineSource: guideline,
      };
    }
  }

  // 11. Oral Glucocorticoid (Prednisolone)
  if (drugId === 'steroid_prednisolone') {
    const guideline = 'UpToDate (Grade 2C) / NICE CKS / Cochrane 2023';
    return {
      dose: '50 mg → 25 mg',
      frequency: 'PO QD 아침 식후 (1주차 50mg/d → 2주차 25mg/d 점진적 감량 후 중단)',
      durationDays: 14,
      isAdjusted: false,
      renalMetricUsed: 'Standard',
      renalWarning:
        '반드시 항바이러스제와 병용하십시오. 면역저하자·파종성 환자 금기. 당뇨 환자 혈당 급상승 주의 및 위장관 보호제(PPI) 병용 검토.',
      appliedTier: '면역정상 심한 급성통증 또는 Ramsay Hunt 한정: 1~2주 단기 테이퍼링',
      guidelineSource: guideline,
    };
  }

  return {
    dose: drug.standardDose,
    frequency: drug.standardFrequency,
    durationDays: drug.standardDurationDays,
    isAdjusted: false,
    renalMetricUsed: metricName,
  };
}
