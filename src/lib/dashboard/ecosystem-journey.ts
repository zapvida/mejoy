import type { ClinicalHandoffState, CustomerJourneyState } from "@/lib/dashboard/types";

export type DashboardEcosystemEvent = {
  eventName: string;
  occurredAt: string;
  sourceSystem?: string | null;
  payload?: Record<string, unknown> | null;
};

export type EcosystemJourneySignals = {
  consultState: "not_started" | "completed";
  prescriptionState: "not_started" | "issued";
  medicationState: "not_started" | "quoted" | "paid" | "in_transit" | "delivered";
  followupState: "idle" | "required" | "active";
  nextBestAction:
    | "book_consult"
    | "review_prescription"
    | "complete_checkout"
    | "track_delivery"
    | "start_treatment"
    | "schedule_followup"
    | "keep_followup";
  clinicalStatusOverride: ClinicalHandoffState | null;
  journeyStateOverride: CustomerJourneyState | null;
};

export function deriveEcosystemJourneySignals(
  events: DashboardEcosystemEvent[],
): EcosystemJourneySignals {
  const sorted = [...events].sort(
    (a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
  );

  const signals: EcosystemJourneySignals = {
    consultState: "not_started",
    prescriptionState: "not_started",
    medicationState: "not_started",
    followupState: "idle",
    nextBestAction: "book_consult",
    clinicalStatusOverride: null,
    journeyStateOverride: null,
  };

  for (const event of sorted) {
    switch (event.eventName) {
      case "clinical.consult.completed":
        signals.consultState = "completed";
        signals.clinicalStatusOverride = "completed";
        signals.nextBestAction = "review_prescription";
        signals.journeyStateOverride = "consult_in_progress";
        break;
      case "prescription.created":
      case "prescription.signed":
        signals.prescriptionState = "issued";
        signals.clinicalStatusOverride = "payment_pending";
        signals.nextBestAction = "complete_checkout";
        signals.journeyStateOverride = "rx_pending";
        break;
      case "quote.created":
        signals.medicationState = "quoted";
        signals.clinicalStatusOverride = "payment_pending";
        signals.nextBestAction = "complete_checkout";
        signals.journeyStateOverride = "rx_pending";
        break;
      case "payment.confirmed":
        signals.medicationState = "paid";
        signals.nextBestAction = "track_delivery";
        signals.journeyStateOverride = "payment_confirmed";
        break;
      case "order.in_transit":
        signals.medicationState = "in_transit";
        signals.nextBestAction = "track_delivery";
        signals.journeyStateOverride = "shipped";
        break;
      case "order.delivered":
        signals.medicationState = "delivered";
        signals.clinicalStatusOverride = "completed";
        signals.nextBestAction = "start_treatment";
        signals.journeyStateOverride = "delivered";
        break;
      case "program.followup.required":
        signals.followupState = "required";
        signals.clinicalStatusOverride = "followup";
        signals.nextBestAction = "schedule_followup";
        signals.journeyStateOverride = "consult_in_progress";
        break;
      case "program.task.unlocked":
        signals.followupState = signals.followupState === "required" ? "required" : "active";
        signals.nextBestAction =
          signals.followupState === "required" ? "schedule_followup" : "keep_followup";
        break;
      default:
        break;
    }
  }

  return signals;
}
