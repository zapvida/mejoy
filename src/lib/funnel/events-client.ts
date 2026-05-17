import { getOrCreateJourneyContext } from "@/lib/analytics/journey";
import {
  inferProgramSlugFromPath,
  readClientAttribution,
  sanitizeClientAnalyticsPayload,
} from "@/lib/analytics/clientTracking";

export type FunnelEventName =
  | "lp_view"
  | "cta_start_triage"
  | "triage_started"
  | "triage_completed"
  | "report_viewed"
  | "whatsapp_report_cta"
  | "doctor_orientation_click"
  | "trilha_selected"
  | "plan_selected"
  | "report_plan_selected"
  | "report_inline_checkout_opened"
  | "checkout_viewed"
  | "begin_checkout"
  | "report_inline_checkout_started"
  | "pix_generated"
  | "pix_copied"
  | "payment_link_opened"
  | "report_payment_pending"
  | "checkout_error"
  | "checkout_abandon"
  | "payment_confirmed"
  | "cta_clinical_handoff"
  | "handoff_failed"
  | "handoff_created"
  | "handoff_opened"
  | "handoff_completed"
  | "clinical_payment_started"
  | "clinical_payment_success"
  | "dashboard_redirect_after_payment"
  | "consult_completed"
  | "pharmacy_order_started"
  | "pharmacy_order_created"
  | "followup_started";

export const CANONICAL_LAUNCH_EVENT_NAMES: readonly FunnelEventName[] = [
  "lp_view",
  "cta_start_triage",
  "triage_started",
  "triage_completed",
  "report_viewed",
  "doctor_orientation_click",
  "plan_selected",
  "checkout_viewed",
  "begin_checkout",
  "cta_clinical_handoff",
  "handoff_created",
  "handoff_opened",
  "handoff_failed",
  "pix_generated",
  "pix_copied",
  "payment_link_opened",
  "checkout_error",
  "checkout_abandon",
  "clinical_payment_started",
  "payment_confirmed",
  "clinical_payment_success",
  "consult_completed",
  "pharmacy_order_created",
] as const;

export type MejoyConversionEventName =
  | "triage_start"
  | "triage_submit"
  | "triage_submit_blocked"
  | "triage_answer_persist_failed"
  | "triage_finalize_failed"
  | "report_view"
  | "report_cta_click"
  | "medication_preference_select"
  | "plan_select"
  | "checkout_inline_open"
  | "begin_checkout"
  | "whatsapp_report_click"
  | "handoff_created"
  | "payment_created";

function pushToDataLayer(event: FunnelEventName, payload: Record<string, any>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

function pushToGtag(event: FunnelEventName, payload: Record<string, any>) {
  if (typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", event, payload);
  }
}

function pushToCustomAnalytics(
  event: FunnelEventName,
  payload: Record<string, any>,
) {
  if (typeof window === "undefined") return;
  try {
    window.analytics?.track?.(event, payload);
  } catch {
    // no-op
  }
}

function buildCanonicalPayload(payload: Record<string, any>) {
  const journey = getOrCreateJourneyContext();
  return sanitizeClientAnalyticsPayload({
    ...readClientAttribution(),
    ...payload,
    program_slug: payload.program_slug || inferProgramSlugFromPath(),
    origin: payload.origin || payload.source || window.location.pathname,
    correlation_id: payload.correlation_id || journey.correlationId,
    session_pseudo_id: payload.session_pseudo_id || journey.sessionPseudoId,
    ts: Date.now(),
    path: window.location.pathname,
    query: window.location.search,
  });
}

export function trackFunnelEvent(
  event: FunnelEventName,
  payload: Record<string, any> = {},
) {
  if (typeof window === "undefined") return;
  const enrichedPayload = buildCanonicalPayload(payload);

  pushToDataLayer(event, enrichedPayload);
  pushToGtag(event, enrichedPayload);
  pushToCustomAnalytics(event, enrichedPayload);
}

export function trackMejoyConversionEvent(
  event: MejoyConversionEventName,
  payload: Record<string, any> = {},
) {
  if (typeof window === "undefined") return;
  const enrichedPayload = buildCanonicalPayload({
    funnel: "mejoy_emagrecimento",
    product: "emagrecimento",
    ...payload,
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...enrichedPayload });
  if (window.gtag) {
    window.gtag("event", event, enrichedPayload);
  }
  try {
    window.analytics?.track?.(event, enrichedPayload);
  } catch {
    // no-op
  }
}
