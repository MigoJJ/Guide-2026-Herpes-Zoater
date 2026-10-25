import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { EncounterStore } from './types';
import { createHistorySlice, initialHistory } from './historySlice';
import { createLesionSlice } from './lesionSlice';
import { createTreatmentSlice } from './treatmentSlice';
import type { Encounter } from '../domain/types';

export const useEncounterStore = create<EncounterStore>()(
  immer((...a) => ({
    ...createHistorySlice(...a),
    ...createLesionSlice(...a),
    ...createTreatmentSlice(...a),

    resetAll: () => {
      const [set] = a;
      set((state) => {
        state.history = { ...initialHistory };
        state.lesions = [];
        state.treatments = [{ drugId: 'valacyclovir' }];
      });
    },

    getEncounter: () => {
      const [, get] = a;
      const current = get();
      const encounter: Encounter = {
        history: current.history,
        lesions: current.lesions,
        treatments: current.treatments,
      };
      return encounter;
    },
  }))
);

// Pure memoized-friendly selectors
export const selectHistory = (state: EncounterStore) => state.history;
export const selectLesions = (state: EncounterStore) => state.lesions;
export const selectTreatments = (state: EncounterStore) => state.treatments;
export const selectEncounter = (state: EncounterStore): Encounter => ({
  history: state.history,
  lesions: state.lesions,
  treatments: state.treatments,
});
