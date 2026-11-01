import type {
  BiologicalSex,
  DermatomeId,
  Encounter,
  History,
  IvIndication,
  LesionSelection,
  ProdromeSymptom,
  RashStage,
  RegimenSelection,
  RiskFactor,
  Side,
} from '../domain/types';

export interface HistorySlice {
  history: History;
  setOnsetDate: (date: string | null) => void;
  setRashStage: (stage: RashStage | null) => void;
  setPainNrs: (nrs: number | null) => void;
  toggleProdrome: (symptom: ProdromeSymptom) => void;
  toggleRiskFactor: (rf: RiskFactor) => void;
  // Patient Demographics & Renal
  setAge: (age: number | null) => void;
  setSex: (sex: BiologicalSex | null) => void;
  setWeightKg: (weight: number | null) => void;
  setSerumCreatinine: (cr: number | null) => void;
  setEgfr: (egfr: number | null) => void;
  setCrcl: (crcl: number | null) => void;
  setNewVesiclesEmerging: (val: boolean) => void;
  // Red Flag Signs
  setOcularSymptoms: (val: boolean) => void;
  setHutchinsonSign: (val: boolean) => void;
  setHearingSymptoms: (val: boolean) => void;
  setFacialPalsy: (val: boolean) => void;
}

export interface LesionSlice {
  lesions: LesionSelection[];
  toggleLesion: (dermatome: DermatomeId, side: Side) => void;
  setLesionSide: (dermatome: DermatomeId, side: Side) => void;
  removeLesion: (dermatome: DermatomeId) => void;
  clearLesions: () => void;
}

export interface TreatmentSlice {
  treatments: RegimenSelection[];
  toggleTreatment: (drugId: string) => void;
  selectAntiviral: (drugId: string) => void;
  selectGabapentinoid: (drugId: string) => void;
  switchToOral: (oralDrugId?: string) => void;
  setIvIndication: (drugId: string, indication: IvIndication) => void;
  setPrn: (drugId: string, isPrn: boolean) => void;
  updateTreatment: (drugId: string, updates: Partial<RegimenSelection>) => void;
  removeTreatment: (drugId: string) => void;
  clearTreatments: () => void;
}

export interface EncounterStore extends HistorySlice, LesionSlice, TreatmentSlice {
  resetAll: () => void;
  getEncounter: () => Encounter;
}
