import crypto from "crypto";

import {
  getHandoffSecret,
  getHandoffSecretSource,
  getHandoffTtlSeconds
} from "@/lib/handoff/config";
import {
  HANDOFF_VERSION,
  handoffEnvelopeSchema,
  mapStatusToAnalyticsEvent,
  sanitizeSafeMetadata,
  type ConsentStatus,
  type HandoffStatus,
  type SafeMetadata
} from "@/lib/handoff/schema";

export { HANDOFF_VERSION, mapStatusToAnalyticsEvent };

export interface HandoffEnvelopeV1 {
  handoff_version: string;
  handoff_id: string;
  correlation_id: string;
  source_system: "mejoy";
  target_system: "zapvida";
  source_journey: string;
  source_url?: string;
  created_at: string;
  issued_at: string;
  expires_at: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    gclid?: string;
    fbclid?: string;
    ttclid?: string;
    msclkid?: string;
    ref?: string;
  };
  session_pseudo_id?: string;
  journey: {
    triage_id: string;
    report_id?: string;
    order_id?: string;
    quote_id?: string;
    prescription_id?: string;
    patient_id?: string;
    program_slug: string;
    recommended_queue?: string;
    handoff_status: HandoffStatus;
  };
  consent: {
    consent_status: ConsentStatus;
    consent_timestamp: string;
  };
  identity: {
    email_hash?: string;
    phone_hash?: string;
  };
  signature?: {
    algorithm: "HS256";
    token_type: "handoff_envelope";
    key_source: string;
    signed_at: string;
    callback_auth_mode: "token_only" | "signed";
  };
  metadata: SafeMetadata;
}

export interface CreateHandoffInput {
  triageId: string;
  reportId?: string;
  orderId?: string;
  quoteId?: string;
  prescriptionId?: string;
  patientId?: string;
  programSlug?: string;
  recommendedQueue?: string;
  consentStatus?: ConsentStatus;
  consentTimestamp?: string;
  correlationId?: string;
  sessionPseudoId?: string;
  sourceJourney?: string;
  sourceUrl?: string;
  metadata?: SafeMetadata;
  utm?: HandoffEnvelopeV1["utm"];
  email?: string;
  phone?: string;
  ttlSeconds?: number;
  callbackAuthMode?: "token_only" | "signed";
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  const padded = input + "===".slice((input.length + 3) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf8");
}

function hashPII(value?: string): string | undefined {
  if (!value) return undefined;
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function createHandoffEnvelope(input: CreateHandoffInput): HandoffEnvelopeV1 {
  const now = new Date();
  const ttl = getHandoffTtlSeconds(input.ttlSeconds);
  const expiresAt = new Date(now.getTime() + ttl * 1000);
  const handoffId = crypto.randomUUID();
  const createdAt = now.toISOString();
  const correlationId = input.correlationId || crypto.randomUUID();

  return {
    handoff_version: HANDOFF_VERSION,
    handoff_id: handoffId,
    correlation_id: correlationId,
    source_system: "mejoy",
    target_system: "zapvida",
    source_journey: input.sourceJourney || input.programSlug || "emagrecimento",
    source_url: input.sourceUrl,
    created_at: createdAt,
    issued_at: createdAt,
    expires_at: expiresAt.toISOString(),
    utm: input.utm || {},
    session_pseudo_id: input.sessionPseudoId,
    journey: {
      triage_id: input.triageId,
      report_id: input.reportId,
      order_id: input.orderId,
      quote_id: input.quoteId,
      prescription_id: input.prescriptionId,
      patient_id: input.patientId,
      program_slug: input.programSlug || "emagrecimento",
      recommended_queue: input.recommendedQueue,
      handoff_status: "created"
    },
    consent: {
      consent_status: input.consentStatus || "pending",
      consent_timestamp: input.consentTimestamp || createdAt
    },
    identity: {
      email_hash: hashPII(input.email),
      phone_hash: hashPII(input.phone)
    },
    signature: {
      algorithm: "HS256",
      token_type: "handoff_envelope",
      key_source: getHandoffSecretSource(),
      signed_at: createdAt,
      callback_auth_mode: input.callbackAuthMode || "token_only"
    },
    metadata: sanitizeSafeMetadata(input.metadata || {})
  };
}

export function signHandoffEnvelope(
  envelope: HandoffEnvelopeV1,
  secret: string = getHandoffSecret()
): string {
  const payload = base64UrlEncode(JSON.stringify(envelope));
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${payload}.${signature}`;
}

export function verifyHandoffToken(token: string, secret: string = getHandoffSecret()): {
  valid: boolean;
  envelope?: HandoffEnvelopeV1;
  reason?: string;
} {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return { valid: false, reason: "Token inválido" };
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return { valid: false, reason: "Assinatura inválida" };
  }

  try {
    const parsedPayload = JSON.parse(base64UrlDecode(payload));
    const envelope = handoffEnvelopeSchema.parse(parsedPayload) as HandoffEnvelopeV1;
    const expiresAt = new Date(envelope.expires_at).getTime();
    if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false, reason: "Token expirado" };
    }
    return { valid: true, envelope };
  } catch {
    return { valid: false, reason: "Payload inválido" };
  }
}

export function updateHandoffStatus(
  envelope: HandoffEnvelopeV1,
  status: HandoffStatus,
  updates: Partial<{
    orderId: string;
    quoteId: string;
    prescriptionId: string;
    correlationId: string;
    metadata: SafeMetadata;
    callbackAuthMode: "token_only" | "signed";
  }> = {}
): HandoffEnvelopeV1 {
  return {
    ...envelope,
    handoff_id: envelope.handoff_id || deriveLegacyHandoffId(envelope),
    correlation_id: updates.correlationId || envelope.correlation_id,
    journey: {
      ...envelope.journey,
      order_id: updates.orderId || envelope.journey.order_id,
      quote_id: updates.quoteId || envelope.journey.quote_id,
      prescription_id: updates.prescriptionId || envelope.journey.prescription_id,
      handoff_status: status
    },
    signature: {
      algorithm: "HS256",
      token_type: "handoff_envelope",
      key_source: getHandoffSecretSource(),
      signed_at: new Date().toISOString(),
      callback_auth_mode: updates.callbackAuthMode || envelope.signature?.callback_auth_mode || "token_only"
    },
    metadata: sanitizeSafeMetadata({
      ...(envelope.metadata || {}),
      ...(updates.metadata || {})
    })
  };
}

export function deriveLegacyHandoffId(envelope: Pick<HandoffEnvelopeV1, "issued_at" | "journey">): string {
  const base = `${envelope.journey.triage_id}:${envelope.journey.report_id || ""}:${envelope.issued_at}`;
  return crypto.createHash("sha256").update(base).digest("hex").slice(0, 32);
}

export function buildZapVidaHandoffUrl(
  token: string,
  programSlug = "emagrecimento",
  handoffId?: string,
  correlationId?: string,
  utm: Partial<HandoffEnvelopeV1["utm"]> = {}
): string {
  const base =
    process.env.NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL ||
    `https://zapvida.com/quiz/${encodeURIComponent(programSlug)}`;

  const url = new URL(base);
  url.searchParams.set("handoff", token);
  if (handoffId) {
    url.searchParams.set("handoff_id", handoffId);
  }
  if (correlationId) {
    url.searchParams.set("correlation_id", correlationId);
  }
  url.searchParams.set("utm_source", "mejoy");
  url.searchParams.set("utm_medium", "handoff");
  url.searchParams.set("utm_campaign", `emagrecimento_${programSlug}`);

  if (utm.source) url.searchParams.set("origin_utm_source", utm.source);
  if (utm.medium) url.searchParams.set("origin_utm_medium", utm.medium);
  if (utm.campaign) url.searchParams.set("origin_utm_campaign", utm.campaign);
  if (utm.content) url.searchParams.set("origin_utm_content", utm.content);
  if (utm.term) url.searchParams.set("origin_utm_term", utm.term);
  if (utm.ref) url.searchParams.set("origin_ref", utm.ref);
  if (utm.gclid) url.searchParams.set("gclid", utm.gclid);
  if (utm.fbclid) url.searchParams.set("fbclid", utm.fbclid);
  if (utm.ttclid) url.searchParams.set("ttclid", utm.ttclid);
  if (utm.msclkid) url.searchParams.set("msclkid", utm.msclkid);

  return url.toString();
}
