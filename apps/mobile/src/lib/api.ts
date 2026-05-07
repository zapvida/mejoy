import { z } from 'zod';

import type {
  ClinicalShareBundleResponse,
  NotificationListResponse,
  PatientDashboard,
} from '@mejoy/api-contracts/mobile';
import {
  careRequestResponseSchema,
  doseLogSchema,
  examDocumentSchema,
  mealAnalysisResponseSchema,
  mobileProfileSchema,
  notificationListResponseSchema,
  patientDashboardSchema,
  shareBundleResponseSchema,
  wearablesSyncResponseSchema,
} from '@mejoy/api-contracts/mobile';

type SessionLike = {
  apiBaseUrl: string;
  email: string;
};

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
    throw new Error(payload?.error || `HTTP ${response.status}`);
  }

  return schema.parse(payload);
}

export function getDashboard(session: SessionLike): Promise<PatientDashboard> {
  return requestJson({
    session,
    path: '/api/mobile/v1/dashboard',
    schema: patientDashboardSchema,
  });
}

export function getProfile(session: SessionLike) {
  return requestJson({
    session,
    path: '/api/mobile/v1/profile',
    schema: mobileProfileSchema,
  });
}

export function getNotifications(session: SessionLike): Promise<NotificationListResponse> {
  return requestJson({
    session,
    path: '/api/mobile/v1/notifications',
    schema: notificationListResponseSchema,
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

export function createShareBundle(session: SessionLike, body: Record<string, unknown>): Promise<ClinicalShareBundleResponse> {
  return requestJson({
    session,
    path: '/api/mobile/v1/share-bundles',
    schema: shareBundleResponseSchema,
    method: 'POST',
    body,
  });
}
