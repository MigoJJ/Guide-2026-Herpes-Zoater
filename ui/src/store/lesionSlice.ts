import type { StateCreator } from 'zustand';
import type { EncounterStore, LesionSlice } from './types';

export const createLesionSlice: StateCreator<
  EncounterStore,
  [['zustand/immer', never]],
  [],
  LesionSlice
> = (set) => ({
  lesions: [],

  toggleLesion: (dermatome, side) =>
    set((state) => {
      const existingIdx = state.lesions.findIndex((l) => l.dermatome === dermatome);
      if (existingIdx >= 0) {
        const existing = state.lesions[existingIdx];
        if (existing && existing.side === side) {
          // Same side clicked -> toggle off
          state.lesions.splice(existingIdx, 1);
        } else if (existing) {
          // Different side clicked -> switch to new side (or update)
          existing.side = side;
        }
      } else {
        state.lesions.push({ dermatome, side });
      }
    }),

  setLesionSide: (dermatome, side) =>
    set((state) => {
      const existing = state.lesions.find((l) => l.dermatome === dermatome);
      if (existing) {
        existing.side = side;
      } else {
        state.lesions.push({ dermatome, side });
      }
    }),

  removeLesion: (dermatome) =>
    set((state) => {
      state.lesions = state.lesions.filter((l) => l.dermatome !== dermatome);
    }),

  clearLesions: () =>
    set((state) => {
      state.lesions = [];
    }),
});
