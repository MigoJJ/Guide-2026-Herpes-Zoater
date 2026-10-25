import type {
  DermatomeId,
  Encounter,
  History,
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
  setEgfr: (egfr: number | null) => void;
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
  updateTreatment: (drugId: string, updates: Partial<RegimenSelection>) => void;
  removeTreatment: (drugId: string) => void;
  clearTreatments: () => void;
}

export interface EncounterStore extends HistorySlice, LesionSlice, TreatmentSlice {
  resetAll: () => void;
  getEncounter: () => Encounter;
}
