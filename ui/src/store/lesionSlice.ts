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
        if (!existing) return;

        if (side === 'Bilateral') {
          // If already Bilateral, clicking Bilateral again toggles it off completely
          if (existing.side === 'Bilateral') {
            state.lesions.splice(existingIdx, 1);
          } else {
            existing.side = 'Bilateral';
          }
        } else if (side === 'L') {
          if (existing.side === 'L') {
            // Already Left only -> toggle off
            state.lesions.splice(existingIdx, 1);
          } else if (existing.side === 'R') {
            // Was Right, now user clicked Left -> Both sides involved!
            existing.side = 'Bilateral';
          } else if (existing.side === 'Bilateral') {
            // Was Bilateral, toggling Left off leaves Right active
            existing.side = 'R';
          }
        } else if (side === 'R') {
          if (existing.side === 'R') {
            // Already Right only -> toggle off
            state.lesions.splice(existingIdx, 1);
          } else if (existing.side === 'L') {
            // Was Left, now user clicked Right -> Both sides involved!
            existing.side = 'Bilateral';
          } else if (existing.side === 'Bilateral') {
            // Was Bilateral, toggling Right off leaves Left active
            existing.side = 'L';
          }
        }
      } else {
        // Not present yet -> add with specified side
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
