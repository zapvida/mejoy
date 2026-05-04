import { getOrCreateJourneyContext } from "@/lib/analytics/journey";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, any>>;
    gtag?: (...args: any[]) => void;
    analytics?: {
      track?: (event: string, payload?: Record<string, any>) => void;
    };
  }
}

export type FunnelEventName =
  | "lp_view"
  | "cta_start_triage"
  | "triage_started"
  | "triage_completed"
  | "report_viewed"
  | "whatsapp_report_cta"
  | "trilha_selected"
  | "report_plan_selected"
  | "report_inline_checkout_opened"
  | "report_inline_checkout_started"
  | "report_payment_pending"
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

function pushToCustomAnalytics(event: FunnelEventName, payload: Record<string, any>) {
  if (typeof window === "undefined") return;
  try {
    (window as any).analytics?.track?.(event, payload);
  } catch {
    // no-op
  }
}

export function trackFunnelEvent(event: FunnelEventName, payload: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  const journey = getOrCreateJourneyContext();
  const enrichedPayload = {
    ...payload,
    correlation_id: payload.correlation_id || journey.correlationId,
    session_pseudo_id: payload.session_pseudo_id || journey.sessionPseudoId,
    ts: Date.now(),
    path: window.location.pathname,
    query: window.location.search
  };

  pushToDataLayer(event, enrichedPayload);
  pushToGtag(event, enrichedPayload);
  pushToCustomAnalytics(event, enrichedPayload);
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!match) return undefined;
  const value = match.split("=").slice(1).join("=");
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readClientUtm() {
  if (typeof window === "undefined") return {};
  const search = new URLSearchParams(window.location.search);
  const fromQueryOrCookie = (key: string) => search.get(key) || readCookie(key) || undefined;
  return {
    utm_source: fromQueryOrCookie("utm_source"),
    utm_medium: fromQueryOrCookie("utm_medium"),
    utm_campaign: fromQueryOrCookie("utm_campaign"),
    utm_content: fromQueryOrCookie("utm_content"),
    utm_term: fromQueryOrCookie("utm_term"),
  };
}

export function trackMejoyConversionEvent(
  event: MejoyConversionEventName,
  payload: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;
  const journey = getOrCreateJourneyContext();
  const utm = readClientUtm();
  const enrichedPayload = {
    funnel: "mejoy_emagrecimento",
    product: "emagrecimento",
    ...utm,
    ...payload,
    correlation_id: payload.correlation_id || journey.correlationId,
    session_pseudo_id: payload.session_pseudo_id || journey.sessionPseudoId,
    ts: Date.now(),
    path: window.location.pathname,
    query: window.location.search,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...enrichedPayload });
  if (window.gtag) {
    window.gtag("event", event, enrichedPayload);
  }
  try {
    (window as any).analytics?.track?.(event, enrichedPayload);
  } catch {
    // no-op
  }
}
