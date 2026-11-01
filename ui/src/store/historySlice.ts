import type { StateCreator } from 'zustand';
import type { History } from '../domain/types';
import type { EncounterStore, HistorySlice } from './types';
import { calculateCockcroftGault } from '../domain/regimens';

export const initialHistory: History = {
  onsetDate: null,
  rashStage: 'vesicular',
  painNrs: null,
  prodrome: [],
  riskFactors: [],
  age: null,
  sex: null,
  weightKg: null,
  serumCreatinine: null,
  egfr: null,
  crcl: null,
  newVesiclesEmerging: false,
  ocularSymptoms: false,
  hutchinsonSign: false,
  hearingSymptoms: false,
  facialPalsy: false,
};

function autoComputeCrCl(h: History): number | null {
  return calculateCockcroftGault(h.age, h.sex, h.weightKg, h.serumCreatinine);
}

export const createHistorySlice: StateCreator<
  EncounterStore,
  [['zustand/immer', never]],
  [],
  HistorySlice
> = (set) => ({
  history: { ...initialHistory },

  setOnsetDate: (date) =>
    set((state) => {
      state.history.onsetDate = date;
    }),

  setRashStage: (stage) =>
    set((state) => {
      state.history.rashStage = stage;
    }),

  setPainNrs: (nrs) =>
    set((state) => {
      state.history.painNrs = nrs;
    }),

  toggleProdrome: (symptom) =>
    set((state) => {
      const idx = state.history.prodrome.indexOf(symptom);
      if (idx >= 0) {
        state.history.prodrome.splice(idx, 1);
      } else {
        state.history.prodrome.push(symptom);
      }
    }),

  toggleRiskFactor: (rf) =>
    set((state) => {
      const idx = state.history.riskFactors.indexOf(rf);
      if (idx >= 0) {
        state.history.riskFactors.splice(idx, 1);
      } else {
        state.history.riskFactors.push(rf);
      }
    }),

  setAge: (age) =>
    set((state) => {
      state.history.age = age;
      if (age !== null && age >= 50 && !state.history.riskFactors.includes('age_ge_50')) {
        state.history.riskFactors.push('age_ge_50');
      }
      const computed = autoComputeCrCl(state.history);
      if (computed !== null) {
        state.history.crcl = computed;
      }
    }),

  setSex: (sex) =>
    set((state) => {
      state.history.sex = sex;
      const computed = autoComputeCrCl(state.history);
      if (computed !== null) {
        state.history.crcl = computed;
      }
    }),

  setWeightKg: (weight) =>
    set((state) => {
      state.history.weightKg = weight;
      const computed = autoComputeCrCl(state.history);
      if (computed !== null) {
        state.history.crcl = computed;
      }
    }),

  setSerumCreatinine: (cr) =>
    set((state) => {
      state.history.serumCreatinine = cr;
      const computed = autoComputeCrCl(state.history);
      if (computed !== null) {
        state.history.crcl = computed;
      }
    }),

  setEgfr: (egfr) =>
    set((state) => {
      state.history.egfr = egfr;
    }),

  setCrcl: (crcl) =>
    set((state) => {
      state.history.crcl = crcl;
    }),

  setNewVesiclesEmerging: (val) =>
    set((state) => {
      state.history.newVesiclesEmerging = val;
    }),

  setOcularSymptoms: (val) =>
    set((state) => {
      state.history.ocularSymptoms = val;
    }),

  setHutchinsonSign: (val) =>
    set((state) => {
      state.history.hutchinsonSign = val;
    }),

  setHearingSymptoms: (val) =>
    set((state) => {
      state.history.hearingSymptoms = val;
    }),

  setFacialPalsy: (val) =>
    set((state) => {
      state.history.facialPalsy = val;
    }),
});
