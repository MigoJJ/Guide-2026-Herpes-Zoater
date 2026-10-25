import { describe, expect, it } from 'vitest';
import { calculateAdjustedDose } from '../../domain/regimens';

describe('regimens domain & renal adjustment', () => {
  it('returns standard doses when eGFR is normal (>= 60) or null', () => {
    const valNormal = calculateAdjustedDose('valacyclovir', 85);
    expect(valNormal.dose).toBe('1000 mg');
    expect(valNormal.frequency).toContain('TID');
    expect(valNormal.isAdjusted).toBe(false);

    const valNull = calculateAdjustedDose('valacyclovir', null);
    expect(valNull.isAdjusted).toBe(false);
    expect(valNull.dose).toBe('1000 mg');
  });

  it('adjusts Valacyclovir dose for impaired eGFR thresholds', () => {
    // eGFR 30-49 -> 1000 mg BID
    const mod = calculateAdjustedDose('valacyclovir', 40);
    expect(mod.dose).toBe('1000 mg');
    expect(mod.frequency).toContain('BID');
    expect(mod.isAdjusted).toBe(true);

    // eGFR 10-29 -> 1000 mg QD
    const sev = calculateAdjustedDose('valacyclovir', 20);
    expect(sev.dose).toBe('1000 mg');
    expect(sev.frequency).toContain('QD');
    expect(sev.isAdjusted).toBe(true);

    // eGFR < 10 -> 500 mg QD
    const esrd = calculateAdjustedDose('valacyclovir', 8);
    expect(esrd.dose).toBe('500 mg');
    expect(esrd.frequency).toContain('QD');
    expect(esrd.isAdjusted).toBe(true);
  });

  it('adjusts Famciclovir dose correctly for renal impairment', () => {
    // eGFR 40-59 -> 500 mg BID
    const mild = calculateAdjustedDose('famciclovir', 45);
    expect(mild.dose).toBe('500 mg');
    expect(mild.frequency).toContain('BID');
    expect(mild.isAdjusted).toBe(true);

    // eGFR 20-39 -> 500 mg QD
    const mod = calculateAdjustedDose('famciclovir', 30);
    expect(mod.dose).toBe('500 mg');
    expect(mod.frequency).toContain('QD');
    expect(mod.isAdjusted).toBe(true);

    // eGFR < 20 -> 250 mg QD
    const sev = calculateAdjustedDose('famciclovir', 15);
    expect(sev.dose).toBe('250 mg');
    expect(sev.frequency).toContain('QD');
    expect(sev.isAdjusted).toBe(true);
  });

  it('warns about NSAID use in renal impairment', () => {
    const nsaidAdj = calculateAdjustedDose('nsaid_ibuprofen', 45);
    expect(nsaidAdj.isAdjusted).toBe(true);
    expect(nsaidAdj.renalWarning).toContain('NSAID');
  });

  it('adjusts Gabapentinoid starting doses in CKD', () => {
    const pregabalinAdj = calculateAdjustedDose('pregabalin', 25);
    expect(pregabalinAdj.isAdjusted).toBe(true);
    expect(pregabalinAdj.dose).toBe('25-50 mg');

    const gabapentinAdj = calculateAdjustedDose('gabapentin', 40);
    expect(gabapentinAdj.isAdjusted).toBe(true);
    expect(gabapentinAdj.frequency).toContain('QD');
  });
});
