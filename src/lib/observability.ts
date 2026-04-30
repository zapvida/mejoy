 
 

type SentryModule = {
  configureScope?: (callback: (scope: { setTag: (...args: unknown[]) => void }) => void) => void;
  captureException?: (...args: unknown[]) => void;
};

let cachedSentry: SentryModule | null | undefined;

const loadSentry = (): SentryModule | null => {
  if (cachedSentry !== undefined) {
    return cachedSentry;
  }

  try {
    const dynamicRequire =
      (typeof require === "function" ? require : eval("require")) as
        | ((...args: [string]) => SentryModule)
        | undefined;
    cachedSentry = dynamicRequire ? dynamicRequire("@sentry/node") : null;
  } catch {
    cachedSentry = null;
  }

  return cachedSentry;
};

export const setSentryTriageTag = (triageId: string) => {
  if (!triageId) return;
  const sentry = loadSentry();

  try {
    sentry?.configureScope?.(scope => {
      scope.setTag("triage_id", triageId);
    });
  } catch {
    // Sentry não configurado ou indisponível
  }
};

export const captureException = (error: unknown, context?: Record<string, unknown>) => {
  const sentry = loadSentry();

  try {
    sentry?.captureException?.(error, context ? { extra: context } : undefined);
  } catch {
    // Ignora falhas ao capturar exceções
  }
};
