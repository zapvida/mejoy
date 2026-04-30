import { getOrCreateJourneyContext } from "@/lib/analytics/journey";

type CreateClinicalHandoffInput = {
  triageId: string;
  reportId?: string;
  sourceJourney: string;
  sourceOrigin: string;
  consentStatus?: "granted" | "revoked" | "pending";
  programSlug?: string;
  recommendedQueue?: string;
};

type CreateClinicalHandoffResponse = {
  ok: boolean;
  handoffId?: string;
  correlationId?: string;
  handoffToken?: string;
  redirectUrl?: string;
  envelope?: unknown;
  error?: string;
};

export async function createClinicalHandoff(
  input: CreateClinicalHandoffInput
): Promise<CreateClinicalHandoffResponse> {
  const journey = getOrCreateJourneyContext();
  const response = await fetch("/api/handoff/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      triageId: input.triageId,
      reportId: input.reportId,
      programSlug: input.programSlug || "emagrecimento",
      recommendedQueue: input.recommendedQueue || "endocrinologia-metabologia",
      consentStatus: input.consentStatus || "granted",
      correlationId: journey.correlationId,
      sessionPseudoId: journey.sessionPseudoId,
      sourceJourney: input.sourceJourney,
      sourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
      idempotencyKey: [
        "handoff",
        input.sourceJourney,
        input.triageId,
        input.reportId || "no-report",
        journey.correlationId
      ].join(":"),
      metadata: {
        origin: input.sourceOrigin
      }
    })
  });

  const data = (await response.json()) as CreateClinicalHandoffResponse;
  if (!response.ok || !data?.redirectUrl) {
    throw new Error(data?.error || "Não foi possível conectar com o ZapVida agora.");
  }

  return data;
}
