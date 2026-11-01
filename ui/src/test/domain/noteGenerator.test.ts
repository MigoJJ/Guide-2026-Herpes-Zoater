import { describe, expect, it } from 'vitest';
import { generateNote } from '../../domain/noteGenerator';
import type { Encounter } from '../../domain/types';

describe('noteGenerator pure function', () => {
  const fixedDate = new Date('2026-10-25T12:00:00Z');

  it('generates standard thoracic zoster SOAP note within 72h window', () => {
    const encounter: Encounter = {
      history: {
        onsetDate: '2026-10-24',
        rashStage: 'vesicular',
        painNrs: 6,
        prodrome: ['tingling', 'burning'],
        riskFactors: ['age_ge_50'],
        age: 58,
        sex: 'M',
        weightKg: 68,
        serumCreatinine: 0.9,
        egfr: 88,
        crcl: 85,
        newVesiclesEmerging: false,
        ocularSymptoms: false,
        hutchinsonSign: false,
        hearingSymptoms: false,
        facialPalsy: false,
      },
      lesions: [{ dermatome: 'T4', side: 'R' }],
      treatments: [
        { drugId: 'valacyclovir' },
        { drugId: 'pregabalin' },
      ],
    };

    const note = generateNote(encounter, { locale: 'ko', referenceDate: fixedDate });

    expect(note).toContain('[S]');
    expect(note).toContain('58세/남성/68kg');
    expect(note).toContain('우측(Right) T4 부위');
    expect(note).toContain('NRS 6/10');
    expect(note).toContain('작열감(화끈거림)');

    expect(note).toContain('[O]');
    expect(note).toContain('군집성 수포');
    expect(note).toContain('정중선(midline)을 넘지 않음');

    expect(note).toContain('[A]');
    expect(note).toContain('Herpes zoster without complications');
    expect(note).toContain('B02.9');
    expect(note).toContain('골든타임');

    expect(note).toContain('[P]');
    expect(note).toContain('발라시클로버');
    expect(note).toContain('1000 mg PO TID');
    expect(note).toContain('프레가발린');
    expect(note).toContain('싱그릭스');
  });

  it('generates Herpes Zoster Ophthalmicus (B02.30) note with urgent eye referral', () => {
    const encounter: Encounter = {
      history: {
        onsetDate: '2026-10-23',
        rashStage: 'vesicular',
        painNrs: 8,
        prodrome: ['headache', 'fever'],
        riskFactors: [],
        age: 62,
        sex: 'F',
        weightKg: 55,
        serumCreatinine: 0.8,
        egfr: 95,
        crcl: 68,
        newVesiclesEmerging: false,
        ocularSymptoms: true,
        hutchinsonSign: true,
        hearingSymptoms: false,
        facialPalsy: false,
      },
      lesions: [{ dermatome: 'V1', side: 'L' }],
      treatments: [{ drugId: 'valacyclovir' }],
    };

    const note = generateNote(encounter, { locale: 'ko', referenceDate: fixedDate });

    expect(note).toContain('B02.30');
    expect(note).toContain('Herpes zoster ophthalmicus');
    expect(note).toContain('안과(Ophthalmology) 당일 즉시 응급 협진 의뢰');
  });

  it('generates Ramsay Hunt syndrome (B02.21) note with ENT/neuro referral', () => {
    const encounter: Encounter = {
      history: {
        onsetDate: '2026-10-24',
        rashStage: 'vesicular',
        painNrs: 7,
        prodrome: ['malaise'],
        riskFactors: [],
        age: 50,
        sex: 'M',
        weightKg: 75,
        serumCreatinine: 1.0,
        egfr: 80,
        crcl: 85,
        newVesiclesEmerging: false,
        ocularSymptoms: false,
        hutchinsonSign: false,
        hearingSymptoms: true,
        facialPalsy: true,
      },
      lesions: [{ dermatome: 'C2', side: 'R' }],
      treatments: [{ drugId: 'valacyclovir' }],
    };

    const note = generateNote(encounter, { locale: 'ko', referenceDate: fixedDate });

    expect(note).toContain('B02.21');
    expect(note).toContain('Ramsay Hunt syndrome');
    expect(note).toContain('이비인후과/신경과 협진');
  });

  it('generates Disseminated Zoster (B02.7) note with admission recommendation', () => {
    const encounter: Encounter = {
      history: {
        onsetDate: '2026-10-22',
        rashStage: 'vesicular',
        painNrs: 5,
        prodrome: ['fever'],
        riskFactors: ['immunocompromised'],
        age: 65,
        sex: 'M',
        weightKg: 60,
        serumCreatinine: 1.1,
        egfr: 60,
        crcl: 55,
        newVesiclesEmerging: true,
        ocularSymptoms: false,
        hutchinsonSign: false,
        hearingSymptoms: false,
        facialPalsy: false,
      },
      lesions: [
        { dermatome: 'T3', side: 'L' },
        { dermatome: 'T7', side: 'L' },
        { dermatome: 'L2', side: 'L' },
      ],
      treatments: [{ drugId: 'acyclovir_iv', ivIndication: 'disseminated_immunocompromised' }],
    };

    const note = generateNote(encounter, { locale: 'ko', referenceDate: fixedDate });

    expect(note).toContain('B02.7');
    expect(note).toContain('Disseminated herpes zoster');
    expect(note).toContain('내과 입원(공기/접촉 격리 병실) 및 정맥주사');
    expect(note).toContain('600 mg (10 mg/kg)');
  });

  it('reflects CrCl Cockcroft-Gault renal dose adjustment in note', () => {
    const encounter: Encounter = {
      history: {
        onsetDate: '2026-10-24',
        rashStage: 'vesicular',
        painNrs: 5,
        prodrome: [],
        riskFactors: ['ckd'],
        age: 75,
        sex: 'F',
        weightKg: 50,
        serumCreatinine: 1.0,
        egfr: 56,
        crcl: 38.4,
        newVesiclesEmerging: false,
        ocularSymptoms: false,
        hutchinsonSign: false,
        hearingSymptoms: false,
        facialPalsy: false,
      },
      lesions: [{ dermatome: 'T10', side: 'R' }],
      treatments: [{ drugId: 'valacyclovir' }],
    };

    const note = generateNote(encounter, { locale: 'ko', referenceDate: fixedDate });

    expect(note).toContain('CrCl(Cockcroft-Gault): 38.4 mL/min');
    expect(note).toContain('1000 mg PO BID');
    expect(note).toContain('[CrCl 기준 용량 감량됨]');
  });
});
