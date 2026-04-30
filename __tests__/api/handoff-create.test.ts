/// <reference types="jest" />
/** @jest-environment node */

import { createMocks } from "node-mocks-http";

import { createHandoffEnvelope } from "@/lib/handoff/envelope";
import { createHandoffHandler } from "@/pages/api/handoff/create";

jest.mock("@/lib/handoff/store", () => ({
  findReusableCreatedHandoff: jest.fn(),
  persistHandoffEvent: jest.fn()
}));

const store = jest.requireMock("@/lib/handoff/store");

describe("/api/handoff/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.HANDOFF_TOKEN_SECRET = "test-handoff-secret";
    process.env.NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL = "https://zapvida.com/quiz/emagrecimento";
  });

  it("creates a new handoff and persists append-only events", async () => {
    store.findReusableCreatedHandoff.mockResolvedValue(null);
    store.persistHandoffEvent.mockResolvedValue({ ok: true });

    const { req, res } = createMocks({
      method: "POST",
      body: {
        triageId: "triage-123",
        reportId: "report-123",
        sourceJourney: "emagrecimento.report",
        metadata: {
          origin: "report_primary"
        }
      },
      headers: {
        referer: "https://www.mejoy.com.br/emagrecimento/relatorio?id=report-123"
      },
      cookies: {
        utm_source: "meta",
        mejoy_correlation_id: "corr-cookie-123",
        mejoy_session_id: "session-cookie-123"
      }
    });

    await createHandoffHandler(req as any, res as any);

    const json = res._getJSONData();
    expect(res._getStatusCode()).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.correlationId).toBe("corr-cookie-123");
    expect(json.redirectUrl).toContain("handoff_id=");
    expect(json.redirectUrl).toContain("correlation_id=corr-cookie-123");
    expect(store.persistHandoffEvent).toHaveBeenCalledTimes(2);
    expect(store.persistHandoffEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        status: "created"
      })
    );
    expect(store.persistHandoffEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        status: "sent"
      })
    );
    expect(res.getHeader("Set-Cookie")).toEqual(
      expect.arrayContaining([
        expect.stringContaining("handoff_id="),
        expect.stringContaining("mejoy_correlation_id=corr-cookie-123"),
        expect.stringContaining("mejoy_session_id=session-cookie-123")
      ])
    );
  });

  it("returns the existing active handoff for repeated idempotent requests", async () => {
    const existingEnvelope = createHandoffEnvelope({
      triageId: "triage-123",
      reportId: "report-123",
      correlationId: "corr-123"
    });

    store.findReusableCreatedHandoff.mockResolvedValue({
      event_name: "handoff_create",
      envelope: existingEnvelope
    });

    const { req, res } = createMocks({
      method: "POST",
      body: {
        triageId: "triage-123",
        reportId: "report-123"
      },
      cookies: {
        mejoy_correlation_id: "corr-123"
      }
    });

    await createHandoffHandler(req as any, res as any);

    const json = res._getJSONData();
    expect(res._getStatusCode()).toBe(200);
    expect(json.deduped).toBe(true);
    expect(json.handoffId).toBe(existingEnvelope.handoff_id);
    expect(store.persistHandoffEvent).not.toHaveBeenCalled();
  });

  it("accepts the legacy snake_case contract without breaking compatibility", async () => {
    store.findReusableCreatedHandoff.mockResolvedValue(null);
    store.persistHandoffEvent.mockResolvedValue({ ok: true });

    const { req, res } = createMocks({
      method: "POST",
      body: {
        triage_id: "legacy-triage",
        report_id: "legacy-report",
        program_slug: "emagrecimento",
        recommended_queue: "endocrino",
        consent_status: "granted"
      }
    });

    await createHandoffHandler(req as any, res as any);

    const json = res._getJSONData();
    expect(res._getStatusCode()).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.envelope.journey.triage_id).toBe("legacy-triage");
    expect(json.envelope.journey.report_id).toBe("legacy-report");
  });
});
