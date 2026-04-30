import crypto from "crypto";

import {
  getHandoffCallbackSecret,
  getHandoffCallbackSecretSource,
  getHandoffCallbackToleranceSeconds
} from "@/lib/handoff/config";

type AuthMode = "token_only" | "signed";

type SignedCallbackVerification = {
  ok: boolean;
  authMode: AuthMode;
  reason?: string;
  nonce?: string;
  timestamp?: string;
  signature?: string;
};

type SignatureOptions = {
  nonce?: string;
  timestamp?: string;
  secret?: string;
};

const CALLBACK_NONCE_PREFIX = "handoff:nonce:";

function timingSafeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return `{${entries
    .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
    .join(",")}}`;
}

async function markNonceSeen(nonce: string, ttlSec: number): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const key = `${CALLBACK_NONCE_PREFIX}${nonce}`;

  try {
    if (url && token) {
      const createdResponse = await fetch(`${url}/setnx/${encodeURIComponent(key)}/1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const created = (await createdResponse.text()) === "1";
      if (created) {
        await fetch(`${url}/expire/${encodeURIComponent(key)}/${ttlSec}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      return created;
    }
  } catch {
    // fallback in-memory below
  }

  const globalKey = "__handoff_nonce_registry";
  const now = Date.now();
  const registry =
    ((global as any)[globalKey] as Map<string, number> | undefined) || new Map<string, number>();
  (global as any)[globalKey] = registry;

  for (const [existingNonce, expiresAt] of registry.entries()) {
    if (expiresAt <= now) {
      registry.delete(existingNonce);
    }
  }

  if (registry.has(key)) {
    return false;
  }

  registry.set(key, now + ttlSec * 1000);
  return true;
}

export function createSignedCallbackHeaders(
  body: unknown,
  options: SignatureOptions = {}
): Record<string, string> {
  const nonce = options.nonce || crypto.randomUUID();
  const timestamp = options.timestamp || new Date().toISOString();
  const secret = options.secret || getHandoffCallbackSecret();
  const payload = `${timestamp}.${nonce}.${stableStringify(body)}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  return {
    "x-handoff-nonce": nonce,
    "x-handoff-timestamp": timestamp,
    "x-handoff-signature": signature
  };
}

export async function verifySignedStatusCallback(input: {
  body: unknown;
  signature?: string | string[];
  timestamp?: string | string[];
  nonce?: string | string[];
}): Promise<SignedCallbackVerification> {
  const signature = Array.isArray(input.signature) ? input.signature[0] : input.signature;
  const timestamp = Array.isArray(input.timestamp) ? input.timestamp[0] : input.timestamp;
  const nonce = Array.isArray(input.nonce) ? input.nonce[0] : input.nonce;

  if (!signature && !timestamp && !nonce) {
    return { ok: true, authMode: "token_only" };
  }

  if (!signature || !timestamp || !nonce) {
    return { ok: false, authMode: "signed", reason: "Cabeçalhos de assinatura incompletos" };
  }

  const toleranceSeconds = getHandoffCallbackToleranceSeconds();
  const parsedTimestamp = new Date(timestamp).getTime();
  if (Number.isNaN(parsedTimestamp)) {
    return { ok: false, authMode: "signed", reason: "Timestamp inválido" };
  }

  const driftSeconds = Math.abs(Date.now() - parsedTimestamp) / 1000;
  if (driftSeconds > toleranceSeconds) {
    return { ok: false, authMode: "signed", reason: "Timestamp expirado" };
  }

  const secret = getHandoffCallbackSecret();
  const payload = `${timestamp}.${nonce}.${stableStringify(input.body)}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  if (!timingSafeEqual(signature, expectedSignature)) {
    return { ok: false, authMode: "signed", reason: "Assinatura inválida" };
  }

  const nonceAccepted = await markNonceSeen(nonce, toleranceSeconds);
  if (!nonceAccepted) {
    return { ok: false, authMode: "signed", reason: "Nonce já utilizado" };
  }

  return {
    ok: true,
    authMode: "signed",
    nonce,
    timestamp,
    signature
  };
}

export function getCallbackSignatureMetadata(authMode: AuthMode) {
  return {
    algorithm: "HS256" as const,
    token_type: "handoff_envelope" as const,
    key_source: getHandoffCallbackSecretSource(),
    signed_at: new Date().toISOString(),
    callback_auth_mode: authMode
  };
}
