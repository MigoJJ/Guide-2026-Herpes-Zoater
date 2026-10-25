import { describe, expect, it } from 'vitest';
import { ALL_DERMATOME_IDS, getDermatome, getDermatomesByRegion } from '../../domain/dermatomes';

describe('dermatomes domain', () => {
  it('contains cranial, cervical, thoracic, lumbar, and sacral dermatomes', () => {
    expect(ALL_DERMATOME_IDS).toContain('V1');
    expect(ALL_DERMATOME_IDS).toContain('V2');
    expect(ALL_DERMATOME_IDS).toContain('V3');
    expect(ALL_DERMATOME_IDS).toContain('C2');
    expect(ALL_DERMATOME_IDS).toContain('T4');
    expect(ALL_DERMATOME_IDS).toContain('L5');
    expect(ALL_DERMATOME_IDS).toContain('S1');
    // C1 is excluded from sensory dermatomes
    expect(ALL_DERMATOME_IDS).not.toContain('C1');
  });

  it('correctly retrieves dermatome metadata by ID', () => {
    const t4 = getDermatome('T4');
    expect(t4).toBeDefined();
    expect(t4.labelKo).toContain('흉추 4번');
    expect(t4.landmarks).toContain('유두');
    expect(t4.region).toBe('thoracic');
  });

  it('filters dermatomes by region', () => {
    const cranial = getDermatomesByRegion('cranial');
    expect(cranial.map((d) => d.id)).toEqual(['V1', 'V2', 'V3']);

    const thoracic = getDermatomesByRegion('thoracic');
    expect(thoracic).toHaveLength(12);
  });
});
