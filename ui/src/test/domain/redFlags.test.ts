import { describe, expect, it } from 'vitest';
import { evaluateRedFlags } from '../../domain/redFlags';
import type { Encounter } from '../../domain/types';

describe('redFlags rules engine', () => {
  const baseEncounter: Encounter = {
    history: {
      onsetDate: '2026-10-24',
      rashStage: 'vesicular',
      painNrs: 4,
      prodrome: ['itching'],
      riskFactors: [],
      age: 45,
      sex: 'M',
      weightKg: 70,
      serumCreatinine: 1.0,
      egfr: 90,
      crcl: 90,
      newVesiclesEmerging: false,
      ocularSymptoms: false,
      hutchinsonSign: false,
      hearingSymptoms: false,
      facialPalsy: false,
    },
    lesions: [{ dermatome: 'T4', side: 'R' }],
    treatments: [{ drugId: 'valacyclovir' }],
  };

  it('triggers critical alert for V1 involvement (HZO)', () => {
    const encounter: Encounter = {
      ...baseEncounter,
      lesions: [{ dermatome: 'V1', side: 'R' }],
    };
    const alerts = evaluateRedFlags(encounter);
    const hzo = alerts.find((a) => a.id === 'redflag-hzo');
    expect(hzo).toBeDefined();
    expect(hzo?.severity).toBe('critical');
    expect(hzo?.recommendation).toContain('안과');
  });

  it('triggers 72h exception alert when onset > 3 days but new vesicles are still emerging', () => {
    const refDate = new Date('2026-10-30'); // 6 days after
    const encounter: Encounter = {
      ...baseEncounter,
      history: {
        ...baseEncounter.history,
        onsetDate: '2026-10-24',
        newVesiclesEmerging: true,
      },
    };
    const alerts = evaluateRedFlags(encounter, refDate);
    const exception = alerts.find((a) => a.id === 'info-72h-exception');
    expect(exception).toBeDefined();
    expect(exception?.message).toContain('새로운 수포');
    expect(exception?.recommendation).toContain('강력히 권고');
  });

  it('triggers 72h exception alert for elderly (age >= 50) or severe pain (NRS >= 7)', () => {
    const refDate = new Date('2026-10-30');
    const encounterElderly: Encounter = {
      ...baseEncounter,
      history: {
        ...baseEncounter.history,
        onsetDate: '2026-10-24',
        age: 75,
        newVesiclesEmerging: false,
      },
    };
    const alerts = evaluateRedFlags(encounterElderly, refDate);
    const exception = alerts.find((a) => a.id === 'info-72h-exception');
    expect(exception).toBeDefined();
    expect(exception?.message).toContain('50세 이상');
  });

  it('warns about concomitant Tramadol + Gabapentinoid respiratory depression (FDA 2019)', () => {
    const encounterCombo: Encounter = {
      ...baseEncounter,
      treatments: [
        { drugId: 'valacyclovir' },
        { drugId: 'tramadol_apap' },
        { drugId: 'pregabalin' },
      ],
    };
    const alerts = evaluateRedFlags(encounterCombo);
    const warning = alerts.find((a) => a.id === 'warning-tramadol-gabapentinoid');
    expect(warning).toBeDefined();
    expect(warning?.title).toContain('FDA 2019');
    expect(warning?.message).toContain('호흡 억제');
  });

  it('warns about immunocompromised status with extended therapy guidance', () => {
    const encounter: Encounter = {
      ...baseEncounter,
      history: {
        ...baseEncounter.history,
        riskFactors: ['immunocompromised'],
      },
    };
    const alerts = evaluateRedFlags(encounter);
    const ic = alerts.find((a) => a.id === 'redflag-immunocompromised');
    expect(ic).toBeDefined();
    expect(ic?.severity).toBe('warning');
    expect(ic?.recommendation).toContain('가피(딱지)화');
  });

  it('prioritizes CrCl Cockcroft-Gault in renal impairment alert', () => {
    const encounter: Encounter = {
      ...baseEncounter,
      history: {
        ...baseEncounter.history,
        egfr: 56,
        crcl: 38,
      },
      treatments: [{ drugId: 'valacyclovir' }],
    };
    const alerts = evaluateRedFlags(encounter);
    const renal = alerts.find((a) => a.id === 'warning-renal-adjustment');
    expect(renal).toBeDefined();
    expect(renal?.title).toContain('CrCl');
  });
});
