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

  it('updates demographics and automatically calculates Cockcroft-Gault CrCl', () => {
    const { setAge, setSex, setWeightKg, setSerumCreatinine } = useEncounterStore.getState();

    setAge(75);
    setSex('F');
    setWeightKg(50);
    setSerumCreatinine(1.0);

    const history = useEncounterStore.getState().history;
    expect(history.age).toBe(75);
    expect(history.sex).toBe('F');
    expect(history.weightKg).toBe(50);
    expect(history.serumCreatinine).toBe(1.0);
    // CrCl = (65 * 50) / 72 * 0.85 = ~38.4
    expect(history.crcl).toBe(38.4);
    // age >= 50 adds age_ge_50
    expect(history.riskFactors).toContain('age_ge_50');
  });

  it('enforces single antiviral selection and supports IV-to-oral step-down', () => {
    const { selectAntiviral, switchToOral } = useEncounterStore.getState();

    // Default was valacyclovir
    expect(useEncounterStore.getState().treatments).toEqual([{ drugId: 'valacyclovir' }]);

    // Select acyclovir_iv replaces valacyclovir
    selectAntiviral('acyclovir_iv');
    expect(useEncounterStore.getState().treatments).toEqual([{ drugId: 'acyclovir_iv' }]);

    // Select famvir_kr_250 replaces acyclovir_iv
    selectAntiviral('famvir_kr_250');
    expect(useEncounterStore.getState().treatments).toEqual([{ drugId: 'famvir_kr_250' }]);

    // Select acyclovir_iv again, then switch to oral
    selectAntiviral('acyclovir_iv');
    switchToOral('valacyclovir');
    expect(useEncounterStore.getState().treatments).toEqual([{ drugId: 'valacyclovir' }]);
  });

  it('enforces single gabapentinoid selection between pregabalin and gabapentin', () => {
    const { selectGabapentinoid, toggleTreatment } = useEncounterStore.getState();

    selectGabapentinoid('pregabalin');
    expect(useEncounterStore.getState().treatments.some((t) => t.drugId === 'pregabalin')).toBe(true);

    // Toggling gabapentin replaces pregabalin
    toggleTreatment('gabapentin');
    expect(useEncounterStore.getState().treatments.some((t) => t.drugId === 'gabapentin')).toBe(true);
    expect(useEncounterStore.getState().treatments.some((t) => t.drugId === 'pregabalin')).toBe(false);
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
