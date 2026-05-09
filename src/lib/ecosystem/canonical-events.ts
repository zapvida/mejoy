import crypto from "crypto";

import { z } from "zod";

const LEGACY_EVENT_NAMES = [
  "document.finalized",
  "prescription.redeemed",
  "pharmacy.invited",
  "pharmacy.onboarded",
] as const;

const CANONICAL_EVENT_NAMES = [
  "patient.profile.updated",
  "clinical.consult.completed",
  "prescription.created",
  "prescription.signed",
  "prescription.redeemed",
  "quote.created",
  "order.created",
  "payment.confirmed",
  "order.in_transit",
  "order.delivered",
  "program.purchased",
  "program.task.unlocked",
  "program.followup.required",
  "pharmacy.invited",
  "pharmacy.onboarded",
] as const;

export type CanonicalEventName = (typeof CANONICAL_EVENT_NAMES)[number];

const legacySchema = z.object({
  event: z.enum(LEGACY_EVENT_NAMES),
  eventId: z.string().min(1),
  idempotencyKey: z.string().min(1),
  correlationId: z.string().min(1),
  sourceSystem: z.string().min(1),
  sourceJourney: z.string().min(1),
  contractVersion: z.string().optional(),
  occurredAt: z.string().optional(),
  data: z.record(z.string(), z.unknown()),
});

const canonicalSchema = z.object({
  event_id: z.string().min(1),
  event_name: z.enum(CANONICAL_EVENT_NAMES),
  schema_version: z.number().int().positive().optional(),
  correlation_id: z.string().min(1),
  idempotency_key: z.string().min(1),
  source_system: z.string().min(1),
  source_journey: z.string().optional(),
  producer: z.string().optional(),
  occurred_at: z.string().optional(),
  patient_ref: z.string().optional().nullable(),
  doctor_ref: z.string().optional().nullable(),
  pharmacy_ref: z.string().optional().nullable(),
  company_ref: z.string().optional().nullable(),
  prescription_id: z.string().optional().nullable(),
  quote_id: z.string().optional().nullable(),
  order_id: z.string().optional().nullable(),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export type NormalizedEcosystemEvent = {
  eventId: string;
  eventName: CanonicalEventName;
  idempotencyKey: string;
  correlationId: string;
  sourceSystem: string;
  sourceJourney: string;
  contractVersion: string;
  occurredAt: string;
  producer: string | null;
  patientRef: string | null;
  doctorRef: string | null;
  pharmacyRef: string | null;
  companyRef: string | null;
  prescriptionId: string | null;
  quoteId: string | null;
  orderId: string | null;
  payload: Record<string, unknown>;
};

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return `{${entries
    .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
    .join(",")}}`;
}

function getLegacySignature(rawText: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(rawText).digest("hex");
}

function getSignedSignature(body: unknown, timestamp: string, nonce: string, secret: string) {
  const payload = `${timestamp}.${nonce}.${stableStringify(body)}`;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function timingSafeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

async function markNonceSeen(nonce: string, ttlSec: number): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const key = `mejoy:ecosystem:nonce:${nonce}`;

  try {
    if (url && token) {
      const createdResponse = await fetch(`${url}/setnx/${encodeURIComponent(key)}/1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const created = (await createdResponse.text()) === "1";
      if (created) {
        await fetch(`${url}/expire/${encodeURIComponent(key)}/${ttlSec}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      return created;
    }
  } catch {
    // fallback in-memory below
  }

  const globalKey = "__mejoy_ecosystem_nonce_registry";
  const registry =
    ((global as any)[globalKey] as Map<string, number> | undefined) || new Map<string, number>();
  (global as any)[globalKey] = registry;

  const now = Date.now();
  for (const [existingNonce, expiresAt] of registry.entries()) {
    if (expiresAt <= now) {
      registry.delete(existingNonce);
    }
  }

  if (registry.has(key)) {
    return false;
  }

  registry.set(key, now + ttlSec * 1000);
  return true;
}

function normalizeLegacyEventName(input: z.infer<typeof legacySchema>): CanonicalEventName {
  if (input.event === "document.finalized") {
    return "prescription.created";
  }
  return input.event;
}

function getNestedRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toStringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function normalizeEcosystemEvent(input: unknown): NormalizedEcosystemEvent {
  const canonicalParsed = canonicalSchema.safeParse(input);
  if (canonicalParsed.success) {
    const data = canonicalParsed.data;
    return {
      eventId: data.event_id,
      eventName: data.event_name,
      idempotencyKey: data.idempotency_key,
      correlationId: data.correlation_id,
      sourceSystem: data.source_system,
      sourceJourney: data.source_journey || data.producer || data.source_system,
      contractVersion: String(data.schema_version ?? 1),
      occurredAt: data.occurred_at || new Date().toISOString(),
      producer: data.producer || null,
      patientRef: data.patient_ref ?? null,
      doctorRef: data.doctor_ref ?? null,
      pharmacyRef: data.pharmacy_ref ?? null,
      companyRef: data.company_ref ?? null,
      prescriptionId: data.prescription_id ?? null,
      quoteId: data.quote_id ?? null,
      orderId: data.order_id ?? null,
      payload: data.payload || {},
    };
  }

  const legacyParsed = legacySchema.parse(input);
  const data = legacyParsed.data;
  const canonicalPatient = getNestedRecord(data.canonicalPatient);

  return {
    eventId: legacyParsed.eventId,
    eventName: normalizeLegacyEventName(legacyParsed),
    idempotencyKey: legacyParsed.idempotencyKey,
    correlationId: legacyParsed.correlationId,
    sourceSystem: legacyParsed.sourceSystem,
    sourceJourney: legacyParsed.sourceJourney,
    contractVersion: legacyParsed.contractVersion || "1.0",
    occurredAt: legacyParsed.occurredAt || new Date().toISOString(),
    producer: legacyParsed.sourceSystem,
    patientRef: toStringOrNull(data.patientRef) || toStringOrNull(data.patient_id),
    doctorRef: toStringOrNull(data.doctorId),
    pharmacyRef: toStringOrNull(data.pharmacyId),
    companyRef: toStringOrNull(data.companyId),
    prescriptionId:
      toStringOrNull(data.prescriptionId) ||
      toStringOrNull(data.documentId) ||
      toStringOrNull(data.document_id),
    quoteId: toStringOrNull(data.quoteId),
    orderId: toStringOrNull(data.orderId),
    payload: {
      ...data,
      canonicalPatient,
    },
  };
}

export async function verifyEcosystemSignature(input: {
  body: unknown;
  rawText: string;
  secret: string;
  signature: string | null;
  timestamp: string | null;
  nonce: string | null;
  toleranceSeconds?: number;
}) {
  if (!input.signature) {
    return { ok: false as const, reason: "Assinatura não fornecida" };
  }

  if (input.timestamp || input.nonce) {
    if (!input.timestamp || !input.nonce) {
      return { ok: false as const, reason: "Cabeçalhos de assinatura incompletos" };
    }

    const toleranceSeconds = Math.min(Math.max(input.toleranceSeconds ?? 300, 30), 900);
    const parsedTimestamp = new Date(input.timestamp).getTime();
    if (Number.isNaN(parsedTimestamp)) {
      return { ok: false as const, reason: "Timestamp inválido" };
    }

    const driftSeconds = Math.abs(Date.now() - parsedTimestamp) / 1000;
    if (driftSeconds > toleranceSeconds) {
      return { ok: false as const, reason: "Timestamp expirado" };
    }

    const expectedSignature = getSignedSignature(
      input.body,
      input.timestamp,
      input.nonce,
      input.secret,
    );

    if (!timingSafeEqual(input.signature, expectedSignature)) {
      return { ok: false as const, reason: "Assinatura inválida" };
    }

    const nonceAccepted = await markNonceSeen(input.nonce, toleranceSeconds);
    if (!nonceAccepted) {
      return { ok: false as const, reason: "Nonce já utilizado" };
    }

    return { ok: true as const, authMode: "signed" as const };
  }

  const expectedSignature = getLegacySignature(input.rawText, input.secret);
  if (!timingSafeEqual(input.signature, expectedSignature)) {
    return { ok: false as const, reason: "Assinatura inválida" };
  }

  return { ok: true as const, authMode: "legacy" as const };
}

export function mapCanonicalEventToHandoffStatus(eventName: CanonicalEventName) {
  switch (eventName) {
    case "clinical.consult.completed":
      return "consult_completed";
    case "prescription.created":
    case "prescription.signed":
      return "prescription_created";
    case "quote.created":
      return "quote_created";
    case "payment.confirmed":
      return "order_paid";
    case "order.in_transit":
      return "pharmacy_order_started";
    case "order.delivered":
      return "order_delivered";
    case "program.task.unlocked":
      return "retention_started";
    case "program.followup.required":
      return "followup_started";
    default:
      return null;
  }
}
