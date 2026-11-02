import type { StateCreator } from 'zustand';
import type { EncounterStore, SessionSlice } from './types';
import { initialHistory } from './historySlice';
import { calculateCockcroftGault, convertWeightToKg } from '../domain/regimens';

export const createSessionSlice: StateCreator<
  EncounterStore,
  [['zustand/immer', never]],
  [],
  SessionSlice
> = (set) => ({
  patientSessionKey: null,

  setPatientSession: (sessionKey, demographics) =>
    set((state) => {
      // 1. Critical Clinical Safety: Purge all examination, lesions, and treatments from prior patient!
      state.lesions = [];
      state.treatments = [];
      state.history = {
        ...initialHistory,
        prodrome: [],
        riskFactors: [],
      };
      state.patientSessionKey = sessionKey;

      // 2. If new patient demographics are provided from EMR, populate them cleanly
      if (demographics) {
        if (demographics.age !== undefined) state.history.age = demographics.age;
        if (demographics.sex !== undefined) state.history.sex = demographics.sex;

        if (demographics.weight !== undefined && demographics.weight !== null) {
          const unit = demographics.weightUnit ?? 'kg';
          state.history.weightUnit = unit;
          state.history.weightInputValue = demographics.weight;
          state.history.weightKg = convertWeightToKg(demographics.weight, unit);
        } else if (demographics.weightKg !== undefined) {
          state.history.weightUnit = 'kg';
          state.history.weightInputValue = demographics.weightKg;
          state.history.weightKg = demographics.weightKg;
        }

        if (demographics.serumCreatinine !== undefined) {
          state.history.serumCreatinine = demographics.serumCreatinine;
        }
        if (demographics.serumCreatinineDate !== undefined) {
          state.history.serumCreatinineDate = demographics.serumCreatinineDate;
        }
        if (demographics.egfr !== undefined) state.history.egfr = demographics.egfr;
        if (demographics.egfrDate !== undefined) {
          state.history.egfrDate = demographics.egfrDate;
        }

        if (state.history.age !== null && state.history.age >= 50) {
          state.history.riskFactors.push('age_ge_50');
        }

        if (demographics.crcl !== undefined && demographics.crcl !== null) {
          state.history.crcl = demographics.crcl;
          state.history.isCrclManual = true;
        } else {
          state.history.crcl = calculateCockcroftGault(
            state.history.age,
            state.history.sex,
            state.history.weightKg,
            state.history.serumCreatinine
          );
          state.history.isCrclManual = false;
        }
      }
    }),

  clearPatientSession: () =>
    set((state) => {
      state.patientSessionKey = null;
      state.lesions = [];
      state.treatments = [];
      state.history = { ...initialHistory };
    }),
});
