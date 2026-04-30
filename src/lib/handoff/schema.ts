import { z } from "zod";

export const HANDOFF_VERSION = "1.1" as const;
export const LEGACY_HANDOFF_VERSIONS = ["1.0", "1"] as const;

export const HANDOFF_STATUS_VALUES = [
  "created",
  "sent",
  "opened",
  "accepted",
  "rejected",
  "expired",
  "consult_started",
  "consult_completed",
  "prescription_created",
  "quote_created",
  "clinical_payment_started",
  "clinical_payment_success",
  "order_paid",
  "pharmacy_order_started",
  "pharmacy_order_created",
  "order_delivered",
  "retention_started",
  "followup_started",
  "cancelled",
  "failed",
  "completed"
] as const;

export type HandoffStatus = (typeof HANDOFF_STATUS_VALUES)[number];
export type ConsentStatus = "granted" | "revoked" | "pending";
export type SafeMetadata = Record<string, string | number | boolean | null>;

const SENSITIVE_METADATA_PATTERNS = [
  /name/i,
  /email/i,
  /phone/i,
  /whats/i,
  /cpf/i,
  /document/i,
  /patient/i
];

const isoDatetimeSchema = z.string().datetime({ offset: true });
const trimmedString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.string().min(1).max(255)
);
const optionalTrimmedString = trimmedString.optional();
const optionalLongString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.string().min(1).max(8192)
).optional();
const safeMetadataValueSchema = z.union([
  z.string().max(512),
  z.number().finite(),
  z.boolean(),
  z.null()
]);

const safeMetadataSchema = z
  .record(z.string().regex(/^[a-zA-Z0-9_.:-]{1,64}$/), safeMetadataValueSchema)
  .default({});

const handoffUtmSchema = z
  .object({
    source: optionalTrimmedString,
    medium: optionalTrimmedString,
    campaign: optionalTrimmedString,
    content: optionalTrimmedString,
    term: optionalTrimmedString,
    gclid: optionalTrimmedString,
    fbclid: optionalTrimmedString,
    ttclid: optionalTrimmedString,
    msclkid: optionalTrimmedString,
    ref: optionalTrimmedString
  })
  .partial()
  .default({});

const signatureMetadataSchema = z.object({
  algorithm: z.literal("HS256"),
  token_type: z.literal("handoff_envelope"),
  key_source: z.string().min(1).max(64),
  signed_at: isoDatetimeSchema,
  callback_auth_mode: z.enum(["token_only", "signed"]).default("token_only")
});

const handoffJourneySchema = z.object({
  triage_id: trimmedString,
  report_id: optionalTrimmedString,
  order_id: optionalTrimmedString,
  quote_id: optionalTrimmedString,
  prescription_id: optionalTrimmedString,
  patient_id: optionalTrimmedString,
  program_slug: trimmedString,
  recommended_queue: optionalTrimmedString,
  handoff_status: z.enum(HANDOFF_STATUS_VALUES)
});

const identitySchema = z.object({
  email_hash: optionalTrimmedString,
  phone_hash: optionalTrimmedString
});

export const handoffEnvelopeSchema = z
  .object({
    handoff_version: z.string().min(1).max(16),
    handoff_id: trimmedString.optional(),
    correlation_id: optionalTrimmedString,
    source_system: z.literal("mejoy").default("mejoy"),
    target_system: z.literal("zapvida").default("zapvida"),
    source_journey: optionalTrimmedString,
    source_url: z.string().url().optional(),
    created_at: isoDatetimeSchema.optional(),
    issued_at: isoDatetimeSchema.optional(),
    expires_at: isoDatetimeSchema,
    utm: handoffUtmSchema,
    session_pseudo_id: optionalTrimmedString,
    journey: handoffJourneySchema,
    consent: z.object({
      consent_status: z.enum(["granted", "revoked", "pending"]).default("pending"),
      consent_timestamp: isoDatetimeSchema
    }),
    identity: identitySchema.default({}),
    signature: signatureMetadataSchema.optional(),
    metadata: safeMetadataSchema
  })
  .transform((value) => {
    const createdAt = value.created_at || value.issued_at;
    return {
      ...value,
      handoff_version:
        value.handoff_version === HANDOFF_VERSION ||
        LEGACY_HANDOFF_VERSIONS.includes(value.handoff_version as (typeof LEGACY_HANDOFF_VERSIONS)[number])
          ? value.handoff_version
          : HANDOFF_VERSION,
      handoff_id: value.handoff_id,
      correlation_id: value.correlation_id || value.handoff_id,
      source_journey: value.source_journey || value.journey.program_slug,
      created_at: createdAt || new Date().toISOString(),
      issued_at: createdAt || new Date().toISOString()
    };
  });

const createBodySchema = z
  .object({
    handoffVersion: z.string().optional(),
    handoff_version: z.string().optional(),
    triageId: optionalTrimmedString,
    triage_id: optionalTrimmedString,
    reportId: optionalTrimmedString,
    report_id: optionalTrimmedString,
    orderId: optionalTrimmedString,
    order_id: optionalTrimmedString,
    quoteId: optionalTrimmedString,
    quote_id: optionalTrimmedString,
    prescriptionId: optionalTrimmedString,
    prescription_id: optionalTrimmedString,
    patientId: optionalTrimmedString,
    patient_id: optionalTrimmedString,
    programSlug: optionalTrimmedString,
    program_slug: optionalTrimmedString,
    recommendedQueue: optionalTrimmedString,
    recommended_queue: optionalTrimmedString,
    consentStatus: z.enum(["granted", "revoked", "pending"]).optional(),
    consent_status: z.enum(["granted", "revoked", "pending"]).optional(),
    consentTimestamp: isoDatetimeSchema.optional(),
    consent_timestamp: isoDatetimeSchema.optional(),
    correlationId: optionalTrimmedString,
    correlation_id: optionalTrimmedString,
    sessionPseudoId: optionalTrimmedString,
    session_pseudo_id: optionalTrimmedString,
    sourceJourney: optionalTrimmedString,
    source_journey: optionalTrimmedString,
    sourceUrl: z.string().url().optional(),
    source_url: z.string().url().optional(),
    idempotencyKey: optionalTrimmedString,
    idempotency_key: optionalTrimmedString,
    email: optionalTrimmedString,
    phone: optionalTrimmedString,
    ttlSeconds: z.number().int().positive().max(86400).optional(),
    ttl_seconds: z.number().int().positive().max(86400).optional(),
    metadata: safeMetadataSchema.optional(),
    utm: handoffUtmSchema.optional()
  })
  .passthrough()
  .transform((value) => ({
    handoffVersion: value.handoffVersion || value.handoff_version || HANDOFF_VERSION,
    triageId: value.triageId || value.triage_id || value.reportId || value.report_id,
    reportId: value.reportId || value.report_id,
    orderId: value.orderId || value.order_id,
    quoteId: value.quoteId || value.quote_id,
    prescriptionId: value.prescriptionId || value.prescription_id,
    patientId: value.patientId || value.patient_id,
    programSlug: value.programSlug || value.program_slug || "emagrecimento",
    recommendedQueue:
      value.recommendedQueue || value.recommended_queue || "endocrinologia-metabologia",
    consentStatus: value.consentStatus || value.consent_status || "pending",
    consentTimestamp: value.consentTimestamp || value.consent_timestamp,
    correlationId: value.correlationId || value.correlation_id,
    sessionPseudoId: value.sessionPseudoId || value.session_pseudo_id,
    sourceJourney: value.sourceJourney || value.source_journey || "emagrecimento",
    sourceUrl: value.sourceUrl || value.source_url,
    idempotencyKey: value.idempotencyKey || value.idempotency_key,
    email: value.email,
    phone: value.phone,
    ttlSeconds: value.ttlSeconds || value.ttl_seconds,
    metadata: sanitizeSafeMetadata(value.metadata || {}),
    utm: value.utm || {}
  }))
  .superRefine((value, ctx) => {
    if (!value.triageId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "triageId é obrigatório",
        path: ["triageId"]
      });
    }
  });

const statusBodySchema = z
  .object({
    handoffToken: optionalLongString,
    handoff_token: optionalLongString,
    status: optionalTrimmedString,
    statusReason: optionalTrimmedString,
    status_reason: optionalTrimmedString,
    occurredAt: isoDatetimeSchema.optional(),
    occurred_at: isoDatetimeSchema.optional(),
    idempotencyKey: optionalTrimmedString,
    idempotency_key: optionalTrimmedString,
    correlationId: optionalTrimmedString,
    correlation_id: optionalTrimmedString,
    orderId: optionalTrimmedString,
    order_id: optionalTrimmedString,
    quoteId: optionalTrimmedString,
    quote_id: optionalTrimmedString,
    prescriptionId: optionalTrimmedString,
    prescription_id: optionalTrimmedString,
    metadata: safeMetadataSchema.optional()
  })
  .passthrough()
  .transform((value) => ({
    handoffToken: value.handoffToken || value.handoff_token,
    status: normalizeHandoffStatus(value.status),
    statusReason: value.statusReason || value.status_reason,
    occurredAt: value.occurredAt || value.occurred_at,
    idempotencyKey: value.idempotencyKey || value.idempotency_key,
    correlationId: value.correlationId || value.correlation_id,
    orderId: value.orderId || value.order_id,
    quoteId: value.quoteId || value.quote_id,
    prescriptionId: value.prescriptionId || value.prescription_id,
    metadata: sanitizeSafeMetadata(value.metadata || {})
  }))
  .superRefine((value, ctx) => {
    if (!value.handoffToken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "handoffToken é obrigatório",
        path: ["handoffToken"]
      });
    }
    if (!value.status) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "status inválido",
        path: ["status"]
      });
    }
  });

export type NormalizedCreateHandoffBody = z.infer<typeof createBodySchema>;
export type NormalizedStatusBody = z.infer<typeof statusBodySchema>;

export function parseCreateHandoffBody(body: unknown): NormalizedCreateHandoffBody {
  return createBodySchema.parse(body || {});
}

export function parseStatusHandoffBody(body: unknown): NormalizedStatusBody {
  return statusBodySchema.parse(body || {});
}

export function sanitizeSafeMetadata(metadata: SafeMetadata = {}): SafeMetadata {
  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => {
      return !SENSITIVE_METADATA_PATTERNS.some((pattern) => pattern.test(key));
    })
  );
}

export function normalizeHandoffStatus(value?: string | null): HandoffStatus | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (HANDOFF_STATUS_VALUES.includes(normalized as HandoffStatus)) {
    return normalized as HandoffStatus;
  }
  return null;
}

const TERMINAL_STATUSES = new Set<HandoffStatus>([
  "rejected",
  "expired",
  "cancelled",
  "failed",
  "order_delivered"
]);

const PROGRESS_INDEX: Record<HandoffStatus, number> = {
  created: 0,
  sent: 10,
  opened: 20,
  accepted: 30,
  completed: 30,
  rejected: 35,
  consult_started: 40,
  clinical_payment_started: 45,
  clinical_payment_success: 50,
  consult_completed: 60,
  prescription_created: 70,
  quote_created: 80,
  pharmacy_order_started: 85,
  pharmacy_order_created: 90,
  order_paid: 100,
  order_delivered: 110,
  retention_started: 120,
  followup_started: 120,
  cancelled: 130,
  failed: 130,
  expired: 130
};

export function isTerminalHandoffStatus(status: HandoffStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}

export function isHandoffTransitionAllowed(
  currentStatus: HandoffStatus,
  nextStatus: HandoffStatus
): boolean {
  if (currentStatus === nextStatus) return true;
  if (isTerminalHandoffStatus(currentStatus)) return false;
  if (TERMINAL_STATUSES.has(nextStatus)) return true;
  return PROGRESS_INDEX[nextStatus] >= PROGRESS_INDEX[currentStatus];
}

export function mapStatusToAnalyticsEvent(status: HandoffStatus): string | null {
  const eventMap: Record<HandoffStatus, string | null> = {
    created: "handoff_create",
    sent: "handoff_send",
    opened: "handoff_accept",
    accepted: "handoff_accept",
    completed: "handoff_accept",
    rejected: "handoff_reject",
    expired: "handoff_expired",
    consult_started: "callback_consult_started",
    consult_completed: "callback_consult_completed",
    prescription_created: "callback_prescription_created",
    quote_created: "callback_quote_created",
    clinical_payment_started: "callback_clinical_payment_started",
    clinical_payment_success: "callback_clinical_payment_success",
    order_paid: "callback_order_paid",
    pharmacy_order_started: "callback_pharmacy_order_started",
    pharmacy_order_created: "callback_order_created",
    order_delivered: "callback_order_delivered",
    retention_started: "retention_entry",
    followup_started: "retention_entry",
    cancelled: "callback_cancelled",
    failed: null
  };

  return eventMap[status];
}
