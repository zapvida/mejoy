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

export const dashboardPrimaryActionSchema = z
  .object({
    label: z.string(),
    href: z.string(),
    variant: z.enum(['primary', 'secondary', 'support']),
  })
  .nullable();

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

export const dashboardInsightBlockSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  tone: z.enum(['performance', 'clinical', 'celebration', 'warning']),
  metricLabel: z.string().nullable(),
  metricValue: z.string().nullable(),
  supportingCopy: z.string().nullable(),
  cta: dashboardPrimaryActionSchema.optional(),
});

export const dashboardNotificationSchema = z.object({
  id: z.string(),
  level: z.enum(['info', 'success', 'warning', 'critical']),
  title: z.string(),
  body: z.string(),
  cta: dashboardPrimaryActionSchema.optional(),
  deepLink: z.string().nullable().default(null),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  campaignType: z.enum(['clinical', 'lifestyle', 'commerce', 'ritual', 'sleep', 'engagement']).default('clinical'),
  dismissState: z.enum(['pending', 'dismissed', 'completed']).default('pending'),
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

export const sideEffectLogSchema = z.object({
  id: z.string(),
  symptom: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
  status: z.enum(['monitor', 'needs-review', 'resolved']),
  note: z.string().nullable(),
  occurredAt: z.string(),
  createdAt: z.string(),
});

export const sideEffectLogInputSchema = z.object({
  symptom: z.string().min(2).max(80),
  severity: z.enum(['low', 'medium', 'high']),
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
  sleep: z
    .object({
      recordedAt: z.string(),
      durationHours: z.number().positive().max(24),
      latencyMinutes: z.number().int().min(0).max(300).optional(),
      awakenings: z.number().int().min(0).max(20).optional(),
    })
    .optional(),
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

export const specialistChannelRequestInputSchema = z.object({
  specialty: z.enum(['endocrino', 'nutrologia', 'psicologia', 'nutricao', 'clinica-geral']),
  reason: z.string().min(3).max(160),
  goals: z.array(z.string().min(2).max(120)).max(6).optional(),
  note: z.string().max(500).optional(),
});

export const specialistChannelRequestResponseSchema = z.object({
  id: z.string(),
  status: z.enum(['requested', 'queued_for_review']),
  specialty: z.enum(['endocrino', 'nutrologia', 'psicologia', 'nutricao', 'clinica-geral']),
  createdAt: z.string(),
  slaHours: z.number().int().min(1).max(72),
  nextStep: z.string(),
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

export const examTimelineItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['upload', 'ocr', 'review']),
  status: z.enum(['queued', 'processing', 'ready']),
  occurredAt: z.string(),
  summary: z.string().nullable(),
});

export const examListResponseSchema = z.object({
  generatedAt: z.string(),
  documents: z.array(examDocumentSchema),
  timeline: z.array(examTimelineItemSchema),
});

export const recommendedModuleSchema = z.enum([
  'dashboard',
  'journey',
  'glp1',
  'meal-ai',
  'sleep',
  'rituals',
  'notifications',
  'exams',
  'consult',
  'bundle',
  'refill',
  'reports',
  'prevention',
  'goals',
  'referral',
  'specialist',
]);

export const productAppFeatureMatrixItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  webValue: z.string(),
  appValue: z.string(),
  summary: z.string(),
  featured: z.boolean(),
});

export const productAppValueSchema = z.object({
  appIncluded: z.boolean(),
  appTier: z.enum(['premium_full_access']),
  headline: z.string(),
  summary: z.string(),
  featureMatrix: z.array(productAppFeatureMatrixItemSchema),
});

export const protocolContextSchema = z.object({
  primaryProtocolSlug: z.enum([
    'emagrecimento',
    'sono',
    'ansiedade',
    'intestino',
    'figado',
    'menopausa',
    'imunidade',
    'articulacoes',
    'calvicie',
    'libido-masculina',
  ]),
  primaryProtocolTitle: z.string(),
  careLane: z.enum(['glp1_integral', 'whole_person_care']),
  relatedProtocols: z.array(z.string()),
});

export const recommendedActionSchema = z.object({
  label: z.string(),
  href: z.string(),
  reason: z.string(),
});

export const tierPlanIdSchema = z.enum(['visitor_preview', 'programa_1m', 'programa_3m', 'programa_6m']);

export const tierEntitlementSchema = z.object({
  planId: tierPlanIdSchema,
  durationMonths: z.number().int().min(0).max(12),
  unlockedFeatures: z.array(recommendedModuleSchema),
  includedCare: z.array(z.string()),
  deviceRewardEligible: z.boolean(),
  specialistChannelEligible: z.boolean(),
});

export const goalPillarSchema = z.enum([
  'nutrition',
  'movement',
  'sleep',
  'regulation',
  'prevention',
  'adherence',
]);

export const goalProgressItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  pillar: goalPillarSchema,
  completed: z.boolean(),
  scoreImpact: z.number().int().min(1).max(20),
  requiresProof: z.boolean(),
  dueAt: z.string().nullable(),
});

export const healthScorePillarSchema = z.object({
  id: goalPillarSchema,
  label: z.string(),
  currentScore: z.number().int().min(0).max(20),
  maxScore: z.number().int().min(5).max(20),
  status: z.enum(['good', 'attention', 'critical']),
  explanation: z.string(),
});

export const healthScoreActionSchema = z.object({
  id: z.string(),
  title: z.string(),
  reason: z.string(),
  href: z.string(),
  scoreImpact: z.number().int().min(1).max(20),
});

export const healthScoreSnapshotSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  pillars: z.array(healthScorePillarSchema),
  trend: z.enum(['improving', 'stable', 'attention']),
  delta24h: z.number().int().min(-20).max(20),
  nextBestActions: z.array(healthScoreActionSchema),
  scoreDrivers: z.array(z.string()),
});

export const preventionTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  category: z.enum(['checkup', 'labs', 'shared-decision', 'lifestyle']),
  priority: z.enum(['high', 'medium', 'low']),
  dueLabel: z.string(),
  href: z.string(),
  source: z.string(),
});

export const preventionChecklistResponseSchema = z.object({
  generatedAt: z.string(),
  ageBand: z.string(),
  sexAtBirth: z.enum(['female', 'male', 'unknown']),
  riskFlags: z.array(z.string()),
  dueTasks: z.array(preventionTaskSchema),
  upcomingTasks: z.array(preventionTaskSchema),
  sharedDecisionTasks: z.array(preventionTaskSchema),
  sources: z.array(z.string()),
});

export const referralGamificationStatusSchema = z.object({
  inviteCode: z.string(),
  qrCode: z.string(),
  invitesAccepted: z.number().int().min(0),
  streak: z.number().int().min(0),
  rewardProgress: z.number().int().min(0).max(100),
  nextReward: z.string(),
});

export const dailyCuriositySchema = z.object({
  id: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  body: z.string(),
  takeaway: z.string(),
});

export const activationStateSchema = z.enum([
  'visitor',
  'buyer',
  'activated_patient',
  'care_active',
]);

export const entitlementSnapshotSchema = z.object({
  generatedAt: z.string(),
  accessLevel: z.enum(['full_app']),
  activationState: activationStateSchema,
  protocolContext: protocolContextSchema,
  recommendedModules: z.array(recommendedModuleSchema),
  recommendedActions: z.array(recommendedActionSchema),
  productAppValue: productAppValueSchema,
  planId: tierPlanIdSchema,
  durationMonths: z.number().int().min(0).max(12),
  unlockedFeatures: z.array(recommendedModuleSchema),
  includedCare: z.array(z.string()),
  specialistChannelEligible: z.boolean(),
  deviceRewardEligible: z.boolean(),
});

export const examUploadInputSchema = z.object({
  fileName: z.string().min(3).max(180),
  mimeType: z.string().min(3).max(120),
  base64Content: z.string().max(5_000_000).optional(),
  summaryText: z.string().max(1000).optional(),
  capturedAt: z.string().optional(),
  tags: z.array(z.string().min(1).max(40)).max(8).optional(),
});

export const ritualCategorySchema = z.enum(['focus', 'craving', 'anxiety', 'pre-sleep']);

export const ritualTrackSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  durationMinutes: z.number().int().min(2).max(20),
  category: ritualCategorySchema,
  accent: z.string(),
  benefit: z.string(),
  recommendedFor: z.string(),
  audioUrl: z.string().nullable(),
  isFeatured: z.boolean(),
});

export const ritualSessionSchema = z.object({
  id: z.string(),
  ritualId: z.string(),
  category: ritualCategorySchema,
  durationMinutes: z.number().int().min(1).max(30),
  outcome: z.enum(['started', 'completed', 'skipped']),
  completedAt: z.string(),
  reflection: z.string().nullable(),
  insight: z.string().nullable(),
});

export const ritualSessionInputSchema = z.object({
  ritualId: z.string().min(2),
  category: ritualCategorySchema,
  durationMinutes: z.number().int().min(1).max(30),
  outcome: z.enum(['started', 'completed', 'skipped']).default('completed'),
  reflection: z.string().max(240).optional(),
});

export const ritualListResponseSchema = z.object({
  generatedAt: z.string(),
  featured: ritualTrackSchema.nullable(),
  tracks: z.array(ritualTrackSchema),
  recentSessions: z.array(ritualSessionSchema),
});

export const journeyInsightSchema = z.object({
  id: z.string(),
  source: z.enum(['weight', 'dose', 'sleep', 'nutrition', 'ritual']),
  title: z.string(),
  body: z.string(),
  tone: z.enum(['good', 'focus', 'warning']),
});

export const refillRequestSchema = z.object({
  id: z.string(),
  status: z.enum(['requested', 'handoff_created', 'scheduled']),
  medication: z.string(),
  doseMg: z.number().nullable(),
  createdAt: z.string(),
  etaHours: z.number(),
  nextStep: z.string(),
  redirectUrl: z.string().nullable(),
});

export const refillRequestInputSchema = z.object({
  medication: z.string().min(2).max(80),
  doseMg: z.number().positive().max(100).optional(),
  urgency: z.enum(['routine', 'soon', 'urgent']).default('routine'),
  note: z.string().max(280).optional(),
});

export const journeyResponseSchema = z.object({
  generatedAt: z.string(),
  weightLogs: z.array(mobileWeightLogSchema),
  doseLogs: z.array(doseLogSchema),
  sideEffectLogs: z.array(sideEffectLogSchema),
  latestSleep: sleepSnapshotSchema.nullable(),
  insights: z.array(journeyInsightSchema),
  adherenceScore: z.number().nullable(),
  refill: refillRequestSchema.nullable(),
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

export const mobileAnalyticsEventNameSchema = z.enum([
  'app_open',
  'dashboard_loaded',
  'weight_logged',
  'meal_analyzed',
  'sleep_synced',
  'meditation_started',
  'consult_requested',
  'exam_uploaded',
  'bundle_shared',
  'handoff_opened',
  'side_effect_flagged',
  'onboarding_started',
  'onboarding_checkout_opened',
  'activation_completed',
  'app_activation_completed',
  'entitlement_seen',
  'app_value_block_viewed',
  'goal_toggled',
  'prevention_checklist_viewed',
  'referral_status_viewed',
  'specialist_request_submitted',
  'protocol_personalized_home_loaded',
  'push_permission_prompted',
  'deeplink_opened',
]);

export const mobileAnalyticsEventInputSchema = z.object({
  event: mobileAnalyticsEventNameSchema,
  screen: z.string().max(80).optional(),
  status: z.enum(['ok', 'error', 'info']).default('info'),
  metadata: z
    .record(z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional()
    .default({}),
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

export const riskStatusSchema = z.object({
  level: z.enum(['low', 'attention', 'high']),
  label: z.string(),
  summary: z.string(),
});

export const patientDashboardSchema = z.object({
  generatedAt: z.string(),
  featureFlags: mobileFeatureFlagsSchema,
  profile: mobileProfileSchema.nullable(),
  activationState: activationStateSchema,
  careLane: z.enum(['glp1_integral', 'whole_person_care']),
  protocolContext: protocolContextSchema,
  recommendedModules: z.array(recommendedModuleSchema),
  recommendedActions: z.array(recommendedActionSchema),
  productAppValue: productAppValueSchema,
  entitlements: entitlementSnapshotSchema,
  journey: z.object({
    state: z.string(),
    title: z.string(),
    summary: z.string(),
    primaryAction: dashboardPrimaryActionSchema,
  }),
  tier: tierEntitlementSchema,
  lockedFeatures: z.array(recommendedModuleSchema),
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
  healthScore: healthScoreSnapshotSchema,
  prevention: preventionChecklistResponseSchema,
  goals: z.array(goalProgressItemSchema),
  dailyCuriosity: dailyCuriositySchema,
  insights: z.array(dashboardInsightBlockSchema),
  ritualSuggestion: ritualTrackSchema.nullable(),
  refill: refillRequestSchema.nullable(),
  riskStatus: riskStatusSchema,
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
  referral: referralGamificationStatusSchema,
});

export type MobileFeatureFlags = z.infer<typeof mobileFeatureFlagsSchema>;
export type MobileProfile = z.infer<typeof mobileProfileSchema>;
export type DashboardInsightBlock = z.infer<typeof dashboardInsightBlockSchema>;
export type PatientDashboard = z.infer<typeof patientDashboardSchema>;
export type WeightLog = z.infer<typeof mobileWeightLogSchema>;
export type DoseLog = z.infer<typeof doseLogSchema>;
export type SideEffectLog = z.infer<typeof sideEffectLogSchema>;
export type MealAnalysisResponse = z.infer<typeof mealAnalysisResponseSchema>;
export type SleepSnapshot = z.infer<typeof sleepSnapshotSchema>;
export type CareRequestResponse = z.infer<typeof careRequestResponseSchema>;
export type ExamDocument = z.infer<typeof examDocumentSchema>;
export type ExamTimelineItem = z.infer<typeof examTimelineItemSchema>;
export type ExamListResponse = z.infer<typeof examListResponseSchema>;
export type ProductAppFeatureMatrixItem = z.infer<typeof productAppFeatureMatrixItemSchema>;
export type ProductAppValue = z.infer<typeof productAppValueSchema>;
export type ProtocolContext = z.infer<typeof protocolContextSchema>;
export type RecommendedAction = z.infer<typeof recommendedActionSchema>;
export type EntitlementSnapshot = z.infer<typeof entitlementSnapshotSchema>;
export type TierEntitlement = z.infer<typeof tierEntitlementSchema>;
export type GoalProgressItem = z.infer<typeof goalProgressItemSchema>;
export type HealthScoreSnapshot = z.infer<typeof healthScoreSnapshotSchema>;
export type PreventionChecklistResponse = z.infer<typeof preventionChecklistResponseSchema>;
export type ReferralGamificationStatus = z.infer<typeof referralGamificationStatusSchema>;
export type NotificationListResponse = z.infer<typeof notificationListResponseSchema>;
export type MobileAnalyticsEventInput = z.infer<typeof mobileAnalyticsEventInputSchema>;
export type ClinicalShareBundleResponse = z.infer<typeof shareBundleResponseSchema>;
export type RitualTrack = z.infer<typeof ritualTrackSchema>;
export type RitualSession = z.infer<typeof ritualSessionSchema>;
export type RitualListResponse = z.infer<typeof ritualListResponseSchema>;
export type JourneyInsight = z.infer<typeof journeyInsightSchema>;
export type JourneyResponse = z.infer<typeof journeyResponseSchema>;
export type RefillRequest = z.infer<typeof refillRequestSchema>;
export type SpecialistChannelRequestResponse = z.infer<typeof specialistChannelRequestResponseSchema>;
