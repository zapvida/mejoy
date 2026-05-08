/// <reference types="jest" />
/** @jest-environment node */

import {
  buildZapVidaHandoffUrl,
  createHandoffEnvelope,
  signHandoffEnvelope,
  verifyHandoffToken
} from "@/lib/handoff/envelope";

describe("handoff envelope", () => {
  beforeEach(() => {
    process.env.HANDOFF_TOKEN_SECRET = "test-handoff-secret";
    process.env.NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL = "https://zapvida.com/quiz/emagrecimento";
  });

  it("creates, signs and verifies a versioned handoff envelope", () => {
    const envelope = createHandoffEnvelope({
      triageId: "triage-123",
      reportId: "report-123",
      orderId: "order-123",
      quoteId: "quote-123",
      prescriptionId: "presc-123",
      correlationId: "corr-123",
      sessionPseudoId: "session-123",
      sourceJourney: "emagrecimento.report",
      sourceUrl: "https://www.mejoy.com.br/emagrecimento/relatorio?id=report-123",
      consentStatus: "granted",
      utm: {
        source: "meta",
        medium: "cpc",
        campaign: "launch",
        ttclid: "tt-123",
        msclkid: "ms-123"
      },
      metadata: {
        origin: "report_primary"
      },
      email: "paciente@example.com",
      phone: "+5511999999999"
    });

    const token = signHandoffEnvelope(envelope);
    const verified = verifyHandoffToken(token);

    expect(verified.valid).toBe(true);
    expect(verified.envelope).toMatchObject({
      handoff_version: "1.1",
      correlation_id: "corr-123",
      source_journey: "emagrecimento.report",
      source_url: "https://www.mejoy.com.br/emagrecimento/relatorio?id=report-123",
      session_pseudo_id: "session-123",
      journey: {
        triage_id: "triage-123",
        report_id: "report-123",
        order_id: "order-123",
        quote_id: "quote-123",
        prescription_id: "presc-123",
        handoff_status: "created"
      },
      consent: {
        consent_status: "granted"
      },
      utm: {
        source: "meta",
        medium: "cpc",
        ttclid: "tt-123",
        msclkid: "ms-123"
      }
    });
    expect(verified.envelope?.identity.email_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(verified.envelope?.identity.phone_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(verified.envelope?.signature?.algorithm).toBe("HS256");
  });

  it("keeps backward compatibility for legacy 1.0 tokens", () => {
    const legacyEnvelope = {
      handoff_version: "1.0",
      handoff_id: "legacy-handoff-1",
      source_system: "mejoy" as const,
      target_system: "zapvida" as const,
      issued_at: "2026-04-05T18:00:00.000Z",
      expires_at: "2099-04-05T18:15:00.000Z",
      utm: {
        source: "mejoy"
      },
      journey: {
        triage_id: "legacy-triage",
        report_id: "legacy-report",
        program_slug: "emagrecimento",
        recommended_queue: "endocrino",
        handoff_status: "created" as const
      },
      consent: {
        consent_status: "granted" as const,
        consent_timestamp: "2026-04-05T18:00:00.000Z"
      },
      identity: {},
      metadata: {}
    };

    const token = signHandoffEnvelope(legacyEnvelope as any);
    const verified = verifyHandoffToken(token);

    expect(verified.valid).toBe(true);
    expect(verified.envelope?.handoff_version).toBe("1.0");
    expect(verified.envelope?.created_at).toBe("2026-04-05T18:00:00.000Z");
    expect(verified.envelope?.correlation_id).toBe("legacy-handoff-1");
    expect(verified.envelope?.source_journey).toBe("emagrecimento");
  });

  it("adds correlation_id to the ZapVida redirect url", () => {
    const url = buildZapVidaHandoffUrl("signed.token", "emagrecimento", "handoff-123", "corr-123", {
      source: "google",
      medium: "cpc",
      campaign: "launch",
      gclid: "gclid-123",
      msclkid: "msclkid-123",
    });

    expect(url).toContain("handoff=signed.token");
    expect(url).toContain("handoff_id=handoff-123");
    expect(url).toContain("correlation_id=corr-123");
    expect(url).toContain("origin_utm_source=google");
    expect(url).toContain("origin_utm_medium=cpc");
    expect(url).toContain("origin_utm_campaign=launch");
    expect(url).toContain("gclid=gclid-123");
    expect(url).toContain("msclkid=msclkid-123");
  });
});
