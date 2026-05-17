"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { EnhancedInput, NumericInput } from "@/components/ui/EnhancedInput";
import LogoWithName from "@/components/ui/LogoWithName";
import { RefinedButton } from "@/components/ui/RefinedButton";
import { trackMejoyConversionEvent } from "@/lib/funnel/events-client";
import { validateBrazilPhoneInput } from "@/lib/phone/normalize";
import type { StepDef, TriageFlow } from "@/lib/triage/schema";
import { cn } from "@/lib/utils";
import {
  clearDependentAnswers,
  computeProgress,
  isStepAnswered,
  isStepVisible,
} from "@/lib/triage/onePageHelpers";
import {
  formatBirthDateIsoForDisplay,
  formatBirthDateMask,
  parseBirthDateDisplayToIso,
} from "@/lib/emagrecimento/intake-date";
import { EMAGRECIMENTO_TRIAGE_ASSETS } from "@/lib/emagrecimento-lp-assets";

import {
  EMAGRECIMENTO_INTAKE_PAGES,
  EMAGRECIMENTO_TOTAL_SECTIONS,
  getEmagrecimentoStepByKey,
  getFirstIncompleteEmagrecimentoPageIndex,
  type EmagrecimentoPageConfig,
  type EmagrecimentoPageItem,
} from "./emagrecimentoPagedConfig";
import {
  coerceStringArray,
  normalizeAnswersForSteps,
  normalizePersistedStepValue,
} from "./emagrecimentoAnswerNormalization";

export type RunnerCompletionStatus = "completed" | "running" | "failed";
export type RunnerCompletePayload = {
  triageId: string;
  status: RunnerCompletionStatus;
  reportId?: string;
  error?: string;
};

const localKey = (id: string) => `triage:${id}`;
const pendingKey = (id: string) => `${localKey(id)}:pending`;
const isBrowser = typeof window !== "undefined";

type PendingPayload = {
  triageId: string;
  stepKey: string;
  value: any;
  progress: number;
  answeredAt: string;
};

const FORM_INPUT_CLASSNAME =
  "h-14 rounded-[16px] border border-[#d4d8d0] bg-white px-4 text-[17px] font-medium text-slate-900 shadow-none transition placeholder:text-slate-400 focus:border-[#2f6a49] focus:ring-4 focus:ring-[#e5efe4]";

const DATE_INPUT_CLASSNAME =
  "h-14 w-full rounded-[16px] border border-[#d4d8d0] bg-white px-4 text-[17px] font-medium text-slate-900 outline-none transition focus:border-[#2f6a49] focus:ring-4 focus:ring-[#e5efe4]";

const TEXTAREA_CLASSNAME =
  "min-h-[128px] w-full rounded-[16px] border border-[#d4d8d0] bg-white px-4 py-4 text-[17px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2f6a49] focus:ring-4 focus:ring-[#e5efe4]";

const REQUIRED_MESSAGES: Record<string, string> = {
  aceita_termos: "Confirme os documentos para continuar.",
  consentimento_whatsapp:
    "Autorize o contato pelo WhatsApp para receber seu resultado.",
  contraindicacoes_glp1: "Selecione ao menos uma opção para continuar.",
  comorbidades: "Selecione ao menos uma opção para continuar.",
};

const INLINE_CONSENT_COPY: Record<string, string> = {
  aceita_termos:
    "Confirmo que li os documentos essenciais da jornada, incluindo privacidade, uso de IA nos relatórios e telemedicina.",
  consentimento_whatsapp:
    "Autorizo o envio do meu resultado inicial, orientações e próximos passos pelo canal oficial da MeJoy no WhatsApp.",
};

const NUMERIC_UNITS_BY_KEY: Record<string, string> = {
  altura: "cm",
  height: "cm",
  peso: "kg",
  weight: "kg",
  peso_meta: "kg",
};

const FIELD_LABEL_OVERRIDES: Record<string, string> = {
  altura: "Altura",
  peso: "Peso atual",
  peso_meta: "Peso desejado",
  sexo: "Sexo biológico",
  gestacao: "Gestação ou plano de engravidar",
  data_nascimento: "Data de nascimento",
  contraindicacoes_glp1: "Existe algum destes históricos?",
  comorbidades: "Quais condições se aplicam ao seu caso?",
  cirurgia_bariatrica_previa: "Já fez cirurgia bariátrica?",
  uso_opioides_3meses: "Usou opioides nos últimos 3 meses?",
  medicamentos_prescritos_atual: "Usa medicamentos prescritos atualmente?",
  uso_medicacao_emagrecimento_recente:
    "Usou medicação para emagrecimento nas últimas 4 semanas?",
  efeitos_colaterais_previos: "Teve efeitos que fizeram parar o tratamento?",
  pressao_arterial_faixa:
    "Como estava sua pressão na última medição que lembra?",
  frequencia_cardiaca_repouso: "Frequência cardíaca em repouso, se souber",
  impacto_vida: "Quanto o peso afeta sua rotina?",
  objetivo_principal: "Qual é seu objetivo principal?",
  preferencia_principio_ativo: "Qual linha você prefere avaliar primeiro?",
  primeiro_nome: "Como podemos te chamar?",
  whatsapp: "WhatsApp com DDD",
};

const FIELD_HELPER_OVERRIDES: Record<string, string> = {
  altura: "Em centímetros. Se preferir, 1,70 também funciona.",
  peso: "Em quilogramas.",
  peso_meta: "Uma meta inicial já ajuda a leitura clínica.",
  sexo: "Usado para critérios de segurança e gestação.",
  gestacao: "GLP-1 não é indicado na gestação.",
  data_nascimento: "Programa para maiores de 18 anos.",
  contraindicacoes_glp1:
    "Marque tudo o que se aplicar. Se nada se aplicar, escolha a opção correspondente.",
  comorbidades: "Marque apenas o que já faz parte do seu histórico.",
  cirurgia_bariatrica_previa:
    "Esse contexto ajuda a evitar recomendações inadequadas.",
  uso_opioides_3meses: "Informação de segurança para a avaliação médica.",
  medicamentos_prescritos_atual:
    "Interações medicamentosas importam para a decisão clínica.",
  uso_medicacao_emagrecimento_recente:
    "Ajuda a entender tolerância e resposta recente.",
  efeitos_colaterais_previos: "Só aparece se você indicar uso prévio.",
  pressao_arterial_faixa:
    "Não substitui aferição médica; serve como contexto inicial.",
  frequencia_cardiaca_repouso:
    "Se não souber, selecione a opção correspondente.",
  impacto_vida: "Queremos medir o impacto real do peso no seu dia a dia.",
  objetivo_principal: "Isso orienta a prioridade do relatório.",
  preferencia_principio_ativo: "A decisão final é sempre do médico.",
  primeiro_nome: "Esse nome entra no seu resumo.",
  whatsapp: "Canal oficial para envio do resultado e próximos passos.",
};

const TRIAGE_EDITORIAL_FACTS = [
  { value: "3 etapas", label: "sem desviar do fluxo atual" },
  { value: "1 resultado", label: "gerado logo apos a triagem" },
  { value: "100%", label: "fechamento na mesma jornada" },
];

const TRIAGE_HERO_FRAMES = EMAGRECIMENTO_TRIAGE_ASSETS.heroFrames;

const TRIAGE_SOCIAL_AVATARS = EMAGRECIMENTO_TRIAGE_ASSETS.socialAvatars;

function deriveImcRangeFromAnswers(
  answers: Record<string, any>,
): string | undefined {
  const rawPeso = answers.peso ?? answers.weight;
  const rawAltura = answers.altura ?? answers.height;
  const peso = Number(rawPeso);
  const alturaCm = Number(rawAltura);
  if (
    Number.isNaN(peso) ||
    Number.isNaN(alturaCm) ||
    peso <= 0 ||
    alturaCm <= 0
  )
    return undefined;

  const alturaM = alturaCm < 3 ? alturaCm : alturaCm / 100;
  const imc = peso / (alturaM * alturaM);
  if (imc < 18.5) return "abaixo_peso";
  if (imc < 25) return "peso_adequado";
  if (imc < 30) return "sobrepeso";
  if (imc < 35) return "obesidade_grau_1";
  if (imc < 40) return "obesidade_grau_2";
  return "obesidade_grau_3";
}

function readPending(triageId: string): PendingPayload[] {
  if (!isBrowser) return [];
  try {
    const existing = window.localStorage.getItem(pendingKey(triageId));
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
}

function writePending(triageId: string, queue: PendingPayload[]) {
  if (!isBrowser) return;
  try {
    if (queue.length === 0)
      window.localStorage.removeItem(pendingKey(triageId));
    else
      window.localStorage.setItem(pendingKey(triageId), JSON.stringify(queue));
  } catch {
    /* ignore */
  }
}

function enqueuePending(triageId: string, payload: PendingPayload) {
  if (!isBrowser) return;
  try {
    const queue = readPending(triageId);
    queue.push(payload);
    writePending(triageId, queue);
  } catch {
    /* ignore */
  }
}

function storeAnswers(triageId: string, answers: Record<string, any>) {
  if (!isBrowser) return;
  try {
    const dataWithTimestamp = { ...answers, _timestamp: Date.now() };
    window.localStorage.setItem(
      localKey(triageId),
      JSON.stringify(dataWithTimestamp),
    );
  } catch {
    /* ignore */
  }
}

function getStoredAnswers(triageId: string, fallback: Record<string, any>) {
  if (!isBrowser) return fallback;
  try {
    const cached = window.localStorage.getItem(localKey(triageId));
    if (!cached) return fallback;
    const parsed = JSON.parse(cached);
    return typeof parsed === "object" && parsed
      ? { ...fallback, ...parsed }
      : fallback;
  } catch {
    return fallback;
  }
}

interface Props {
  triageId: string;
  flow: TriageFlow;
  initialAnswers?: Record<string, any>;
  onComplete?: (payload: RunnerCompletePayload) => void | Promise<void>;
}

export function EmagrecimentoOnePageIntake({
  triageId,
  flow,
  initialAnswers = {},
  onComplete,
}: Props) {
  const steps = useMemo(
    () => flow.steps.filter((step) => step.type !== "info"),
    [flow.steps],
  );
  /** Conteúdo estável vs referência: evita re-merge e setAnswers em loop quando o pai refaz `{...session.answers}` a cada polling. */
  const initialAnswersSnapshot = JSON.stringify(initialAnswers ?? {});
  const mergedInitialAnswers = useMemo(
    () =>
      normalizeAnswersForSteps(
        steps,
        getStoredAnswers(triageId, initialAnswers),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- snapshot acima representa o conteúdo de initialAnswers
    [initialAnswersSnapshot, steps, triageId],
  );
  const stepsByKey = useMemo(
    () => new Map(steps.map((step) => [step.key, step])),
    [steps],
  );

  const [answers, setAnswers] = useState<Record<string, any>>(() => ({
    ...mergedInitialAnswers,
  }));
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [finalizeStatus, setFinalizeStatus] = useState<
    RunnerCompletionStatus | "idle"
  >("idle");
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [birthDateDraft, setBirthDateDraft] = useState(() =>
    formatBirthDateIsoForDisplay(mergedInitialAnswers.data_nascimento),
  );

  const pendingFlushRef = useRef(false);
  const finalizeInFlightRef = useRef(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const startPollingForReportRef = useRef<() => void>(() => {});
  const answersRef = useRef(answers);
  const intakeHydratedRef = useRef<string | null>(null);
  const previousTriageIdRef = useRef(triageId);
  const flowCardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (previousTriageIdRef.current !== triageId) {
      previousTriageIdRef.current = triageId;
      answersRef.current = { ...mergedInitialAnswers };
      setAnswers({ ...mergedInitialAnswers });
      return;
    }

    setAnswers((prev) => {
      const next = normalizeAnswersForSteps(steps, {
        ...mergedInitialAnswers,
        ...prev,
      });
      answersRef.current = next;
      return next;
    });
  }, [mergedInitialAnswers, steps, triageId]);

  useEffect(() => {
    intakeHydratedRef.current = null;
  }, [triageId]);

  useEffect(() => {
    setBirthDateDraft(
      formatBirthDateIsoForDisplay(mergedInitialAnswers.data_nascimento),
    );
  }, [mergedInitialAnswers.data_nascimento, triageId]);

  useEffect(() => {
    if (intakeHydratedRef.current === triageId) return;
    const merged = { ...mergedInitialAnswers, ...answersRef.current };
    setCurrentPageIndex(
      getFirstIncompleteEmagrecimentoPageIndex(
        EMAGRECIMENTO_INTAKE_PAGES,
        steps,
        merged,
      ),
    );
    intakeHydratedRef.current = triageId;
  }, [mergedInitialAnswers, steps, triageId]);

  const progress = useMemo(
    () => computeProgress(steps, answers),
    [steps, answers],
  );
  const pageProgress = useMemo(
    () =>
      Math.round(
        ((currentPageIndex + 1) / EMAGRECIMENTO_INTAKE_PAGES.length) * 100,
      ),
    [currentPageIndex],
  );

  const clearCachedProgress = useCallback(() => {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(localKey(triageId));
      window.localStorage.removeItem(pendingKey(triageId));
    } catch {
      /* ignore */
    }
  }, [triageId]);

  const flushPendingQueue = useCallback(async () => {
    if (!isBrowser) return;
    const queue = readPending(triageId);
    if (!queue.length) return;
    pendingFlushRef.current = true;
    const remaining: PendingPayload[] = [];
    for (const item of queue) {
      try {
        const response = await fetch("/api/triage/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error("failed");
      } catch {
        remaining.push(item);
      }
    }
    writePending(triageId, remaining);
    pendingFlushRef.current = false;
  }, [triageId]);

  useEffect(() => {
    void flushPendingQueue();
  }, [flushPendingQueue]);

  const persistAnswer = useCallback(
    async (step: StepDef, value: any) => {
      const safe = normalizePersistedStepValue(step, value);
      let updated = { ...answersRef.current, [step.key]: safe };
      updated = clearDependentAnswers(steps, updated, step.key);
      answersRef.current = updated;
      setAnswers(updated);
      storeAnswers(triageId, updated);
      const nextProgress = computeProgress(steps, updated);
      const payload: PendingPayload = {
        triageId,
        stepKey: step.key,
        value: safe,
        progress: nextProgress,
        answeredAt: new Date().toISOString(),
      };
      try {
        const response = await fetch("/api/triage/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("fail");
        await flushPendingQueue();
      } catch {
        enqueuePending(triageId, payload);
      }
    },
    [flushPendingQueue, steps, triageId],
  );

  const setField = useCallback(
    (step: StepDef, value: any) => {
      const normalizedValue = normalizePersistedStepValue(step, value);
      let updated = { ...answersRef.current, [step.key]: normalizedValue };
      updated = clearDependentAnswers(steps, updated, step.key);
      answersRef.current = updated;
      setAnswers(updated);
      storeAnswers(triageId, updated);
      void persistAnswer(step, normalizedValue);
      setSectionErrors((prev) => {
        const next = { ...prev };
        delete next[step.key];
        return next;
      });
    },
    [persistAnswer, steps, triageId],
  );

  const toggleMultiselect = useCallback(
    (step: StepDef, value: string, checked: boolean) => {
      const currentValues = coerceStringArray(answers[step.key]);
      let next: string[] = [...currentValues];
      const isNone = value === "nenhuma";

      if (isNone && checked) {
        next = ["nenhuma"];
      } else if (checked) {
        next = next.filter((item) => item !== "nenhuma");
        if (!next.includes(value)) next.push(value);
      } else {
        next = next.filter((item) => item !== value);
      }

      setField(step, next);
    },
    [answers, setField],
  );

  const retryWithBackoff = async <T,>(
    operation: () => Promise<T>,
    maxRetries = 2,
    baseDelayMs = 1000,
  ) => {
    let lastError: unknown = null;
    for (let attempt = 0; attempt < maxRetries; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries - 1) break;
        await new Promise((resolve) =>
          setTimeout(resolve, baseDelayMs * 2 ** attempt),
        );
      }
    }
    throw lastError instanceof Error
      ? lastError
      : new Error("Falha após tentativas.");
  };

  const startPollingForReport = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    let attempts = 0;
    const maxAttempts = 60;
    const pollInterval = 5000;

    const poll = async () => {
      attempts += 1;
      if (attempts > maxAttempts) {
        setFinalizeStatus("failed");
        setFinalizeError(
          "O relatório está demorando mais que o esperado. Tente novamente.",
        );
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        return;
      }

      try {
        const response = await fetch("/api/triage/finalize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Idempotency-Key": triageId,
          },
          body: JSON.stringify({ triageId, triageSlug: flow.slug }),
        });
        if (!response.ok) return;

        const payload = await response.json();
        if (payload?.ok && payload?.redirect) {
          setFinalizeStatus("completed");
          clearCachedProgress();
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          if (typeof window !== "undefined")
            window.location.href = payload.redirect;
          await onComplete?.({
            triageId,
            status: "completed",
            reportId: triageId,
          });
        } else if (
          payload?.ok === false ||
          payload?.error ||
          payload?.status === "failed"
        ) {
          setFinalizeStatus("failed");
          setFinalizeError(payload?.error || "Erro ao gerar relatório.");
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      } catch {
        /* continue polling */
      }
    };

    void poll();
    pollingIntervalRef.current = setInterval(
      poll,
      pollInterval,
    ) as unknown as ReturnType<typeof setInterval>;
  }, [clearCachedProgress, flow.slug, onComplete, triageId]);

  useEffect(() => {
    startPollingForReportRef.current = startPollingForReport;
  }, [startPollingForReport]);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  const finalizeTriage = useCallback(async () => {
    if (finalizeInFlightRef.current) return;

    finalizeInFlightRef.current = true;
    setFinalizeStatus("running");
    setFinalizeError(null);

    try {
      await flushPendingQueue();
      const response = await retryWithBackoff(async () => {
        const controller =
          typeof AbortController !== "undefined"
            ? new AbortController()
            : undefined;
        const timeoutId =
          typeof setTimeout === "function" && controller
            ? setTimeout(() => controller.abort(), 60_000)
            : null;

        try {
          const body: {
            triageId: string;
            triageSlug?: string;
            answers?: Record<string, any>;
          } = {
            triageId,
            triageSlug: flow.slug,
          };
          if (
            typeof window !== "undefined" &&
            process.env.NODE_ENV === "development"
          ) {
            body.answers = answersRef.current;
          }

          const result = await fetch("/api/triage/finalize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Idempotency-Key": triageId,
            },
            body: JSON.stringify(body),
            ...(controller?.signal ? { signal: controller.signal } : {}),
          });

          if (result.status >= 500)
            throw new Error(result.statusText || "Falha ao finalizar.");
          return result;
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
      });

      let payload: any = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : "Falha ao finalizar triagem.",
        );
      }

      if (payload?.ok && payload?.redirect) {
        setFinalizeStatus("completed");
        clearCachedProgress();
        if (typeof window !== "undefined")
          window.location.href = payload.redirect;
        await onComplete?.({
          triageId,
          status: "completed",
          reportId: triageId,
        });
      } else if (payload?.ok && payload?.status === "running") {
        setFinalizeStatus("running");
        await onComplete?.({ triageId, status: "running" });
        startPollingForReportRef.current();
      } else {
        throw new Error("Resposta inválida da finalização.");
      }
    } catch (error) {
      const message =
        error instanceof Error &&
        error.message &&
        !/aborted/i.test(error.message)
          ? error.message
          : "Não foi possível finalizar. Tente novamente.";

      setFinalizeStatus("failed");
      setFinalizeError(message);
      await onComplete?.({ triageId, status: "failed", error: message });
    } finally {
      finalizeInFlightRef.current = false;
    }
  }, [
    clearCachedProgress,
    flushPendingQueue,
    flow.slug,
    onComplete,
    retryWithBackoff,
    triageId,
  ]);

  const validateStepValue = useCallback(
    (step: StepDef, requiredOverride?: boolean) => {
      const required = requiredOverride ?? step.required ?? false;
      if (step.key === "data_nascimento") {
        const normalizedBirthDate =
          typeof answers.data_nascimento === "string" && answers.data_nascimento
            ? answers.data_nascimento
            : parseBirthDateDisplayToIso(birthDateDraft);

        if (required && !normalizedBirthDate) {
          return birthDateDraft
            ? "Digite a data no formato DD/MM/AAAA."
            : "Responda para continuar.";
        }

        if (normalizedBirthDate) {
          const date = new Date(normalizedBirthDate);
          if (Number.isNaN(date.getTime())) return "Data inválida.";
          const age = Math.floor(
            (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
          );
          if (age < 18) return "Programa para maiores de 18 anos.";
          if (age > 100) return "Verifique a data informada.";
        }

        return null;
      }

      if (required && !isStepAnswered(step, answers)) {
        return REQUIRED_MESSAGES[step.key] ?? "Responda para continuar.";
      }

      if (step.key === "whatsapp" && answers.whatsapp) {
        return validateBrazilPhoneInput(String(answers.whatsapp));
      }

      return null;
    },
    [answers, birthDateDraft],
  );

  const updatePageErrors = useCallback(
    (page: EmagrecimentoPageConfig, nextErrors: Record<string, string>) => {
      const keys = Array.from(new Set(page.items.map((item) => item.key)));
      setSectionErrors((prev) => {
        const updated = { ...prev };
        keys.forEach((key) => delete updated[key]);
        Object.entries(nextErrors).forEach(([key, value]) => {
          updated[key] = value;
        });
        return updated;
      });
      return Object.keys(nextErrors).length === 0;
    },
    [],
  );

  const validatePage = useCallback(
    (page: EmagrecimentoPageConfig) => {
      const nextErrors: Record<string, string> = {};

      for (const item of page.items) {
        const step = stepsByKey.get(item.key);
        if (!step || !isStepVisible(step, answers)) continue;

        if (item.kind === "field") {
          const message = validateStepValue(step, item.required);
          if (message) nextErrors[step.key] = message;
          continue;
        }

        if (item.required && !isStepAnswered(step, answers)) {
          nextErrors[step.key] =
            REQUIRED_MESSAGES[step.key] ??
            "Selecione ao menos uma opção para continuar.";
        }
      }

      return updatePageErrors(page, nextErrors);
    },
    [answers, stepsByKey, updatePageErrors, validateStepValue],
  );

  const validateAll = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    for (const step of steps) {
      if (!isStepVisible(step, answers)) continue;
      const message = validateStepValue(step);
      if (message) nextErrors[step.key] = message;
    }
    setSectionErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [answers, steps, validateStepValue]);

  const scrollToFirstError = useCallback(() => {
    const firstError = document.querySelector(
      '[data-triage-field-error="true"]',
    );
    firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const moveToPage = useCallback((nextIndex: number) => {
    setCurrentPageIndex(nextIndex);
    window.setTimeout(() => {
      flowCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  }, []);

  const handleNext = useCallback(() => {
    const currentPage = EMAGRECIMENTO_INTAKE_PAGES[currentPageIndex];
    if (!currentPage) return;

    if (!validatePage(currentPage)) {
      scrollToFirstError();
      return;
    }

    moveToPage(
      Math.min(currentPageIndex + 1, EMAGRECIMENTO_INTAKE_PAGES.length - 1),
    );
  }, [currentPageIndex, moveToPage, scrollToFirstError, validatePage]);

  const handleSubmit = useCallback(async () => {
    const currentPage = EMAGRECIMENTO_INTAKE_PAGES[currentPageIndex];
    if (!currentPage) return;

    if (!validatePage(currentPage)) {
      scrollToFirstError();
      return;
    }

    if (!validateAll()) {
      moveToPage(
        getFirstIncompleteEmagrecimentoPageIndex(
          EMAGRECIMENTO_INTAKE_PAGES,
          steps,
          answers,
        ),
      );
      return;
    }

    trackMejoyConversionEvent("triage_submit", {
      triageId,
      triageSlug: flow.slug,
      imcRange: deriveImcRangeFromAnswers(answers),
    });

    setSubmitting(true);
    try {
      for (const step of steps) {
        if (!isStepVisible(step, answers)) continue;
        await persistAnswer(step, answers[step.key]);
      }
      await finalizeTriage();
    } finally {
      setSubmitting(false);
    }
  }, [
    answers,
    currentPageIndex,
    finalizeTriage,
    flow.slug,
    moveToPage,
    persistAnswer,
    scrollToFirstError,
    steps,
    triageId,
    validateAll,
    validatePage,
  ]);

  const currentPage = EMAGRECIMENTO_INTAKE_PAGES[currentPageIndex];

  const getVisibleStep = useCallback(
    (key: string) => {
      const step = getEmagrecimentoStepByKey(steps, key);
      if (!step || !isStepVisible(step, answers)) return null;
      return step;
    },
    [answers, steps],
  );

  const getFieldLabel = useCallback(
    (step: StepDef, override?: string) =>
      override ?? FIELD_LABEL_OVERRIDES[step.key] ?? step.label,
    [],
  );

  const getFieldHelper = useCallback(
    (step: StepDef, override?: string) =>
      override ?? FIELD_HELPER_OVERRIDES[step.key] ?? step.helperText,
    [],
  );

  const renderInlineLegalLinks = useCallback((step: StepDef) => {
    if (!step.legalLinks?.length) return null;
    return (
      <p className="mt-3 text-xs leading-6 text-slate-500">
        {step.legalLinks.map((link, index) => (
          <span key={link.href}>
            {index > 0 ? <span className="mx-1 text-slate-300">•</span> : null}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#2f6a49] underline underline-offset-4"
            >
              {link.label}
            </a>
          </span>
        ))}
      </p>
    );
  }, []);

  const renderQuestionShell = useCallback(
    (
      step: StepDef,
      children: ReactNode,
      options?: {
        hideLabel?: boolean;
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) => {
      const error = sectionErrors[step.key];
      const helperText = getFieldHelper(step, options?.helperText);
      const label = getFieldLabel(step, options?.label);

      return (
        <div
          className={cn("min-w-0", options?.containerClassName)}
          data-step-key={step.key}
          data-triage-field-error={error ? "true" : undefined}
        >
          {!options?.hideLabel ? (
            <label className="block text-[15px] font-semibold leading-6 text-slate-900">
              {label}
            </label>
          ) : null}
          {helperText ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {helperText}
            </p>
          ) : null}
          <div className={cn(options?.hideLabel ? "" : "mt-3")}>{children}</div>
          {error ? (
            <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
          ) : null}
        </div>
      );
    },
    [getFieldHelper, getFieldLabel, sectionErrors],
  );

  const renderConsentField = useCallback(
    (step: StepDef) => {
      const checkedValue = step.options?.[0]?.value ?? "aceito";
      const isSelected = answers[step.key] === checkedValue;

      return (
        <div
          className="rounded-[18px] border border-[#d4d8d0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
          data-step-key={step.key}
          data-triage-field-error={sectionErrors[step.key] ? "true" : undefined}
        >
          <button
            type="button"
            onClick={() => setField(step, isSelected ? "" : checkedValue)}
            className={cn(
              "flex w-full items-start gap-3 text-left",
              isSelected ? "text-slate-900" : "text-slate-700",
            )}
            aria-pressed={isSelected}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition",
                isSelected
                  ? "border-[#2f6a49] bg-[#2f6a49] text-white"
                  : "border-slate-300 bg-white text-transparent",
              )}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8.5 6.2 11.7 13 4.9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-sm leading-6">
              {INLINE_CONSENT_COPY[step.key] ?? step.label}
            </span>
          </button>
          {renderInlineLegalLinks(step)}
          {sectionErrors[step.key] ? (
            <p className="mt-2 text-sm font-medium text-red-600">
              {sectionErrors[step.key]}
            </p>
          ) : null}
        </div>
      );
    },
    [answers, renderInlineLegalLinks, sectionErrors, setField],
  );

  const renderNumberField = useCallback(
    (
      step: StepDef,
      options?: {
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) =>
      renderQuestionShell(
        step,
        <NumericInput
          name={step.key}
          unit={NUMERIC_UNITS_BY_KEY[step.key]}
          value={
            answers[step.key] === undefined || answers[step.key] === ""
              ? ""
              : String(answers[step.key])
          }
          onChange={(event) => {
            const raw = event.target.value;
            setField(step, raw === "" ? "" : Number(raw));
          }}
          placeholder={step.placeholder}
          min={step.min}
          max={step.max}
          step={step.step}
          className={FORM_INPUT_CLASSNAME}
        />,
        options,
      ),
    [answers, renderQuestionShell, setField],
  );

  const renderTextField = useCallback(
    (
      step: StepDef,
      options?: {
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) =>
      renderQuestionShell(
        step,
        <EnhancedInput
          name={step.key}
          type={step.key === "whatsapp" ? "tel" : "text"}
          inputMode={step.key === "whatsapp" ? "tel" : "text"}
          value={answers[step.key] ?? ""}
          onChange={(event) => setField(step, event.target.value)}
          placeholder={step.placeholder}
          className={FORM_INPUT_CLASSNAME}
        />,
        options,
      ),
    [answers, renderQuestionShell, setField],
  );

  const renderDateField = useCallback(
    (
      step: StepDef,
      options?: {
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) =>
      renderQuestionShell(
        step,
        <EnhancedInput
          name={step.key}
          type="text"
          inputMode="numeric"
          value={birthDateDraft}
          onChange={(event) => {
            const maskedValue = formatBirthDateMask(event.target.value);
            const normalizedValue = parseBirthDateDisplayToIso(maskedValue);

            setBirthDateDraft(maskedValue);
            setField(step, normalizedValue || "");
          }}
          placeholder="DD/MM/AAAA"
          maxLength={10}
          className={DATE_INPUT_CLASSNAME}
        />,
        options,
      ),
    [birthDateDraft, renderQuestionShell, setField],
  );

  const renderTextareaField = useCallback(
    (
      step: StepDef,
      options?: {
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) =>
      renderQuestionShell(
        step,
        <textarea
          name={step.key}
          value={answers[step.key] ?? ""}
          onChange={(event) => setField(step, event.target.value)}
          placeholder={step.placeholder}
          className={TEXTAREA_CLASSNAME}
        />,
        options,
      ),
    [answers, renderQuestionShell, setField],
  );

  const renderBinaryField = useCallback(
    (
      step: StepDef,
      options?: {
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) => {
      const fieldOptions = step.options ?? [];
      return renderQuestionShell(
        step,
        <div className="grid grid-cols-2 gap-3">
          {fieldOptions.map((option) => {
            const selected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                name={step.key}
                onClick={() => setField(step, option.value)}
                className={cn(
                  "rounded-[18px] border px-4 py-4 text-left transition",
                  selected
                    ? "border-[#2f6a49] bg-[#eef6ef] shadow-[0_10px_24px_rgba(47,106,73,0.08)]"
                    : "border-[#d8dfd5] bg-white hover:border-[#bfcabd]",
                )}
              >
                <span className="text-[15px] font-semibold text-slate-900">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>,
        options,
      );
    },
    [answers, renderQuestionShell, setField],
  );

  const renderSexField = useCallback(
    (
      step: StepDef,
      options?: {
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) => {
      const fieldOptions = step.options ?? [];
      return renderQuestionShell(
        step,
        <div className="grid grid-cols-2 gap-3">
          {fieldOptions.map((option) => {
            const selected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                name={step.key}
                onClick={() => setField(step, option.value)}
                className={cn(
                  "rounded-[18px] border px-4 py-5 text-left transition",
                  selected
                    ? "border-[#2f6a49] bg-[#eef6ef] shadow-[0_10px_24px_rgba(47,106,73,0.08)]"
                    : "border-[#d8dfd5] bg-white hover:border-[#bfcabd]",
                )}
              >
                <span className="block text-base font-semibold text-slate-900">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>,
        options,
      );
    },
    [answers, renderQuestionShell, setField],
  );

  const renderSelectField = useCallback(
    (
      step: StepDef,
      options?: {
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) => {
      const fieldOptions = step.options ?? [];
      return renderQuestionShell(
        step,
        <div className="space-y-2.5">
          {fieldOptions.map((option) => {
            const selected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                name={step.key}
                onClick={() => setField(step, option.value)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-[18px] border px-4 py-4 text-left transition",
                  selected
                    ? "border-[#2f6a49] bg-[#eef6ef] shadow-[0_10px_24px_rgba(47,106,73,0.06)]"
                    : "border-[#d8dfd5] bg-white hover:border-[#bfcabd]",
                )}
              >
                <span
                  className={cn(
                    "mt-1 h-4 w-4 shrink-0 rounded-full border-2",
                    selected
                      ? "border-[#2f6a49] bg-[#2f6a49]"
                      : "border-slate-300 bg-white",
                  )}
                />
                <span className="text-[15px] leading-6 text-slate-800">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>,
        options,
      );
    },
    [answers, renderQuestionShell, setField],
  );

  const renderMultiselectField = useCallback(
    (
      step: StepDef,
      filteredOptionValues?: string[],
      options?: {
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) => {
      const fieldOptions = (step.options ?? []).filter((option) =>
        filteredOptionValues
          ? filteredOptionValues.includes(option.value)
          : true,
      );
      const selected = coerceStringArray(answers[step.key]).filter(
        (value) => value !== "",
      );
      const selectedOutsideSlice = filteredOptionValues
        ? selected.filter(
            (value) =>
              !filteredOptionValues.includes(value) && value !== "nenhuma",
          )
        : [];

      return renderQuestionShell(
        step,
        <>
          {selectedOutsideSlice.length > 0 ? (
            <p className="mb-3 text-xs font-medium text-slate-500">
              Seleções já marcadas acima seguem mantidas.
            </p>
          ) : null}
          <div className="space-y-2.5">
            {fieldOptions.map((option) => {
              const checked = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  name={step.key}
                  onClick={() =>
                    toggleMultiselect(step, option.value, !checked)
                  }
                  className={cn(
                    "flex w-full items-start gap-3 rounded-[18px] border px-4 py-4 text-left transition",
                    checked
                      ? "border-[#2f6a49] bg-[#eef6ef] shadow-[0_10px_24px_rgba(47,106,73,0.06)]"
                      : "border-[#d8dfd5] bg-white hover:border-[#bfcabd]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition",
                      checked
                        ? "border-[#2f6a49] bg-[#2f6a49] text-white"
                        : "border-slate-300 bg-white text-transparent",
                    )}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8.5 6.2 11.7 13 4.9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[15px] leading-6 text-slate-800">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </>,
        options,
      );
    },
    [answers, renderQuestionShell, toggleMultiselect],
  );

  const renderSelectCardsField = useCallback(
    (
      step: StepDef,
      options?: {
        label?: string;
        helperText?: string;
        containerClassName?: string;
      },
    ) =>
      renderQuestionShell(
        step,
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(step.cardOptions ?? []).map((option) => {
            const selected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                name={step.key}
                onClick={() => setField(step, option.value)}
                className={cn(
                  "rounded-[22px] border px-4 py-4 text-left transition",
                  selected
                    ? "border-[#2f6a49] bg-[#eef6ef] shadow-[0_12px_24px_rgba(47,106,73,0.08)]"
                    : "border-[#d8dfd5] bg-white hover:border-[#bfcabd]",
                )}
              >
                {option.badge ? (
                  <span className="mb-3 inline-flex rounded-full bg-[#edf3ed] px-2.5 py-1 text-[11px] font-semibold text-[#2f6a49]">
                    {option.badge}
                  </span>
                ) : null}
                <div className="text-[15px] font-semibold leading-6 text-slate-900">
                  {option.title}
                </div>
                {option.subtitle ? (
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {option.subtitle}
                  </p>
                ) : null}
                {option.priceHint ? (
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-700">
                    {option.priceHint}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>,
        options,
      ),
    [answers, renderQuestionShell, setField],
  );

  const renderFieldByStep = useCallback(
    (
      step: StepDef,
      item?: EmagrecimentoPageItem,
      options?: { label?: string; helperText?: string },
    ) => {
      if (
        step.key === "aceita_termos" ||
        step.key === "consentimento_whatsapp"
      ) {
        return renderConsentField(step);
      }

      if (step.type === "number") return renderNumberField(step, options);
      if (step.type === "text") return renderTextField(step, options);
      if (step.type === "textarea") return renderTextareaField(step, options);
      if (step.type === "date") return renderDateField(step, options);
      if (step.type === "select_cards")
        return renderSelectCardsField(step, options);
      if (step.type === "multiselect") {
        const filteredValues =
          item?.kind === "multiselectSlice"
            ? [
                ...item.optionValues,
                ...(item.includeNoneOption ? ["nenhuma"] : []),
              ]
            : undefined;
        return renderMultiselectField(step, filteredValues, options);
      }

      if (step.type === "select") {
        if (step.key === "sexo") return renderSexField(step, options);
        if ((step.options ?? []).length === 2)
          return renderBinaryField(step, options);
        return renderSelectField(step, options);
      }

      return renderTextField(step, options);
    },
    [
      renderBinaryField,
      renderConsentField,
      renderDateField,
      renderMultiselectField,
      renderNumberField,
      renderSelectCardsField,
      renderSelectField,
      renderSexField,
      renderTextField,
      renderTextareaField,
    ],
  );

  const renderStageSection = useCallback(
    (
      title: string,
      description: string | undefined,
      children: ReactNode,
      options?: { muted?: boolean },
    ) => (
      <section
        className={cn(
          "px-5 py-5 sm:px-7 sm:py-6",
          options?.muted ? "bg-[#fbfbf7]" : "bg-white",
        )}
      >
        <div
          className={cn(
            "rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-6",
            options?.muted
              ? "border-[#e4e8de] bg-white"
              : "border-[#d8e3d5] bg-[linear-gradient(180deg,#f9fbf7_0%,#f1f6ef_100%)]",
          )}
        >
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
              Bloco da triagem
            </p>
            <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[22px]">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-[14px] leading-6 text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
          {children}
        </div>
      </section>
    ),
    [],
  );

  const renderProfilePage = useCallback(() => {
    const aceite = getVisibleStep("aceita_termos");
    const altura = getVisibleStep("altura");
    const peso = getVisibleStep("peso");
    const pesoMeta = getVisibleStep("peso_meta");
    const sexo = getVisibleStep("sexo");
    const gestacao = getVisibleStep("gestacao");
    const dataNascimento = getVisibleStep("data_nascimento");

    return (
      <>
        {renderStageSection(
          "Confirmação e documentos",
          "Confirme para continuar.",
          <div className="space-y-4">
            {aceite ? renderFieldByStep(aceite) : null}
          </div>,
          { muted: true },
        )}

        {renderStageSection(
          "Dados básicos",
          "Esses dados ajudam a calcular elegibilidade e enquadramento inicial.",
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {altura ? renderNumberField(altura) : null}
              {peso ? renderNumberField(peso) : null}
            </div>
            {pesoMeta ? renderNumberField(pesoMeta) : null}
          </div>,
        )}

        {renderStageSection(
          "Critérios iniciais de segurança",
          "Usamos esse bloco para reduzir risco e orientar a análise médica.",
          <div className="space-y-5">
            {sexo ? renderSexField(sexo) : null}
            {gestacao ? renderSelectField(gestacao) : null}
            {dataNascimento
              ? renderDateField(dataNascimento, {
                  helperText:
                    "Digite no formato DD/MM/AAAA. Sem abrir calendário.",
                })
              : null}
          </div>,
          { muted: true },
        )}
      </>
    );
  }, [
    getVisibleStep,
    renderDateField,
    renderFieldByStep,
    renderNumberField,
    renderSelectField,
    renderSexField,
    renderStageSection,
  ]);

  const renderClinicalPage = useCallback(
    (page: EmagrecimentoPageConfig) => {
      const contraindicacoes = getVisibleStep("contraindicacoes_glp1");
      const comorbidades = getVisibleStep("comorbidades");
      const cirurgia = getVisibleStep("cirurgia_bariatrica_previa");
      const opioides = getVisibleStep("uso_opioides_3meses");
      const prescritos = getVisibleStep("medicamentos_prescritos_atual");
      const usoRecente = getVisibleStep("uso_medicacao_emagrecimento_recente");
      const efeitos = getVisibleStep("efeitos_colaterais_previos");
      const pressao = getVisibleStep("pressao_arterial_faixa");
      const frequencia = getVisibleStep("frequencia_cardiaca_repouso");

      const comorbidadeSlices = page.items.filter(
        (
          item,
        ): item is Extract<
          EmagrecimentoPageItem,
          { kind: "multiselectSlice" }
        > => item.kind === "multiselectSlice" && item.key === "comorbidades",
      );
      const [primeiraFatia, segundaFatia] = comorbidadeSlices;

      return (
        <>
          {renderStageSection(
            "Perguntas de saúde",
            "Comece pelos critérios que podem mudar elegibilidade ou conduta.",
            <div className="space-y-5">
              {contraindicacoes
                ? renderMultiselectField(contraindicacoes, undefined, {
                    label: "Histórico importante",
                    helperText:
                      "Marque tudo o que se aplicar. Se nada se aplicar, escolha a opção correspondente.",
                  })
                : null}
            </div>,
            { muted: true },
          )}

          {renderStageSection(
            "Condições associadas",
            "Marque apenas diagnósticos ou contextos que realmente fazem parte do seu histórico.",
            <div className="space-y-5">
              {comorbidades && primeiraFatia
                ? renderMultiselectField(
                    comorbidades,
                    primeiraFatia.optionValues,
                    {
                      label: "Condições metabólicas e osteoarticulares",
                      helperText: "Parte 1 de 2.",
                    },
                  )
                : null}
              {comorbidades && segundaFatia
                ? renderMultiselectField(
                    comorbidades,
                    [
                      ...segundaFatia.optionValues,
                      ...(segundaFatia.includeNoneOption ? ["nenhuma"] : []),
                    ],
                    {
                      label: "Outras condições relevantes",
                      helperText:
                        "Parte 2 de 2. Se nada se aplicar, marque a opção correspondente.",
                    },
                  )
                : null}
            </div>,
          )}

          {renderStageSection(
            "Histórico terapêutico",
            "Esse bloco reduz retrabalho na consulta e evita repetir caminhos inadequados.",
            <div className="grid gap-5 lg:grid-cols-2">
              {cirurgia ? renderBinaryField(cirurgia) : null}
              {opioides ? renderBinaryField(opioides) : null}
              {prescritos ? renderBinaryField(prescritos) : null}
              {usoRecente ? renderSelectField(usoRecente) : null}
              {efeitos
                ? renderSelectField(efeitos, {
                    containerClassName: "lg:col-span-2",
                  })
                : null}
            </div>,
            { muted: true },
          )}

          {renderStageSection(
            "Contexto cardiometabólico",
            "Mais dois sinais simples para fechar a leitura de risco inicial.",
            <div className="grid gap-5 lg:grid-cols-2">
              {pressao ? renderSelectField(pressao) : null}
              {frequencia ? renderSelectField(frequencia) : null}
            </div>,
          )}
        </>
      );
    },
    [
      getVisibleStep,
      renderBinaryField,
      renderMultiselectField,
      renderSelectField,
      renderStageSection,
    ],
  );

  const renderGoalsContactPage = useCallback(() => {
    const impacto = getVisibleStep("impacto_vida");
    const objetivo = getVisibleStep("objetivo_principal");
    const preferencia = getVisibleStep("preferencia_principio_ativo");
    const primeiroNome = getVisibleStep("primeiro_nome");
    const whatsapp = getVisibleStep("whatsapp");
    const consentimentoWhatsapp = getVisibleStep("consentimento_whatsapp");

    return (
      <>
        {renderStageSection(
          "Objetivo e preferência inicial",
          "Queremos entender o impacto do peso na sua rotina e qual estratégia faz mais sentido avaliar.",
          <div className="space-y-5">
            {impacto ? renderSelectField(impacto) : null}
            {objetivo ? renderSelectField(objetivo) : null}
            {preferencia ? renderSelectCardsField(preferencia) : null}
          </div>,
          { muted: true },
        )}

        {renderStageSection(
          "Entrega do resultado",
          "Seu resultado inicial e os próximos passos seguem pelo canal oficial da MeJoy.",
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              {primeiroNome ? renderTextField(primeiroNome) : null}
              {whatsapp ? renderTextField(whatsapp) : null}
            </div>
            {consentimentoWhatsapp
              ? renderFieldByStep(consentimentoWhatsapp)
              : null}
          </div>,
        )}
      </>
    );
  }, [
    getVisibleStep,
    renderFieldByStep,
    renderSelectCardsField,
    renderSelectField,
    renderStageSection,
    renderTextField,
  ]);

  const renderGenericPage = useCallback(
    (page: EmagrecimentoPageConfig) =>
      page.items.map((item) => {
        const step = stepsByKey.get(item.key);
        if (!step || !isStepVisible(step, answers)) return null;
        return (
          <div
            key={`${page.id}-${item.key}`}
            className="px-5 py-6 sm:px-7 sm:py-7"
          >
            {renderFieldByStep(step, item)}
          </div>
        );
      }),
    [answers, renderFieldByStep, stepsByKey],
  );

  const renderCurrentPageBody = useCallback(
    (page: EmagrecimentoPageConfig) => {
      if (page.id === "etapa-1-perfil") return renderProfilePage();
      if (page.id === "etapa-2-clinico") return renderClinicalPage(page);
      if (page.id === "etapa-3-objetivo-e-contato")
        return renderGoalsContactPage();
      return renderGenericPage(page);
    },
    [
      renderClinicalPage,
      renderGenericPage,
      renderGoalsContactPage,
      renderProfilePage,
    ],
  );

  if (!currentPage) return null;

  if (finalizeStatus === "running" || finalizeStatus === "completed") {
    return (
      <div className="min-h-screen bg-[#faf7f1] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-[42rem] overflow-hidden rounded-[36px] border border-[#dde5d7] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[linear-gradient(180deg,#f6fbf7_0%,#eff5ec_100%)] p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#446048]">
                Plano MeJoy em preparação
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">
                Organizando sua leitura personalizada
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Sua triagem foi recebida. Agora a MeJoy cruza perfil,
                elegibilidade preliminar, objetivo e próximos passos para
                apresentar o plano inicial com clareza.
              </p>
            </div>
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#2f6a49] border-t-transparent" />
              <p className="text-xl font-semibold tracking-[-0.03em] text-slate-900">
                Isso costuma levar poucos segundos
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Mantenha esta página aberta. Assim que o Plano MeJoy ficar
                pronto, a jornada segue automaticamente para o relatório.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (finalizeStatus === "failed" && finalizeError) {
    return (
      <div className="min-h-screen bg-[#faf7f1] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-[38rem] rounded-[36px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-700">
            Ajuste necessário
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-900">
            Não foi possível finalizar a triagem agora
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {finalizeError}
          </p>
          <RefinedButton
            type="button"
            onClick={() => setFinalizeStatus("idle")}
            className="mt-6 h-12 rounded-full bg-[#2f6a49] px-6 text-white hover:bg-[#25563b]"
          >
            Tentar novamente
          </RefinedButton>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#faf7f1] px-4 py-6 text-slate-900 sm:px-6 sm:py-8"
      data-testid="emagrecimento-intake"
    >
      <div className="mx-auto max-w-[74rem]">
        <header className="pb-10 pt-2 sm:pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <LogoWithName size="medium" priority />
            </div>
            <div className="inline-flex w-fit items-center rounded-full border border-[#d8ddd5] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
              Canal oficial MeJoy
            </div>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4b6b50] sm:text-xs">
                Triagem clínica MeJoy
              </p>
              <h1 className="mt-4 max-w-3xl text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.06em] text-slate-900 sm:text-[3.4rem]">
                Sua avaliação começa por uma triagem simples, clínica e segura.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Esta triagem organiza seu contexto clínico em poucos passos, com
                linguagem clara, privacidade e leitura fácil para preparar seu
                Plano MeJoy antes da avaliação médica.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {TRIAGE_EDITORIAL_FACTS.map((fact) => (
                  <div
                    key={fact.value}
                    className="rounded-[24px] border border-[#dbe4d7] bg-white px-4 py-4 shadow-[0_14px_35px_rgba(15,23,42,0.04)]"
                  >
                    <p className="text-lg font-semibold tracking-[-0.03em] text-slate-900">
                      {fact.value}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {fact.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-[#d8ddd5] bg-white px-4 py-2 shadow-sm">
                  Dados clínicos essenciais
                </span>
                <span className="rounded-full border border-[#d8ddd5] bg-white px-4 py-2 shadow-sm">
                  Resultado inicial ao final
                </span>
                <span className="rounded-full border border-[#d8ddd5] bg-white px-4 py-2 shadow-sm">
                  WhatsApp oficial MeJoy
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-[28px] border border-[#dbe4d7] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                    Confiança editorial
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    A jornada separa triagem, pagamento e decisão médica final,
                    com dados protegidos e contato pelo canal oficial.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {TRIAGE_SOCIAL_AVATARS.map((avatar) => (
                      <span
                        key={avatar}
                        className="relative inline-flex h-11 w-11 overflow-hidden rounded-full border-2 border-white"
                      >
                        <Image
                          src={avatar}
                          alt="Avatar de paciente"
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      Jornada premium com fricção mínima
                    </p>
                    <p className="text-xs text-slate-500">
                      triagem, plano e checkout na mesma narrativa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-[0.86fr_1fr_0.88fr]">
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[30px] border border-white bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.07)] lg:self-end">
                  <div className="relative overflow-hidden rounded-[22px]">
                    <Image
                      src={TRIAGE_HERO_FRAMES[0].src}
                      alt={TRIAGE_HERO_FRAMES[0].alt}
                      width={560}
                      height={680}
                      className={cn(
                        "h-full w-full object-cover",
                        TRIAGE_HERO_FRAMES[0].className,
                      )}
                      sizes="(max-width: 1024px) 48vw, 20vw"
                      priority
                    />
                  </div>
                </div>
                <div className="overflow-hidden rounded-[30px] border border-white bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
                  <div className="relative overflow-hidden rounded-[22px]">
                    <Image
                      src={TRIAGE_HERO_FRAMES[1].src}
                      alt={TRIAGE_HERO_FRAMES[1].alt}
                      width={560}
                      height={480}
                      className={cn(
                        "h-full w-full object-cover",
                        TRIAGE_HERO_FRAMES[1].className,
                      )}
                      sizes="(max-width: 1024px) 48vw, 18vw"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {TRIAGE_HERO_FRAMES.slice(2).map((frame) => (
                  <div
                    key={frame.src}
                    className="overflow-hidden rounded-[30px] border border-white bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.07)]"
                  >
                    <div className="relative overflow-hidden rounded-[22px]">
                      <Image
                        src={frame.src}
                        alt={frame.alt}
                        width={560}
                        height={560}
                        className={cn(
                          "h-full w-full object-cover",
                          frame.className,
                        )}
                        sizes="(max-width: 1024px) 48vw, 16vw"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden rounded-[32px] border border-[#dbe4d7] bg-[linear-gradient(180deg,#ffffff_0%,#f3f7f0_100%)] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] lg:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                  O que acontece aqui
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                  Perfil, histórico e objetivo em sequência limpa.
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Você preenche apenas o que importa para elegibilidade,
                  segurança e recomendação inicial.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Sem sair da jornada nem abrir telas paralelas.",
                    "Campos essenciais primeiro, contexto clínico depois.",
                    "Próximo passo conectado ao relatório e ao pagamento seguro.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-[#e3e7df] bg-white px-4 py-3 text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-dashed border-[#d7e3da] bg-white px-4 py-4 text-sm text-slate-600">
                  A triagem organiza informações preliminares. Prescrição, dose
                  e continuidade sempre dependem da avaliação médica.
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start">
          <section
            ref={flowCardRef}
            className="overflow-hidden rounded-[34px] border border-[#dde5d7] bg-white shadow-[0_22px_65px_rgba(15,23,42,0.06)]"
            data-testid={`triage-stage-${currentPage.id}`}
          >
            <div className="border-b border-[#e5ebe2] bg-[linear-gradient(180deg,#ffffff_0%,#f7faf6_100%)] px-5 py-7 sm:px-7 sm:pb-8 sm:pt-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-[#eef2eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#38573f]">
                  Etapa {currentPage.section} de {EMAGRECIMENTO_TOTAL_SECTIONS}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                  {pageProgress}% concluído
                </span>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-end">
                <div className="max-w-[36rem]">
                  <h2 className="text-[34px] font-semibold tracking-[-0.05em] text-slate-900 sm:text-[42px] sm:leading-[1.02]">
                    {currentPage.title}
                  </h2>
                  {currentPage.description ? (
                    <p className="mt-3 max-w-[32rem] text-sm leading-6 text-slate-600 sm:text-[15px]">
                      {currentPage.description}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-[28px] border border-[#dbe4d7] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                    Ritmo desta etapa
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {[
                      "Campos simples e diretos",
                      "Sem perder o contexto",
                      "Preparado para o relatório final",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-[18px] border border-[#e4e8de] bg-[#fafbf8] px-3 py-3 text-sm text-slate-600"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {EMAGRECIMENTO_INTAKE_PAGES.map((page, index) => {
                  const isDone = index < currentPageIndex;
                  const isActive = index === currentPageIndex;
                  return (
                    <div
                      key={page.id}
                      className={cn(
                        "h-1.5 rounded-full transition",
                        isDone
                          ? "bg-[#2f6a49]"
                          : isActive
                            ? "bg-[#9bb89e]"
                            : "bg-[#e5ebe2]",
                      )}
                    />
                  );
                })}
              </div>
            </div>

            <div className="divide-y divide-[#eef2ea]">
              {renderCurrentPageBody(currentPage)}
            </div>

            <div className="border-t border-[#e5ebe2] bg-[#fcfdfb] px-5 py-5 sm:px-7 sm:py-6">
              {finalizeError ? (
                <div className="mb-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {finalizeError}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs leading-6 text-slate-500">
                  {currentPage.note ??
                    "Suas respostas seguem para a avaliação clínica inicial da MeJoy."}
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                  {currentPageIndex > 0 ? (
                    <RefinedButton
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        moveToPage(Math.max(currentPageIndex - 1, 0))
                      }
                      className="h-12 rounded-full border border-[#d8dfd5] bg-white px-5 text-slate-700 hover:bg-[#f4f6f1]"
                    >
                      Voltar
                    </RefinedButton>
                  ) : null}

                  <RefinedButton
                    type="button"
                    loading={submitting}
                    onClick={
                      currentPage.submit
                        ? () => void handleSubmit()
                        : handleNext
                    }
                    className="h-12 rounded-full bg-[#2f6a49] px-6 text-white shadow-[0_12px_24px_rgba(47,106,73,0.18)] hover:bg-[#25563b] hover:shadow-[0_14px_28px_rgba(47,106,73,0.22)]"
                  >
                    {currentPage.ctaLabel}
                  </RefinedButton>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-24">
            <div className="rounded-[30px] border border-[#dde5d7] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                A jornada continua
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                Triagem, relatório e checkout ficam encaixados.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ao finalizar aqui, o relatório abre e o fechamento continua na
                mesma narrativa, sem telas confusas.
              </p>
            </div>

            <div className="rounded-[30px] border border-[#dde5d7] bg-[linear-gradient(180deg,#ffffff_0%,#f3f7f0_100%)] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                O que a MeJoy usa
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Dados essenciais para elegibilidade e seguranca.",
                  "Preferencia inicial do principio ativo, sem travar a decisao medica.",
                  "Contato oficial para o resultado e a proxima etapa.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] border border-[#e3e7df] bg-white px-4 py-3 text-sm text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
