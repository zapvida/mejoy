import { z } from 'zod';

import {
  careRequestResponseSchema,
  doseLogSchema,
  entitlementSnapshotSchema,
  examDocumentSchema,
  examListResponseSchema,
  goalProgressItemSchema,
  healthScoreSnapshotSchema,
  journeyResponseSchema,
  mealAnalysisResponseSchema,
  mobileProfileSchema,
  notificationListResponseSchema,
  patientDashboardSchema,
  preventionChecklistResponseSchema,
  refillRequestSchema,
  referralGamificationStatusSchema,
  ritualListResponseSchema,
  ritualSessionSchema,
  shareBundleResponseSchema,
  sideEffectLogSchema,
  specialistChannelRequestResponseSchema,
  tierEntitlementSchema,
  wearablesSyncResponseSchema,
} from '@mejoy/api-contracts/mobile';

type SessionLike = {
  apiBaseUrl: string;
  email: string;
};

function normalizeApiError(payload: unknown, status: number) {
  const raw =
    typeof payload === 'object' && payload !== null && 'error' in payload
      ? String((payload as { error?: unknown }).error || '')
      : '';

  if (status === 401 || raw === 'AUTH_REQUIRED') {
    return 'Entre com a conta MeJoy vinculada à sua compra para abrir esta área.';
  }

  if (status === 404) {
    return 'Não encontrei este recurso na sua conta MeJoy. Atualize a tela ou volte para o início.';
  }

  if (status >= 500) {
    return 'Não consegui carregar esta área agora. Atualize em alguns instantes ou fale com o suporte MeJoy.';
  }

  return raw && !/^HTTP\s+\d+$/i.test(raw)
    ? raw
    : 'Não consegui concluir esta ação agora. Revise os dados e tente novamente.';
}

async function requestJson<T>({
  session,
  path,
  schema,
  method = 'GET',
  body,
}: {
  session: SessionLike;
  path: string;
  schema: z.ZodType<T>;
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
}): Promise<T> {
  const response = await fetch(`${session.apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(session.email ? { 'X-User-Email': session.email } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(normalizeApiError(payload, response.status));
  }

  return schema.parse(payload);
}

export function getDashboard(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/dashboard',
    schema: patientDashboardSchema,
  });
}

export function getEntitlements(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/entitlements',
    schema: entitlementSnapshotSchema,
  });
}

export function getJourney(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/journey',
    schema: journeyResponseSchema,
  });
}

export function getProfile(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/profile',
    schema: mobileProfileSchema,
  });
}

export function getNotifications(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/notifications',
    schema: notificationListResponseSchema,
  });
}

export function getHealthScore(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/health-score',
    schema: healthScoreSnapshotSchema,
  });
}

export function getPreventionChecklist(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/prevention/checklist',
    schema: preventionChecklistResponseSchema,
  });
}

export function getTierDetails(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/tiers',
    schema: tierEntitlementSchema,
  });
}

export function getReferralStatus(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/referral/status',
    schema: referralGamificationStatusSchema,
  });
}

export function createWeightLog(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/programs/glp1/weight-logs',
    schema: z.object({
      id: z.string(),
      weightKg: z.number(),
      bmi: z.number().nullable(),
      circumferenceCm: z.number().nullable(),
      note: z.string().nullable(),
      occurredAt: z.string(),
      createdAt: z.string(),
    }),
    method: 'POST',
    body,
  });
}

export function createDoseLog(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/programs/glp1/dose-logs',
    schema: doseLogSchema,
    method: 'POST',
    body,
  });
}

export function createSideEffectLog(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/programs/glp1/side-effects',
    schema: sideEffectLogSchema,
    method: 'POST',
    body,
  });
}

export function analyzeMeal(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/nutrition/analyze-meal',
    schema: mealAnalysisResponseSchema,
    method: 'POST',
    body,
  });
}

export function syncWearables(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/wearables/sync',
    schema: wearablesSyncResponseSchema,
    method: 'POST',
    body,
  });
}

export function requestConsult(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/care-requests',
    schema: careRequestResponseSchema,
    method: 'POST',
    body,
  });
}

export function createExamDocument(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/exams/upload',
    schema: examDocumentSchema,
    method: 'POST',
    body,
  });
}

export function getExams(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/exams',
    schema: examListResponseSchema,
  });
}

export function createShareBundle(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/share-bundles',
    schema: shareBundleResponseSchema,
    method: 'POST',
    body,
  });
}

export function getRituals(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/rituals',
    schema: ritualListResponseSchema,
  });
}

export function createRitualSession(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/ritual-sessions',
    schema: ritualSessionSchema,
    method: 'POST',
    body,
  });
}

export function createRefillRequest(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/refill-requests',
    schema: refillRequestSchema,
    method: 'POST',
    body,
  });
}

export function toggleGoalProgress(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/goals/toggle',
    schema: goalProgressItemSchema,
    method: 'POST',
    body,
  });
}

export function requestSpecialistChannel(session: SessionLike, body: Record<string, unknown>) {
  return requestJson({
    session,
    path: '/api/mobile/v1/specialist-channel/request',
    schema: specialistChannelRequestResponseSchema,
    method: 'POST',
    body,
  });
}
