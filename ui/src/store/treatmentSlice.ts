import type { StateCreator } from 'zustand';
import type { EncounterStore, TreatmentSlice } from './types';

export const createTreatmentSlice: StateCreator<
  EncounterStore,
  [['zustand/immer', never]],
  [],
  TreatmentSlice
> = (set) => ({
  treatments: [{ drugId: 'valacyclovir' }], // Default standard choice

  toggleTreatment: (drugId) =>
    set((state) => {
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
