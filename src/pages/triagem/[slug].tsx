import Head from "next/head";
import { useRouter } from "next/router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction
} from "react";

import PartnerCTAGroup from "@/components/cta/PartnerCTAGroup";
import { EmagrecimentoOnePageIntake } from "@/components/triage/EmagrecimentoOnePageIntake";
import { Runner, type RunnerCompletePayload, type RunnerCompletionStatus } from "@/components/triage/Runner";
import { trackFunnelEvent } from "@/lib/funnel/events-client";
import { flowsMap } from "@/lib/triage/flows";
import type { TriageFlow } from "@/lib/triage/schema";
import { ZAPFARM_TRIAGE_SLUGS_WITH_PRODUCT_RELATORIO } from "@/lib/emagrecimento/whatsappCta";

interface SessionResponse {
  triageId: string;
  firstVisit: boolean;
  answers?: Record<string, any>;
  progress?: number;
  completed?: boolean;
  reportId?: string;
}

type FetchState = "idle" | "loading" | "ready" | "error";

const localKey = (id: string) => `triage:${id}`;
const pendingKey = (id: string) => `${localKey(id)}:pending`;

const clearLocalCache = (triageId?: string) => {
  if (!triageId || typeof window === "undefined") return;
  window.localStorage.removeItem(localKey(triageId));
  window.localStorage.removeItem(pendingKey(triageId));
};

/** Next.locale pode aparecer como `pt-BR` ou `pt-br` no pathname; só `[A-Z]{2}` quebrava o strip do prefixo. */
const LOCALE_PREFIX_PATTERN = /^\/[a-z]{2}(?:-[A-Za-z]{2})?(?=\/|$)/;
const DYNAMIC_SEGMENT_PATTERN = /^\[[^/]+\]$/;

const extractSlugFromPath = (path: string | undefined) => {
  if (!path) return undefined;

  const cleanPath = path.split("#")[0]?.split("?")[0] ?? "";
  const withoutLocale = cleanPath.replace(LOCALE_PREFIX_PATTERN, "");
  const segments = withoutLocale.split("/").filter(Boolean);

  if (segments[0] !== "triagem") return undefined;
  const candidate = segments[1];
  if (!candidate || DYNAMIC_SEGMENT_PATTERN.test(candidate)) return undefined;

  return candidate;
};

const resolveSlugFromLocation = () => {
  if (typeof window === "undefined") return undefined;
  return extractSlugFromPath(window.location.pathname);
};

/** True when the browser pathname is `/triagem/.../` with a slug (not apenas `/triagem`). */
function browserIsOnExplicitTriagePath(): boolean {
  if (typeof window === "undefined") return false;
  const pathname = window.location.pathname.split(/[?#]/)[0] ?? "";
  const stripped = pathname.replace(LOCALE_PREFIX_PATTERN, "");
  const segs = stripped.split("/").filter(Boolean);
  return segs.length >= 2 && segs[0] === "triagem";
}

/**
 * Quando usar: descartar resposta de `/api/triage/session` apenas se **a URL** já foi para OUTRA slug
 * de triagem. Comparar contra `slugRef.current` causava rajadas POST: `displaySlug`/`router.query`
 * pode oscilar durante hidratação e anular respostas válidas ⇒ `session` nunca ficava definido.
 */
function sessionResponseStillRelevant(slugStarted: string): boolean {
  if (typeof window === "undefined") return true;
  const pathSlug = resolveSlugFromLocation();
  if (!pathSlug) return true;
  return pathSlug === slugStarted;
}

const EMPTY_SEED_ANSWERS: Record<string, never> = {};

/** Evita novo objeto `initialAnswers` a cada polling de sessão (quebrava o intake com setAnswers em loop). */
function buildEmagrecimentoServerSeedAnswers(answers?: Record<string, any> | null) {
  const a = { ...(answers ?? {}) };
  if (a.name && !a.primeiro_nome) a.primeiro_nome = a.name;
  if (a.dob && !a.data_nascimento) a.data_nascimento = a.dob;
  if (a.sex && !a.sexo) a.sexo = a.sex;
  return a;
}

type SessionFlight = {
  readonly key: string;
  readonly controller: AbortController;
  readonly done: Promise<void>;
};

type ResumeFlightEntry = { controller: AbortController; promise: Promise<SessionResponse> };
const resumeSessionBySlug = new Map<string, ResumeFlightEntry>();

function abortResumeSessionForSlug(triageSlug: string) {
  const e = resumeSessionBySlug.get(triageSlug);
  if (!e) return;
  e.controller.abort();
  resumeSessionBySlug.delete(triageSlug);
}

function applyTriageSessionSuccess(
  json: SessionResponse,
  slugStarted: string,
  setSession: Dispatch<SetStateAction<SessionResponse | null>>,
  setState: Dispatch<SetStateAction<FetchState>>,
  setShowRunner: Dispatch<SetStateAction<boolean>>
) {
  if (!sessionResponseStillRelevant(slugStarted)) return;
  setSession(json);
  setState("ready");
  const progressValue = json.progress ?? 0;
  const hasAnswers = json.answers ? Object.keys(json.answers).length > 0 : false;
  const shouldHoldRunner =
    slugStarted !== "emagrecimento" &&
    !json.completed &&
    progressValue < 100 &&
    (progressValue > 0 || hasAnswers);
  setShowRunner(!shouldHoldRunner);
}

export default function TriageSlugPage() {
  const router = useRouter();
  const slugFromQuery = router.query.slug;
  const [slug, setSlug] = useState<string | undefined>(() => {
    if (typeof slugFromQuery === "string" && slugFromQuery) return slugFromQuery;
    if (Array.isArray(slugFromQuery) && slugFromQuery[0]) return slugFromQuery[0];
    return undefined;
  });

  const querySlugResolved = useMemo(
    () =>
      typeof slugFromQuery === "string" && slugFromQuery
        ? slugFromQuery
        : Array.isArray(slugFromQuery) && slugFromQuery[0]
          ? slugFromQuery[0]
          : undefined,
    [slugFromQuery]
  );

  const pathSlugFromAsPath = useMemo(
    () => extractSlugFromPath(router.asPath),
    [router.asPath]
  );

  /** Uma identidade estável: query → asPath → estado (sincronizado no effect). Sem refs no render. */
  const displaySlug = useMemo(
    () => querySlugResolved || pathSlugFromAsPath || slug,
    [querySlugResolved, pathSlugFromAsPath, slug]
  );

  const flow: TriageFlow | undefined = useMemo(
    () => (displaySlug ? flowsMap[displaySlug] : undefined),
    [displaySlug]
  );

  const [state, setState] = useState<FetchState>("idle");
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRunner, setShowRunner] = useState(false);
  const [finalizeState, setFinalizeState] = useState<RunnerCompletionStatus | "idle">("idle");
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizeStateRef = useRef<RunnerCompletionStatus | "idle">("idle");
  const triageStartedTrackedRef = useRef(false);

  /** Um voo POST ativo por slug: resume coalesce; novo `forceNew` aborta o anterior. */
  const sessionFlightRef = useRef<SessionFlight | null>(null);
  const forceNewSeqRef = useRef(0);

  const slugRef = useRef(displaySlug);
  slugRef.current = displaySlug;

  /** Slug efetivo do flow renderizado (`flowsMap[slug].slug`): imune a hacks de pathname em timers. */
  const flowSlugRef = useRef<string | undefined>(undefined);
  flowSlugRef.current = flow?.slug;

  const triageSlugNavPrevRef = useRef<string | undefined>(undefined);

  const sessionRef = useRef<SessionResponse | null>(null);
  sessionRef.current = session;

  const hasProgress =
    !!session &&
    !session.completed &&
    (((session.progress ?? 0) > 0) ||
      (session.answers ? Object.keys(session.answers).length > 0 : false));

  /** Congelado por `triageId`: polls de sessão não devem disparar novo merge no EmagrecimentoOnePageIntake. */
  const emagrecimentoSeedRef = useRef<{
    triageId: string;
    answers: Record<string, any>;
  } | null>(null);
  const lastSlugRef = useRef<string | undefined>(displaySlug);

  if (lastSlugRef.current !== displaySlug) {
    lastSlugRef.current = displaySlug;
    emagrecimentoSeedRef.current = null;
  }

  if (displaySlug === "emagrecimento" && session?.triageId) {
    const tid = session.triageId;
    if (!emagrecimentoSeedRef.current || emagrecimentoSeedRef.current.triageId !== tid) {
      emagrecimentoSeedRef.current = {
        triageId: tid,
        answers: buildEmagrecimentoServerSeedAnswers(session.answers ?? undefined),
      };
    }
  } else if (displaySlug !== "emagrecimento") {
    emagrecimentoSeedRef.current = null;
  }

  const emagrecimentoInitialAnswers =
    displaySlug === "emagrecimento" &&
    session?.triageId &&
    emagrecimentoSeedRef.current?.triageId === session.triageId
      ? emagrecimentoSeedRef.current.answers
      : EMPTY_SEED_ANSWERS;

  const fetchSession = useCallback(
    async (forceNew = false, options: { silent?: boolean } = {}) => {
      /** Congela pelo pathname real; fallback ao ref apenas em edge SSR/hidratação. */
      const slugStarted =
        (typeof window !== "undefined" ? resolveSlugFromLocation() : undefined) ?? slugRef.current;
      if (!slugStarted) return;
      const silent = options.silent ?? false;
      /** Intake já polla /finalize; silent + session só gerava rajada ~4s (scheduleSessionRefresh). */
      if (silent && slugStarted === "emagrecimento") return;
      const resumeKey = `${slugStarted}|resume`;

      if (!silent) setState("loading");
      setError(null);

      if (!forceNew) {
        let sharedTry = resumeSessionBySlug.get(slugStarted);
        while (sharedTry) {
          try {
            const joined = await sharedTry.promise;
            if (!sessionResponseStillRelevant(slugStarted)) return;
            applyTriageSessionSuccess(
              joined,
              slugStarted,
              setSession,
              setState,
              setShowRunner
            );
            return;
          } catch {
            sharedTry = resumeSessionBySlug.get(slugStarted);
          }
        }
      }

      const inflight = sessionFlightRef.current;

      if (!forceNew && inflight?.key === resumeKey) {
        await inflight.done;
        return;
      }

      if (inflight) {
        inflight.controller.abort();
        sessionFlightRef.current = null;
      }

      if (forceNew) {
        abortResumeSessionForSlug(slugStarted);
      }

      const flightKey = forceNew ? `${slugStarted}|new:${++forceNewSeqRef.current}` : resumeKey;
      const controller = new AbortController();
      let resolveDone!: () => void;
      const done = new Promise<void>(r => {
        resolveDone = r;
      });
      sessionFlightRef.current = { key: flightKey, controller, done };

      const runPost = async (): Promise<SessionResponse> => {
        const tid = setTimeout(() => controller.abort(), 30000);
        try {
          const response = await fetch("/api/triage/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ triageSlug: slugStarted, forceNew }),
            signal: controller.signal,
          });

          let json: SessionResponse & { error?: string };
          try {
            json = await response.json();
          } catch {
            throw new Error("Resposta inválida do servidor. Tente novamente.");
          }

          if (!response.ok) {
            const errorMessage = json?.error || `Erro ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
          }

          return json;
        } finally {
          clearTimeout(tid);
        }
      };

      try {
        const execPromise = !forceNew
          ? Promise.resolve()
              .then(() => runPost())
              .finally(() => {
                const ent = resumeSessionBySlug.get(slugStarted);
                if (ent?.controller === controller) resumeSessionBySlug.delete(slugStarted);
              })
          : runPost();

        if (!forceNew) {
          resumeSessionBySlug.set(slugStarted, { controller, promise: execPromise });
        }

        const json = await execPromise;

        if (!sessionResponseStillRelevant(slugStarted)) return;

        applyTriageSessionSuccess(
          json,
          slugStarted,
          setSession,
          setState,
          setShowRunner
        );
      } catch (err) {
        const supersededSilent =
          controller.signal.aborted &&
          (sessionFlightRef.current === null || sessionFlightRef.current.controller !== controller);
        if (supersededSilent) {
          return;
        }

        let errorMessage = "Erro ao carregar triagem.";
        if (err instanceof Error) {
          if (err.name === "AbortError" || err.message.includes("timeout")) {
            errorMessage =
              "A requisição demorou muito. Verifique sua conexão e tente novamente.";
          } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
            errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
          } else {
            errorMessage = err.message;
          }
        }

        if (!sessionResponseStillRelevant(slugStarted)) return;

        console.error("[TriagePage] Error fetching session:", err);
        setError(errorMessage);
        setState("error");
      } finally {
        resolveDone();
        if (sessionFlightRef.current?.controller === controller) {
          sessionFlightRef.current = null;
        }
      }
    },
    []
  );

  const scheduleSessionRefresh = useCallback(() => {
    if (flowSlugRef.current === "emagrecimento") return;

    const pathSlugGuard =
      (typeof window !== "undefined" ? resolveSlugFromLocation() : undefined) ??
      extractSlugFromPath(router.asPath) ??
      slugRef.current;
    if (pathSlugGuard === "emagrecimento") return;

    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
    pollTimeoutRef.current = setTimeout(async () => {
      if (flowSlugRef.current === "emagrecimento") {
        if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
        return;
      }
      const slugNow =
        (typeof window !== "undefined" ? resolveSlugFromLocation() : undefined) ??
        extractSlugFromPath(router.asPath) ??
        slugRef.current;
      if (slugNow === "emagrecimento") {
        if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
        return;
      }
      await fetchSession(false, { silent: true });
      if (finalizeStateRef.current === "running") {
        scheduleSessionRefresh();
      }
    }, 4000);
  }, [fetchSession, router.asPath]);

  useEffect(() => {
    finalizeStateRef.current = finalizeState;
    if (finalizeState !== "running" && pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, [finalizeState]);

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (session?.completed) {
      setFinalizeState("completed");
      setFinalizeError(null);
    }
  }, [session?.completed]);

  useEffect(() => {
    if (!displaySlug || !session?.triageId || triageStartedTrackedRef.current) return;
    trackFunnelEvent("triage_started", {
      triage_slug: displaySlug,
      triage_id: session.triageId
    });
    triageStartedTrackedRef.current = true;
  }, [displaySlug, session?.triageId]);

  useEffect(() => {
    const querySlug =
      typeof slugFromQuery === "string" && slugFromQuery
        ? slugFromQuery
        : Array.isArray(slugFromQuery) && slugFromQuery[0]
          ? slugFromQuery[0]
          : undefined;

    const pathSlug =
      extractSlugFromPath(router.asPath) ??
      (typeof window !== "undefined" ? resolveSlugFromLocation() : undefined);

    const resolved = querySlug ?? pathSlug;

    setSlug(current => {
      if (resolved !== undefined) {
        return current === resolved ? current : resolved;
      }
      if (current !== undefined && pathSlug !== undefined && pathSlug === current) {
        return current;
      }
      if (typeof window !== "undefined") {
        const locSlug = resolveSlugFromLocation();
        if (locSlug !== undefined) {
          return current === locSlug ? current : locSlug;
        }
        /* Nunca apagar o slug apenas porque router.query/asPath falharam em um instante:
           isso re-disparava bootstrap (session null → fetchSession) em loop na produção. */
        if (browserIsOnExplicitTriagePath()) {
          return current;
        }
        return undefined;
      }
      return current;
    });
  }, [router.asPath, slugFromQuery]);

  /**
   * Troca de slug (/triagem/gastro → …/emagrecimento): cancela POST do slug anterior.
   * Não aborta no cleanup (Strict remount do mesmo slug reutiliza o POST global `resumeSessionBySlug`).
   */
  useEffect(() => {
    if (!displaySlug) {
      triageSlugNavPrevRef.current = undefined;
      return undefined;
    }

    const prevNav = triageSlugNavPrevRef.current;
    if (prevNav !== undefined && prevNav !== displaySlug) {
      abortResumeSessionForSlug(prevNav);
      const stale = sessionFlightRef.current;
      if (stale?.key.startsWith(`${prevNav}|`)) {
        stale.controller.abort();
        sessionFlightRef.current = null;
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
      setSession(null);
      setState("idle");
      setError(null);
      setShowRunner(false);
      setFinalizeState("idle");
      setFinalizeError(null);
      triageStartedTrackedRef.current = false;
    }
    triageSlugNavPrevRef.current = displaySlug;

    return undefined;
  }, [displaySlug]);

  useEffect(() => {
    const slugKey = displaySlug;
    if (!slugKey) return;

    const flowForSlug = flowsMap[slugKey];
    if (!flowForSlug) {
      return;
    }

    /**
     * Não liste `finalizeState` nas deps: mudanças (idle↔running) re-disparavam o bootstrap com
     * `session` ainda null e geravam rajadas extras de POST. O ref atualiza no efeito acima antes
     * deste (ordem no arquivo): 388 sync → aqui bootstrap.
     */
    if (finalizeStateRef.current === "running" || finalizeStateRef.current === "completed") return;
    const sess = sessionRef.current;
    if (sess?.completed) return;
    if (sess) return;

    void fetchSession();
  }, [fetchSession, displaySlug]);

  const handleRestart = async () => {
    if (!session) return;
    clearLocalCache(session.triageId);
    await fetchSession(true);
    setFinalizeState("idle");
    setFinalizeError(null);
  };

  const handleContinue = () => {
    setShowRunner(true);
    if (finalizeState === "failed") {
      setFinalizeState("idle");
      setFinalizeError(null);
    }
  };

  const handleRunnerComplete = useCallback(
    async ({ triageId, status, reportId, error: runError }: RunnerCompletePayload) => {
      if (status === "completed") {
        console.log(`[TriagePage] Triagem completada para triageId: ${triageId}`);
        clearLocalCache(triageId);
        setFinalizeState("completed");
        setFinalizeError(null);
        const finalId = reportId ?? triageId;
        trackFunnelEvent("triage_completed", {
          triage_slug: displaySlug,
          triage_id: triageId,
          report_id: finalId
        });

        setSession(prev =>
          prev
            ? {
                ...prev,
                reportId: finalId ?? prev.reportId,
                completed: true
              }
            : prev
        );

        // Não fazer fetchSession após completar - evita recriação de sessão
        console.log(`[TriagePage] Não recriando sessão após completar triagem`);
        return;
      }

      if (status === "running") {
        setFinalizeState("running");
        setFinalizeError(null);
        await fetchSession(false, { silent: true });
        /* EmagrecimentoOnePageIntake já faz poll de /api/triage/finalize (5s). Poll duplicado em
           /api/triage/session (4s) gerava rajadas nos logs Vercel e re-renders sem necessidade. */
        if (flowSlugRef.current !== "emagrecimento") {
          scheduleSessionRefresh();
        }
        return;
      }

      if (status === "failed") {
        setFinalizeState("failed");
        setFinalizeError(runError ?? "Não foi possível gerar o relatório automaticamente.");
      }
    },
    [fetchSession, scheduleSessionRefresh, displaySlug]
  );

  const handleViewReport = () => {
    const reportContextId = session?.triageId;
    if (!reportContextId) {
      setFinalizeError("O relatório ainda está sendo processado. Aguarde alguns instantes e tente novamente.");
      void fetchSession(false, { silent: true });
      return;
    }
    
    const redirectPath = ZAPFARM_TRIAGE_SLUGS_WITH_PRODUCT_RELATORIO.includes(
      (displaySlug || '') as (typeof ZAPFARM_TRIAGE_SLUGS_WITH_PRODUCT_RELATORIO)[number]
    )
      ? `/${displaySlug}/relatorio?id=${reportContextId}`
      : `/relatorio/${reportContextId}`;
    
    void router.push(redirectPath);
  };

  if (!displaySlug) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 text-white">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
          <p className="text-sm text-white/70">Carregando triagem…</p>
        </div>
      </main>
    );
  }

  if (!flow) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground">
        <div>
          <h1 className="text-3xl font-semibold">Triagem não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            Não encontramos uma triagem ativa com o identificador fornecido. Volte para a página
            anterior e escolha novamente.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{flow.title} • Triagem | Me Joy</title>
        <meta
          name="description"
          content="Triagem interativa com relatórios personalizados e recomendações clínicas."
        />
      </Head>

      {state === "loading" && (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 text-white">
          <div className="space-y-6 text-center">
            {/* Spinner animado com gradiente */}
            <div className="mx-auto relative">
              <div className="h-16 w-16 sm:h-20 sm:w-20 animate-spin rounded-full border-4 border-white/10 border-t-transparent">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" style={{ animationDuration: '1.5s' }} />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 animate-spin" style={{ animationDuration: '1s', animationDirection: 'reverse' }} />
              </div>
            </div>
            
            {/* Texto de loading */}
            <div className="space-y-2">
              <p className="text-lg font-semibold sm:text-xl">Preparando sua triagem...</p>
              <p className="text-sm text-white/60 sm:text-base">Isso pode levar alguns instantes</p>
            </div>

            {/* Barra de progresso animada */}
            <div className="mx-auto w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </main>
      )}

      {state === "error" && (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 sm:px-6 text-center text-white">
          <div className="w-full max-w-lg space-y-6 sm:space-y-8">
            {/* Ícone de erro animado */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 sm:h-24 sm:w-24">
              <svg 
                className="h-10 w-10 text-red-400 sm:h-12 sm:w-12" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>

            {/* Título e mensagem */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold sm:text-3xl">Não foi possível iniciar</h1>
              <p className="text-base text-white/70 sm:text-lg">
                {error || "Ocorreu um erro ao carregar a triagem. Por favor, tente novamente."}
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <button
                type="button"
                onClick={() => fetchSession()}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.35)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(5,150,105,0.45)] hover:scale-105 active:scale-95 sm:px-10 sm:py-4 sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tentar novamente
                </span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/triagem")}
                className="rounded-full border-2 border-white/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95 sm:px-10 sm:py-4 sm:text-base"
              >
                Escolher outra triagem
              </button>
            </div>

            {/* Informação adicional */}
            <div className="pt-4 text-xs text-white/50 sm:text-sm">
              <p>Se o problema persistir, entre em contato com nosso suporte.</p>
            </div>
          </div>
        </main>
      )}

      {state === "ready" && session && (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
          {session.completed ? (
            <div className="flex min-h-screen flex-col items-center justify-center px-6 text-white">
              <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/10 p-10 text-center backdrop-blur-xl shadow-[0_40px_120px_rgba(10,14,40,0.6)]">
                <span className="text-xs uppercase tracking-[0.4em] text-white/60">Triagem concluída</span>
                <h1 className="mt-4 text-3xl font-semibold">{flow.title}</h1>
                <p className="mt-4 text-white/80">
                  Seu relatório está pronto e ficou salvo com segurança. Você pode acessá-lo quando quiser.
                </p>

                {displaySlug !== 'emagrecimento' && (
                  <div className="mt-6">
                    <PartnerCTAGroup
                      partners={['zapvida', 'zapfarm']}
                      context="triage_done"
                      triageId={session.triageId}
                      reportId={session.triageId}
                      variant="primary"
                      fullWidth
                    />
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={handleViewReport}
                    className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.35)] transition hover:shadow-[0_12px_40px_rgba(5,150,105,0.45)]"
                  >
                    Ver relatório
                  </button>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white/80 hover:text-white"
                  >
                    Iniciar nova triagem
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {hasProgress && !showRunner && (
                <section className="flex min-h-screen items-center justify-center px-6 py-16 text-white">
                  <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/10 p-10 backdrop-blur-xl shadow-[0_40px_120px_rgba(10,14,40,0.6)]">
                    <span className="text-xs uppercase tracking-[0.4em] text-white/60">
                      Você parou por aqui
                    </span>
                    <h1 className="mt-4 text-3xl font-semibold">{flow.title}</h1>
                    <p className="mt-4 text-white/75">
                      Podemos continuar de onde você parou ou reiniciar com dados em branco. Suas respostas anteriores ficaram salvas com segurança.
                    </p>
                    {finalizeState === "failed" && finalizeError && (
                      <div className="mt-6 rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
                        {finalizeError}
                      </div>
                    )}
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                      <button
                        type="button"
                        onClick={handleContinue}
                        className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.35)] transition hover:shadow-[0_12px_40px_rgba(5,150,105,0.45)]"
                      >
                        Continuar de onde parei
                      </button>
                      <button
                        type="button"
                        onClick={handleRestart}
                        className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white/80 hover:text-white"
                      >
                        Começar do zero
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {showRunner &&
                (displaySlug === "emagrecimento" ? (
                  <EmagrecimentoOnePageIntake
                    key={session.triageId}
                    triageId={session.triageId}
                    flow={flow}
                    initialAnswers={emagrecimentoInitialAnswers}
                    onComplete={handleRunnerComplete}
                  />
                ) : (
                  <Runner
                    key={session.triageId}
                    triageId={session.triageId}
                    flow={flow}
                    firstVisit={session.firstVisit}
                    initialAnswers={session.answers}
                    onComplete={handleRunnerComplete}
                  />
                ))}
            </>
          )}
        </main>
      )}
    </>
  );
}
