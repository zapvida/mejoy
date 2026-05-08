type Primitive = string | number | boolean;

const UTM_STORAGE_KEY = "zapfarm_utms_v1";
const CLIENT_ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "ttclid",
  "msclkid",
] as const;

const EXACT_SENSITIVE_KEYS = new Set([
  "name",
  "full_name",
  "firstname",
  "first_name",
  "lastname",
  "last_name",
  "email",
  "phone",
  "telefone",
  "celular",
  "whatsapp",
  "cpf",
  "document",
  "documento",
  "patient",
  "patient_id",
  "patient_name",
]);

const SENSITIVE_KEY_PATTERNS = [
  /(^|[_-])(email|phone|telefone|celular|whats|whatsapp|cpf|document|documento)([_-]|$)/i,
  /(^|[_-])patient([_-]|$)/i,
];

declare global {
  interface Window {
    analytics?: {
      track?: (event: string, payload?: Record<string, unknown>) => void;
    };
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
    mejoyCookiePreferences?: {
      essential: boolean;
      analytics: boolean;
      marketing: boolean;
    };
    mejoyGoogleConsentState?: {
      analytics_storage: "granted" | "denied";
      ad_storage: "granted" | "denied";
      ad_user_data: "granted" | "denied";
      ad_personalization: "granted" | "denied";
    };
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!match) return undefined;

  const value = match.split("=").slice(1).join("=");
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readSerializedUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const cookieRaw = readCookie(UTM_STORAGE_KEY);
  const localStorageRaw = (() => {
    try {
      return window.localStorage.getItem(UTM_STORAGE_KEY) || undefined;
    } catch {
      return undefined;
    }
  })();

  const raw = cookieRaw || localStorageRaw;
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const record = parsed as Record<string, unknown>;
    if (
      "data" in record &&
      record.data &&
      typeof record.data === "object" &&
      !Array.isArray(record.data)
    ) {
      return Object.fromEntries(
        Object.entries(record.data as Record<string, unknown>).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string"
        )
      );
    }

    return Object.fromEntries(
      Object.entries(record).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string"
      )
    );
  } catch {
    return {};
  }
}

function readSearchParam(name: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get(name) || undefined;
}

function isSensitiveKey(key: string): boolean {
  const normalized = key.trim().toLowerCase();
  if (EXACT_SENSITIVE_KEYS.has(normalized)) return true;
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(normalized));
}

function sanitizeValue(value: unknown): Primitive | Record<string, unknown> | Primitive[] | undefined {
  if (value === undefined || value === null) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    const sanitized = value
      .map((item) => sanitizeValue(item))
      .filter((item): item is Primitive => typeof item === "string" || typeof item === "number" || typeof item === "boolean");
    return sanitized.length > 0 ? sanitized : undefined;
  }

  if (typeof value === "object") {
    const sanitizedEntries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !isSensitiveKey(key))
      .map(([key, innerValue]) => [key, sanitizeValue(innerValue)] as const)
      .filter((entry): entry is readonly [string, Primitive | Record<string, unknown> | Primitive[]] => entry[1] !== undefined);

    if (sanitizedEntries.length === 0) return undefined;
    return Object.fromEntries(sanitizedEntries);
  }

  return undefined;
}

export function inferProgramSlugFromPath(pathname?: string): string {
  const path =
    pathname ||
    (typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "");

  if (
    path.includes("/emagrecimento") ||
    path.includes("/triagem/emagrecimento") ||
    path.includes("/programas/emagrecimento")
  ) {
    return "emagrecimento";
  }

  if (path.includes("/obesidade")) {
    return "obesidade";
  }

  return "mejoy";
}

export function readClientAttribution(): Record<string, string> {
  const serializedUtms = readSerializedUtms();

  return Object.fromEntries(
    CLIENT_ATTRIBUTION_KEYS.map((key) => {
      const value = readSearchParam(key) || readCookie(key) || serializedUtms[key];
      return [key, value];
    }).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
}

export function sanitizeClientAnalyticsPayload(
  payload: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload)
      .filter(([key]) => !isSensitiveKey(key))
      .map(([key, value]) => [key, sanitizeValue(value)] as const)
      .filter((entry): entry is readonly [string, Primitive | Record<string, unknown> | Primitive[]] => entry[1] !== undefined)
  );
}
