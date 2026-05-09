export type SyncTecmedPatientProfileInput = {
  sourceSystem: "mejoy";
  externalUserId?: string | null;
  correlationId?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  birthDate?: string | null;
  sex?: "M" | "F" | "O" | null;
  address?: {
    zipCode?: string | null;
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    state?: string | null;
  } | null;
}

export async function syncTecmedPatientProfile(
  input: SyncTecmedPatientProfileInput,
) {
  const baseUrl = (
    process.env.ZAPVIDA_BASE_URL ??
    process.env.TECMED_CORE_BASE_URL ??
    "https://zapvida.com"
  ).replace(/\/$/, "");

  const secret =
    process.env.TECMED_INTERNAL_SECRET ??
    process.env.ECOSYSTEM_WEBHOOK_SECRET ??
    process.env.ZAPVIDA_WEBHOOK_SECRET ??
    "";

  if (!secret) {
    return { ok: false, skipped: true, reason: "missing_secret" as const };
  }

  try {
    const response = await fetch(`${baseUrl}/api/internal/tecmed/patient-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": secret,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`sync_failed:${response.status}:${text}`);
    }

    return (await response.json()) as {
      ok: true;
      canonicalProfile?: {
        patientRef?: string;
        profileCompletenessStatus?: string;
      } | null;
    };
  } catch (error) {
    console.error("[TECMED_SYNC:MEJOY] Falha ao sincronizar perfil", error);
    return { ok: false, skipped: true, reason: "request_failed" as const };
  }
}
