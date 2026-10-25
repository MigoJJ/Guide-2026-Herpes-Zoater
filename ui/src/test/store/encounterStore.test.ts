import { describe, expect, it, beforeEach } from 'vitest';
import { useEncounterStore } from '../../store';

describe('useEncounterStore Zustand store', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('toggles lesions correctly and updates side', () => {
    const { toggleLesion } = useEncounterStore.getState();

    toggleLesion('T4', 'R');
    expect(useEncounterStore.getState().lesions).toEqual([{ dermatome: 'T4', side: 'R' }]);

    // Toggling with different side updates side
    toggleLesion('T4', 'L');
    expect(useEncounterStore.getState().lesions).toEqual([{ dermatome: 'T4', side: 'L' }]);

    // Toggling with same side removes it
    toggleLesion('T4', 'L');
    expect(useEncounterStore.getState().lesions).toEqual([]);
  });

  it('updates history fields correctly', () => {
    const { setOnsetDate, setPainNrs, toggleProdrome, setEgfr } = useEncounterStore.getState();

    setOnsetDate('2026-10-24');
    setPainNrs(7);
    toggleProdrome('burning');
    setEgfr(45);

    const history = useEncounterStore.getState().history;
    expect(history.onsetDate).toBe('2026-10-24');
    expect(history.painNrs).toBe(7);
    expect(history.prodrome).toContain('burning');
    expect(history.egfr).toBe(45);
  });

  it('resets all state on resetAll', () => {
    const { toggleLesion, setPainNrs, resetAll } = useEncounterStore.getState();
    toggleLesion('V1', 'R');
    setPainNrs(9);

    resetAll();

    expect(useEncounterStore.getState().lesions).toEqual([]);
    expect(useEncounterStore.getState().history.painNrs).toBeNull();
  });
});
