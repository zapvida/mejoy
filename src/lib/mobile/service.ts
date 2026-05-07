import crypto from 'crypto';

import { buildMeDashboard } from '@/lib/dashboard/service';
import {
  buildZapVidaHandoffUrl,
  createHandoffEnvelope,
  mapStatusToAnalyticsEvent,
  signHandoffEnvelope,
} from '@/lib/handoff/envelope';
import { persistHandoffEvent } from '@/lib/handoff/store';
import { signShareBundleToken } from '@/lib/mobile/share-bundles';
import { prisma } from '@/lib/prisma';
import { hasSupabaseAdminConfig, supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  careRequestInputSchema,
  careRequestResponseSchema,
  createShareBundleInputSchema,
  dashboardNotificationSchema,
  doseLogInputSchema,
  doseLogSchema,
  examDocumentSchema,
  examListResponseSchema,
  examTimelineItemSchema,
  examUploadInputSchema,
  journeyResponseSchema,
  mealAnalysisInputSchema,
  mealAnalysisResponseSchema,
  mobileProfileSchema,
  mobileReportSchema,
  mobileWeightLogSchema,
  notificationListResponseSchema,
  patientDashboardSchema,
  refillRequestInputSchema,
  refillRequestSchema,
  ritualListResponseSchema,
  ritualSessionInputSchema,
  ritualSessionSchema,
  shareBundleResponseSchema,
  sideEffectLogInputSchema,
  sideEffectLogSchema,
  sleepSnapshotSchema,
  wearablesSyncInputSchema,
  wearablesSyncResponseSchema,
  weightLogInputSchema,
} from '@mejoy/api-contracts/mobile';
import {
  buildAdherenceScore,
  buildDashboardInsights,
  buildJourneyInsights,
  buildRiskStatus,
  calculateBmi,
  classifyWeightTrend,
  estimateMealFromText,
  getDefaultRitualTracks,
  getSleepCoachingTip,
  pickSuggestedRitual,
  resolveMobileFeatureFlags,
  scoreSleepSnapshot,
} from '@mejoy/domain';

type ProfileRecord = {
  id: string;
  name?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  sex?: string | null;
  birth_date?: Date | string | null;
  birthDate?: Date | string | null;
  weight_kg?: number | { toString(): string } | null;
  weightKg?: number | { toString(): string } | null;
  height_cm?: number | { toString(): string } | null;
  heightCm?: number | { toString(): string } | null;
  created_at?: Date | string | null;
  createdAt?: Date | string | null;
  updated_at?: Date | string | null;
  updatedAt?: Date | string | null;
};

type MobileActor = {
  email: string | null;
  profile: ReturnType<typeof normalizeProfileRecord> | null;
  actorId: string | null;
};

const CARE_REQUEST_ACTION = 'mobile.care_request.created';
const DOSE_LOG_ACTION = 'mobile.glp1.dose_log.created';
const EXAM_UPLOAD_ACTION = 'mobile.exam_document.created';
const REFILL_REQUEST_ACTION = 'mobile.refill_request.created';
const RITUAL_SESSION_ACTION = 'mobile.ritual_session.created';
const SHARE_BUNDLE_ACTION = 'mobile.share_bundle.created';
const SIDE_EFFECT_LOG_ACTION = 'mobile.glp1.side_effect_log.created';
const SLEEP_SYNC_ACTION = 'mobile.sleep_sync.created';
const WEIGHT_LOG_ACTION = 'mobile.glp1.weight_log.created';

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.toISOString();
}

function normalizeProfileRecord(profile: ProfileRecord | null | undefined) {
  if (!profile) return null;

  return mobileProfileSchema.parse({
    id: profile.id,
    name: profile.name ?? null,
    email: profile.email ?? null,
    whatsapp: profile.whatsapp ?? null,
    sex: profile.sex ?? null,
    birthDate: toIso(profile.birth_date ?? profile.birthDate) ?? null,
    weightKg: toNumber(profile.weight_kg ?? profile.weightKg),
    heightCm: toNumber(profile.height_cm ?? profile.heightCm),
    bmi: calculateBmi(toNumber(profile.weight_kg ?? profile.weightKg), toNumber(profile.height_cm ?? profile.heightCm)),
    createdAt: toIso(profile.created_at ?? profile.createdAt),
    updatedAt: toIso(profile.updated_at ?? profile.updatedAt),
  });
}

async function createAuditEntry(actorId: string, action: string, details: Record<string, unknown>) {
  return prisma.auditLog.create({
    data: {
      userId: actorId,
      action,
      details,
    },
  });
}

async function findAuditEntries<T>(
  actorId: string,
  action: string,
  parser: (_input: unknown) => T,
  take = 20
): Promise<T[]> {
  const rows = await prisma.auditLog.findMany({
    where: {
      userId: actorId,
      action,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take,
  });

  const parsed: T[] = [];
  for (const row of rows) {
    try {
      parsed.push(parser(row.details));
    } catch {
      continue;
    }
  }
  return parsed;
}

function toNotification(
  input: Partial<ReturnType<typeof dashboardNotificationSchema.parse>> & {
    id: string;
    level: 'info' | 'success' | 'warning' | 'critical';
    title: string;
    body: string;
  }
) {
  const priority =
    input.priority ??
    (input.level === 'critical'
      ? 'urgent'
      : input.level === 'warning'
        ? 'high'
        : input.level === 'success'
          ? 'medium'
          : 'low');

  return dashboardNotificationSchema.parse({
    ...input,
    cta: input.cta ?? null,
    deepLink: input.deepLink ?? input.cta?.href ?? null,
    priority,
    campaignType: input.campaignType ?? 'clinical',
    dismissState: input.dismissState ?? 'pending',
  });
}

function defaultSleepSummary(snapshot: ReturnType<typeof sleepSnapshotSchema.parse> | null) {
  return {
    latestDurationHours: snapshot?.durationHours ?? null,
    consistencyScore: snapshot?.score ?? null,
    lastSyncedAt: snapshot?.recordedAt ?? null,
    coachingTip: getSleepCoachingTip(snapshot?.durationHours),
  };
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120);
}

function buildHeuristicNotifications(params: {
  lastWeightLoggedAt: string | null;
  sleepDurationHours: number | null;
  sleepScore: number | null;
  latestRefill: ReturnType<typeof refillRequestSchema.parse> | null;
  suggestedRitualId: string | null;
}) {
  const notifications: Array<ReturnType<typeof toNotification>> = [];

  if (!params.lastWeightLoggedAt) {
    notifications.push(
      toNotification({
        id: 'weight-log-missing',
        level: 'warning',
        title: 'Registre seu peso inicial',
        body: 'Sem pesagem recente, o acompanhamento longitudinal perde precisão.',
        cta: {
          label: 'Abrir jornada GLP-1',
          href: '/journey',
          variant: 'primary',
        },
        campaignType: 'clinical',
      })
    );
  }

  if (params.sleepDurationHours != null && params.sleepDurationHours < 6) {
    notifications.push(
      toNotification({
        id: 'sleep-coaching',
        level: 'info',
        title: 'Seu sono merece atenção hoje',
        body: 'Dormir pouco piora energia, fome e execução do plano. Proteja a próxima noite.',
        cta: {
          label: 'Ver jornada',
          href: '/journey',
          variant: 'secondary',
        },
        campaignType: 'sleep',
      })
    );
  }

  if (params.sleepScore != null && params.sleepScore < 70 && params.suggestedRitualId) {
    notifications.push(
      toNotification({
        id: 'ritual-suggestion',
        level: 'info',
        title: 'Um ritual curto pode proteger o resto do seu dia',
        body: 'Seu app já tem uma prática sugerida para regulação e foco.',
        cta: {
          label: 'Abrir rituais',
          href: '/rituals',
          variant: 'support',
        },
        campaignType: 'ritual',
      })
    );
  }

  if (!params.latestRefill) {
    notifications.push(
      toNotification({
        id: 'refill-reminder',
        level: 'info',
        title: 'Planeje o próximo reabastecimento com folga',
        body: 'Abrir o pedido cedo evita ruído operacional e interrupção da rotina.',
        cta: {
          label: 'Solicitar refill',
          href: '/refill-request',
          variant: 'support',
        },
        campaignType: 'commerce',
      })
    );
  }

  return notifications;
}

function buildExamTimeline(documents: Awaited<ReturnType<typeof listExamDocuments>>) {
  return documents.map((document, index) =>
    examTimelineItemSchema.parse({
      id: `${document.id}-timeline`,
      title: document.fileName,
      type: index === 0 ? 'review' : document.status === 'uploaded' ? 'ocr' : 'upload',
      status: document.status === 'uploaded' ? 'ready' : 'queued',
      occurredAt: document.uploadedAt,
      summary: document.summaryText ?? document.reviewHint,
    })
  );
}

export async function resolveMobileActor(params: {
  email: string | null;
  profile?: ProfileRecord | null;
}): Promise<MobileActor> {
  const normalizedEmail = params.email?.trim().toLowerCase() || null;
  let profile = normalizeProfileRecord(params.profile);

  if (!profile && normalizedEmail) {
    const fallback = await prisma.profile.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    });
    profile = normalizeProfileRecord(fallback as ProfileRecord | null);
  }

  return {
    email: normalizedEmail,
    profile,
    actorId: profile?.id || normalizedEmail,
  };
}

export async function listWeightLogs(actorId: string) {
  return findAuditEntries(actorId, WEIGHT_LOG_ACTION, (input) => mobileWeightLogSchema.parse(input), 24);
}

export async function listDoseLogs(actorId: string) {
  return findAuditEntries(actorId, DOSE_LOG_ACTION, (input) => doseLogSchema.parse(input), 24);
}

export async function listSideEffectLogs(actorId: string) {
  return findAuditEntries(actorId, SIDE_EFFECT_LOG_ACTION, (input) => sideEffectLogSchema.parse(input), 24);
}

export async function listRitualSessions(actorId: string) {
  return findAuditEntries(actorId, RITUAL_SESSION_ACTION, (input) => ritualSessionSchema.parse(input), 24);
}

export async function getLatestSleepSnapshot(actorId: string) {
  const snapshots = await findAuditEntries(actorId, SLEEP_SYNC_ACTION, (input) => sleepSnapshotSchema.parse(input), 1);
  return snapshots[0] || null;
}

export async function listExamDocuments(actorId: string) {
  return findAuditEntries(actorId, EXAM_UPLOAD_ACTION, (input) => examDocumentSchema.parse(input), 20);
}

export async function listRefillRequests(actorId: string) {
  return findAuditEntries(actorId, REFILL_REQUEST_ACTION, (input) => refillRequestSchema.parse(input), 12);
}

export async function getLatestCareRequest(actorId: string) {
  const requests = await findAuditEntries(actorId, CARE_REQUEST_ACTION, (input) => careRequestResponseSchema.parse(input), 12);
  return requests[0] || null;
}

export async function getCareRequestById(actorId: string, requestId: string) {
  const requests = await findAuditEntries(actorId, CARE_REQUEST_ACTION, (input) => careRequestResponseSchema.parse(input), 50);
  return requests.find((request) => request.id === requestId) || null;
}

export async function buildMobileDashboard(params: { email: string | null; profile?: ProfileRecord | null }) {
  const actor = await resolveMobileActor(params);
  const featureFlags = resolveMobileFeatureFlags();
  const baseDashboard = await buildMeDashboard({
    email: actor.email,
    profile: params.profile,
  });

  const weightLogs = actor.actorId ? await listWeightLogs(actor.actorId) : [];
  const doseLogs = actor.actorId ? await listDoseLogs(actor.actorId) : [];
  const sideEffectLogs = actor.actorId ? await listSideEffectLogs(actor.actorId) : [];
  const latestSleep = actor.actorId ? await getLatestSleepSnapshot(actor.actorId) : null;
  const examDocuments = actor.actorId ? await listExamDocuments(actor.actorId) : [];
  const latestCareRequest = actor.actorId ? await getLatestCareRequest(actor.actorId) : null;
  const latestRefill = actor.actorId ? (await listRefillRequests(actor.actorId))[0] || null : null;

  const recentOrders = [...baseDashboard.orders.storeV2, ...baseDashboard.orders.protocol]
    .slice(0, 6)
    .map((order) => ({
      id: order.id,
      label: order.label,
      status: order.status,
      amountCents: order.amountCents,
      createdAt: order.createdAt,
      href: order.href,
    }));

  const recentReports = baseDashboard.reports.active.slice(0, 6).map((report) =>
    mobileReportSchema.parse({
      id: report.id,
      triageId: report.triageId,
      triageSlug: report.triageSlug,
      status: report.status,
      createdAt: report.createdAt,
      completedAt: report.completedAt,
      summary: report.summary,
      href: report.href,
    })
  );

  const latestWeight = weightLogs[0] || null;
  const latestDose = doseLogs[0] || null;
  const sleepSummary = defaultSleepSummary(latestSleep);
  const weightTrend = classifyWeightTrend(
    weightLogs.map((log) => ({
      occurredAt: log.occurredAt,
      weightKg: log.weightKg,
    }))
  );
  const dosesTaken = doseLogs.filter((log) => log.adherence === 'taken').length;
  const weighInsLast14Days = weightLogs.filter(
    (log) => Date.now() - new Date(log.occurredAt).getTime() <= 14 * 24 * 60 * 60 * 1000
  ).length;
  const adherenceScore = buildAdherenceScore({
    dosesTaken,
    dosesExpected: Math.max(1, doseLogs.length),
    weighInsLast14Days,
  });
  const riskStatus = buildRiskStatus({
    highSeveritySideEffects: sideEffectLogs.filter((log) => log.severity === 'high').length,
    sleepDurationHours: latestSleep?.durationHours ?? null,
    adherenceScore,
  });
  const ritualSuggestion = pickSuggestedRitual({
    sleepDurationHours: latestSleep?.durationHours ?? null,
    adherenceScore,
    stressSignal: riskStatus.level !== 'low',
  });
  const insights = buildDashboardInsights({
    adherenceScore,
    sleepScore: latestSleep?.score ?? null,
    weightTrend,
    latestWeightKg: latestWeight?.weightKg ?? actor.profile?.weightKg ?? null,
  });

  const notifications = [
    ...baseDashboard.notifications.map((notification) =>
      toNotification({
        id: notification.id,
        level: notification.level,
        title: notification.title,
        body: notification.body,
        cta: notification.cta || null,
        campaignType: 'clinical',
      })
    ),
    ...buildHeuristicNotifications({
      lastWeightLoggedAt: latestWeight?.occurredAt ?? null,
      sleepDurationHours: latestSleep?.durationHours ?? null,
      sleepScore: latestSleep?.score ?? null,
      latestRefill,
      suggestedRitualId: ritualSuggestion.id,
    }),
  ];

  return patientDashboardSchema.parse({
    generatedAt: new Date().toISOString(),
    featureFlags,
    profile: actor.profile,
    journey: {
      state: baseDashboard.journey.state,
      title: baseDashboard.journey.title,
      summary: baseDashboard.journey.summary,
      primaryAction: baseDashboard.journey.primaryAction || null,
    },
    metrics: {
      bmi: latestWeight?.bmi ?? actor.profile?.bmi ?? null,
      currentWeightKg: latestWeight?.weightKg ?? actor.profile?.weightKg ?? null,
      lastWeightLoggedAt: latestWeight?.occurredAt ?? null,
      weightTrend,
    },
    glp1: {
      programSlug: 'emagrecimento',
      currentDoseMg: latestDose?.doseMg ?? null,
      dosePhase: latestDose?.phase ?? null,
      adherenceScore,
      lastDoseAt: latestDose?.occurredAt ?? null,
      sideEffectFlags: [...new Set([...sideEffectLogs.map((log) => log.symptom), ...(latestDose?.sideEffects ?? [])])].slice(0, 6),
    },
    sleep: sleepSummary,
    insights,
    ritualSuggestion,
    refill: latestRefill,
    riskStatus,
    orders: recentOrders,
    reports: recentReports,
    notifications,
    exams: {
      totalDocuments: examDocuments.length,
      lastUploadedAt: examDocuments[0]?.uploadedAt ?? null,
      pendingChecklist: ['Hemograma', 'Glicemia/HbA1c', 'Perfil lipídico', 'TSH'],
    },
    care: {
      latestRequestId: latestCareRequest?.id ?? null,
      latestRequestStatus: latestCareRequest?.status ?? null,
      conciergeSlaHours: latestCareRequest?.conciergeSlaHours ?? 12,
    },
  });
}

export async function getJourney(params: { email: string | null; profile?: ProfileRecord | null }) {
  const actor = await resolveMobileActor(params);

  if (!actor.actorId) {
    throw new Error('AUTH_REQUIRED');
  }

  const weightLogs = await listWeightLogs(actor.actorId);
  const doseLogs = await listDoseLogs(actor.actorId);
  const sideEffectLogs = await listSideEffectLogs(actor.actorId);
  const ritualSessions = await listRitualSessions(actor.actorId);
  const latestSleep = await getLatestSleepSnapshot(actor.actorId);
  const latestRefill = (await listRefillRequests(actor.actorId))[0] || null;
  const weightTrend = classifyWeightTrend(
    weightLogs.map((log) => ({
      occurredAt: log.occurredAt,
      weightKg: log.weightKg,
    }))
  );
  const adherenceScore = buildAdherenceScore({
    dosesTaken: doseLogs.filter((log) => log.adherence === 'taken').length,
    dosesExpected: Math.max(1, doseLogs.length),
    weighInsLast14Days: weightLogs.filter(
      (log) => Date.now() - new Date(log.occurredAt).getTime() <= 14 * 24 * 60 * 60 * 1000
    ).length,
  });

  return journeyResponseSchema.parse({
    generatedAt: new Date().toISOString(),
    weightLogs,
    doseLogs,
    sideEffectLogs,
    latestSleep,
    insights: buildJourneyInsights({
      adherenceScore,
      sleepScore: latestSleep?.score ?? null,
      weightTrend,
      sideEffectCount: sideEffectLogs.length,
      ritualSessionsCompleted: ritualSessions.filter((session) => session.outcome === 'completed').length,
    }),
    adherenceScore,
    refill: latestRefill,
  });
}

export async function getNotificationFeed(params: { email: string | null; profile?: ProfileRecord | null }) {
  const dashboard = await buildMobileDashboard(params);

  return notificationListResponseSchema.parse({
    generatedAt: dashboard.generatedAt,
    notifications: dashboard.notifications,
    preferences: {
      quietHoursStart: 22,
      quietHoursEnd: 8,
      reminders: true,
      clinical: true,
      lifestyle: true,
      marketing: false,
    },
    featureFlags: dashboard.featureFlags,
  });
}

export async function createWeightLog(params: {
  actorId: string;
  profile: ReturnType<typeof normalizeProfileRecord> | null;
  input: unknown;
}) {
  const parsedInput = weightLogInputSchema.parse(params.input);
  const now = new Date();
  const payload = mobileWeightLogSchema.parse({
    id: crypto.randomUUID(),
    weightKg: parsedInput.weightKg,
    bmi: calculateBmi(parsedInput.weightKg, params.profile?.heightCm ?? null),
    circumferenceCm: parsedInput.circumferenceCm ?? null,
    note: parsedInput.note ?? null,
    occurredAt: parsedInput.occurredAt || now.toISOString(),
    createdAt: now.toISOString(),
  });

  await createAuditEntry(params.actorId, WEIGHT_LOG_ACTION, payload);
  return payload;
}

export async function createDoseLog(params: { actorId: string; input: unknown }) {
  const parsedInput = doseLogInputSchema.parse(params.input);
  const now = new Date();
  const payload = doseLogSchema.parse({
    id: crypto.randomUUID(),
    medication: parsedInput.medication,
    doseMg: parsedInput.doseMg,
    phase: parsedInput.phase,
    adherence: parsedInput.adherence,
    sideEffects: parsedInput.sideEffects ?? [],
    note: parsedInput.note ?? null,
    occurredAt: parsedInput.occurredAt || now.toISOString(),
    createdAt: now.toISOString(),
  });

  await createAuditEntry(params.actorId, DOSE_LOG_ACTION, payload);
  return payload;
}

export async function createSideEffectLog(params: { actorId: string; input: unknown }) {
  const parsedInput = sideEffectLogInputSchema.parse(params.input);
  const now = new Date().toISOString();
  const payload = sideEffectLogSchema.parse({
    id: crypto.randomUUID(),
    symptom: parsedInput.symptom,
    severity: parsedInput.severity,
    status: parsedInput.severity === 'high' ? 'needs-review' : 'monitor',
    note: parsedInput.note ?? null,
    occurredAt: parsedInput.occurredAt || now,
    createdAt: now,
  });

  await createAuditEntry(params.actorId, SIDE_EFFECT_LOG_ACTION, payload);
  return payload;
}

export async function analyzeMeal(input: unknown) {
  const parsedInput = mealAnalysisInputSchema.parse(input);
  const basis = [parsedInput.description, parsedInput.menuText].filter(Boolean).join('. ');
  const estimate = estimateMealFromText(basis || 'prato misto');

  return mealAnalysisResponseSchema.parse({
    source: parsedInput.imageBase64 ? 'ai-assisted' : 'heuristic',
    caloriesEstimate: estimate.caloriesEstimate,
    proteinGrams: estimate.proteinGrams,
    carbsGrams: estimate.carbsGrams,
    fatGrams: estimate.fatGrams,
    fiberGrams: estimate.fiberGrams,
    riskLevel: estimate.riskLevel,
    flags: estimate.flags,
    bestChoice: estimate.bestChoice,
    disclaimer: 'Estimativa assistiva. Não substitui avaliação nutricional ou conduta médica.',
  });
}

export async function syncWearables(params: { actorId: string; input: unknown }) {
  const parsedInput = wearablesSyncInputSchema.parse(params.input);
  const snapshot = parsedInput.sleep
    ? sleepSnapshotSchema.parse({
        provider: parsedInput.provider,
        recordedAt: parsedInput.sleep.recordedAt,
        durationHours: parsedInput.sleep.durationHours,
        latencyMinutes: parsedInput.sleep.latencyMinutes ?? null,
        awakenings: parsedInput.sleep.awakenings ?? null,
        score: scoreSleepSnapshot({
          durationHours: parsedInput.sleep.durationHours,
          latencyMinutes: parsedInput.sleep.latencyMinutes,
          awakenings: parsedInput.sleep.awakenings,
        }),
      })
    : null;

  if (snapshot) {
    await createAuditEntry(params.actorId, SLEEP_SYNC_ACTION, snapshot);
  }

  return wearablesSyncResponseSchema.parse({
    syncedAt: new Date().toISOString(),
    provider: parsedInput.provider,
    sleepSnapshot: snapshot,
    coachingTip: getSleepCoachingTip(snapshot?.durationHours ?? null),
  });
}

export async function listRituals(params: { actorId: string }) {
  const recentSessions = await listRitualSessions(params.actorId);
  const tracks = getDefaultRitualTracks();
  const featured = tracks.find((track) => track.isFeatured) || tracks[0] || null;

  return ritualListResponseSchema.parse({
    generatedAt: new Date().toISOString(),
    featured,
    tracks,
    recentSessions,
  });
}

export async function createRitualSession(params: { actorId: string; input: unknown }) {
  const parsedInput = ritualSessionInputSchema.parse(params.input);
  const track = getDefaultRitualTracks().find((candidate) => candidate.id === parsedInput.ritualId);
  const now = new Date().toISOString();
  const payload = ritualSessionSchema.parse({
    id: crypto.randomUUID(),
    ritualId: parsedInput.ritualId,
    category: parsedInput.category,
    durationMinutes: parsedInput.durationMinutes,
    outcome: parsedInput.outcome,
    completedAt: now,
    reflection: parsedInput.reflection ?? null,
    insight:
      parsedInput.outcome === 'completed'
        ? `Sessão ${track?.title || 'ritual'} concluída. Preserve esse gatilho como parte do seu loop diário.`
        : 'Sessão registrada. Volte quando precisar reativar foco ou regulação.'
        ,
  });

  await createAuditEntry(params.actorId, RITUAL_SESSION_ACTION, payload);
  return payload;
}

export async function createCareRequest(params: {
  actor: MobileActor;
  input: unknown;
}) {
  if (!params.actor.actorId) {
    throw new Error('AUTH_REQUIRED');
  }

  const parsedInput = careRequestInputSchema.parse(params.input);
  const now = new Date().toISOString();
  let handoffId: string | null = null;
  let redirectUrl: string | null = null;
  let status: 'requested' | 'handoff_created' = 'requested';

  if (parsedInput.triageId) {
    const envelope = createHandoffEnvelope({
      triageId: parsedInput.triageId,
      reportId: parsedInput.reportId,
      patientId: params.actor.profile?.id || undefined,
      programSlug: parsedInput.programSlug,
      sourceJourney: 'mobile.care-request',
      email: params.actor.email || undefined,
      phone: params.actor.profile?.whatsapp || undefined,
      consentStatus: 'granted',
      metadata: {
        origin: 'mobile_care_request',
        reason: parsedInput.reason,
        preferred_period: parsedInput.preferredPeriod,
      },
    });

    const handoffToken = signHandoffEnvelope(envelope);
    handoffId = envelope.handoff_id;
    redirectUrl = buildZapVidaHandoffUrl(
      handoffToken,
      envelope.journey.program_slug,
      envelope.handoff_id,
      envelope.correlation_id
    );
    status = 'handoff_created';

    await persistHandoffEvent({
      envelope,
      status: 'created',
      eventName: mapStatusToAnalyticsEvent('created'),
      source: 'create_api',
      metadata: {
        source: 'mobile.care_request',
      },
    });
  }

  const payload = careRequestResponseSchema.parse({
    id: crypto.randomUUID(),
    status,
    conciergeSlaHours: 12,
    createdAt: now,
    handoffId,
    redirectUrl,
  });

  await createAuditEntry(params.actor.actorId, CARE_REQUEST_ACTION, payload);
  return payload;
}

export async function createRefillRequest(params: { actorId: string; input: unknown }) {
  const parsedInput = refillRequestInputSchema.parse(params.input);
  const payload = refillRequestSchema.parse({
    id: crypto.randomUUID(),
    status: parsedInput.urgency === 'urgent' ? 'handoff_created' : 'requested',
    medication: parsedInput.medication,
    doseMg: parsedInput.doseMg ?? null,
    createdAt: new Date().toISOString(),
    etaHours: parsedInput.urgency === 'urgent' ? 6 : parsedInput.urgency === 'soon' ? 12 : 24,
    nextStep:
      parsedInput.urgency === 'urgent'
        ? 'Concierge clínico priorizado para revisar sua necessidade de reposição.'
        : 'Seu pedido entrou na fila operacional para validação e retorno.',
    redirectUrl: parsedInput.urgency === 'urgent' ? '/consult-request?flow=refill' : null,
  });

  await createAuditEntry(params.actorId, REFILL_REQUEST_ACTION, payload);
  return payload;
}

export async function createExamDocument(params: { actorId: string; input: unknown }) {
  const parsedInput = examUploadInputSchema.parse(params.input);
  const now = new Date().toISOString();
  let status: 'queued' | 'uploaded' = 'queued';
  let reviewHint = 'Documento recebido. OCR clínico poderá ser aplicado na próxima etapa do pipeline.';

  if (parsedInput.base64Content && hasSupabaseAdminConfig) {
    try {
      const bucket = process.env.MEJOY_EXAMS_BUCKET || 'mejoy-exams';
      const storagePath = `${params.actorId}/${Date.now()}-${sanitizeFileName(parsedInput.fileName)}`;
      const raw = parsedInput.base64Content.includes(',')
        ? parsedInput.base64Content.split(',')[1]
        : parsedInput.base64Content;

      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(storagePath, Buffer.from(raw, 'base64'), {
          contentType: parsedInput.mimeType,
          upsert: false,
        });

      if (!error) {
        status = 'uploaded';
        reviewHint = 'Arquivo armazenado com sucesso. O pipeline de OCR pode processá-lo sem reenvio.';
      }
    } catch {
      status = 'queued';
    }
  }

  const payload = examDocumentSchema.parse({
    id: crypto.randomUUID(),
    fileName: parsedInput.fileName,
    mimeType: parsedInput.mimeType,
    uploadedAt: now,
    status,
    summaryText: parsedInput.summaryText ?? null,
    reviewHint,
  });

  await createAuditEntry(params.actorId, EXAM_UPLOAD_ACTION, payload);
  return payload;
}

export async function listExams(params: { actorId: string }) {
  const documents = await listExamDocuments(params.actorId);
  return examListResponseSchema.parse({
    generatedAt: new Date().toISOString(),
    documents,
    timeline: buildExamTimeline(documents),
  });
}

export async function createShareBundle(params: {
  actor: MobileActor;
  input: unknown;
}) {
  if (!params.actor.actorId || !params.actor.profile) {
    throw new Error('AUTH_REQUIRED');
  }

  const parsedInput = createShareBundleInputSchema.parse(params.input);
  const dashboard = await buildMobileDashboard({
    email: params.actor.email,
    profile: params.actor.profile as ProfileRecord,
  });
  const latestWeight = params.actor.actorId ? (await listWeightLogs(params.actor.actorId))[0] || null : null;
  const latestSleep = params.actor.actorId ? await getLatestSleepSnapshot(params.actor.actorId) : null;

  const bundle = {
    patient: dashboard.profile ?? params.actor.profile,
    journeyTitle: dashboard.journey.title,
    summary: dashboard.journey.summary,
    recentReports: dashboard.reports,
    recentOrders: dashboard.orders,
    latestWeight,
    latestSleep: parsedInput.includeSleep ? latestSleep : null,
    note: parsedInput.note ?? null,
  };

  const expiresAt = new Date(Date.now() + parsedInput.expiresInHours * 60 * 60 * 1000).toISOString();
  const bundleId = crypto.randomUUID();
  const token = signShareBundleToken({
    bundleId,
    exp: expiresAt,
  });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mejoy.com.br';
  const shareUrl = `${baseUrl.replace(/\/$/, '')}/api/mobile/v1/share-bundles/${bundleId}?token=${encodeURIComponent(token)}`;

  const payload = shareBundleResponseSchema.parse({
    id: bundleId,
    token,
    expiresAt,
    shareUrl,
    bundle,
  });

  await createAuditEntry(params.actor.actorId, SHARE_BUNDLE_ACTION, payload);
  return payload;
}

export async function getStoredShareBundle(bundleId: string) {
  const rows = await prisma.auditLog.findMany({
    where: {
      action: SHARE_BUNDLE_ACTION,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  for (const row of rows) {
    const parsed = shareBundleResponseSchema.safeParse(row.details);
    if (parsed.success && parsed.data.id === bundleId) {
      return parsed.data;
    }
  }

  return null;
}
