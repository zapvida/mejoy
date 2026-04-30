'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import LegalLinksAccordion from '@/components/triage/LegalLinksAccordion';
import { MeJoyBrand } from '@/components/ui/MeJoyBrand';
import { EnhancedInput, NumericInput } from '@/components/ui/EnhancedInput';
import { RefinedButton } from '@/components/ui/RefinedButton';
import { trackMejoyConversionEvent } from '@/lib/funnel/events-client';
import { formatBrazilPhoneDisplay, validateBrazilPhoneInput } from '@/lib/phone/normalize';
import type { StepDef, TriageFlow } from '@/lib/triage/schema';
import {
  clearDependentAnswers,
  computeProgress,
  isStepAnswered,
  isStepVisible,
} from '@/lib/triage/onePageHelpers';
import { cn } from '@/lib/utils';

export type RunnerCompletionStatus = 'completed' | 'running' | 'failed';
export type RunnerCompletePayload = {
  triageId: string;
  status: RunnerCompletionStatus;
  reportId?: string | null;
  error?: string;
};

const localKey = (id: string) => `triage:${id}`;
const pendingKey = (id: string) => `${localKey(id)}:pending`;
const isBrowser = typeof window !== 'undefined';
const SEGMENTS = 12;

const NUMERIC_UNITS_BY_KEY: Record<string, string> = {
  altura: 'cm',
  height: 'cm',
  peso: 'kg',
  weight: 'kg',
  peso_meta: 'kg',
};

const GROUP_ORDER = ['consentimento', 'seguranca', 'historico', 'objetivos', 'contato'] as const;

const GROUP_META: Record<
  string,
  { eyebrow: string; title: string; description: string }
> = {
  consentimento: {
    eyebrow: 'Bloco 1',
    title: 'Consentimento e dados base',
    description: 'Contexto essencial para a leitura inicial do seu perfil.',
  },
  seguranca: {
    eyebrow: 'Bloco 2',
    title: 'Segurança clínica',
    description: 'Histórico e sinais que ajudam a direcionar a avaliação com mais cuidado.',
  },
  historico: {
    eyebrow: 'Bloco 3',
    title: 'Histórico e uso prévio',
    description: 'Experiências anteriores com tratamentos e tolerabilidade.',
  },
  objetivos: {
    eyebrow: 'Bloco 4',
    title: 'Objetivos e preferência terapêutica',
    description: 'O que você espera do programa e qual linha parece mais adequada.',
  },
  contato: {
    eyebrow: 'Bloco 5',
    title: 'Contato e autorização',
    description: 'Canal oficial para entregar seu relatório e próximos passos.',
  },
};

type PendingPayload = {
  triageId: string;
  stepKey: string;
  value: any;
  progress: number;
  answeredAt: string;
};

const normalizeAnswerValue = (value: unknown) => {
  if (value == null) return null;
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  return String(value);
};

const normalizePhoneInputValue = (value: unknown) => {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return '';
  const withoutCountryCode = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
  return withoutCountryCode.slice(0, 11);
};

const readPending = (triageId: string): PendingPayload[] => {
  if (!isBrowser) return [];
  try {
    const existing = window.localStorage.getItem(pendingKey(triageId));
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
};

const writePending = (triageId: string, queue: PendingPayload[]) => {
  if (!isBrowser) return;
  try {
    if (queue.length === 0) window.localStorage.removeItem(pendingKey(triageId));
    else window.localStorage.setItem(pendingKey(triageId), JSON.stringify(queue));
  } catch {
    /* noop */
  }
};

const enqueuePending = (triageId: string, payload: PendingPayload) => {
  if (!isBrowser) return;
  try {
    const queue = readPending(triageId);
    queue.push(payload);
    writePending(triageId, queue);
  } catch {
    /* noop */
  }
};

const storeAnswers = (triageId: string, answers: Record<string, any>) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(localKey(triageId), JSON.stringify({ ...answers, _timestamp: Date.now() }));
  } catch {
    /* noop */
  }
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
  const [answers, setAnswers] = useState<Record<string, any>>(() => ({ ...initialAnswers }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [finalizeStatus, setFinalizeStatus] = useState<RunnerCompletionStatus | 'idle'>('idle');
  const [finalizeError, setFinalizeError] = useState<string | null>(null);

  const pendingFlushRef = useRef(false);
  const finalizeInFlightRef = useRef(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef(answers);
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    setAnswers(prev => ({ ...initialAnswers, ...prev }));
  }, [initialAnswers]);

  const visibleSteps = useMemo(
    () => steps.filter(step => isStepVisible(step, answers)),
    [answers, steps]
  );
  const progress = useMemo(() => computeProgress(steps, answers), [answers, steps]);
  const filledSegments = Math.min(SEGMENTS, Math.round((progress / 100) * SEGMENTS));

  const groupedSections = useMemo(() => {
    return GROUP_ORDER.map(groupKey => ({
      key: groupKey,
      meta: GROUP_META[groupKey],
      steps: visibleSteps.filter(step => step.group === groupKey),
    })).filter(section => section.steps.length > 0);
  }, [visibleSteps]);

  const clearCachedProgress = useCallback(() => {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(localKey(triageId));
      window.localStorage.removeItem(pendingKey(triageId));
    } catch {
      /* noop */
    }
  }, [triageId]);

  const setSingleFieldError = useCallback((key: string, message: string | null) => {
    setFieldErrors(prev => {
      const next = { ...prev };
      if (message) next[key] = message;
      else delete next[key];
      return next;
    });
  }, []);

  const validateDate = useCallback((value: any) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Data inválida.';
    const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) return 'Programa disponível apenas para maiores de 18 anos.';
    if (age > 100) return 'Revise a data informada.';
    return null;
  }, []);

  const validateStepValue = useCallback(
    (step: StepDef, value: any, currentAnswers: Record<string, any>) => {
      if (step.required && !isStepAnswered(step, { ...currentAnswers, [step.key]: value })) {
        if (step.key === 'consentimento_whatsapp') return 'Autorize o contato para receber o relatório.';
        if (step.key === 'primeiro_nome') return 'Informe seu nome para continuar.';
        if (step.key === 'whatsapp') return 'Informe seu WhatsApp com DDD.';
        return 'Responda para continuar.';
      }

      if (step.key === 'whatsapp' && value) {
        const error = validateBrazilPhoneInput(String(value));
        if (error) return 'Informe um WhatsApp válido com DDD.';
      }

      if (step.key === 'data_nascimento' && value) {
        return validateDate(value);
      }

      return null;
    },
    [validateDate]
  );

  const scrollToNextStep = useCallback(
    (currentKey: string) => {
      if (!isBrowser || window.innerWidth >= 768) return;
      const currentIndex = visibleSteps.findIndex(step => step.key === currentKey);
      if (currentIndex < 0) return;
      const nextStep = visibleSteps[currentIndex + 1];
      if (!nextStep) return;

      window.setTimeout(() => {
        const target = stepRefs.current[nextStep.key];
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 140);
    },
    [visibleSteps]
  );

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
    async (step: StepDef, value: any, nextAnswersOverride?: Record<string, any>) => {
      const safeValue = normalizeAnswerValue(value);
      const nextAnswers = nextAnswersOverride ?? answersRef.current;
      const nextProgress = computeProgress(steps, nextAnswers);
      const payload: PendingPayload = {
        triageId,
        stepKey: step.key,
        value: safeValue,
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
        trackMejoyConversionEvent('triage_answer_persist_failed', {
          triageId,
          triageSlug: flow.slug,
          stepKey: step.key,
        });
      }
    },
    [flow.slug, flushPendingQueue, steps, triageId]
  );

  const setField = useCallback(
    (step: StepDef, rawValue: any, options?: { autoAdvance?: boolean }) => {
      const value = step.key === 'whatsapp' ? normalizePhoneInputValue(rawValue) : rawValue;
      let updated = { ...answersRef.current, [step.key]: value };
      updated = clearDependentAnswers(steps, updated, step.key);
      answersRef.current = updated;
      setAnswers(updated);
      storeAnswers(triageId, updated);
      void persistAnswer(step, value, updated);

      const error = validateStepValue(step, value, updated);
      setSingleFieldError(step.key, error);

      if (options?.autoAdvance && step.autoAdvance) {
        scrollToNextStep(step.key);
      }
    },
    [persistAnswer, scrollToNextStep, setSingleFieldError, steps, triageId, validateStepValue]
  );

  const toggleMultiselect = useCallback(
    (step: StepDef, value: string, checked: boolean) => {
      const current = (answers[step.key] as string[]) || [];
      let next = [...current];
      const isNone = value === 'nenhuma';

      if (isNone && checked) {
        next = ['nenhuma'];
      } else if (checked) {
        next = next.filter(item => item !== 'nenhuma');
        if (!next.includes(value)) next.push(value);
      } else {
        next = next.filter(item => item !== value);
      }

      setField(step, next);
    },
    [answers, setField]
  );

  const retryWithBackoff = async <T,>(operation: () => Promise<T>, maxRetries = 2, baseDelayMs = 1000) => {
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

    const poll = async () => {
      attempts += 1;
      if (attempts > maxAttempts) {
        setFinalizeStatus('failed');
        setFinalizeError('O relatório está demorando mais que o esperado. Tente novamente.');
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        trackMejoyConversionEvent('triage_finalize_failed', {
          triageId,
          triageSlug: flow.slug,
          stage: 'poll_timeout',
        });
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
          trackMejoyConversionEvent('triage_finalize_failed', {
            triageId,
            triageSlug: flow.slug,
            stage: 'poll_failed',
            error: payload?.error,
          });
        }
      } catch {
        /* continue polling */
      }
    };

    void poll();
    pollingIntervalRef.current = setInterval(poll, 5000) as unknown as ReturnType<typeof setInterval>;
  }, [clearCachedProgress, flow.slug, onComplete, triageId]);

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
          typeof setTimeout === 'function' && controller ? setTimeout(() => controller.abort(), 60_000) : null;

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
        await onComplete?.({ triageId, status: 'running', reportId: null });
        startPollingForReport();
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
      trackMejoyConversionEvent('triage_finalize_failed', {
        triageId,
        triageSlug: flow.slug,
        stage: 'finalize_request',
        error: message,
      });
      await onComplete?.({ triageId, status: 'failed', error: message });
    } finally {
      finalizeInFlightRef.current = false;
    }
  }, [clearCachedProgress, flow.slug, flushPendingQueue, onComplete, retryWithBackoff, startPollingForReport, triageId]);

  const validateAll = useCallback(() => {
    const errors: Record<string, string> = {};

    for (const step of steps) {
      if (!isStepVisible(step, answers)) continue;
      const error = validateStepValue(step, answers[step.key], answers);
      if (error) errors[step.key] = error;
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      trackMejoyConversionEvent('triage_submit_blocked', {
        triageId,
        triageSlug: flow.slug,
        stage: 'local_validation',
        fields: Object.keys(errors),
      });
    }

    return Object.keys(errors).length === 0;
  }, [answers, flow.slug, steps, triageId, validateStepValue]);

  const handleSubmit = useCallback(async () => {
    if (!validateAll()) {
      const firstError = document.querySelector('[data-triage-field-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        await persistAnswer(step, answers[step.key], answers);
      }
      await finalizeTriage();
    } finally {
      setSubmitting(false);
    }
  }, [answers, finalizeTriage, flow.slug, persistAnswer, steps, triageId, validateAll]);

  const renderStep = (step: StepDef) => {
    if (!isStepVisible(step, answers)) return null;
    const error = fieldErrors[step.key];

    const baseWrap = (child: ReactNode) => (
      <div
        key={step.key}
        ref={node => {
          stepRefs.current[step.key] = node;
        }}
        className={cn(
          'rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-5',
          step.compact ? 'md:col-span-1' : 'md:col-span-2'
        )}
        data-triage-field-error={error ? 'true' : undefined}
        data-triage-step={step.key}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-6 text-slate-900">{step.label}</h3>
            {step.helperText && <p className="mt-1 text-sm leading-6 text-slate-600">{step.helperText}</p>}
            {step.evidenceNote && <p className="mt-2 text-xs font-medium text-emerald-700">{step.evidenceNote}</p>}
          </div>
          {step.required && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              obrigatório
            </span>
          )}
        </div>

        {step.legalLinks && step.legalLinks.length > 0 && (
          <div className="mt-3">
            <LegalLinksAccordion links={step.legalLinks} brand="lpac" />
          </div>
        )}

        <div className="mt-4">{child}</div>
        {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      </div>
    );

    if (step.type === 'number') {
      const unit = NUMERIC_UNITS_BY_KEY[step.key];
      return baseWrap(
        <NumericInput
          name={step.key}
          unit={unit}
          value={answers[step.key] === undefined || answers[step.key] === '' ? '' : String(answers[step.key])}
          onChange={event => {
            const raw = event.target.value;
            setField(step, raw === '' ? '' : Number(raw));
          }}
          placeholder={step.placeholder}
          min={step.min}
          max={step.max}
          step={step.step}
        />
      );
    }

    if (step.type === 'text') {
      const isWhatsapp = step.key === 'whatsapp';
      const value = isWhatsapp ? formatBrazilPhoneDisplay(answers[step.key] ?? '') : answers[step.key] ?? '';

      return baseWrap(
        <EnhancedInput
          name={step.key}
          type="text"
          value={value}
          onChange={event => setField(step, isWhatsapp ? event.target.value : event.target.value)}
          placeholder={isWhatsapp ? '(11) 99999-8888' : step.placeholder}
          inputMode={isWhatsapp ? 'tel' : 'text'}
        />
      );
    }

    if (step.type === 'date') {
      return baseWrap(
        <input
          name={step.key}
          type="date"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          value={answers[step.key] ?? ''}
          onChange={event => setField(step, event.target.value)}
        />
      );
    }

    if (step.type === 'select' && step.options && step.options.length <= 3) {
      const isBinary = step.options.length === 2;
      return baseWrap(
        <div className={cn('grid gap-3', isBinary ? 'grid-cols-2' : 'grid-cols-1')}>
          {step.options.map(option => {
            const selected = answers[step.key] === option.value;
            const isPositive = option.value !== 'nao' && !option.label.toLowerCase().startsWith('não');
            return (
              <button
                key={option.value}
                type="button"
                data-option-value={option.value}
                onClick={() => setField(step, option.value, { autoAdvance: true })}
                className={cn(
                  'flex min-h-[88px] items-center justify-center gap-3 rounded-[24px] border-2 px-4 py-4 text-center transition',
                  selected
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                    isPositive ? 'bg-emerald-600' : 'bg-slate-500'
                  )}
                >
                  {selected ? '✓' : isPositive ? '+' : '−'}
                </span>
                <span className="text-sm font-semibold leading-5 text-slate-900 sm:text-base">{option.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (step.type === 'select' && step.options) {
      return baseWrap(
        <div className="space-y-2.5">
          {step.options.map(option => {
            const selected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                data-option-value={option.value}
                onClick={() => setField(step, option.value, { autoAdvance: true })}
                className={cn(
                  'flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition',
                  selected
                    ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold',
                    selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-transparent'
                  )}
                >
                  ✓
                </span>
                <span className="leading-6 text-slate-800">{option.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (step.type === 'multiselect' && step.options) {
      const values = (answers[step.key] as string[]) || [];
      return baseWrap(
        <div className="space-y-2.5">
          {step.options.map(option => {
            const checked = values.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                data-option-value={option.value}
                onClick={() => toggleMultiselect(step, option.value, !checked)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition',
                  checked ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold',
                    checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-transparent'
                  )}
                >
                  ✓
                </span>
                <span className="leading-6 text-slate-800">{option.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (step.type === 'select_cards' && step.cardOptions) {
      const selected = answers[step.key] as string | undefined;
      return baseWrap(
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {step.cardOptions.map(option => {
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                data-option-value={option.value}
                onClick={() => {
                  setField(step, option.value, { autoAdvance: true });
                  trackMejoyConversionEvent('medication_preference_select', {
                    triageId,
                    triageSlug: flow.slug,
                    medication: option.value,
                  });
                }}
                className={cn(
                  'rounded-[26px] border-2 p-4 text-left transition',
                  isSelected ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                {option.badge && (
                  <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                    {option.badge}
                  </span>
                )}
                <div className="mt-3 text-lg font-semibold text-slate-900">{option.title}</div>
                {option.subtitle && <p className="mt-2 text-sm leading-6 text-slate-600">{option.subtitle}</p>}
                {option.priceHint && <p className="mt-3 text-sm font-medium leading-6 text-emerald-800">{option.priceHint}</p>}
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  if (finalizeStatus === 'running' || finalizeStatus === 'completed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="text-lg font-semibold text-slate-900">Gerando seu relatório…</p>
          <p className="mt-2 text-sm text-slate-600">Isso leva alguns segundos. Não feche esta página.</p>
        </div>
      </div>
    );
  }

  if (finalizeStatus === 'failed' && finalizeError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-[30px] border border-red-200 bg-white p-8 text-center shadow-lg">
          <p className="text-lg font-semibold text-red-800">Não foi possível finalizar</p>
          <p className="mt-2 text-sm text-slate-600">{finalizeError}</p>
          <RefinedButton type="button" className="mt-6 rounded-full" onClick={() => void finalizeTriage()}>
            Tentar novamente
          </RefinedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6f1_0%,#f8fafc_24%,#f8fafc_100%)] pb-40">
      <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100">
              <MeJoyBrand iconClassName="h-8 w-8 rounded-xl" titleClassName="text-[15px]" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Triagem de emagrecimento</p>
              <p className="text-xs text-slate-500">Fluxo curto, seguro e com menos fricção</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500">Progresso</p>
            <p className="text-sm font-bold text-slate-900">{progress}%</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 pb-3 sm:px-6">
          <div className="flex gap-1">
            {Array.from({ length: SEGMENTS }).map((_, index) => (
              <div
                key={index}
                className={cn('h-2 flex-1 rounded-full transition-colors', index < filledSegments ? 'bg-emerald-600' : 'bg-slate-200')}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
        <section className="rounded-[32px] bg-[#17392f] p-6 text-white shadow-[0_28px_90px_rgba(10,18,16,0.18)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200">Resumo da jornada</p>
          <h1 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
            Menos cliques, menos rolagem e mais clareza para gerar seu relatório.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/84 sm:text-base">
            Preencha os blocos abaixo. Quando houver avaliação médica indicada, você já segue no mesmo fluxo.
          </p>
        </section>

        {groupedSections.map(section => (
          <section
            key={section.key}
            className="rounded-[32px] border border-emerald-100 bg-white/88 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur sm:p-5"
          >
            <div className="mb-4 rounded-[26px] border border-emerald-100 bg-emerald-50/70 px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">{section.meta.eyebrow}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">{section.meta.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{section.meta.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.steps.map(step => renderStep(step))}
            </div>
          </section>
        ))}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/96 px-4 py-4 shadow-[0_-10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6 sm:pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-slate-900">Tudo pronto para gerar seu relatório inicial.</p>
            <p className="text-xs text-slate-500">Prescrição somente quando indicada após avaliação médica.</p>
          </div>
          <RefinedButton
            type="button"
            variant="primary"
            className="w-full rounded-full bg-emerald-600 py-4 text-base font-bold hover:bg-emerald-700 md:w-auto md:min-w-[280px]"
            loading={submitting}
            disabled={submitting || pendingFlushRef.current}
            onClick={() => void handleSubmit()}
          >
            Gerar meu relatório
          </RefinedButton>
        </div>
      </div>
    </div>
  );
}
