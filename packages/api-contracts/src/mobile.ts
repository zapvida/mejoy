import { z } from 'zod';

export const mobileFeatureFlagsSchema = z.object({
  dashboard: z.boolean(),
  wearables: z.boolean(),
  mealAi: z.boolean(),
  sleep: z.boolean(),
  meditation: z.boolean(),
  clinicalShare: z.boolean(),
  consultRequest: z.boolean(),
  glp1Tracking: z.boolean(),
  push: z.boolean(),
});

export const dashboardPrimaryActionSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(['primary', 'secondary', 'support']),
}).nullable();

export const mobileProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  whatsapp: z.string().nullable(),
  sex: z.string().nullable(),
  birthDate: z.string().nullable(),
  weightKg: z.number().nullable(),
  heightCm: z.number().nullable(),
  bmi: z.number().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const dashboardNotificationSchema = z.object({
  id: z.string(),
  level: z.enum(['info', 'success', 'warning', 'critical']),
  title: z.string(),
  body: z.string(),
  cta: dashboardPrimaryActionSchema.optional(),
});

export const mobileOrderSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.string(),
  amountCents: z.number(),
  createdAt: z.string(),
  href: z.string().optional(),
});

export const mobileReportSchema = z.object({
  id: z.string(),
  triageId: z.string(),
  triageSlug: z.string(),
  status: z.string(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
  summary: z.string().nullable(),
  href: z.string().optional(),
});

export const mobileWeightLogSchema = z.object({
  id: z.string(),
  weightKg: z.number(),
  bmi: z.number().nullable(),
  circumferenceCm: z.number().nullable(),
  note: z.string().nullable(),
  occurredAt: z.string(),
  createdAt: z.string(),
});

export const weightLogInputSchema = z.object({
  weightKg: z.number().positive().max(400),
  circumferenceCm: z.number().positive().max(300).optional(),
  note: z.string().max(280).optional(),
  occurredAt: z.string().optional(),
});

export const doseLogSchema = z.object({
  id: z.string(),
  medication: z.string(),
  doseMg: z.number().positive().max(100),
  phase: z.string(),
  adherence: z.enum(['taken', 'partial', 'missed']),
  sideEffects: z.array(z.string()).default([]),
  note: z.string().nullable(),
  occurredAt: z.string(),
  createdAt: z.string(),
});

export const doseLogInputSchema = z.object({
  medication: z.string().min(2).max(80),
  doseMg: z.number().positive().max(100),
  phase: z.string().min(2).max(80),
  adherence: z.enum(['taken', 'partial', 'missed']).default('taken'),
  sideEffects: z.array(z.string().min(1).max(80)).max(8).optional(),
  note: z.string().max(280).optional(),
  occurredAt: z.string().optional(),
});

export const sleepSnapshotSchema = z.object({
  provider: z.enum(['healthkit', 'health-connect', 'manual']),
  recordedAt: z.string(),
  durationHours: z.number().positive().max(24).nullable(),
  latencyMinutes: z.number().int().min(0).max(300).nullable().optional(),
  awakenings: z.number().int().min(0).max(20).nullable().optional(),
  score: z.number().min(0).max(100).nullable(),
});

export const wearablesSyncInputSchema = z.object({
  provider: z.enum(['healthkit', 'health-connect', 'manual']),
  sleep: z.object({
    recordedAt: z.string(),
    durationHours: z.number().positive().max(24),
    latencyMinutes: z.number().int().min(0).max(300).optional(),
    awakenings: z.number().int().min(0).max(20).optional(),
  }).optional(),
  stepsCount: z.number().int().min(0).max(100000).optional(),
});

export const wearablesSyncResponseSchema = z.object({
  syncedAt: z.string(),
  provider: z.enum(['healthkit', 'health-connect', 'manual']),
  sleepSnapshot: sleepSnapshotSchema.nullable(),
  coachingTip: z.string(),
});

export const mealAnalysisInputSchema = z.object({
  description: z.string().max(500).optional(),
  menuText: z.string().max(2000).optional(),
  imageBase64: z.string().max(2_000_000).optional(),
  hungerLevel: z.number().int().min(1).max(5).optional(),
});

export const mealAnalysisResponseSchema = z.object({
  source: z.enum(['heuristic', 'ai-assisted']),
  caloriesEstimate: z.number(),
  proteinGrams: z.number(),
  carbsGrams: z.number(),
  fatGrams: z.number(),
  fiberGrams: z.number(),
  riskLevel: z.enum(['low', 'moderate', 'high']),
  flags: z.array(z.string()),
  bestChoice: z.string(),
  disclaimer: z.string(),
});

export const careRequestInputSchema = z.object({
  reason: z.string().min(3).max(140),
  preferredPeriod: z.enum(['morning', 'afternoon', 'evening', 'first-available']),
  programSlug: z.string().default('emagrecimento'),
  note: z.string().max(500).optional(),
  triageId: z.string().optional(),
  reportId: z.string().optional(),
  symptoms: z.array(z.string().min(1).max(80)).max(10).optional(),
});

export const careRequestResponseSchema = z.object({
  id: z.string(),
  status: z.enum(['requested', 'handoff_created']),
  conciergeSlaHours: z.number(),
  createdAt: z.string(),
  handoffId: z.string().nullable(),
  redirectUrl: z.string().nullable(),
});

export const examDocumentSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  uploadedAt: z.string(),
  status: z.enum(['queued', 'uploaded']),
  summaryText: z.string().nullable(),
  reviewHint: z.string(),
});

export const examUploadInputSchema = z.object({
  fileName: z.string().min(3).max(180),
  mimeType: z.string().min(3).max(120),
  base64Content: z.string().max(5_000_000).optional(),
  summaryText: z.string().max(1000).optional(),
  capturedAt: z.string().optional(),
  tags: z.array(z.string().min(1).max(40)).max(8).optional(),
});

export const notificationPreferenceSchema = z.object({
  quietHoursStart: z.number().int().min(0).max(23),
  quietHoursEnd: z.number().int().min(0).max(23),
  reminders: z.boolean(),
  clinical: z.boolean(),
  lifestyle: z.boolean(),
  marketing: z.boolean(),
});

export const notificationListResponseSchema = z.object({
  generatedAt: z.string(),
  notifications: z.array(dashboardNotificationSchema),
  preferences: notificationPreferenceSchema,
  featureFlags: mobileFeatureFlagsSchema,
});

export const clinicalShareBundleSchema = z.object({
  patient: mobileProfileSchema,
  journeyTitle: z.string(),
  summary: z.string(),
  recentReports: z.array(mobileReportSchema),
  recentOrders: z.array(mobileOrderSchema),
  latestWeight: mobileWeightLogSchema.nullable(),
  latestSleep: sleepSnapshotSchema.nullable(),
  note: z.string().nullable(),
});

export const createShareBundleInputSchema = z.object({
  reportId: z.string().optional(),
  triageId: z.string().optional(),
  note: z.string().max(500).optional(),
  expiresInHours: z.number().int().min(1).max(168).default(72),
  includeSleep: z.boolean().default(true),
  includeMeals: z.boolean().default(false),
  includeSymptoms: z.boolean().default(true),
});

export const shareBundleResponseSchema = z.object({
  id: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  shareUrl: z.string(),
  bundle: clinicalShareBundleSchema,
});

export const patientDashboardSchema = z.object({
  generatedAt: z.string(),
  featureFlags: mobileFeatureFlagsSchema,
  profile: mobileProfileSchema.nullable(),
  journey: z.object({
    state: z.string(),
    title: z.string(),
    summary: z.string(),
    primaryAction: dashboardPrimaryActionSchema,
  }),
  metrics: z.object({
    bmi: z.number().nullable(),
    currentWeightKg: z.number().nullable(),
    lastWeightLoggedAt: z.string().nullable(),
    weightTrend: z.enum(['down', 'stable', 'up', 'unknown']),
  }),
  glp1: z.object({
    programSlug: z.string(),
    currentDoseMg: z.number().nullable(),
    dosePhase: z.string().nullable(),
    adherenceScore: z.number().nullable(),
    lastDoseAt: z.string().nullable(),
    sideEffectFlags: z.array(z.string()),
  }),
  sleep: z.object({
    latestDurationHours: z.number().nullable(),
    consistencyScore: z.number().nullable(),
    lastSyncedAt: z.string().nullable(),
    coachingTip: z.string(),
  }),
  orders: z.array(mobileOrderSchema),
  reports: z.array(mobileReportSchema),
  notifications: z.array(dashboardNotificationSchema),
  exams: z.object({
    totalDocuments: z.number(),
    lastUploadedAt: z.string().nullable(),
    pendingChecklist: z.array(z.string()),
  }),
  care: z.object({
    latestRequestId: z.string().nullable(),
    latestRequestStatus: z.string().nullable(),
    conciergeSlaHours: z.number(),
  }),
});

export type MobileFeatureFlags = z.infer<typeof mobileFeatureFlagsSchema>;
export type MobileProfile = z.infer<typeof mobileProfileSchema>;
export type PatientDashboard = z.infer<typeof patientDashboardSchema>;
export type WeightLog = z.infer<typeof mobileWeightLogSchema>;
export type DoseLog = z.infer<typeof doseLogSchema>;
export type MealAnalysisResponse = z.infer<typeof mealAnalysisResponseSchema>;
export type SleepSnapshot = z.infer<typeof sleepSnapshotSchema>;
export type CareRequestResponse = z.infer<typeof careRequestResponseSchema>;
export type ExamDocument = z.infer<typeof examDocumentSchema>;
export type NotificationListResponse = z.infer<typeof notificationListResponseSchema>;
export type ClinicalShareBundleResponse = z.infer<typeof shareBundleResponseSchema>;
