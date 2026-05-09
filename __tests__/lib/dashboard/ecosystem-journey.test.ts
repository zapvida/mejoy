import { deriveEcosystemJourneySignals } from "@/lib/dashboard/ecosystem-journey";

describe("ecosystem journey signals", () => {
  it("derives prescription, delivery and follow-up states from canonical events", () => {
    const signals = deriveEcosystemJourneySignals([
      {
        eventName: "clinical.consult.completed",
        occurredAt: "2026-05-08T10:00:00.000Z",
      },
      {
        eventName: "prescription.signed",
        occurredAt: "2026-05-08T10:10:00.000Z",
      },
      {
        eventName: "payment.confirmed",
        occurredAt: "2026-05-08T10:20:00.000Z",
      },
      {
        eventName: "order.in_transit",
        occurredAt: "2026-05-08T10:30:00.000Z",
      },
      {
        eventName: "program.followup.required",
        occurredAt: "2026-05-08T10:40:00.000Z",
      },
    ]);

    expect(signals.consultState).toBe("completed");
    expect(signals.prescriptionState).toBe("issued");
    expect(signals.medicationState).toBe("in_transit");
    expect(signals.followupState).toBe("required");
    expect(signals.nextBestAction).toBe("schedule_followup");
    expect(signals.journeyStateOverride).toBe("consult_in_progress");
  });
});
