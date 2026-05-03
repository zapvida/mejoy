'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { trackMejoyConversionEvent } from '@/lib/funnel/events-client';
import { validateBrazilPhoneInput } from '@/lib/phone/normalize';
import { cn } from '@/lib/utils';
import type { StepDef, TriageFlow } from '@/lib/triage/schema';
import {
  clearDependentAnswers,
  computeProgress,
  isStepAnswered,
  isStepVisible,
} from '@/lib/triage/onePageHelpers';

import {
  EMAGRECIMENTO_INTAKE_PAGES,
  EMAGRECIMENTO_TOTAL_SECTIONS,
  getEmagrecimentoStepByKey,
  getFirstIncompleteEmagrecimentoPageIndex,
  type EmagrecimentoPageConfig,
  type EmagrecimentoPageItem,
} from './emagrecimentoPagedConfig';
import {
  coerceStringArray,
  normalizeAnswersForSteps,
  normalizePersistedStepValue,
} from './emagrecimentoAnswerNormalization';

export type RunnerCompletionStatus = 'completed' | 'running' | 'failed';
export type RunnerCompletePayload = {
  triageId: string;
  status: RunnerCompletionStatus;
  reportId?: string;
  error?: string;
};

const localKey = (id: string) => `triage:${id}`;
const pendingKey = (id: string) => `${localKey(id)}:pending`;
const isBrowser = typeof window !== 'undefined';

type PendingPayload = {
  triageId: string;
  stepKey: string;
  value: any;
  progress: number;
  answeredAt: string;
};

const INPUT_CLASSNAME =
  'h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-medium text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100';

const TEXTAREA_CLASSNAME =
  'min-h-[132px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base font-medium text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100';

const SURFACE_CLASSNAME =
  'rounded-[28px] border border-slate-200 bg-[#f6f7f5] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6';

const REQUIRED_MESSAGES: Record<string, string> = {
  aceita_termos: 'Confirme os documentos para continuar.',
  consentimento_whatsapp: 'Autorize o contato pelo WhatsApp para receber seu resultado.',
  contraindicacoes_glp1: 'Selecione ao menos uma opção para continuar.',
  comorbidades: 'Selecione ao menos uma opção para continuar.',
};

const INLINE_CONSENT_COPY: Record<string, string> = {
  aceita_termos:
    'Confirmo que li os documentos essenciais da jornada, incluindo privacidade, uso de IA nos relatórios e telemedicina.',
  consentimento_whatsapp:
    'Autorizo o envio do meu resultado inicial, orientações e próximos passos pelo canal oficial da Mejoy no WhatsApp.',
};

const NUMERIC_UNITS_BY_KEY: Record<string, string> = {
  altura: 'cm',
  height: 'cm',
  peso: 'kg',
  weight: 'kg',
  peso_meta: 'kg',
};

function deriveImcRangeFromAnswers(answers: Record<string, any>): string | undefined {
  const rawPeso = answers.peso ?? answers.weight;
  const rawAltura = answers.altura ?? answers.height;
  const peso = Number(rawPeso);
  const alturaCm = Number(rawAltura);
  if (Number.isNaN(peso) || Number.isNaN(alturaCm) || peso <= 0 || alturaCm <= 0) return undefined;

  const alturaM = alturaCm < 3 ? alturaCm : alturaCm / 100;
  const imc = peso / (alturaM * alturaM);
  if (imc < 18.5) return 'abaixo_peso';
  if (imc < 25) return 'peso_adequado';
  if (imc < 30) return 'sobrepeso';
  if (imc < 35) return 'obesidade_grau_1';
  if (imc < 40) return 'obesidade_grau_2';
  return 'obesidade_grau_3';
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
    if (queue.length === 0) window.localStorage.removeItem(pendingKey(triageId));
    else window.localStorage.setItem(pendingKey(triageId), JSON.stringify(queue));
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
    window.localStorage.setItem(localKey(triageId), JSON.stringify(dataWithTimestamp));
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
    return typeof parsed === 'object' && parsed ? { ...fallback, ...parsed } : fallback;
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
  const steps = useMemo(() => flow.steps.filter(step => step.type !== 'info'), [flow.steps]);
  const mergedInitialAnswers = useMemo(
    () => normalizeAnswersForSteps(steps, getStoredAnswers(triageId, initialAnswers)),
    [initialAnswers, steps, triageId]
  );
  const stepsByKey = useMemo(() => new Map(steps.map(step => [step.key, step])), [steps]);

  const [answers, setAnswers] = useState<Record<string, any>>(() => ({ ...mergedInitialAnswers }));
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [finalizeStatus, setFinalizeStatus] = useState<RunnerCompletionStatus | 'idle'>('idle');
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const pendingFlushRef = useRef(false);
  const finalizeInFlightRef = useRef(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startPollingForReportRef = useRef<() => void>(() => {});
  const answersRef = useRef(answers);
  const intakeHydratedRef = useRef<string | null>(null);
  const previousTriageIdRef = useRef(triageId);

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

    setAnswers(prev => {
      const next = normalizeAnswersForSteps(steps, { ...mergedInitialAnswers, ...prev });
      answersRef.current = next;
      return next;
    });
  }, [mergedInitialAnswers, steps, triageId]);

  useEffect(() => {
    intakeHydratedRef.current = null;
  }, [triageId]);

  useEffect(() => {
    if (intakeHydratedRef.current === triageId) return;
    const merged = { ...mergedInitialAnswers, ...answersRef.current };
    setCurrentPageIndex(
      getFirstIncompleteEmagrecimentoPageIndex(EMAGRECIMENTO_INTAKE_PAGES, steps, merged)
    );
    intakeHydratedRef.current = triageId;
  }, [mergedInitialAnswers, steps, triageId]);

  const progress = useMemo(() => computeProgress(steps, answers), [steps, answers]);
  const pageProgress = useMemo(
    () => Math.round(((currentPageIndex + 1) / EMAGRECIMENTO_INTAKE_PAGES.length) * 100),
    [currentPageIndex]
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
        const response = await fetch('/api/triage/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error('failed');
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
        const response = await fetch('/api/triage/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('fail');
        await flushPendingQueue();
      } catch {
        enqueuePending(triageId, payload);
      }
    },
    [flushPendingQueue, steps, triageId]
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
      setSectionErrors(prev => {
        const next = { ...prev };
        delete next[step.key];
        return next;
      });
    },
    [persistAnswer, steps, triageId]
  );

  const toggleMultiselect = useCallback(
    (step: StepDef, value: string, checked: boolean) => {
      const cur = coerceStringArray(answers[step.key]);
      let next: string[] = [...cur];
      const isNone = value === 'nenhuma';
      if (isNone && checked) {
        next = ['nenhuma'];
      } else if (checked) {
        next = next.filter(v => v !== 'nenhuma');
        if (!next.includes(value)) next.push(value);
      } else {
        next = next.filter(v => v !== value);
      }
      setField(step, next);
    },
    [answers, setField]
  );

  const retryWithBackoff = async <T,>(
    operation: () => Promise<T>,
    maxRetries = 2,
    baseDelayMs = 1000
  ) => {
    let lastError: unknown = null;
    for (let attempt = 0; attempt < maxRetries; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries - 1) break;
        await new Promise(resolve => setTimeout(resolve, baseDelayMs * 2 ** attempt));
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Falha após tentativas.');
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
        setFinalizeStatus('failed');
        setFinalizeError('O relatório está demorando mais que o esperado. Tente novamente.');
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        return;
      }

      try {
        const response = await fetch('/api/triage/finalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': triageId },
          body: JSON.stringify({ triageId, triageSlug: flow.slug }),
        });
        if (!response.ok) return;

        const payload = await response.json();
        if (payload?.ok && payload?.redirect) {
          setFinalizeStatus('completed');
          clearCachedProgress();
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          if (typeof window !== 'undefined') window.location.href = payload.redirect;
          await onComplete?.({ triageId, status: 'completed', reportId: triageId });
        } else if (payload?.ok === false || payload?.error || payload?.status === 'failed') {
          setFinalizeStatus('failed');
          setFinalizeError(payload?.error || 'Erro ao gerar relatório.');
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
      pollInterval
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
    setFinalizeStatus('running');
    setFinalizeError(null);

    try {
      await flushPendingQueue();
      const response = await retryWithBackoff(async () => {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
        const timeoutId =
          typeof setTimeout === 'function' && controller
            ? setTimeout(() => controller.abort(), 60_000)
            : null;

        try {
          const body: { triageId: string; triageSlug?: string; answers?: Record<string, any> } = {
            triageId,
            triageSlug: flow.slug,
          };
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            body.answers = answersRef.current;
          }

          const result = await fetch('/api/triage/finalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': triageId },
            body: JSON.stringify(body),
            ...(controller?.signal ? { signal: controller.signal } : {}),
          });

          if (result.status >= 500) throw new Error(result.statusText || 'Falha ao finalizar.');
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
        throw new Error(typeof payload?.error === 'string' ? payload.error : 'Falha ao finalizar triagem.');
      }

      if (payload?.ok && payload?.redirect) {
        setFinalizeStatus('completed');
        clearCachedProgress();
        if (typeof window !== 'undefined') window.location.href = payload.redirect;
        await onComplete?.({ triageId, status: 'completed', reportId: triageId });
      } else if (payload?.ok && payload?.status === 'running') {
        setFinalizeStatus('running');
        await onComplete?.({ triageId, status: 'running' });
        startPollingForReportRef.current();
      } else {
        throw new Error('Resposta inválida da finalização.');
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message && !/aborted/i.test(error.message)
          ? error.message
          : 'Não foi possível finalizar. Tente novamente.';

      setFinalizeStatus('failed');
      setFinalizeError(message);
      await onComplete?.({ triageId, status: 'failed', error: message });
    } finally {
      finalizeInFlightRef.current = false;
    }
  }, [clearCachedProgress, flushPendingQueue, flow.slug, onComplete, retryWithBackoff, triageId]);

  const validateStepValue = useCallback(
    (step: StepDef, requiredOverride?: boolean) => {
      const required = requiredOverride ?? step.required ?? false;
      if (required && !isStepAnswered(step, answers)) {
        return REQUIRED_MESSAGES[step.key] ?? 'Responda para continuar.';
      }

      if (step.key === 'whatsapp' && answers.whatsapp) {
        return validateBrazilPhoneInput(String(answers.whatsapp));
      }

      if (step.key === 'data_nascimento' && answers.data_nascimento) {
        const date = new Date(answers.data_nascimento);
        if (Number.isNaN(date.getTime())) return 'Data inválida.';
        const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < 18) return 'Programa para maiores de 18 anos.';
        if (age > 100) return 'Verifique a data informada.';
      }

      return null;
    },
    [answers]
  );

  const updatePageErrors = useCallback(
    (page: EmagrecimentoPageConfig, nextErrors: Record<string, string>) => {
      const keys = Array.from(new Set(page.items.map(item => item.key)));
      setSectionErrors(prev => {
        const updated = { ...prev };
        keys.forEach(key => delete updated[key]);
        Object.entries(nextErrors).forEach(([key, value]) => {
          updated[key] = value;
        });
        return updated;
      });
      return Object.keys(nextErrors).length === 0;
    },
    []
  );

  const validatePage = useCallback(
    (page: EmagrecimentoPageConfig) => {
      const nextErrors: Record<string, string> = {};

      for (const item of page.items) {
        const step = stepsByKey.get(item.key);
        if (!step || !isStepVisible(step, answers)) continue;

        if (item.kind === 'field') {
          const message = validateStepValue(step, item.required);
          if (message) nextErrors[step.key] = message;
          continue;
        }

        if (item.required && !isStepAnswered(step, answers)) {
          nextErrors[step.key] = REQUIRED_MESSAGES[step.key] ?? 'Selecione ao menos uma opção para continuar.';
        }
      }

      return updatePageErrors(page, nextErrors);
    },
    [answers, stepsByKey, updatePageErrors, validateStepValue]
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
    const firstError = document.querySelector('[data-triage-field-error="true"]');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const moveToPage = useCallback((nextIndex: number) => {
    setCurrentPageIndex(nextIndex);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleNext = useCallback(() => {
    const currentPage = EMAGRECIMENTO_INTAKE_PAGES[currentPageIndex];
    if (!currentPage) return;

    if (!validatePage(currentPage)) {
      scrollToFirstError();
      return;
    }

    moveToPage(Math.min(currentPageIndex + 1, EMAGRECIMENTO_INTAKE_PAGES.length - 1));
  }, [currentPageIndex, moveToPage, scrollToFirstError, validatePage]);

  const handleSubmit = useCallback(async () => {
    const currentPage = EMAGRECIMENTO_INTAKE_PAGES[currentPageIndex];
    if (!currentPage) return;

    if (!validatePage(currentPage)) {
      scrollToFirstError();
      return;
    }

    if (!validateAll()) {
      moveToPage(getFirstIncompleteEmagrecimentoPageIndex(EMAGRECIMENTO_INTAKE_PAGES, steps, answers));
      return;
    }

    trackMejoyConversionEvent('triage_submit', {
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
    [answers, steps]
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
              className="font-medium text-emerald-700 underline underline-offset-4"
            >
              {link.label}
            </a>
          </span>
        ))}
      </p>
    );
  }, []);

  const renderQuestionShell = useCallback(
    (step: StepDef, children: ReactNode, options?: { hideLabel?: boolean; helperText?: string }) => {
      const error = sectionErrors[step.key];
      const helperText = options?.helperText ?? step.helperText;

      return (
        <div data-triage-field-error={error ? 'true' : undefined}>
          {!options?.hideLabel ? (
            <label className="block text-[15px] font-semibold leading-6 text-slate-900">{step.label}</label>
          ) : null}
          {helperText ? <p className="mt-1 text-sm leading-6 text-slate-500">{helperText}</p> : null}
          <div className={cn(options?.hideLabel ? '' : 'mt-3')}>{children}</div>
          {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}
        </div>
      );
    },
    [sectionErrors]
  );

  const renderConsentField = useCallback(
    (step: StepDef) => {
      const checkedValue = step.options?.[0]?.value ?? 'aceito';
      const isSelected = answers[step.key] === checkedValue;

      return (
        <div
          className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          data-triage-field-error={sectionErrors[step.key] ? 'true' : undefined}
        >
          <button
            type="button"
            onClick={() => setField(step, isSelected ? '' : checkedValue)}
            className={cn(
              'flex w-full items-start gap-3 text-left',
              isSelected ? 'text-slate-900' : 'text-slate-700'
            )}
            aria-pressed={isSelected}
          >
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition',
                isSelected
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 bg-white text-transparent'
              )}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5 6.2 11.7 13 4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-sm leading-6">{INLINE_CONSENT_COPY[step.key] ?? step.label}</span>
          </button>
          {renderInlineLegalLinks(step)}
          {sectionErrors[step.key] ? (
            <p className="mt-2 text-sm font-medium text-red-600">{sectionErrors[step.key]}</p>
          ) : null}
        </div>
      );
    },
    [answers, renderInlineLegalLinks, sectionErrors, setField]
  );

  const renderNumberField = useCallback(
    (step: StepDef, extraClassName?: string) =>
      renderQuestionShell(
        step,
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            value={
              answers[step.key] === undefined || answers[step.key] === '' ? '' : String(answers[step.key])
            }
            onChange={event => {
              const raw = event.target.value;
              setField(step, raw === '' ? '' : Number(raw));
            }}
            placeholder={step.placeholder}
            min={step.min}
            max={step.max}
            step={step.step}
            className={cn(INPUT_CLASSNAME, NUMERIC_UNITS_BY_KEY[step.key] ? 'pr-14' : '', extraClassName)}
          />
          {NUMERIC_UNITS_BY_KEY[step.key] ? (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
              {NUMERIC_UNITS_BY_KEY[step.key]}
            </span>
          ) : null}
        </div>
      ),
    [answers, renderQuestionShell, setField]
  );

  const renderTextField = useCallback(
    (step: StepDef) =>
      renderQuestionShell(
        step,
        <input
          type={step.key === 'whatsapp' ? 'tel' : 'text'}
          inputMode={step.key === 'whatsapp' ? 'tel' : 'text'}
          value={answers[step.key] ?? ''}
          onChange={event => setField(step, event.target.value)}
          placeholder={step.placeholder}
          className={INPUT_CLASSNAME}
        />
      ),
    [answers, renderQuestionShell, setField]
  );

  const renderDateField = useCallback(
    (step: StepDef) =>
      renderQuestionShell(
        step,
        <input
          type="date"
          value={answers[step.key] ?? ''}
          onChange={event => setField(step, event.target.value)}
          className={INPUT_CLASSNAME}
        />
      ),
    [answers, renderQuestionShell, setField]
  );

  const renderTextareaField = useCallback(
    (step: StepDef) =>
      renderQuestionShell(
        step,
        <textarea
          value={answers[step.key] ?? ''}
          onChange={event => setField(step, event.target.value)}
          placeholder={step.placeholder}
          className={TEXTAREA_CLASSNAME}
        />
      ),
    [answers, renderQuestionShell, setField]
  );

  const renderBinaryField = useCallback(
    (step: StepDef) => {
      const options = step.options ?? [];
      return renderQuestionShell(
        step,
        <div className="grid grid-cols-2 gap-3">
          {options.map(option => {
            const selected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setField(step, option.value)}
                className={cn(
                  'rounded-[22px] border px-4 py-5 text-left transition',
                  selected
                    ? 'border-emerald-600 bg-emerald-50 shadow-[0_8px_18px_rgba(16,185,129,0.12)]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <span className="text-[15px] font-semibold text-slate-900">{option.label}</span>
              </button>
            );
          })}
        </div>
      );
    },
    [answers, renderQuestionShell, setField]
  );

  const renderSexField = useCallback(
    (step: StepDef) => {
      const options = step.options ?? [];
      return renderQuestionShell(
        step,
        <div className="grid grid-cols-2 gap-3">
          {options.map(option => {
            const selected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setField(step, option.value)}
                className={cn(
                  'rounded-[22px] border px-4 py-6 text-left transition',
                  selected
                    ? 'border-emerald-600 bg-emerald-50 shadow-[0_8px_18px_rgba(16,185,129,0.12)]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <span className="block text-base font-semibold text-slate-900">{option.label}</span>
              </button>
            );
          })}
        </div>
      );
    },
    [answers, renderQuestionShell, setField]
  );

  const renderSelectField = useCallback(
    (step: StepDef) => {
      const options = step.options ?? [];
      return renderQuestionShell(
        step,
        <div className="space-y-2.5">
          {options.map(option => {
            const selected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setField(step, option.value)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-[22px] border px-4 py-4 text-left transition',
                  selected
                    ? 'border-emerald-600 bg-emerald-50 shadow-[0_8px_18px_rgba(16,185,129,0.08)]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <span
                  className={cn(
                    'mt-1 h-4 w-4 shrink-0 rounded-full border-2',
                    selected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                  )}
                />
                <span className="text-[15px] leading-6 text-slate-800">{option.label}</span>
              </button>
            );
          })}
        </div>
      );
    },
    [answers, renderQuestionShell, setField]
  );

  const renderMultiselectField = useCallback(
    (step: StepDef, filteredOptionValues?: string[]) => {
      const options = (step.options ?? []).filter(option =>
        filteredOptionValues ? filteredOptionValues.includes(option.value) : true
      );
      const selected = coerceStringArray(answers[step.key]).filter(value => value !== '');
      const selectedOutsideSlice = filteredOptionValues
        ? selected.filter(value => !filteredOptionValues.includes(value) && value !== 'nenhuma')
        : [];

      return renderQuestionShell(
        step,
        <>
          {selectedOutsideSlice.length > 0 ? (
            <p className="mb-3 text-xs font-medium text-slate-500">
              Seleções anteriores mantidas nesta etapa.
            </p>
          ) : null}
          <div className="space-y-2.5">
            {options.map(option => {
              const checked = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleMultiselect(step, option.value, !checked)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-[22px] border px-4 py-4 text-left transition',
                    checked
                      ? 'border-emerald-600 bg-emerald-50 shadow-[0_8px_18px_rgba(16,185,129,0.08)]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition',
                      checked
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white text-transparent'
                    )}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8.5 6.2 11.7 13 4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[15px] leading-6 text-slate-800">{option.label}</span>
                </button>
              );
            })}
          </div>
        </>
      );
    },
    [answers, renderQuestionShell, toggleMultiselect]
  );

  const renderSelectCardsField = useCallback(
    (step: StepDef) =>
      renderQuestionShell(
        step,
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(step.cardOptions ?? []).map(option => {
            const selected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setField(step, option.value)}
                className={cn(
                  'rounded-[24px] border px-4 py-4 text-left transition',
                  selected
                    ? 'border-emerald-600 bg-emerald-50 shadow-[0_10px_20px_rgba(16,185,129,0.08)]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                {option.badge ? (
                  <span className="mb-3 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {option.badge}
                  </span>
                ) : null}
                <div className="text-[15px] font-semibold leading-6 text-slate-900">{option.title}</div>
                {option.subtitle ? (
                  <p className="mt-1 text-sm leading-6 text-slate-500">{option.subtitle}</p>
                ) : null}
                {option.priceHint ? (
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{option.priceHint}</p>
                ) : null}
              </button>
            );
          })}
        </div>
      ),
    [answers, renderQuestionShell, setField]
  );

  const renderFieldByStep = useCallback(
    (step: StepDef, item?: EmagrecimentoPageItem) => {
      if (step.key === 'aceita_termos' || step.key === 'consentimento_whatsapp') {
        return renderConsentField(step);
      }

      if (step.type === 'number') return renderNumberField(step);
      if (step.type === 'text') return renderTextField(step);
      if (step.type === 'textarea') return renderTextareaField(step);
      if (step.type === 'date') return renderDateField(step);
      if (step.type === 'select_cards') return renderSelectCardsField(step);
      if (step.type === 'multiselect') {
        const filteredValues =
          item?.kind === 'multiselectSlice'
            ? [
                ...item.optionValues,
                ...(item.includeNoneOption ? ['nenhuma'] : []),
              ]
            : undefined;
        return renderMultiselectField(step, filteredValues);
      }

      if (step.type === 'select') {
        if (step.key === 'sexo') return renderSexField(step);
        if ((step.options ?? []).length === 2) return renderBinaryField(step);
        return renderSelectField(step);
      }

      return renderTextField(step);
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
    ]
  );

  const renderProfilePage = useCallback(() => {
    const altura = getVisibleStep('altura');
    const peso = getVisibleStep('peso');
    const pesoMeta = getVisibleStep('peso_meta');
    const sexo = getVisibleStep('sexo');
    const gestacao = getVisibleStep('gestacao');
    const dataNascimento = getVisibleStep('data_nascimento');
    const aceite = getVisibleStep('aceita_termos');

    return (
      <div className="space-y-4">
        {aceite ? renderFieldByStep(aceite) : null}

        <div className={SURFACE_CLASSNAME}>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {altura ? renderNumberField(altura) : null}
              {peso ? renderNumberField(peso) : null}
            </div>

            {pesoMeta ? renderNumberField(pesoMeta) : null}
            {sexo ? renderSexField(sexo) : null}
            {gestacao ? renderSelectField(gestacao) : null}
            {dataNascimento ? renderDateField(dataNascimento) : null}
          </div>
        </div>
      </div>
    );
  }, [
    getVisibleStep,
    renderDateField,
    renderFieldByStep,
    renderNumberField,
    renderSelectField,
    renderSexField,
  ]);

  const renderGenericPage = useCallback(
    (page: EmagrecimentoPageConfig) => {
      const renderedItems = page.items
        .map(item => {
          const step = stepsByKey.get(item.key);
          if (!step || !isStepVisible(step, answers)) return null;
          return (
            <div key={`${page.id}-${item.key}`}>
              {renderFieldByStep(step, item)}
            </div>
          );
        })
        .filter(Boolean);

      return (
        <div className={SURFACE_CLASSNAME}>
          <div className="space-y-5">{renderedItems}</div>
        </div>
      );
    },
    [answers, renderFieldByStep, stepsByKey]
  );

  if (finalizeStatus === 'running' || finalizeStatus === 'completed') {
    return (
      <div className="min-h-screen bg-[#fbfbf8] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-[34rem] rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="text-xl font-semibold tracking-[-0.03em] text-slate-900">Gerando seu relatório</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Isso costuma levar alguns segundos. Mantenha esta página aberta.
          </p>
        </div>
      </div>
    );
  }

  if (finalizeStatus === 'failed' && finalizeError) {
    return (
      <div className="min-h-screen bg-[#fbfbf8] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-[34rem] rounded-[32px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xl font-semibold tracking-[-0.03em] text-slate-900">Não foi possível finalizar</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{finalizeError}</p>
          <button
            type="button"
            onClick={() => void finalizeTriage()}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!currentPage) return null;

  return (
    <div className="min-h-screen bg-[#fbfbf8] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-[#fbfbf8]">
        <div className="mx-auto max-w-[34rem] px-4 pb-4 pt-6 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[1.95rem] font-semibold tracking-[-0.08em] text-slate-900">MEJOY</div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span>Excelente 4,8</span>
              <Image
                src="/images/emagrecimento/medvi/stars.svg"
                alt="Avaliação 4,8 de 5"
                width={78}
                height={14}
                priority
              />
            </div>
          </div>

          <div className="mt-4 h-px w-full bg-slate-200" />

          <div className="mt-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Etapa {currentPage.section} de {EMAGRECIMENTO_TOTAL_SECTIONS}</span>
            <span>
              {currentPageIndex + 1}/{EMAGRECIMENTO_INTAKE_PAGES.length}
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600 transition-[width] duration-300"
              style={{ width: `${pageProgress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[34rem] px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Triagem de elegibilidade
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.05] tracking-[-0.05em] text-slate-900 sm:text-[2.25rem]">
              {currentPage.title}
            </h1>
            {currentPage.description ? (
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">{currentPage.description}</p>
            ) : null}
          </div>

          {currentPage.id === 'perfil' ? renderProfilePage() : renderGenericPage(currentPage)}

          {currentPage.note ? (
            <p className="mt-6 text-xs leading-6 text-slate-500">{currentPage.note}</p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            {currentPageIndex > 0 ? (
              <button
                type="button"
                onClick={() => moveToPage(Math.max(currentPageIndex - 1, 0))}
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Voltar
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={() => void (currentPage.submit ? handleSubmit() : handleNext())}
              disabled={submitting}
              className={cn(
                'inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition',
                submitting ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
              )}
            >
              {submitting && currentPage.submit ? 'Gerando...' : currentPage.ctaLabel}
            </button>
          </div>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
            Progresso clínico salvo automaticamente. {progress}% do questionário já foi registrado.
          </p>
        </section>
      </main>
    </div>
  );
}
