import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const LOCALE_PREFIX_PATTERN = /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/;

const extractSlugFromPath = (path: string | undefined) => {
  if (!path) return undefined;

  const cleanPath = path.split("#")[0]?.split("?")[0] ?? "";
  const withoutLocale = cleanPath.replace(LOCALE_PREFIX_PATTERN, "");
  const segments = withoutLocale.split("/").filter(Boolean);

  if (segments[0] !== "triagem") return undefined;

  return segments[1];
};

const resolveSlugFromLocation = () => {
  if (typeof window === "undefined") return undefined;
  return extractSlugFromPath(window.location.pathname);
};

export default function TriageSlugPage() {
  const router = useRouter();
  const slugFromQuery = router.query.slug;
  const [slug, setSlug] = useState<string | undefined>(() => {
    if (typeof slugFromQuery === "string" && slugFromQuery) return slugFromQuery;
    if (Array.isArray(slugFromQuery) && slugFromQuery[0]) return slugFromQuery[0];
    return undefined;
  });
  const flow: TriageFlow | undefined = useMemo(() => (slug ? flowsMap[slug] : undefined), [slug]);

  const [state, setState] = useState<FetchState>("idle");
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRunner, setShowRunner] = useState(false);
  const [finalizeState, setFinalizeState] = useState<RunnerCompletionStatus | "idle">("idle");
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizeStateRef = useRef<RunnerCompletionStatus | "idle">("idle");
  const triageStartedTrackedRef = useRef(false);

  const hasProgress =
    !!session &&
    !session.completed &&
    (((session.progress ?? 0) > 0) ||
      (session.answers ? Object.keys(session.answers).length > 0 : false));

  const emagrecimentoInitialAnswers = useMemo(() => {
    const a = { ...(session?.answers ?? {}) };
    if (slug !== "emagrecimento") return a;
    if (a.name && !a.primeiro_nome) a.primeiro_nome = a.name;
    if (a.dob && !a.data_nascimento) a.data_nascimento = a.dob;
    if (a.sex && !a.sexo) a.sexo = a.sex;
    return a;
  }, [session?.answers, slug]);

  const fetchSession = useCallback(
    async (forceNew = false, options: { silent?: boolean } = {}) => {
      if (!slug) return;
      const silent = options.silent ?? false;
      if (!silent) setState("loading");
      setError(null);
      try {
        // Criar AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos
        
        const response = await fetch("/api/triage/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ triageSlug: slug, forceNew }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Verificar se a resposta é JSON válido
        let json: SessionResponse & { error?: string };
        try {
          json = await response.json();
        } catch (parseError) {
          throw new Error("Resposta inválida do servidor. Tente novamente.");
        }
        
        if (!response.ok) {
          const errorMessage = json?.error || `Erro ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }
        
        setSession(json);
        setState("ready");
        const progressValue = json.progress ?? 0;
        const hasAnswers = json.answers ? Object.keys(json.answers).length > 0 : false;
        const shouldHoldRunner =
          slug !== "emagrecimento" &&
          !json.completed &&
          progressValue < 100 &&
          (progressValue > 0 || hasAnswers);
        setShowRunner(!shouldHoldRunner);
      } catch (err) {
        let errorMessage = "Erro ao carregar triagem.";
        
        if (err instanceof Error) {
          if (err.name === 'AbortError' || err.message.includes('timeout')) {
            errorMessage = "A requisição demorou muito. Verifique sua conexão e tente novamente.";
          } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
          } else {
            errorMessage = err.message;
          }
        }
        
        console.error("[TriagePage] Error fetching session:", err);
        setError(errorMessage);
        setState("error");
      }
    },
    [slug]
  );

  const scheduleSessionRefresh = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
    pollTimeoutRef.current = setTimeout(async () => {
      await fetchSession(false, { silent: true });
      if (finalizeStateRef.current === "running") {
        scheduleSessionRefresh();
      }
    }, 4000);
  }, [fetchSession]);

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
    if (!slug || !session?.triageId || triageStartedTrackedRef.current) return;
    trackFunnelEvent("triage_started", {
      triage_slug: slug,
      triage_id: session.triageId
    });
    triageStartedTrackedRef.current = true;
  }, [slug, session?.triageId]);

  useEffect(() => {
    const nextSlug =
      (typeof slugFromQuery === "string" && slugFromQuery) ||
      (Array.isArray(slugFromQuery) ? slugFromQuery[0] : undefined) ||
      resolveSlugFromLocation() ||
      extractSlugFromPath(router.asPath);

    setSlug(current => (current === nextSlug ? current : nextSlug));
  }, [router.asPath, slugFromQuery]);

  useEffect(() => {
    if (!slug) return;
    
    // Verificar se o flow existe
    if (!flow) {
      console.error(`[TriagePage] Flow not found for slug: ${slug}`);
      setError(`Triagem "${slug}" não encontrada.`);
      setState("error");
      return;
    }
    
    // Não recriar se a sessão já foi concluída ou se estamos finalizando
    if (finalizeState === "running" || finalizeState === "completed") return;
    if (session?.completed) return;
    if (session) return;
    
    void fetchSession();
  }, [fetchSession, flow, slug, finalizeState, session]);

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
          triage_slug: slug,
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
        scheduleSessionRefresh();
        return;
      }

      if (status === "failed") {
        setFinalizeState("failed");
        setFinalizeError(runError ?? "Não foi possível gerar o relatório automaticamente.");
      }
    },
    [fetchSession, scheduleSessionRefresh, session, slug]
  );

  const handleViewReport = () => {
    const reportContextId = session?.triageId;
    if (!reportContextId) {
      setFinalizeError("O relatório ainda está sendo processado. Aguarde alguns instantes e tente novamente.");
      void fetchSession(false, { silent: true });
      return;
    }
    
    const redirectPath = ZAPFARM_TRIAGE_SLUGS_WITH_PRODUCT_RELATORIO.includes(
      (slug || '') as (typeof ZAPFARM_TRIAGE_SLUGS_WITH_PRODUCT_RELATORIO)[number]
    )
      ? `/${slug}/relatorio?id=${reportContextId}`
      : `/relatorio/${reportContextId}`;
    
    void router.push(redirectPath);
  };

  if (!slug) return null;

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
                
                {/* CTAs de Parceiros */}
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
                (slug === "emagrecimento" ? (
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
