const DEFAULT_TTL_SECONDS = 15 * 60;
const DEFAULT_CALLBACK_TOLERANCE_SECONDS = 5 * 60;

export type HandoffSecretSource =
  | "HANDOFF_TOKEN_SECRET"
  | "HANDOFF_CALLBACK_SECRET"
  | "NEXTAUTH_SECRET"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "DEV_FALLBACK";

function readSecretValue(keys: string[]): { source: HandoffSecretSource; value: string } | null {
  for (const key of keys) {
    const value = process.env[key];
    if (!value) continue;
    return {
      source: key as HandoffSecretSource,
      value
    };
  }
  return null;
}

function readSecretSource(keys: string[], allowDevFallback = false): HandoffSecretSource | null {
  const value = readSecretValue(keys);
  if (value) return value.source;
  if (allowDevFallback && process.env.NODE_ENV === "development") {
    return "DEV_FALLBACK";
  }
  return null;
}

export function getHandoffSecret(): string {
  const fromEnv = readSecretValue([
    "HANDOFF_TOKEN_SECRET",
    "NEXTAUTH_SECRET",
    "SUPABASE_SERVICE_ROLE_KEY"
  ]);

  if (fromEnv) {
    return fromEnv.value;
  }

  if (process.env.NODE_ENV === "development") {
    return "dev-only-handoff-secret-change-in-production";
  }

  throw new Error("HANDOFF_TOKEN_SECRET não configurado.");
}

export function getHandoffSecretSource(): HandoffSecretSource {
  const fromEnv = readSecretValue([
    "HANDOFF_TOKEN_SECRET",
    "NEXTAUTH_SECRET",
    "SUPABASE_SERVICE_ROLE_KEY"
  ]);

  if (fromEnv) {
    return fromEnv.source;
  }

  if (process.env.NODE_ENV === "development") {
    return "DEV_FALLBACK";
  }

  throw new Error("HANDOFF_TOKEN_SECRET não configurado.");
}

export function getHandoffCallbackSecret(): string {
  const fromEnv = readSecretValue([
    "HANDOFF_CALLBACK_SECRET",
    "HANDOFF_TOKEN_SECRET",
    "NEXTAUTH_SECRET",
    "SUPABASE_SERVICE_ROLE_KEY"
  ]);

  if (fromEnv) {
    return fromEnv.value;
  }

  if (process.env.NODE_ENV === "development") {
    return "dev-only-handoff-callback-secret-change-in-production";
  }

  throw new Error("HANDOFF_CALLBACK_SECRET não configurado.");
}

export function getHandoffCallbackSecretSource(): HandoffSecretSource {
  const fromEnv = readSecretValue([
    "HANDOFF_CALLBACK_SECRET",
    "HANDOFF_TOKEN_SECRET",
    "NEXTAUTH_SECRET",
    "SUPABASE_SERVICE_ROLE_KEY"
  ]);

  if (fromEnv) {
    return fromEnv.source;
  }

  if (process.env.NODE_ENV === "development") {
    return "DEV_FALLBACK";
  }

  throw new Error("HANDOFF_CALLBACK_SECRET não configurado.");
}

export function getHandoffTtlSeconds(ttlSeconds?: number): number {
  const raw = ttlSeconds || Number(process.env.HANDOFF_TOKEN_TTL_SECONDS || DEFAULT_TTL_SECONDS);
  if (!Number.isFinite(raw)) return DEFAULT_TTL_SECONDS;
  return Math.max(60, Math.floor(raw));
}

export function getHandoffCallbackToleranceSeconds(): number {
  const raw = Number(
    process.env.HANDOFF_CALLBACK_TOLERANCE_SECONDS || DEFAULT_CALLBACK_TOLERANCE_SECONDS
  );
  if (!Number.isFinite(raw)) return DEFAULT_CALLBACK_TOLERANCE_SECONDS;
  return Math.max(30, Math.floor(raw));
}

export function collectHandoffEnvGaps() {
  const required = [
    "HANDOFF_TOKEN_SECRET",
    "NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL"
  ].filter((key) => !process.env[key]);

  const recommended = [
    "HANDOFF_CALLBACK_SECRET",
    "HANDOFF_TOKEN_TTL_SECONDS",
    "HANDOFF_CALLBACK_TOLERANCE_SECONDS",
    "NEXT_PUBLIC_PARTNER_ZAPVIDA_URL",
    "NEXT_PUBLIC_PARTNER_ZAPFARM_URL"
  ].filter((key) => !process.env[key]);

  return {
    required,
    recommended,
    tokenSecretSource: readSecretSource(
      ["HANDOFF_TOKEN_SECRET", "NEXTAUTH_SECRET", "SUPABASE_SERVICE_ROLE_KEY"],
      true
    ),
    callbackSecretSource: readSecretSource(
      ["HANDOFF_CALLBACK_SECRET", "HANDOFF_TOKEN_SECRET", "NEXTAUTH_SECRET", "SUPABASE_SERVICE_ROLE_KEY"],
      true
    )
  };
}
