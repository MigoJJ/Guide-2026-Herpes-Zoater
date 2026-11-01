export type CranialDermatomeId = 'V1' | 'V2' | 'V3';
export type CervicalDermatomeId = 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8';
export type ThoracicDermatomeId =
  | 'T1'
  | 'T2'
  | 'T3'
  | 'T4'
  | 'T5'
  | 'T6'
  | 'T7'
  | 'T8'
  | 'T9'
  | 'T10'
  | 'T11'
  | 'T12';
export type LumbarDermatomeId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export type SacralDermatomeId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';

export type DermatomeId =
  | CranialDermatomeId
  | CervicalDermatomeId
  | ThoracicDermatomeId
  | LumbarDermatomeId
  | SacralDermatomeId;

export type Side = 'L' | 'R' | 'Bilateral';

export interface LesionSelection {
  dermatome: DermatomeId;
  side: Side;
}

export type RashStage = 'erythema' | 'vesicular' | 'pustular' | 'crusted';

export type ProdromeSymptom = 'fever' | 'malaise' | 'itching' | 'tingling' | 'burning' | 'headache';

export type RiskFactor = 'immunocompromised' | 'ckd' | 'age_ge_50' | 'pregnancy' | 'diabetes';

export type BiologicalSex = 'M' | 'F';

export type IvIndication =
  | 'disseminated_immunocompromised' // 면역저하자 / 파종성: 7-10일 후 경구 전환
  | 'cns_involvement' // 중추신경계 침범(수막뇌염): 10-15 mg/kg × 10-14일
  | 'acute_retinal_necrosis' // 급성망막괴사 (ARN): 10-15 mg/kg × 10-14일 후 경구 유지
  | 'severe_facial_or_ophthalmic'; // 중증 안부/안면 대상포진

export interface History {
  onsetDate: string | null; // ISO YYYY-MM-DD
  rashStage: RashStage | null;
  painNrs: number | null; // 0-10
  prodrome: ProdromeSymptom[];
  riskFactors: RiskFactor[];
  // Patient Demographics & Renal Parameters
  age: number | null; // years
  sex: BiologicalSex | null; // 'M' | 'F'
  weightKg: number | null; // kg
  serumCreatinine: number | null; // mg/dL
  egfr: number | null; // mL/min/1.73m² (CKD-EPI)
  crcl: number | null; // mL/min (Cockcroft-Gault)
  newVesiclesEmerging: boolean; // 새 수포가 계속 생성 중인지 여부 (72시간 경과 후 항바이러스제 적응증)
  // Red Flag Signs
  ocularSymptoms: boolean; // Eye pain, redness, blurred vision
  hutchinsonSign: boolean; // Lesion on the tip or side of nose
  hearingSymptoms: boolean; // Tinnitus, vertigo, hearing loss (Ramsay Hunt)
  facialPalsy: boolean; // Facial nerve palsy
}

export interface RegimenSelection {
  drugId: string;
  doseOverride?: string;
  frequencyOverride?: string;
  durationDays?: number;
  isPrn?: boolean; // 필요시(PRN) 여부 (급성기 진통제)
  ivIndication?: IvIndication; // 정맥주사 적응증
}

export interface Encounter {
  history: History;
  lesions: LesionSelection[];
  treatments: RegimenSelection[];
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  recommendation?: string;
}

export interface DermatomeMetadata {
  id: DermatomeId;
  nerve: string;
  labelKo: string;
  labelEn: string;
  region: 'cranial' | 'cervical' | 'thoracic' | 'lumbar' | 'sacral';
  landmarks: string;
}

export type DrugCategory =
  | 'antiviral_oral'
  | 'antiviral_iv'
  | 'neuropathic_analgesic'
  | 'nsaid_analgesic'
  | 'topical';

export interface DrugRegimen {
  id: string;
  nameKo: string;
  nameEn: string;
  category: DrugCategory;
  standardDose: string;
  standardFrequency: string;
  standardDurationDays: number;
  route: 'PO' | 'IV' | 'TOPICAL';
  notes: string;
}
