import type { StateCreator } from 'zustand';
import type { EncounterStore, TreatmentSlice } from './types';
import type { IvIndication } from '../domain/types';

export const ANTIVIRAL_DRUG_IDS = [
  'valacyclovir',
  'famciclovir',
  'famvir_kr_250',
  'acyclovir_oral',
  'acyclovir_iv',
  'foscarnet_iv',
];

export const GABAPENTINOID_DRUG_IDS = ['pregabalin', 'gabapentin'];

export const createTreatmentSlice: StateCreator<
  EncounterStore,
  [['zustand/immer', never]],
  [],
  TreatmentSlice
> = (set) => ({
  treatments: [], // Starts blank until selected by doctor

  selectAntiviral: (drugId) =>
    set((state) => {
      const isAlreadySelected = state.treatments.some((t) => t.drugId === drugId);
      // Remove all current antivirals
      state.treatments = state.treatments.filter(
        (t) => !ANTIVIRAL_DRUG_IDS.includes(t.drugId)
      );
      // If was not already selected, select it
      if (!isAlreadySelected) {
        state.treatments.push({ drugId });
      }
    }),

  selectGabapentinoid: (drugId) =>
    set((state) => {
      const isAlreadySelected = state.treatments.some((t) => t.drugId === drugId);
      // Remove all gabapentinoids
      state.treatments = state.treatments.filter(
        (t) => !GABAPENTINOID_DRUG_IDS.includes(t.drugId)
      );
      if (!isAlreadySelected) {
        state.treatments.push({ drugId });
      }
    }),

  switchToOral: (oralDrugId = 'valacyclovir') =>
    set((state) => {
      // Remove any IV antivirals
      state.treatments = state.treatments.filter(
        (t) => t.drugId !== 'acyclovir_iv' && t.drugId !== 'foscarnet_iv'
      );
      // Ensure oral drug is selected
      const hasOral = state.treatments.some((t) => ANTIVIRAL_DRUG_IDS.includes(t.drugId));
      if (!hasOral) {
        state.treatments.push({ drugId: oralDrugId });
      }
    }),

  setIvIndication: (drugId: string, indication: IvIndication) =>
    set((state) => {
      const item = state.treatments.find((t) => t.drugId === drugId);
      if (item) {
        item.ivIndication = indication;
      }
    }),

  setPrn: (drugId: string, isPrn: boolean) =>
    set((state) => {
      const item = state.treatments.find((t) => t.drugId === drugId);
      if (item) {
        item.isPrn = isPrn;
      }
    }),

  toggleTreatment: (drugId) =>
    set((state) => {
      if (ANTIVIRAL_DRUG_IDS.includes(drugId)) {
        const isAlreadySelected = state.treatments.some((t) => t.drugId === drugId);
        state.treatments = state.treatments.filter(
          (t) => !ANTIVIRAL_DRUG_IDS.includes(t.drugId)
        );
        if (!isAlreadySelected) {
          state.treatments.push({ drugId });
        }
        return;
      }

      if (GABAPENTINOID_DRUG_IDS.includes(drugId)) {
        const isAlreadySelected = state.treatments.some((t) => t.drugId === drugId);
        state.treatments = state.treatments.filter(
          (t) => !GABAPENTINOID_DRUG_IDS.includes(t.drugId)
        );
        if (!isAlreadySelected) {
          state.treatments.push({ drugId });
        }
        return;
      }

      const idx = state.treatments.findIndex((t) => t.drugId === drugId);
      if (idx >= 0) {
        state.treatments.splice(idx, 1);
      } else {
        state.treatments.push({ drugId });
      }
    }),

  updateTreatment: (drugId, updates) =>
    set((state) => {
      const item = state.treatments.find((t) => t.drugId === drugId);
      if (item) {
        Object.assign(item, updates);
      }
    }),

  removeTreatment: (drugId) =>
    set((state) => {
      state.treatments = state.treatments.filter((t) => t.drugId !== drugId);
    }),

  clearTreatments: () =>
    set((state) => {
      state.treatments = [];
    }),
});
