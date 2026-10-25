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
      egfr: 90,
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

  it('triggers critical alert for Hutchinson sign or ocular symptoms even without V1 explicit selection', () => {
    const encounter: Encounter = {
      ...baseEncounter,
      history: {
        ...baseEncounter.history,
        hutchinsonSign: true,
      },
    };
    const alerts = evaluateRedFlags(encounter);
    const hzo = alerts.find((a) => a.id === 'redflag-hzo');
    expect(hzo).toBeDefined();
    expect(hzo?.severity).toBe('critical');
  });

  it('triggers Ramsay Hunt syndrome alert when auditory or facial symptoms are present', () => {
    const encounter: Encounter = {
      ...baseEncounter,
      history: {
        ...baseEncounter.history,
        hearingSymptoms: true,
        facialPalsy: true,
      },
    };
    const alerts = evaluateRedFlags(encounter);
    const rh = alerts.find((a) => a.id === 'redflag-ramsay-hunt');
    expect(rh).toBeDefined();
    expect(rh?.severity).toBe('critical');
    expect(rh?.recommendation).toContain('이비인후과');
  });

  it('triggers disseminated zoster alert when >= 3 dermatomes or bilateral', () => {
    const encounterMulti: Encounter = {
      ...baseEncounter,
      lesions: [
        { dermatome: 'T4', side: 'R' },
        { dermatome: 'T5', side: 'R' },
        { dermatome: 'L1', side: 'R' },
      ],
    };
    const alerts = evaluateRedFlags(encounterMulti);
    const dissem = alerts.find((a) => a.id === 'redflag-disseminated');
    expect(dissem).toBeDefined();
    expect(dissem?.severity).toBe('critical');
    expect(dissem?.recommendation).toContain('IV Acyclovir');
  });

  it('warns about immunocompromised status regardless of onset timing', () => {
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
  });

  it('informs about delayed presentation (>72h) in immunocompetent patients', () => {
    const refDate = new Date('2026-10-30'); // 6 days after 2026-10-24
    const encounter: Encounter = {
      ...baseEncounter,
      history: {
        ...baseEncounter.history,
        onsetDate: '2026-10-24',
      },
    };
    const alerts = evaluateRedFlags(encounter, refDate);
    const delay = alerts.find((a) => a.id === 'info-delayed-presentation');
    expect(delay).toBeDefined();
    expect(delay?.severity).toBe('info');
  });

  it('warns about renal adjustment when eGFR is low with active antiviral', () => {
    const encounter: Encounter = {
      ...baseEncounter,
      history: {
        ...baseEncounter.history,
        egfr: 35,
      },
      treatments: [{ drugId: 'valacyclovir' }],
    };
    const alerts = evaluateRedFlags(encounter);
    const renal = alerts.find((a) => a.id === 'warning-renal-adjustment');
    expect(renal).toBeDefined();
    expect(renal?.severity).toBe('warning');
  });
});
