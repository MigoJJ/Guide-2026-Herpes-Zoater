import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useEncounterStore } from '../../store';
import {
  initEmrBridge,
  dispatchNoteToEmr,
} from '../../shared/emr/emrBridge';

describe('EMR Bridge & Patient Session Safety (Cross-Patient Leakage Prevention)', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
    vi.clearAllMocks();
  });

  it('notifies host EMR of HZ_WIDGET_READY on initialization', () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage');
    const cleanup = initEmrBridge();

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'HZ_WIDGET_READY',
        version: '0.1.0',
      }),
      '*'
    );

    cleanup();
  });

  it('purges all previous patient data and populates new demographics on HZ_SET_PATIENT', () => {
    const cleanup = initEmrBridge();

    // 1. Simulate Patient A (Elderly female with T4 lesion and treatments)
    useEncounterStore.getState().setPatientSession('sess_patient_A', {
      age: 75,
      sex: 'F',
      weightKg: 50,
      serumCreatinine: 1.0,
      egfr: 56,
    });
    useEncounterStore.getState().toggleLesion('T4', 'R');
    useEncounterStore.getState().setPainNrs(8);
    useEncounterStore.getState().selectAntiviral('valacyclovir');

    // Verify Patient A has active clinical data
    expect(useEncounterStore.getState().patientSessionKey).toBe('sess_patient_A');
    expect(useEncounterStore.getState().lesions.length).toBe(1);
    expect(useEncounterStore.getState().treatments.length).toBe(1);
    expect(useEncounterStore.getState().history.painNrs).toBe(8);

    // 2. Doctor switches patient in EMR -> EMR dispatches HZ_SET_PATIENT for Patient B
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'HZ_SET_PATIENT',
          patientSessionKey: 'sess_patient_B_young_male',
          payload: {
            age: 32,
            sex: 'M',
            weightKg: 78,
            serumCreatinine: 0.8,
            egfr: 110,
          },
        },
      })
    );

    // 3. CRITICAL VERIFICATION: Patient A's lesions, pain, and treatments MUST be purged!
    const state = useEncounterStore.getState();
    expect(state.patientSessionKey).toBe('sess_patient_B_young_male');
    expect(state.lesions).toEqual([]); // Completely wiped!
    expect(state.treatments).toEqual([]); // Completely wiped!
    expect(state.history.painNrs).toBeNull(); // Completely wiped!

    // Patient B demographics correctly loaded
    expect(state.history.age).toBe(32);
    expect(state.history.sex).toBe('M');
    expect(state.history.riskFactors).not.toContain('age_ge_50'); // Removed for 32yo!
    expect(state.history.crcl).toBeGreaterThan(100);

    cleanup();
  });

  it('rejects HZ_REQUEST_NOTE when session key mismatches to prevent saving to wrong patient', () => {
    const cleanup = initEmrBridge();
    const postMessageSpy = vi.spyOn(window, 'postMessage');

    // Active patient is Patient A
    useEncounterStore.getState().setPatientSession('sess_active_patient_A');

    // Host EMR erroneously requests note with a stale session key
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'HZ_REQUEST_NOTE',
          patientSessionKey: 'sess_stale_patient_OLD',
        },
      })
    );

    // Must return critical session mismatch error
    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'HZ_SESSION_MISMATCH_ERROR',
        patientSessionKey: 'sess_active_patient_A',
        requestedSessionKey: 'sess_stale_patient_OLD',
      }),
      '*'
    );

    cleanup();
  });

  it('includes active patientSessionKey when dispatching note to EMR', () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage');
    useEncounterStore.getState().setPatientSession('sess_verified_12345');

    dispatchNoteToEmr('[S] Test note\n[O] Exam\n[A] Assessment\n[P] Plan');

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'HZ_SAVE_NOTE',
        patientSessionKey: 'sess_verified_12345',
        soapNote: expect.stringContaining('[S] Test note'),
      }),
      '*'
    );
  });

  it('converts weight from lb to kg and receives lab dates from US EMR payload', () => {
    const cleanup = initEmrBridge();

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'HZ_SET_PATIENT',
          patientSessionKey: 'sess_us_patient_110lb',
          payload: {
            age: 75,
            sex: 'F',
            weight: 110.23, // 110.23 lb ≈ 50.0 kg
            weightUnit: 'lb',
            serumCreatinine: 1.0,
            serumCreatinineDate: '2026-09-01',
          },
        },
      })
    );

    const history = useEncounterStore.getState().history;
    expect(history.weightUnit).toBe('lb');
    expect(history.weightInputValue).toBe(110.23);
    expect(history.weightKg).toBe(50); // Converted to kg!
    expect(history.serumCreatinineDate).toBe('2026-09-01');
    expect(history.crcl).toBe(38.4); // CrCl computed from converted 50kg!

    cleanup();
  });
});
