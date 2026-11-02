import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useEncounterStore } from '../../store';
import {
  initEmrBridge,
  dispatchNoteToEmr,
  getConfiguredEmrOrigins,
  registerNoteProvider,
  isEmrConnected,
} from '../../shared/emr/emrBridge';

const EMR_ORIGIN = 'https://emr.hospital.test';

function sendFromEmr(data: unknown, origin = EMR_ORIGIN) {
  window.dispatchEvent(new MessageEvent('message', { data, origin, source: window }));
}

describe('EMR Bridge & Patient Session Safety (Cross-Patient Leakage Prevention)', () => {
  let cleanup: () => void = () => {};
  let postMessageSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    useEncounterStore.getState().resetAll();
    vi.restoreAllMocks();
    postMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
  });

  it('parses configured origins and never accepts the "*" wildcard', () => {
    expect(getConfiguredEmrOrigins(undefined)).toEqual([]);
    expect(getConfiguredEmrOrigins('*')).toEqual([]);
    expect(getConfiguredEmrOrigins(' https://a.test , *, https://b.test ')).toEqual([
      'https://a.test',
      'https://b.test',
    ]);
  });

  it('stays disabled when no trusted origin is configured', () => {
    cleanup = initEmrBridge([]);
    sendFromEmr({ type: 'HZ_SET_PATIENT', patientSessionKey: 'sess_x', payload: { age: 40 } });

    expect(useEncounterStore.getState().patientSessionKey).toBeNull();
    expect(postMessageSpy).not.toHaveBeenCalled();

    cleanup = initEmrBridge(['*']);
    sendFromEmr({ type: 'HZ_SET_PATIENT', patientSessionKey: 'sess_x' });
    expect(useEncounterStore.getState().patientSessionKey).toBeNull();
  });

  it('ignores messages from an untrusted origin', () => {
    cleanup = initEmrBridge([EMR_ORIGIN]);
    sendFromEmr({ type: 'HZ_SET_PATIENT', patientSessionKey: 'sess_attacker' }, 'https://evil.test');

    expect(useEncounterStore.getState().patientSessionKey).toBeNull();
    expect(isEmrConnected()).toBe(false);
    expect(postMessageSpy).not.toHaveBeenCalled();
  });

  it('purges all previous patient data and replies only to the trusted origin on HZ_SET_PATIENT', () => {
    cleanup = initEmrBridge([EMR_ORIGIN]);

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
    expect(useEncounterStore.getState().lesions.length).toBe(1);

    sendFromEmr({
      type: 'HZ_SET_PATIENT',
      patientSessionKey: 'sess_patient_B_young_male',
      payload: { age: 32, sex: 'M', weightKg: 78, serumCreatinine: 0.8, egfr: 110 },
    });

    const state = useEncounterStore.getState();
    expect(state.patientSessionKey).toBe('sess_patient_B_young_male');
    expect(state.lesions).toEqual([]);
    expect(state.treatments).toEqual([]);
    expect(state.history.painNrs).toBeNull();
    expect(state.history.age).toBe(32);
    expect(state.history.riskFactors).not.toContain('age_ge_50');
    expect(state.history.crcl).toBeGreaterThan(100);

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HZ_PATIENT_LOADED', patientSessionKey: 'sess_patient_B_young_male' }),
      EMR_ORIGIN
    );
    expect(postMessageSpy).not.toHaveBeenCalledWith(expect.anything(), '*');
  });

  it('rejects HZ_REQUEST_NOTE when session key mismatches', () => {
    cleanup = initEmrBridge([EMR_ORIGIN]);
    useEncounterStore.getState().setPatientSession('sess_active_patient_A');

    sendFromEmr({ type: 'HZ_REQUEST_NOTE', patientSessionKey: 'sess_stale_patient_OLD' });

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'HZ_SESSION_MISMATCH_ERROR',
        patientSessionKey: 'sess_active_patient_A',
        requestedSessionKey: 'sess_stale_patient_OLD',
      }),
      EMR_ORIGIN
    );
    expect(postMessageSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HZ_NOTE_RESPONSE' }),
      expect.anything()
    );
  });

  it('rejects HZ_REQUEST_NOTE without a session key instead of skipping the check', () => {
    cleanup = initEmrBridge([EMR_ORIGIN]);
    useEncounterStore.getState().setPatientSession('sess_active_patient_A');

    sendFromEmr({ type: 'HZ_REQUEST_NOTE' });

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HZ_SESSION_MISMATCH_ERROR' }),
      EMR_ORIGIN
    );
    expect(postMessageSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HZ_NOTE_RESPONSE' }),
      expect.anything()
    );
  });

  it('returns the displayed note (including manual edits) in HZ_NOTE_RESPONSE', () => {
    cleanup = initEmrBridge([EMR_ORIGIN]);
    useEncounterStore.getState().setPatientSession('sess_note_owner');
    const unregister = registerNoteProvider(() => '[S] 의사 직접 수정한 노트');

    sendFromEmr({ type: 'HZ_REQUEST_NOTE', patientSessionKey: 'sess_note_owner' });

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'HZ_NOTE_RESPONSE',
        patientSessionKey: 'sess_note_owner',
        soapNote: '[S] 의사 직접 수정한 노트',
      }),
      EMR_ORIGIN
    );
    unregister();
  });

  it('falls back to the generated note when no note panel is registered', () => {
    cleanup = initEmrBridge([EMR_ORIGIN]);
    sendFromEmr({
      type: 'HZ_SET_PATIENT',
      patientSessionKey: 'sess_generated',
      payload: { age: 70, sex: 'F' },
    });

    sendFromEmr({ type: 'HZ_REQUEST_NOTE', patientSessionKey: 'sess_generated' });

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'HZ_NOTE_RESPONSE',
        soapNote: expect.stringContaining('50세 이상'),
      }),
      EMR_ORIGIN
    );
  });

  it('sends HZ_SAVE_NOTE with the session key to the trusted origin only', () => {
    cleanup = initEmrBridge([EMR_ORIGIN]);
    sendFromEmr({ type: 'HZ_SET_PATIENT', patientSessionKey: 'sess_verified_12345' });

    const sent = dispatchNoteToEmr('[S] Test note\n[O] Exam\n[A] Assessment\n[P] Plan');

    expect(sent).toBe(true);
    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'HZ_SAVE_NOTE',
        patientSessionKey: 'sess_verified_12345',
        soapNote: expect.stringContaining('[S] Test note'),
      }),
      EMR_ORIGIN
    );
  });

  it('does not send the note when no trusted EMR is connected', () => {
    useEncounterStore.getState().setPatientSession('sess_without_bridge');

    expect(dispatchNoteToEmr('[S] PHI note')).toBe(false);
    expect(postMessageSpy).not.toHaveBeenCalled();
  });

  it('converts weight from lb to kg and receives lab dates from US EMR payload', () => {
    cleanup = initEmrBridge([EMR_ORIGIN]);

    sendFromEmr({
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
    });

    const history = useEncounterStore.getState().history;
    expect(history.weightUnit).toBe('lb');
    expect(history.weightInputValue).toBe(110.23);
    expect(history.weightKg).toBe(50);
    expect(history.serumCreatinineDate).toBe('2026-09-01');
    expect(history.crcl).toBe(38.4);
  });
});
