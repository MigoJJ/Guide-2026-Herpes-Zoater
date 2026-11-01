import { describe, expect, it, beforeEach } from 'vitest';
import { useEncounterStore } from '../../store';

describe('useEncounterStore Zustand store', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('starts with blank rashStage and empty treatments (Problem 17 fix)', () => {
    const { history, treatments, lesions } = useEncounterStore.getState();
    expect(history.rashStage).toBeNull();
    expect(treatments).toEqual([]);
    expect(lesions).toEqual([]);
  });

  it('allows both sides involved by toggling Left then Right into Bilateral (Problem 15 fix)', () => {
    const { toggleLesion } = useEncounterStore.getState();

    // 1. Click Left T4
    toggleLesion('T4', 'L');
    expect(useEncounterStore.getState().lesions).toEqual([{ dermatome: 'T4', side: 'L' }]);

    // 2. Click Right T4 -> Both sides involved! (Upgrades to Bilateral)
    toggleLesion('T4', 'R');
    expect(useEncounterStore.getState().lesions).toEqual([{ dermatome: 'T4', side: 'Bilateral' }]);

    // 3. Toggle Left off -> Right remains!
    toggleLesion('T4', 'L');
    expect(useEncounterStore.getState().lesions).toEqual([{ dermatome: 'T4', side: 'R' }]);

    // 4. Toggle Right off -> Removed completely
    toggleLesion('T4', 'R');
    expect(useEncounterStore.getState().lesions).toEqual([]);
  });

  it('automatically adds age_ge_50 flag for age >= 50 and removes it when age is corrected to < 50 (Problem 16 fix)', () => {
    const { setAge } = useEncounterStore.getState();

    // Enter age 55 -> age_ge_50 added
    setAge(55);
    expect(useEncounterStore.getState().history.age).toBe(55);
    expect(useEncounterStore.getState().history.riskFactors).toContain('age_ge_50');

    // Correct typo from 55 to 45 -> age_ge_50 removed!
    setAge(45);
    expect(useEncounterStore.getState().history.age).toBe(45);
    expect(useEncounterStore.getState().history.riskFactors).not.toContain('age_ge_50');

    // Re-enter 60 -> age_ge_50 added
    setAge(60);
    expect(useEncounterStore.getState().history.riskFactors).toContain('age_ge_50');

    // Clear age (null) -> age_ge_50 removed
    setAge(null);
    expect(useEncounterStore.getState().history.riskFactors).not.toContain('age_ge_50');
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

    // Starts empty
    expect(useEncounterStore.getState().treatments).toEqual([]);

    // Select valacyclovir
    selectAntiviral('valacyclovir');
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

  it('resets all state to blank on resetAll', () => {
    const { toggleLesion, setPainNrs, selectAntiviral, resetAll } = useEncounterStore.getState();
    toggleLesion('V1', 'R');
    setPainNrs(9);
    selectAntiviral('valacyclovir');

    resetAll();

    expect(useEncounterStore.getState().lesions).toEqual([]);
    expect(useEncounterStore.getState().history.painNrs).toBeNull();
    expect(useEncounterStore.getState().history.rashStage).toBeNull();
    expect(useEncounterStore.getState().treatments).toEqual([]);
  });
});
