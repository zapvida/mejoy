import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

import {
  mapStatusToAnalyticsEvent,
  signHandoffEnvelope,
  updateHandoffStatus,
  verifyHandoffToken
} from "@/lib/handoff/envelope";
import {
  isHandoffTransitionAllowed,
  isTerminalHandoffStatus,
  parseStatusHandoffBody,
  type HandoffStatus
} from "@/lib/handoff/schema";
import {
  getCallbackSignatureMetadata,
  verifySignedStatusCallback
} from "@/lib/handoff/security";
import { getHandoffHistory, persistHandoffEvent } from "@/lib/handoff/store";
import { withRateLimit } from "@/pages/api/_utils/withRateLimit";

function deriveStatusIdempotencyKey(input: {
  handoffId: string;
  status: HandoffStatus;
  explicitKey?: string;
}) {
  return input.explicitKey || `handoff:status:${input.handoffId}:${input.status}`;
}

export async function handoffStatusHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST" });
  }

  try {
    const body = parseStatusHandoffBody(req.body || {});
    const verified = verifyHandoffToken(body.handoffToken);
    if (!verified.valid || !verified.envelope) {
      return res.status(400).json({ ok: false, error: verified.reason || "token inválido" });
    }

    const callbackAuth = await verifySignedStatusCallback({
      body: req.body || {},
      signature: req.headers["x-handoff-signature"],
      timestamp: req.headers["x-handoff-timestamp"],
      nonce: req.headers["x-handoff-nonce"]
    });

    if (!callbackAuth.ok) {
      const replayRejected = callbackAuth.reason?.includes("Nonce");
      const expiredTimestamp = callbackAuth.reason?.includes("Timestamp");
      const statusCode = replayRejected ? 409 : expiredTimestamp ? 400 : 401;
      return res.status(statusCode).json({ ok: false, error: callbackAuth.reason });
    }

    const handoffId = verified.envelope.handoff_id;
    const history = await getHandoffHistory(handoffId);
    const latestEvent = history[history.length - 1];
    const currentStatus = latestEvent?.status || verified.envelope.journey.handoff_status;
    const idempotencyKey = deriveStatusIdempotencyKey({
      handoffId,
      status: body.status,
      explicitKey: body.idempotencyKey || (req.headers["idempotency-key"] as string | undefined)
    });

    const duplicateEvent = history.find((event) => {
      const metadata = event.metadata || {};
      return (
        event.status === body.status &&
        (metadata.idempotency_key === idempotencyKey || isTerminalHandoffStatus(event.status))
      );
    });

    if (duplicateEvent) {
      const envelope = updateHandoffStatus(verified.envelope, body.status, {
        orderId: body.orderId,
        quoteId: body.quoteId,
        prescriptionId: body.prescriptionId,
        correlationId: body.correlationId || verified.envelope.correlation_id,
        metadata: body.metadata,
        callbackAuthMode: callbackAuth.authMode
      });
      return res.status(200).json({
        ok: true,
        deduped: true,
        handoffId,
        status: body.status,
        eventName: duplicateEvent.event_name,
        handoffToken: signHandoffEnvelope(envelope),
        envelope
      });
    }

    if (!isHandoffTransitionAllowed(currentStatus, body.status)) {
      return res.status(409).json({
        ok: false,
        error: `Transição inválida: ${currentStatus} -> ${body.status}`
      });
    }

    const envelope = updateHandoffStatus(verified.envelope, body.status, {
      orderId: body.orderId,
      quoteId: body.quoteId,
      prescriptionId: body.prescriptionId,
      correlationId: body.correlationId || verified.envelope.correlation_id,
      metadata: {
        ...body.metadata,
        status_reason: body.statusReason || null
      },
      callbackAuthMode: callbackAuth.authMode
    });
    envelope.signature = getCallbackSignatureMetadata(callbackAuth.authMode);

    const updatedToken = signHandoffEnvelope(envelope);
    const eventName = mapStatusToAnalyticsEvent(body.status);

    await persistHandoffEvent({
      envelope,
      status: body.status,
      eventName,
      source: "status_api",
      metadata: {
        event_id: `${envelope.handoff_id}:${body.status}`,
        correlation_id: envelope.correlation_id,
        schema_version: envelope.handoff_version,
        occurred_at: body.occurredAt || new Date().toISOString(),
        idempotency_key: idempotencyKey,
        producer: "mejoy.api.handoff.status",
        auth_mode: callbackAuth.authMode,
        callback_nonce: callbackAuth.nonce || null,
        callback_timestamp: callbackAuth.timestamp || null,
        user_agent: req.headers["user-agent"] || null,
        x_forwarded_for: req.headers["x-forwarded-for"] || null,
        referer: req.headers.referer || null,
        transition_from: currentStatus,
        transition_to: body.status
      }
    });

    const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
    res.setHeader(
      "Set-Cookie",
      `handoff_id=${encodeURIComponent(handoffId)}; Path=/; Max-Age=86400; SameSite=Lax; HttpOnly;${secure}`
    );

    return res.status(200).json({
      ok: true,
      handoffId,
      correlationId: envelope.correlation_id,
      status: body.status,
      eventName,
      handoffToken: updatedToken,
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
      error: error instanceof Error ? error.message : "Falha ao processar callback"
    });
  }
}

export default withRateLimit(handoffStatusHandler, { limit: 120, windowSec: 60 });
