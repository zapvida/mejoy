import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

import { readTrackingContextFromReq } from "@/lib/analytics/utm";
import {
  buildZapVidaHandoffUrl,
  createHandoffEnvelope,
  mapStatusToAnalyticsEvent,
  signHandoffEnvelope
} from "@/lib/handoff/envelope";
import { parseCreateHandoffBody } from "@/lib/handoff/schema";
import { findReusableCreatedHandoff, persistHandoffEvent } from "@/lib/handoff/store";
import { withRateLimit } from "@/pages/api/_utils/withRateLimit";

function deriveCreateIdempotencyKey(input: {
  triageId: string;
  reportId?: string;
  orderId?: string;
  programSlug: string;
  correlationId?: string;
  explicitKey?: string;
}) {
  if (input.explicitKey) return input.explicitKey;
  return [
    "handoff:create",
    input.programSlug,
    input.triageId,
    input.reportId || "no-report",
    input.orderId || "no-order",
    input.correlationId || "no-correlation"
  ].join(":");
}

export async function createHandoffHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST" });
  }

  try {
    const body = parseCreateHandoffBody(req.body || {});
    const tracking = readTrackingContextFromReq(req);
    const correlationId = body.correlationId || tracking.correlationId;
    const sessionPseudoId = body.sessionPseudoId || tracking.sessionPseudoId;
    const idempotencyKey = deriveCreateIdempotencyKey({
      triageId: body.triageId,
      reportId: body.reportId,
      orderId: body.orderId,
      programSlug: body.programSlug,
      correlationId,
      explicitKey: body.idempotencyKey || (req.headers["idempotency-key"] as string | undefined)
    });

    const reusable = await findReusableCreatedHandoff({
      triageId: body.triageId,
      reportId: body.reportId,
      orderId: body.orderId,
      programSlug: body.programSlug,
      idempotencyKey
    });

    if (reusable?.envelope) {
      const handoffToken = signHandoffEnvelope(reusable.envelope);
      const redirectUrl = buildZapVidaHandoffUrl(
        handoffToken,
        reusable.envelope.journey.program_slug,
        reusable.envelope.handoff_id,
        reusable.envelope.correlation_id
      );

      return res.status(200).json({
        ok: true,
        deduped: true,
        handoffId: reusable.envelope.handoff_id,
        correlationId: reusable.envelope.correlation_id,
        eventName: reusable.event_name,
        handoffToken,
        redirectUrl,
        envelope: reusable.envelope
      });
    }

    const envelope = createHandoffEnvelope({
      triageId: body.triageId,
      reportId: body.reportId,
      orderId: body.orderId,
      quoteId: body.quoteId,
      prescriptionId: body.prescriptionId,
      patientId: body.patientId,
      programSlug: body.programSlug,
      recommendedQueue: body.recommendedQueue,
      consentStatus: body.consentStatus,
      consentTimestamp: body.consentTimestamp,
      correlationId,
      sessionPseudoId,
      sourceJourney: body.sourceJourney,
      sourceUrl: body.sourceUrl || tracking.sourceUrl,
      metadata: {
        ...body.metadata,
        origin: body.metadata.origin || "handoff_create",
        idempotency_key: idempotencyKey
      },
      utm: {
        source: body.utm.source || tracking.source,
        medium: body.utm.medium || tracking.medium,
        campaign: body.utm.campaign || tracking.campaign,
        content: body.utm.content || tracking.content,
        term: body.utm.term || tracking.term,
        gclid: body.utm.gclid || tracking.gclid,
        fbclid: body.utm.fbclid || tracking.fbclid,
        ttclid: body.utm.ttclid || tracking.ttclid,
        msclkid: body.utm.msclkid || tracking.msclkid,
        ref: body.utm.ref || tracking.ref
      },
      email: body.email,
      phone: body.phone,
      ttlSeconds: body.ttlSeconds
    });

    const handoffToken = signHandoffEnvelope(envelope);
    const redirectUrl = buildZapVidaHandoffUrl(
      handoffToken,
      envelope.journey.program_slug,
      envelope.handoff_id,
      envelope.correlation_id
    );

    const createdEventName = mapStatusToAnalyticsEvent("created");
    const sentEventName = mapStatusToAnalyticsEvent("sent");
    const baseMetadata = {
      event_id: `${envelope.handoff_id}:created`,
      correlation_id: envelope.correlation_id,
      schema_version: envelope.handoff_version,
      occurred_at: envelope.created_at,
      idempotency_key: idempotencyKey,
      producer: "mejoy.api.handoff.create",
      user_agent: req.headers["user-agent"] || null,
      x_forwarded_for: req.headers["x-forwarded-for"] || null,
      referer: req.headers.referer || null
    };

    await persistHandoffEvent({
      envelope,
      status: "created",
      eventName: createdEventName,
      source: "create_api",
      metadata: baseMetadata
    });

    await persistHandoffEvent({
      envelope: {
        ...envelope,
        journey: {
          ...envelope.journey,
          handoff_status: "sent"
        }
      },
      status: "sent",
      eventName: sentEventName,
      source: "create_api",
      metadata: {
        ...baseMetadata,
        event_id: `${envelope.handoff_id}:sent`,
        delivery_status: "sent"
      }
    });

    const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
    res.setHeader("Set-Cookie", [
      `handoff_id=${encodeURIComponent(envelope.handoff_id)}; Path=/; Max-Age=86400; SameSite=Lax; HttpOnly;${secure}`,
      `mejoy_correlation_id=${encodeURIComponent(envelope.correlation_id)}; Path=/; Max-Age=31536000; SameSite=Lax;${secure}`,
      sessionPseudoId
        ? `mejoy_session_id=${encodeURIComponent(sessionPseudoId)}; Path=/; Max-Age=31536000; SameSite=Lax;${secure}`
        : ""
    ].filter(Boolean));

    return res.status(200).json({
      ok: true,
      handoffId: envelope.handoff_id,
      correlationId: envelope.correlation_id,
      eventName: createdEventName,
      handoffToken,
      redirectUrl,
      envelope
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        error: "Payload inválido",
        issues: error.issues
      });
    }

    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Falha ao criar handoff"
    });
  }
}

export default withRateLimit(createHandoffHandler, { limit: 60, windowSec: 60 });
