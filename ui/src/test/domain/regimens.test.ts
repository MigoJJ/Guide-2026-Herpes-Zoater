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

  it('adjusts Valacyclovir dose for Cockcroft-Gault CrCl thresholds and handles Item 7', () => {
    // Normal: CrCl >= 50
    const normal = calculateAdjustedDose('valacyclovir', { crcl: 65, egfr: 70 });
    expect(normal.dose).toBe('1000 mg');
    expect(normal.frequency).toContain('TID');
    expect(normal.isAdjusted).toBe(false);

    // Near threshold (50-59) warning
    const near = calculateAdjustedDose('valacyclovir', { crcl: 52, egfr: 56, age: 72 });
    expect(near.isAdjusted).toBe(false);
    expect(near.renalWarning).toContain('신경독성');

    // Item 7 check: elderly with null renal metrics must NOT print "Standard null mL/min"
    const elderlyNullRenal = calculateAdjustedDose('valacyclovir', { crcl: null, egfr: null, age: 70 });
    expect(elderlyNullRenal.renalWarning).toBeDefined();
    expect(elderlyNullRenal.renalWarning).not.toContain('null');
    expect(elderlyNullRenal.renalWarning).not.toContain('Standard');
    expect(elderlyNullRenal.renalWarning).toContain('고령자(70세)');

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

  it('adjusts Famciclovir FDA (500mg) vs Famvir Korean MFDS (250mg) and handles Item 5', () => {
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

    // Item 5 check: Famvir 250mg for ESRD (<10) supports non-dialysis (q48h) as well as dialysis
    const krHd = calculateAdjustedDose('famvir_kr_250', { crcl: 5, egfr: 5 });
    expect(krHd.frequency).toContain('q48h');
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

  it('handles Acyclovir IV weight requirement and does NOT assume 60kg when missing (Item 3 fix)', () => {
    // Missing weight (null) -> does NOT assume 60kg!
    const ivNoWeight = calculateAdjustedDose('acyclovir_iv', {
      crcl: 70,
      egfr: 75,
      weightKg: null,
    });
    expect(ivNoWeight.dose).toBe('10 mg/kg (체중 입력 필요)');
    expect(ivNoWeight.weightAdjustedMg).toBeUndefined();
    expect(ivNoWeight.renalWarning).toContain('체중(kg)을 입력하면');

    // Entered weight: 70kg -> 700 mg (10 mg/kg)
    const ivWithWeight = calculateAdjustedDose('acyclovir_iv', {
      crcl: 70,
      egfr: 75,
      weightKg: 70,
    });
    expect(ivWithWeight.dose).toBe('700 mg (10 mg/kg)');
    expect(ivWithWeight.weightAdjustedMg).toBe(700);

    // CNS involvement indication: 14 days duration
    const ivCns = calculateAdjustedDose('acyclovir_iv', {
      crcl: 70,
      egfr: 75,
      weightKg: 70,
      ivIndication: 'cns_involvement',
    });
    expect(ivCns.durationDays).toBe(14);
    expect(ivCns.renalWarning).toContain('중추신경계');

    // Impaired CrCl 35: q12h interval
    const ivRenal = calculateAdjustedDose('acyclovir_iv', {
      crcl: 35,
      egfr: 40,
      weightKg: 60,
    });
    expect(ivRenal.frequency).toContain('q12h');
    expect(ivRenal.isAdjusted).toBe(true);
  });

  it('manages Foscarnet IV without assuming 60kg when missing', () => {
    const foscarnetNoWeight = calculateAdjustedDose('foscarnet_iv', { crcl: 70, egfr: 70, weightKg: null });
    expect(foscarnetNoWeight.dose).toBe('40-60 mg/kg (체중 입력 필요)');
    expect(foscarnetNoWeight.weightAdjustedMg).toBeUndefined();

    const foscarnetMod = calculateAdjustedDose('foscarnet_iv', { crcl: 45, egfr: 45, weightKg: 60 });
    expect(foscarnetMod.isAdjusted).toBe(true);
    expect(foscarnetMod.renalWarning).toContain('약제부');
  });

  it('verifies Gabapentin starting dose 300 mg QHS and max cap for CrCl 30-59 (Item 4 fix)', () => {
    const gabapentinMod = calculateAdjustedDose('gabapentin', { crcl: 40, egfr: 50 });
    expect(gabapentinMod.isAdjusted).toBe(true);
    // Starting dose must be 300 mg, not 200-700
    expect(gabapentinMod.dose).toBe('300 mg');
    expect(gabapentinMod.frequency).toContain('QHS');
    expect(gabapentinMod.renalWarning).toContain('최대 1400mg/day');

    // Item 5 check: for ESRD (<15), does not assume dialysis only
    const gabapentinEsrd = calculateAdjustedDose('gabapentin', { crcl: 10, egfr: 10 });
    expect(gabapentinEsrd.dose).toBe('100-300 mg');
    expect(gabapentinEsrd.frequency).toContain('PO QD');
    expect(gabapentinEsrd.frequency).toContain('혈액투석 환자는');

    // Current Neurontin label for CrCl 15-29: 200-700 mg/day QD (not QOD)
    const gabapentinSevere = calculateAdjustedDose('gabapentin', { crcl: 20, egfr: 22 });
    expect(gabapentinSevere.dose).toBe('200-300 mg');
    expect(gabapentinSevere.frequency).toContain('최대 700mg/day');
    expect(gabapentinSevere.frequency).not.toContain('QOD');
  });

  it('ensures Ibuprofen in CKD has isAdjusted: false to prevent false "용량 감량됨" label (Item 6 fix)', () => {
    const nsaidCkd = calculateAdjustedDose('nsaid_ibuprofen', { crcl: 40, egfr: 50 });
    // Dose is NOT adjusted (reduced); it is cautioned/avoided!
    expect(nsaidCkd.isAdjusted).toBe(false);
    expect(nsaidCkd.renalWarning).toContain('신독성');
  });
});
