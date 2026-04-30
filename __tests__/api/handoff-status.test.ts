/// <reference types="jest" />
/** @jest-environment node */

import { createMocks } from "node-mocks-http";

import { createHandoffEnvelope, signHandoffEnvelope } from "@/lib/handoff/envelope";
import { createSignedCallbackHeaders } from "@/lib/handoff/security";
import { handoffStatusHandler } from "@/pages/api/handoff/status";

jest.mock("@/lib/handoff/store", () => ({
  getHandoffHistory: jest.fn(),
  persistHandoffEvent: jest.fn()
}));

const store = jest.requireMock("@/lib/handoff/store");

describe("/api/handoff/status", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.HANDOFF_TOKEN_SECRET = "test-handoff-secret";
    process.env.HANDOFF_CALLBACK_SECRET = "test-handoff-callback-secret";
    process.env.HANDOFF_CALLBACK_TOLERANCE_SECONDS = "300";
    (global as any).__handoff_nonce_registry = new Map();
  });

  function makeToken() {
    const envelope = createHandoffEnvelope({
      triageId: "triage-123",
      reportId: "report-123",
      correlationId: "corr-123",
      sessionPseudoId: "session-123"
    });

    return {
      envelope,
      token: signHandoffEnvelope(envelope)
    };
  }

  it("accepts a signed happy-path callback and persists the audit event", async () => {
    const { envelope, token } = makeToken();
    store.getHandoffHistory.mockResolvedValue([
      {
        status: "sent",
        event_name: "handoff_send",
        metadata: {}
      }
    ]);
    store.persistHandoffEvent.mockResolvedValue({ ok: true });

    const body = {
      handoffToken: token,
      status: "consult_completed",
      prescriptionId: "presc-123"
    };
    const headers = createSignedCallbackHeaders(body, {
      secret: process.env.HANDOFF_CALLBACK_SECRET
    });
    const { req, res } = createMocks({
      method: "POST",
      body,
      headers
    });

    await handoffStatusHandler(req as any, res as any);

    const json = res._getJSONData();
    expect(res._getStatusCode()).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.status).toBe("consult_completed");
    expect(json.envelope.journey.prescription_id).toBe("presc-123");
    expect(json.envelope.signature.callback_auth_mode).toBe("signed");
    expect(store.persistHandoffEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "consult_completed",
        eventName: "callback_consult_completed"
      })
    );
    expect(json.handoffId).toBe(envelope.handoff_id);
  });

  it("rejects callbacks with invalid signatures", async () => {
    const { token } = makeToken();
    const body = {
      handoffToken: token,
      status: "accepted"
    };
    const { req, res } = createMocks({
      method: "POST",
      body,
      headers: {
        ...createSignedCallbackHeaders(body, {
          secret: "wrong-secret"
        })
      }
    });

    await handoffStatusHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData().error).toMatch(/Assinatura inválida/);
  });

  it("rejects callbacks with expired timestamps", async () => {
    const { token } = makeToken();
    const body = {
      handoffToken: token,
      status: "accepted"
    };
    const { req, res } = createMocks({
      method: "POST",
      body,
      headers: {
        ...createSignedCallbackHeaders(body, {
          timestamp: "2020-01-01T00:00:00.000Z",
          secret: process.env.HANDOFF_CALLBACK_SECRET
        })
      }
    });

    await handoffStatusHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData().error).toMatch(/Timestamp expirado/);
  });

  it("rejects replayed callbacks that reuse the same nonce", async () => {
    const { token } = makeToken();
    const body = {
      handoffToken: token,
      status: "accepted"
    };
    const headers = createSignedCallbackHeaders(body, {
      nonce: "fixed-nonce",
      secret: process.env.HANDOFF_CALLBACK_SECRET
    });

    store.getHandoffHistory.mockResolvedValue([
      {
        status: "sent",
        event_name: "handoff_send",
        metadata: {}
      }
    ]);
    store.persistHandoffEvent.mockResolvedValue({ ok: true });

    const first = createMocks({ method: "POST", body, headers });
    await handoffStatusHandler(first.req as any, first.res as any);
    expect(first.res._getStatusCode()).toBe(200);

    const second = createMocks({ method: "POST", body, headers });
    await handoffStatusHandler(second.req as any, second.res as any);
    expect(second.res._getStatusCode()).toBe(409);
    expect(second.res._getJSONData().error).toMatch(/Nonce já utilizado/);
  });

  it("keeps legacy token-only callbacks idempotent", async () => {
    const { token } = makeToken();
    const idempotencyKey = "status-key-123";
    store.getHandoffHistory.mockResolvedValue([
      {
        status: "accepted",
        event_name: "handoff_accept",
        metadata: {
          idempotency_key: idempotencyKey
        }
      }
    ]);

    const { req, res } = createMocks({
      method: "POST",
      body: {
        handoffToken: token,
        status: "accepted",
        idempotencyKey
      }
    });

    await handoffStatusHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().deduped).toBe(true);
    expect(store.persistHandoffEvent).not.toHaveBeenCalled();
  });

  it("rejects invalid statuses", async () => {
    const { token } = makeToken();
    const { req, res } = createMocks({
      method: "POST",
      body: {
        handoffToken: token,
        status: "nao_existe"
      }
    });

    await handoffStatusHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData().error).toBe("Payload inválido");
  });

  it("rejects invalid state transitions", async () => {
    const { token } = makeToken();
    store.getHandoffHistory.mockResolvedValue([
      {
        status: "order_delivered",
        event_name: "callback_order_delivered",
        metadata: {}
      }
    ]);

    const body = {
      handoffToken: token,
      status: "accepted"
    };
    const { req, res } = createMocks({
      method: "POST",
      body,
      headers: {
        ...createSignedCallbackHeaders(body, {
          secret: process.env.HANDOFF_CALLBACK_SECRET
        })
      }
    });

    await handoffStatusHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(409);
    expect(res._getJSONData().error).toMatch(/Transição inválida/);
  });
});
