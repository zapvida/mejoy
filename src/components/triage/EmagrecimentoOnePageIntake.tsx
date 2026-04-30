'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import LegalLinksAccordion from '@/components/triage/LegalLinksAccordion';
import { EnhancedInput, NumericInput } from '@/components/ui/EnhancedInput';
import { RefinedButton } from '@/components/ui/RefinedButton';
import { trackMejoyConversionEvent } from '@/lib/funnel/events-client';
import { cn } from '@/lib/utils';
import type { StepDef, TriageFlow } from '@/lib/triage/schema';
import {
  clearDependentAnswers,
  computeProgress,
  isStepAnswered,
  isStepVisible,
} from '@/lib/triage/onePageHelpers';

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

const normalizeAnswerValue = (v: unknown) => {
  if (v == null) return null;
  if (typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean') return v;
  if (typeof v === 'object' && !Array.isArray(v)) return v;
  return String(v);
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
    /* ignore */
  }
};

const enqueuePending = (triageId: string, payload: PendingPayload) => {
  if (!isBrowser) return;
  try {
    const queue = readPending(triageId);
    queue.push(payload);
    writePending(triageId, queue);
  } catch {
    /* ignore */
  }
};

const storeAnswers = (triageId: string, answers: Record<string, any>) => {
  if (!isBrowser) return;
  try {
    const dataWithTimestamp = { ...answers, _timestamp: Date.now() };
    window.localStorage.setItem(localKey(triageId), JSON.stringify(dataWithTimestamp));
  } catch {
    /* ignore */
  }
};

function validateWhatsappBR(raw: string): string | null {
  const d = raw.replace(/\D/g, '');
  if (d.length < 10 || d.length > 11) return 'Informe DDD + número com 10 ou 11 dígitos.';
  return null;
}

const SEGMENTS = 12;
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

interface Props {
  triageId: string;
  flow: TriageFlow;
  initialAnswers?: Record<string, any>;
  onComplete?: (payload: RunnerCompletePayload) => void | Promise<void>;
}

export function EmagrecimentoOnePageIntake({ triageId, flow, initialAnswers = {}, onComplete }: Props) {
  const steps = useMemo(
    () => flow.steps.filter(s => s.type !== 'info'),
    [flow.steps]
  );

  const [answers, setAnswers] = useState<Record<string, any>>(() => ({ ...initialAnswers }));
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [finalizeStatus, setFinalizeStatus] = useState<RunnerCompletionStatus | 'idle'>('idle');
  const [finalizeError, setFinalizeError] = useState<string | null>(null);

  const pendingFlushRef = useRef(false);
  const finalizeInFlightRef = useRef(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startPollingForReportRef = useRef<() => void>(() => {});
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    setAnswers(prev => ({ ...initialAnswers, ...prev }));
  }, [initialAnswers]);

  const progress = useMemo(() => computeProgress(steps, answers), [steps, answers]);
  const filledSegments = Math.min(SEGMENTS, Math.round((progress / 100) * SEGMENTS));

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
      const safe = normalizeAnswerValue(value);
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
      let updated = { ...answersRef.current, [step.key]: value };
      updated = clearDependentAnswers(steps, updated, step.key);
      answersRef.current = updated;
      setAnswers(updated);
      storeAnswers(triageId, updated);
      void persistAnswer(step, value);
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
      const cur = (answers[step.key] as string[]) || [];
      let next: string[] = [...cur];
      const opts = step.options?.map(o => o.value) ?? [];
      const isNone = value === 'nenhuma';
      if (isNone && checked) {
        next = ['nenhuma'];
      } else if (checked) {
        next = next.filter(v => v !== 'nenhuma');
        if (!next.includes(value)) next.push(value);
      } else {
        next = next.filter(v => v !== value);
      }
      if (next.length === 0 && step.required) {
        setField(step, next);
        return;
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
        await new Promise(r => setTimeout(r, baseDelayMs * 2 ** attempt));
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
        /* continue */
      }
    };

    void poll();
    pollingIntervalRef.current = setInterval(poll, pollInterval) as unknown as ReturnType<typeof setInterval>;
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
        await onComplete?.({ triageId, status: 'running', reportId: null });
        startPollingForReportRef.current();
      } else {
        throw new Error('Resposta inválida da finalização.');
      }
    } catch (e) {
      const message =
        e instanceof Error && e.message && !/aborted/i.test(e.message)
          ? e.message
          : 'Não foi possível finalizar. Tente novamente.';
      setFinalizeStatus('failed');
      setFinalizeError(message);
      await onComplete?.({ triageId, status: 'failed', error: message });
    } finally {
      finalizeInFlightRef.current = false;
    }
  }, [clearCachedProgress, flushPendingQueue, onComplete, retryWithBackoff, triageId, flow.slug]);

  const validateAll = useCallback(() => {
    const errs: Record<string, string> = {};
    for (const step of steps) {
      if (!isStepVisible(step, answers)) continue;
      if (step.required && !isStepAnswered(step, answers)) {
        errs[step.key] = 'Responda para continuar.';
      }
      if (step.key === 'whatsapp' && answers.whatsapp) {
        const wErr = validateWhatsappBR(String(answers.whatsapp));
        if (wErr) errs.whatsapp = wErr;
      }
      if (step.key === 'data_nascimento' && answers.data_nascimento) {
        const d = new Date(answers.data_nascimento);
        if (Number.isNaN(d.getTime())) errs.data_nascimento = 'Data inválida.';
        else {
          const age = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          if (age < 18) errs.data_nascimento = 'Programa para maiores de 18 anos.';
          if (age > 100) errs.data_nascimento = 'Verifique a data informada.';
        }
      }
    }
    setSectionErrors(errs);
    return Object.keys(errs).length === 0;
  }, [answers, steps]);

  const handleSubmit = useCallback(async () => {
    if (!validateAll()) {
      const first = document.querySelector('[data-triage-field-error="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        const v = answers[step.key];
        await persistAnswer(step, v);
      }
      await finalizeTriage();
    } finally {
      setSubmitting(false);
    }
  }, [answers, finalizeTriage, persistAnswer, steps, validateAll]);

  const renderStep = (step: StepDef) => {
    if (!isStepVisible(step, answers)) return null;
    const err = sectionErrors[step.key];
    const baseWrap = (child: ReactNode) => (
      <div
        key={step.key}
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
        data-triage-field-error={err ? 'true' : undefined}
      >
        <h3 className="text-base font-semibold text-slate-900">{step.label}</h3>
        {step.helperText && <p className="mt-1 text-sm text-slate-600">{step.helperText}</p>}
        {step.legalLinks && step.legalLinks.length > 0 && (
          <div className="mt-2">
            <LegalLinksAccordion links={step.legalLinks} brand="lpac" />
          </div>
        )}
        <div className="mt-4">{child}</div>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </div>
    );

    if (step.type === 'number') {
      const unit = NUMERIC_UNITS_BY_KEY[step.key];
      return baseWrap(
        <NumericInput
          unit={unit}
          value={
            answers[step.key] === undefined || answers[step.key] === ''
              ? ''
              : String(answers[step.key])
          }
          onChange={e => {
            const raw = e.target.value;
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
      return baseWrap(
        <EnhancedInput
          type="text"
          value={answers[step.key] ?? ''}
          onChange={e => setField(step, e.target.value)}
          placeholder={step.placeholder}
        />
      );
    }

    if (step.type === 'date') {
      return baseWrap(
        <input
          type="date"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900"
          value={answers[step.key] ?? ''}
          onChange={e => setField(step, e.target.value)}
        />
      );
    }

    if (step.type === 'select' && step.options && step.options.length === 2) {
      const isBinary =
        step.options.every(o => o.value === 'sim' || o.value === 'nao') ||
        step.key.includes('opioides') ||
        step.key.includes('cirurgia') ||
        step.key.includes('medicamentos_prescritos');
      if (isBinary) {
        return baseWrap(
          <div className="grid grid-cols-2 gap-3">
            {step.options.map(opt => {
              const selected = answers[step.key] === opt.value;
              const isNo = opt.value === 'nao' || opt.label.toLowerCase().startsWith('não');
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setField(step, opt.value)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 rounded-2xl border-2 py-6 transition',
                    selected
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white',
                      isNo ? 'bg-emerald-600' : 'bg-rose-500'
                    )}
                  >
                    {isNo ? '✓' : '✕'}
                  </span>
                  <span className="font-medium text-slate-900">{opt.label}</span>
                </button>
              );
            })}
          </div>
        );
      }
    }

    if (step.type === 'select' && step.options) {
      return baseWrap(
        <div className="space-y-2">
          {step.options.map(opt => {
            const selected = answers[step.key] === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setField(step, opt.value)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                  selected
                    ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <span
                  className={cn(
                    'h-4 w-4 shrink-0 rounded-full border-2',
                    selected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                  )}
                />
                <span className="text-slate-800 leading-snug break-words">{opt.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (step.type === 'multiselect' && step.options) {
      const val = (answers[step.key] as string[]) || [];
      return baseWrap(
        <div className="space-y-2">
          {step.options.map(opt => {
            const checked = val.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleMultiselect(step, opt.value, !checked)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                  checked
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                    checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  )}
                >
                  {checked ? '✓' : ''}
                </span>
                <span className="text-slate-800">{opt.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (step.type === 'select_cards' && step.cardOptions) {
      const selected = answers[step.key] as string | undefined;
      return baseWrap(
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {step.cardOptions.map(opt => {
            const isSel = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setField(step, opt.value)}
                className={cn(
                  'rounded-2xl border-2 p-4 text-left transition',
                  isSel ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                {opt.badge && (
                  <span className="mb-2 inline-block rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">
                    {opt.badge}
                  </span>
                )}
                <div className="font-semibold text-slate-900">{opt.title}</div>
                {opt.subtitle && <p className="mt-1 text-xs text-slate-600">{opt.subtitle}</p>}
                {opt.priceHint && <p className="mt-2 text-xs font-medium text-slate-700">{opt.priceHint}</p>}
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
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
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
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <p className="text-lg font-semibold text-red-800">Não foi possível finalizar</p>
          <p className="mt-2 text-sm text-slate-600">{finalizeError}</p>
          <RefinedButton type="button" className="mt-6" onClick={() => finalizeTriage()}>
            Tentar novamente
          </RefinedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-36">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-4 py-3">
          <span className="text-lg font-bold tracking-tight text-slate-900">Me Joy</span>
          <div className="text-right text-xs text-slate-600">
            <div className="font-semibold text-emerald-700">Avaliação médica</div>
            <div>Triagem segura · LGPD</div>
          </div>
        </div>
        <div className="mx-auto max-w-lg px-4 pb-3">
          <div className="flex gap-1">
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors',
                  i < filledSegments ? 'bg-emerald-600' : 'bg-slate-200'
                )}
              />
            ))}
          </div>
          <p className="mt-1 text-center text-xs text-slate-500">{progress}% completo</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">{steps.map(step => renderStep(step))}</main>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-lg">
          <RefinedButton
            type="button"
            variant="primary"
            className="w-full rounded-full bg-emerald-600 py-4 text-base font-bold hover:bg-emerald-700"
            loading={submitting}
            disabled={submitting}
            onClick={() => void handleSubmit()}
          >
            Gerar meu resultado inicial
          </RefinedButton>
          <p className="mt-2 text-center text-[11px] text-slate-500">
            Prescrição somente quando indicada após avaliação médica.
          </p>
        </div>
      </div>
    </div>
  );
}
