const CORRELATION_ID_KEY = "mejoy_correlation_id";
const SESSION_ID_KEY = "mejoy_session_id";

type JourneyContext = {
  correlationId: string;
  sessionPseudoId: string;
};

function generatePseudoId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `mj_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function readCookieValue(name: string) {
  if (typeof document === "undefined") return undefined;
  const prefix = `${name}=`;
  return document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix))
    ?.slice(prefix.length);
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function readStoredValue(key: string) {
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage.getItem(key) || readCookieValue(key);
  } catch {
    return readCookieValue(key);
  }
}

function persistValue(key: string, value: string) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
  writeCookie(key, value);
}

export function getOrCreateJourneyContext(): JourneyContext {
  const correlationId = readStoredValue(CORRELATION_ID_KEY) || generatePseudoId();
  const sessionPseudoId = readStoredValue(SESSION_ID_KEY) || generatePseudoId();

  persistValue(CORRELATION_ID_KEY, correlationId);
  persistValue(SESSION_ID_KEY, sessionPseudoId);

  return {
    correlationId,
    sessionPseudoId
  };
}
