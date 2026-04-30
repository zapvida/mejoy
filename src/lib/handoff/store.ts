import { createClient } from "@supabase/supabase-js";

import type { HandoffEnvelopeV1 } from "@/lib/handoff/envelope";
import type { HandoffStatus } from "@/lib/handoff/schema";

type PersistHandoffEventParams = {
  envelope: HandoffEnvelopeV1;
  status: HandoffStatus;
  eventName: string | null;
  source: "create_api" | "status_api";
  metadata?: Record<string, unknown>;
};

type HandoffEventRow = {
  id: string;
  handoff_id: string;
  status: HandoffStatus;
  event_name: string | null;
  triage_id: string;
  report_id: string | null;
  order_id: string | null;
  program_slug: string;
  envelope: HandoffEnvelopeV1;
  metadata: Record<string, any> | null;
  created_at: string;
};

type PersistResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
};

function createSupabaseIfConfigured() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
    db: { schema: "public" }
  });
}

function isMatchingCreateCandidate(
  row: HandoffEventRow,
  params: {
    triageId: string;
    reportId?: string;
    orderId?: string;
    programSlug: string;
    idempotencyKey?: string;
  }
) {
  if (row.status !== "created" && row.status !== "sent") return false;
  if (row.triage_id !== params.triageId) return false;
  if ((row.report_id || null) !== (params.reportId || null)) return false;
  if ((row.order_id || null) !== (params.orderId || null)) return false;
  if (row.program_slug !== params.programSlug) return false;

  const metadata = row.metadata || {};
  if (params.idempotencyKey && metadata.idempotency_key && metadata.idempotency_key !== params.idempotencyKey) {
    return false;
  }

  const expiresAt = new Date(row.envelope?.expires_at || 0).getTime();
  return !Number.isNaN(expiresAt) && expiresAt > Date.now();
}

export async function persistHandoffEvent({
  envelope,
  status,
  eventName,
  source,
  metadata = {}
}: PersistHandoffEventParams): Promise<PersistResult> {
  const supabase = createSupabaseIfConfigured();
  if (!supabase) {
    return { ok: false, skipped: true, reason: "SUPABASE_NOT_CONFIGURED" };
  }

  const payload = {
    handoff_id: envelope.handoff_id,
    status,
    event_name: eventName,
    triage_id: envelope.journey.triage_id,
    report_id: envelope.journey.report_id || null,
    order_id: envelope.journey.order_id || null,
    patient_id: envelope.journey.patient_id || null,
    program_slug: envelope.journey.program_slug,
    recommended_queue: envelope.journey.recommended_queue || null,
    source_system: envelope.source_system,
    target_system: envelope.target_system,
    consent_status: envelope.consent.consent_status,
    utm: envelope.utm || {},
    identity: envelope.identity || {},
    envelope,
    metadata: {
      source,
      ...metadata
    }
  };

  const { error } = await supabase.from("handoff_events").insert(payload);
  if (error) {
    if (error.code === "42P01") {
      return { ok: false, skipped: true, reason: "TABLE_NOT_FOUND" };
    }
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}

export async function getHandoffHistory(handoffId: string): Promise<HandoffEventRow[]> {
  const supabase = createSupabaseIfConfigured();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("handoff_events")
    .select("id,handoff_id,status,event_name,triage_id,report_id,order_id,program_slug,envelope,metadata,created_at")
    .eq("handoff_id", handoffId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    return [];
  }

  return (data || []) as HandoffEventRow[];
}

export async function findReusableCreatedHandoff(params: {
  triageId: string;
  reportId?: string;
  orderId?: string;
  programSlug: string;
  idempotencyKey?: string;
}): Promise<HandoffEventRow | null> {
  const supabase = createSupabaseIfConfigured();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("handoff_events")
    .select("id,handoff_id,status,event_name,triage_id,report_id,order_id,program_slug,envelope,metadata,created_at")
    .eq("triage_id", params.triageId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return null;

  const rows = ((data || []) as HandoffEventRow[]).filter((row) =>
    isMatchingCreateCandidate(row, params)
  );

  return rows[0] || null;
}
