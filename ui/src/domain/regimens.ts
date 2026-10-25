import type { DrugRegimen } from './types';

export const REGIMEN_METADATA = {
  reviewedBy: 'Infectious Disease & Clinical Decision Support Board',
  reviewedAt: '2026-10-25',
  sources: [
    'CDC/ACIP Guidelines for Prevention and Management of Herpes Zoster',
    'IDSA Clinical Practice Guidelines for Management of Herpes Zoster',
    'FDA Package Inserts: Valtrex (valacyclovir), Famvir (famciclovir), Zovirax (acyclovir)',
    'UpToDate: Vaccination for the prevention of shingles and treatment of herpes zoster (2025/2026)',
  ],
  disclaimer:
    '본 처방 가이드는 보조 정보 제공을 목적으로 하며, 환자의 신기능, 체중, 동반 질환 및 약물 상호작용에 따른 최종 처방 책임은 처방의에게 있습니다.',
};

export const DRUG_REGIMENS: Record<string, DrugRegimen> = {
  valacyclovir: {
    id: 'valacyclovir',
    nameKo: '발라시클로버 (Valacyclovir)',
    nameEn: 'Valacyclovir (Valtrex)',
    category: 'antiviral',
    standardDose: '1000 mg',
    standardFrequency: 'PO TID (하루 3회)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '신기능 정상 성인 표준 요법. 발병 72시간 이내 투여 시 최상의 효과.',
  },
  famciclovir: {
    id: 'famciclovir',
    nameKo: '팜시클로버 (Famciclovir)',
    nameEn: 'Famciclovir (Famvir)',
    category: 'antiviral',
    standardDose: '500 mg',
    standardFrequency: 'PO TID (하루 3회)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '표준 요법 500mg TID. (250mg TID 투여도 승인 용량 중 하나).',
  },
  acyclovir_oral: {
    id: 'acyclovir_oral',
    nameKo: '아시클로버 경구 (Acyclovir Oral)',
    nameEn: 'Acyclovir Oral (Zovirax)',
    category: 'antiviral',
    standardDose: '800 mg',
    standardFrequency: 'PO 5 times/day (하루 5회, 약 4시간 간격)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '복약 순응도 주의 필요 (하루 5회 복용). 신기능에 따라 감량 필요.',
  },
  acyclovir_iv: {
    id: 'acyclovir_iv',
    nameKo: '아시클로버 정맥주사 (Acyclovir IV)',
    nameEn: 'Acyclovir IV',
    category: 'antiviral',
    standardDose: '10 mg/kg',
    standardFrequency: 'IV q8h (8시간마다 정맥투여)',
    standardDurationDays: 7,
    route: 'IV',
    notes: '면역저하자, 파종성 대상포진, 중추신경계 침범, 안과적 응급 시 입원 치료.',
  },
  pregabalin: {
    id: 'pregabalin',
    nameKo: '프레가발린 (Pregabalin)',
    nameEn: 'Pregabalin (Lyrica)',
    category: 'neuropathic_analgesic',
    standardDose: '75 mg',
    standardFrequency: 'PO BID (하루 2회)',
    standardDurationDays: 14,
    route: 'PO',
    notes: '신경병증성 통증 조기 조절 및 대상포진후 신경통(PHN) 예방 목적.',
  },
  gabapentin: {
    id: 'gabapentin',
    nameKo: '가바펜틴 (Gabapentin)',
    nameEn: 'Gabapentin (Neurontin)',
    category: 'neuropathic_analgesic',
    standardDose: '300 mg',
    standardFrequency: 'PO QD at bedtime (취침 전 1회 시작, 300mg TID 적정)',
    standardDurationDays: 14,
    route: 'PO',
    notes: '취침 전 단회 투여로 시작하여 점진적 증량 권장 (졸림, 어지럼 주의).',
  },
  tramadol_apap: {
    id: 'tramadol_apap',
    nameKo: '트라마돌/아세트아미노펜 (Tramadol/APAP)',
    nameEn: 'Tramadol 37.5mg / APAP 325mg',
    category: 'nsaid_analgesic',
    standardDose: '1 tab',
    standardFrequency: 'PO TID (하루 3회 필요시)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '급성기 중등도-중증 통증 완화.',
  },
  nsaid_ibuprofen: {
    id: 'nsaid_ibuprofen',
    nameKo: '이부프로펜 (Ibuprofen)',
    nameEn: 'Ibuprofen 400mg',
    category: 'nsaid_analgesic',
    standardDose: '400 mg',
    standardFrequency: 'PO TID pc (하루 3회 식후)',
    standardDurationDays: 7,
    route: 'PO',
    notes: '급성 염증 및 경증 통증 완화. (신부전/위장관 출혈 위험군 주의)',
  },
  calamine_lotion: {
    id: 'calamine_lotion',
    nameKo: '칼라민 로션 (Calamine)',
    nameEn: 'Calamine Topical Lotion',
    category: 'topical',
    standardDose: '적당량',
    standardFrequency: 'Topical BID-TID (하루 2-3회 도포)',
    standardDurationDays: 7,
    route: 'TOPICAL',
    notes: '수포 및 가려움 완화. 눈 주위 도포 금기.',
  },
  lidocaine_patch: {
    id: 'lidocaine_patch',
    nameKo: '리도카인 5% 패치 (Lidocaine Patch)',
    nameEn: 'Lidocaine 5% Topical Patch',
    category: 'topical',
    standardDose: '1-3매',
    standardFrequency: 'Topical 12시간 부착 후 12시간 휴약 (하루 1회)',
    standardDurationDays: 14,
    route: 'TOPICAL',
    notes: '상처가 완전히 아문 후 국소 신경병증 통증에 사용 (개방성 수포 부위 부착 금기).',
  },
};

export interface AdjustedRegimenResult {
  dose: string;
  frequency: string;
  durationDays: number;
  isAdjusted: boolean;
  renalWarning?: string;
}

export function calculateAdjustedDose(
  drugId: string,
  egfr: number | null
): AdjustedRegimenResult {
  const drug = DRUG_REGIMENS[drugId];
  if (!drug) {
    return {
      dose: '미정',
      frequency: '미정',
      durationDays: 7,
      isAdjusted: false,
    };
  }

  // If no eGFR is provided or eGFR is normal (>= 60), return standard
  if (egfr === null || egfr >= 60) {
    return {
      dose: drug.standardDose,
      frequency: drug.standardFrequency,
      durationDays: drug.standardDurationDays,
      isAdjusted: false,
    };
  }

  // Renal Dose Adjustments based on eGFR
  switch (drugId) {
    case 'valacyclovir': {
      if (egfr >= 50) {
        return {
          dose: '1000 mg',
          frequency: 'PO TID (하루 3회)',
          durationDays: 7,
          isAdjusted: false,
        };
      } else if (egfr >= 30) {
        return {
          dose: '1000 mg',
          frequency: 'PO BID (하루 2회)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 발라시클로버 용량을 1000mg BID로 감량 권장합니다.`,
        };
      } else if (egfr >= 10) {
        return {
          dose: '1000 mg',
          frequency: 'PO QD (하루 1회)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 발라시클로버 용량을 1000mg QD로 감량 권장합니다.`,
        };
      } else {
        return {
          dose: '500 mg',
          frequency: 'PO QD (하루 1회)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min (말기 신부전): 발라시클로버 용량을 500mg QD로 감량 권장합니다.`,
        };
      }
    }

    case 'famciclovir': {
      if (egfr >= 40) {
        return {
          dose: '500 mg',
          frequency: 'PO BID (하루 2회)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 팜시클로버 500mg BID로 감량 권장합니다.`,
        };
      } else if (egfr >= 20) {
        return {
          dose: '500 mg',
          frequency: 'PO QD (하루 1회)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 팜시클로버 500mg QD로 감량 권장합니다.`,
        };
      } else {
        return {
          dose: '250 mg',
          frequency: 'PO QD (하루 1회)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 팜시클로버 250mg QD로 감량 권장합니다.`,
        };
      }
    }

    case 'acyclovir_oral': {
      if (egfr >= 25) {
        return {
          dose: '800 mg',
          frequency: 'PO 5 times/day',
          durationDays: 7,
          isAdjusted: false,
        };
      } else if (egfr >= 10) {
        return {
          dose: '800 mg',
          frequency: 'PO TID (하루 3회)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 아시클로버 800mg TID로 감량 권장합니다.`,
        };
      } else {
        return {
          dose: '800 mg',
          frequency: 'PO BID (하루 2회)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 아시클로버 800mg BID로 감량 권장합니다.`,
        };
      }
    }

    case 'acyclovir_iv': {
      if (egfr >= 50) {
        return {
          dose: '10 mg/kg',
          frequency: 'IV q8h (8시간마다)',
          durationDays: 7,
          isAdjusted: false,
        };
      } else if (egfr >= 25) {
        return {
          dose: '10 mg/kg',
          frequency: 'IV q12h (12시간마다)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 아시클로버 IV 투여 간격을 q12h로 연장 권장합니다.`,
        };
      } else if (egfr >= 10) {
        return {
          dose: '10 mg/kg',
          frequency: 'IV q24h (24시간마다)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 아시클로버 IV 투여 간격을 q24h로 연장 권장합니다.`,
        };
      } else {
        return {
          dose: '5 mg/kg',
          frequency: 'IV q24h (24시간마다)',
          durationDays: 7,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 아시클로버 IV 용량을 5mg/kg q24h로 감량 권장합니다.`,
        };
      }
    }

    case 'pregabalin': {
      if (egfr >= 30) {
        return {
          dose: '75 mg',
          frequency: 'PO QD (하루 1회 시작)',
          durationDays: 14,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 프레가발린 초기 용량 75mg QD(취침 전) 권장.`,
        };
      } else if (egfr >= 15) {
        return {
          dose: '25-50 mg',
          frequency: 'PO QD (하루 1회)',
          durationDays: 14,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 프레가발린 25~50mg QD 감량 권장.`,
        };
      } else {
        return {
          dose: '25 mg',
          frequency: 'PO QD (투석 후 보충)',
          durationDays: 14,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 프레가발린 25mg QD 감량 권장.`,
        };
      }
    }

    case 'gabapentin': {
      if (egfr >= 30) {
        return {
          dose: '300 mg',
          frequency: 'PO QD at bedtime',
          durationDays: 14,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 가바펜틴 초기 300mg QD로 시작하여 천천히 증량 권장.`,
        };
      } else if (egfr >= 15) {
        return {
          dose: '300 mg',
          frequency: 'PO QOD (이틀에 1회) 또는 100mg QD',
          durationDays: 14,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min: 가바펜틴 용량 조절 필수.`,
        };
      } else {
        return {
          dose: '100-300 mg',
          frequency: '투석 후 단회 투여',
          durationDays: 14,
          isAdjusted: true,
          renalWarning: `eGFR ${egfr} mL/min (투석 환자): 투석 직후 단회 투여 권장.`,
        };
      }
    }

    case 'nsaid_ibuprofen': {
      return {
        dose: '400 mg',
        frequency: 'PO TID pc',
        durationDays: 7,
        isAdjusted: true,
        renalWarning: `eGFR ${egfr} mL/min: 신기능 저하 환자에서 NSAID 사용은 신기능 악화 위험이 있으므로 주의하십시오 (아세트아미노펜 대체 권장).`,
      };
    }

    default:
      return {
        dose: drug.standardDose,
        frequency: drug.standardFrequency,
        durationDays: drug.standardDurationDays,
        isAdjusted: false,
      };
  }
}
