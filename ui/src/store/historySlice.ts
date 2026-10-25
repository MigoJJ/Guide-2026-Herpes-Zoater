import type { StateCreator } from 'zustand';
import type { History } from '../domain/types';
import type { EncounterStore, HistorySlice } from './types';

export const initialHistory: History = {
  onsetDate: null,
  rashStage: 'vesicular',
  painNrs: null,
  prodrome: [],
  riskFactors: [],
  egfr: null,
  ocularSymptoms: false,
  hutchinsonSign: false,
  hearingSymptoms: false,
  facialPalsy: false,
};

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

  setEgfr: (egfr) =>
    set((state) => {
      state.history.egfr = egfr;
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
