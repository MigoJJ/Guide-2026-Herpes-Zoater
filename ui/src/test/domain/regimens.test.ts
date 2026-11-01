import { describe, expect, it } from 'vitest';
import { calculateAdjustedDose, calculateCockcroftGault } from '../../domain/regimens';

describe('regimens domain & renal adjustment', () => {
  it('calculates Cockcroft-Gault CrCl accurately', () => {
    // 75 yo female, 50 kg, sCr 1.0 mg/dL -> ~38.4 mL/min
    const crclFemale = calculateCockcroftGault(75, 'F', 50, 1.0);
    expect(crclFemale).toBe(38.4);

    // 60 yo male, 70 kg, sCr 1.0 mg/dL -> ~77.8 mL/min
    const crclMale = calculateCockcroftGault(60, 'M', 70, 1.0);
    expect(crclMale).toBe(77.8);

    // Null inputs
    expect(calculateCockcroftGault(null, 'M', 70, 1.0)).toBeNull();
  });

  it('adjusts Valacyclovir dose for Cockcroft-Gault CrCl thresholds', () => {
    // Normal: CrCl >= 50
    const normal = calculateAdjustedDose('valacyclovir', { crcl: 65, egfr: 70 });
    expect(normal.dose).toBe('1000 mg');
    expect(normal.frequency).toContain('TID');
    expect(normal.isAdjusted).toBe(false);

    // Near threshold (50-59) warning
    const near = calculateAdjustedDose('valacyclovir', { crcl: 52, egfr: 56, age: 72 });
    expect(near.isAdjusted).toBe(false);
    expect(near.renalWarning).toContain('신경독성');

    // Moderate: CrCl 30-49 -> 1000 mg BID
    const mod = calculateAdjustedDose('valacyclovir', { crcl: 38, egfr: 56 });
    expect(mod.dose).toBe('1000 mg');
    expect(mod.frequency).toContain('BID');
    expect(mod.isAdjusted).toBe(true);
    expect(mod.renalMetricUsed).toBe('CrCl');

    // Severe: CrCl 10-29 -> 1000 mg QD
    const sev = calculateAdjustedDose('valacyclovir', { crcl: 20, egfr: 25 });
    expect(sev.dose).toBe('1000 mg');
    expect(sev.frequency).toContain('QD');
    expect(sev.isAdjusted).toBe(true);

    // ESRD: CrCl < 10 -> 500 mg QD
    const esrd = calculateAdjustedDose('valacyclovir', { crcl: 8, egfr: 10 });
    expect(esrd.dose).toBe('500 mg');
    expect(esrd.frequency).toContain('QD');
    expect(esrd.isAdjusted).toBe(true);
  });

  it('adjusts Famciclovir FDA (500mg) vs Famvir Korean MFDS (250mg)', () => {
    // Famciclovir FDA 500mg: CrCl 45 -> 500 mg BID
    const fdaMod = calculateAdjustedDose('famciclovir', { crcl: 45, egfr: 50 });
    expect(fdaMod.dose).toBe('500 mg');
    expect(fdaMod.frequency).toContain('BID');
    expect(fdaMod.isAdjusted).toBe(true);

    // Famvir Korean MFDS 250mg: uses eGFR/CrCl: 45 -> 250 mg BID
    const krMod = calculateAdjustedDose('famvir_kr_250', { crcl: null, egfr: 45 });
    expect(krMod.dose).toBe('250 mg');
    expect(krMod.frequency).toContain('BID');
    expect(krMod.isAdjusted).toBe(true);

    // Hemodialysis
    const krHd = calculateAdjustedDose('famvir_kr_250', { crcl: 5, egfr: 5 });
    expect(krHd.frequency).toContain('투석 직후');
  });

  it('adjusts Acyclovir Oral for CrCl <= 25 mL/min', () => {
    const normal = calculateAdjustedDose('acyclovir_oral', { crcl: 35, egfr: 40 });
    expect(normal.dose).toBe('800 mg');
    expect(normal.frequency).toContain('5 times/day');
    expect(normal.isAdjusted).toBe(false);

    const mod = calculateAdjustedDose('acyclovir_oral', { crcl: 20, egfr: 20 });
    expect(mod.frequency).toContain('q8h');
    expect(mod.isAdjusted).toBe(true);

    const sev = calculateAdjustedDose('acyclovir_oral', { crcl: 8, egfr: 8 });
    expect(sev.frequency).toContain('q12h');
    expect(sev.isAdjusted).toBe(true);
  });

  it('calculates weight-based Acyclovir IV and handles indications', () => {
    // 60 kg, normal renal
    const ivNormal = calculateAdjustedDose('acyclovir_iv', {
      crcl: 70,
      egfr: 75,
      weightKg: 60,
      ivIndication: 'disseminated_immunocompromised',
    });
    expect(ivNormal.dose).toBe('600 mg (10 mg/kg)');
    expect(ivNormal.frequency).toContain('q8h');
    expect(ivNormal.durationDays).toBe(7);

    // CNS involvement indication: 14 days duration
    const ivCns = calculateAdjustedDose('acyclovir_iv', {
      crcl: 70,
      egfr: 75,
      weightKg: 70,
      ivIndication: 'cns_involvement',
    });
    expect(ivCns.dose).toBe('700 mg (10 mg/kg)');
    expect(ivCns.durationDays).toBe(14);

    // Impaired CrCl 35: q12h interval
    const ivRenal = calculateAdjustedDose('acyclovir_iv', {
      crcl: 35,
      egfr: 40,
      weightKg: 60,
    });
    expect(ivRenal.frequency).toContain('q12h');
    expect(ivRenal.isAdjusted).toBe(true);
  });

  it('manages Foscarnet IV and pharmacist consult warning', () => {
    const foscarnetMod = calculateAdjustedDose('foscarnet_iv', { crcl: 45, egfr: 45, weightKg: 60 });
    expect(foscarnetMod.isAdjusted).toBe(true);
    expect(foscarnetMod.renalWarning).toContain('약제부');
  });

  it('adjusts Gabapentinoid starting doses and caps in CKD', () => {
    const pregabalinAdj = calculateAdjustedDose('pregabalin', { crcl: 25, egfr: 30 });
    expect(pregabalinAdj.isAdjusted).toBe(true);
    expect(pregabalinAdj.dose).toBe('25-50 mg/day');

    const gabapentinAdj = calculateAdjustedDose('gabapentin', { crcl: 38, egfr: 56 });
    expect(gabapentinAdj.isAdjusted).toBe(true);
    expect(gabapentinAdj.renalWarning).toContain('1400mg/day');
  });
});
