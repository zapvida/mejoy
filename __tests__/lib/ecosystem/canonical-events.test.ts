import {
  mapCanonicalEventToHandoffStatus,
  normalizeEcosystemEvent,
} from "@/lib/ecosystem/canonical-events";

describe("canonical ecosystem events", () => {
  it("normalizes canonical envelope payloads", () => {
    const event = normalizeEcosystemEvent({
      event_id: "evt_1",
      event_name: "order.in_transit",
      schema_version: 1,
      correlation_id: "corr_1",
      idempotency_key: "order.in_transit:1",
      source_system: "zapfarm",
      source_journey: "zapfarm.orders",
      occurred_at: "2026-05-08T10:00:00.000Z",
      order_id: "order_1",
      payload: { etaMinutes: 90 },
    });

    expect(event.eventName).toBe("order.in_transit");
    expect(event.orderId).toBe("order_1");
    expect(event.payload).toEqual({ etaMinutes: 90 });
  });

  it("normalizes legacy document.finalized as prescription.created", () => {
    const event = normalizeEcosystemEvent({
      event: "document.finalized",
      eventId: "evt_legacy_1",
      idempotencyKey: "legacy:1",
      correlationId: "corr_legacy_1",
      sourceSystem: "aimnese",
      sourceJourney: "aimnese.rx.emit",
      data: {
        documentId: "rx_1",
      },
    });

    expect(event.eventName).toBe("prescription.created");
    expect(event.prescriptionId).toBe("rx_1");
  });

  it("maps canonical milestones to handoff-compatible statuses", () => {
    expect(mapCanonicalEventToHandoffStatus("clinical.consult.completed")).toBe(
      "consult_completed",
    );
    expect(mapCanonicalEventToHandoffStatus("order.in_transit")).toBe(
      "pharmacy_order_started",
    );
    expect(mapCanonicalEventToHandoffStatus("program.purchased")).toBeNull();
  });
});
