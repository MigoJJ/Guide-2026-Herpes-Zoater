import { z } from 'zod';

export const DermatomeIdSchema = z.enum([
  'V1',
  'V2',
  'V3',
  'C2',
  'C3',
  'C4',
  'C5',
  'C6',
  'C7',
  'C8',
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'T8',
  'T9',
  'T10',
  'T11',
  'T12',
  'L1',
  'L2',
  'L3',
  'L4',
  'L5',
  'S1',
  'S2',
  'S3',
  'S4',
  'S5',
]);

export const SideSchema = z.enum(['L', 'R', 'Bilateral']);

export const LesionSelectionSchema = z.object({
  dermatome: DermatomeIdSchema,
  side: SideSchema,
});

export const RashStageSchema = z.enum(['erythema', 'vesicular', 'pustular', 'crusted']);

export const ProdromeSymptomSchema = z.enum([
  'fever',
  'malaise',
  'itching',
  'tingling',
  'burning',
  'headache',
]);

export const RiskFactorSchema = z.enum([
  'immunocompromised',
  'ckd',
  'age_ge_50',
  'pregnancy',
  'diabetes',
]);

export const HistorySchema = z.object({
  onsetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid ISO date string (YYYY-MM-DD)')
    .nullable(),
  rashStage: RashStageSchema.nullable(),
  painNrs: z
    .number()
    .min(0, 'NRS score must be between 0 and 10')
    .max(10, 'NRS score must be between 0 and 10')
    .nullable(),
  prodrome: z.array(ProdromeSymptomSchema),
  riskFactors: z.array(RiskFactorSchema),
  egfr: z.number().min(0).max(200).nullable(),
  ocularSymptoms: z.boolean(),
  hutchinsonSign: z.boolean(),
  hearingSymptoms: z.boolean(),
  facialPalsy: z.boolean(),
});

export const RegimenSelectionSchema = z.object({
  drugId: z.string().min(1),
  doseOverride: z.string().optional(),
  frequencyOverride: z.string().optional(),
  durationDays: z.number().int().positive().optional(),
});

export const EncounterSchema = z.object({
  history: HistorySchema,
  lesions: z.array(LesionSelectionSchema),
  treatments: z.array(RegimenSelectionSchema),
});
