import type { StateCreator } from 'zustand';
import type { History, WeightUnit } from '../domain/types';
import type { EncounterStore, HistorySlice } from './types';
import { calculateCockcroftGault, convertWeightToKg } from '../domain/regimens';

export const initialHistory: History = {
  onsetDate: null,
  rashStage: null, // Starts blank (null) until selected by doctor
  painNrs: null,
  prodrome: [],
  riskFactors: [],
  age: null,
  sex: null,
  weightKg: null,
  weightInputValue: null,
  weightUnit: 'kg',
  serumCreatinine: null,
  serumCreatinineDate: null,
  egfr: null,
  egfrDate: null,
  crcl: null,
  isCrclManual: false,
  newVesiclesEmerging: false,
  ocularSymptoms: false,
  hutchinsonSign: false,
  hearingSymptoms: false,
  facialPalsy: false,
};

function autoComputeCrCl(h: History): number | null {
  return calculateCockcroftGault(h.age, h.sex, h.weightKg, h.serumCreatinine);
}

function updateCrclIfAuto(history: History) {
  if (!history.isCrclManual) {
    history.crcl = autoComputeCrCl(history);
  }
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
      if (age !== null) {
        if (age >= 50) {
          if (!state.history.riskFactors.includes('age_ge_50')) {
            state.history.riskFactors.push('age_ge_50');
          }
        } else {
          // If age is under 50, automatically remove the age_ge_50 flag
          state.history.riskFactors = state.history.riskFactors.filter(
            (rf) => rf !== 'age_ge_50'
          );
        }
      } else {
        // If age is cleared, remove the age_ge_50 flag
        state.history.riskFactors = state.history.riskFactors.filter(
          (rf) => rf !== 'age_ge_50'
        );
      }

      updateCrclIfAuto(state.history);
    }),

  setSex: (sex) =>
    set((state) => {
      state.history.sex = sex;
      updateCrclIfAuto(state.history);
    }),

  setWeightKg: (weight) =>
    set((state) => {
      state.history.weightKg = weight;
      state.history.weightInputValue = weight;
      state.history.weightUnit = 'kg';
      updateCrclIfAuto(state.history);
    }),

  setWeight: (value, unit?: WeightUnit) =>
    set((state) => {
      const activeUnit = unit ?? state.history.weightUnit;
      state.history.weightUnit = activeUnit;
      state.history.weightInputValue = value;
      state.history.weightKg = convertWeightToKg(value, activeUnit);
      updateCrclIfAuto(state.history);
    }),

  setWeightUnit: (unit) =>
    set((state) => {
      state.history.weightUnit = unit;
      state.history.weightKg = convertWeightToKg(state.history.weightInputValue, unit);
      updateCrclIfAuto(state.history);
    }),

  setSerumCreatinine: (cr) =>
    set((state) => {
      state.history.serumCreatinine = cr;
      updateCrclIfAuto(state.history);
    }),

  setSerumCreatinineDate: (date) =>
    set((state) => {
      state.history.serumCreatinineDate = date;
    }),

  setEgfr: (egfr) =>
    set((state) => {
      state.history.egfr = egfr;
    }),

  setEgfrDate: (date) =>
    set((state) => {
      state.history.egfrDate = date;
    }),

  setCrcl: (crcl) =>
    set((state) => {
      if (crcl !== null) {
        state.history.crcl = crcl;
        state.history.isCrclManual = true;
      } else {
        // If user clears manual CrCl input, fall back to auto-calculation
        state.history.isCrclManual = false;
        state.history.crcl = autoComputeCrCl(state.history);
      }
    }),

  resetCrclToAuto: () =>
    set((state) => {
      state.history.isCrclManual = false;
      state.history.crcl = autoComputeCrCl(state.history);
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
