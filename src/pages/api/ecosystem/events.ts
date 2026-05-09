import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import {
  mapCanonicalEventToHandoffStatus,
  normalizeEcosystemEvent,
  verifyEcosystemSignature,
} from "@/lib/ecosystem/canonical-events";

export const config = { api: { bodyParser: false } };

function getSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) return null;
  return { url, key };
}

async function persistEvent(payload: ReturnType<typeof normalizeEcosystemEvent>) {
  const config = getSupabaseConfig();
  if (!config) {
    return { ok: false, skipped: true, reason: "SUPABASE_NOT_CONFIGURED" };
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(config.url, config.key, {
    auth: { persistSession: false },
    db: { schema: "public" },
  });

  const existing = await supabase
    .from("ecosystem_events")
    .select("event_id")
    .eq("event_id", payload.eventId)
    .maybeSingle();

  if (existing.data?.event_id) {
    return { ok: true, deduped: true };
  }

  const { error } = await supabase.from("ecosystem_events").insert({
    event_id: payload.eventId,
    event_name: payload.eventName,
    correlation_id: payload.correlationId,
    idempotency_key: payload.idempotencyKey,
    source_system: payload.sourceSystem,
    source_journey: payload.sourceJourney,
    contract_version: payload.contractVersion || "1.0",
    occurred_at: payload.occurredAt || new Date().toISOString(),
    payload: {
      ...payload.payload,
      patient_ref: payload.patientRef,
      doctor_ref: payload.doctorRef,
      pharmacy_ref: payload.pharmacyRef,
      company_ref: payload.companyRef,
      prescription_id: payload.prescriptionId,
      quote_id: payload.quoteId,
      order_id: payload.orderId,
      producer: payload.producer,
    },
  });

  if (error) {
    if (error.code === "42P01") {
      return { ok: false, skipped: true, reason: "TABLE_NOT_FOUND" };
    }
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST" });
  }

  const secret = process.env.MEJOY_ECOSYSTEM_SECRET;
  if (!secret || secret.trim() === "") {
    return res
      .status(500)
      .json({ ok: false, error: "MEJOY_ECOSYSTEM_SECRET não configurado" });
  }

  try {
    const rawBody = await buffer(req);
    const rawText = rawBody.toString("utf8");
    const receivedSignature = req.headers["x-ecosystem-signature"];
    const signature =
      typeof receivedSignature === "string" ? receivedSignature : null;
    const timestamp =
      typeof req.headers["x-ecosystem-timestamp"] === "string"
        ? req.headers["x-ecosystem-timestamp"]
        : null;
    const nonce =
      typeof req.headers["x-ecosystem-nonce"] === "string"
        ? req.headers["x-ecosystem-nonce"]
        : null;
    const parsedBody = JSON.parse(rawText);

    const verification = await verifyEcosystemSignature({
      body: parsedBody,
      rawText,
      secret,
      signature,
      timestamp,
      nonce,
    });

    if (!verification.ok) {
      const statusCode = verification.reason?.includes("Nonce")
        ? 409
        : verification.reason?.includes("Timestamp")
          ? 400
          : 401;
      return res.status(statusCode).json({ ok: false, error: verification.reason });
    }

    const payload = normalizeEcosystemEvent(parsedBody);
    const persisted = await persistEvent(payload);
    const mirroredStatus = mapCanonicalEventToHandoffStatus(payload.eventName);

    return res.status(200).json({
      ok: true,
      event: payload.eventName,
      eventId: payload.eventId,
      persisted: persisted.ok,
      deduped: "deduped" in persisted ? persisted.deduped : false,
      skipped: "skipped" in persisted ? persisted.skipped : false,
      reason: "reason" in persisted ? persisted.reason : null,
      mirroredStatus,
      authMode: verification.authMode,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: "Payload inválido",
        issues: error.flatten(),
      });
    }

    return res.status(500).json({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Falha ao processar evento do ecossistema",
    });
  }
}
