import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

// import { useRouter } from "next/router";
import BristolMatrix from "./BristolMatrix";
import QuestionWhy from "./QuestionWhy";
import LegalLinksAccordion from "./LegalLinksAccordion";
import { ProfileDataCollector } from "./ProfileDataCollector";
import { TriageStepIllustration, getIllustrationVariant } from "./TriageStepIllustration";
import { ConcentrationMusic } from "./ConcentrationMusic";

import { EnhancedInput, NumericInput } from "@/components/ui/EnhancedInput";
import { RefinedButton } from "@/components/ui/RefinedButton";
import { RefinedCard } from "@/components/ui/RefinedCard";
import { toNumber, maskWeight, maskHeight } from "@/lib/format/number";
import { StepDef, TriageFlow, firstVisitSteps, hasProfileData } from "@/lib/triage/schema";
import { cn } from "@/lib/utils";
import { appendUtmsToUrl } from '@/lib/utm';
import { getBrandBySlug, BRAND_CONFIG } from "@/lib/brand/config";
import { getProductConfig } from "@/lib/zapfarm/product-loader";
import { getProductColorClasses } from "@/lib/zapfarm/color-utils";

const localKey = (id: string) => `triage:${id}`;
const pendingKey = (id: string) => `${localKey(id)}:pending`;
const SEEN_VALUE = "__seen__";
const SKIPPED_VALUE = "__skipped__";

export type RunnerCompletionStatus = "completed" | "running" | "failed";

export type RunnerCompletePayload = {
  triageId: string;
  status: RunnerCompletionStatus;
  reportId?: string;
  error?: string;
};

interface RunnerProps {
  triageId: string;
  flow: TriageFlow;
  firstVisit: boolean;
  initialAnswers?: Record<string, any>;
  // eslint-disable-next-line no-unused-vars
  onComplete?: (_payload: RunnerCompletePayload) => void | Promise<void>;
}

type PendingPayload = {
  triageId: string;
  stepKey: string;
  value: any;
  progress: number;
  answeredAt: string;
};

const isBrowser = typeof window !== "undefined";

// Type-guards e normalizador de resposta
type MatrixAnswer = Record<string, number | string | boolean | null | undefined>;
function isMatrixAnswer(v: unknown): v is MatrixAnswer {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}
function normalizeAnswerValue(v: unknown) {
  if (v == null) return null;
  if (typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean') return v;
  if (isMatrixAnswer(v)) return v;
  return String(v);
}

const getStoredAnswers = (triageId: string, fallback: Record<string, any>) => {
  if (!isBrowser) return fallback;
  try {
    const cached = window.localStorage.getItem(localKey(triageId));
    if (!cached) return fallback;
    const parsed = JSON.parse(cached);
    return typeof parsed === "object" && parsed ? { ...fallback, ...parsed } : fallback;
  } catch {
    return fallback;
  }
};

const storeAnswers = (triageId: string, answers: Record<string, any>) => {
  if (!isBrowser) return;
  try {
    // Limpar dados antigos (mais de 7 dias)
    const keys = Object.keys(window.localStorage);
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    keys.forEach(key => {
      if (key.startsWith('triage:')) {
        try {
          const data = JSON.parse(window.localStorage.getItem(key) || '{}');
          if (data._timestamp && data._timestamp < weekAgo) {
            window.localStorage.removeItem(key);
            window.localStorage.removeItem(key + ':pending');
          }
        } catch {
          // Ignore corrupted data
        }
      }
    });
    // Adicionar timestamp para limpeza futura
    const dataWithTimestamp = { ...answers, _timestamp: Date.now() };
    window.localStorage.setItem(localKey(triageId), JSON.stringify(dataWithTimestamp));
  } catch {
    /* ignore */
  }
};

const enqueuePending = (triageId: string, payload: PendingPayload) => {
  if (!isBrowser) return;
  try {
    const existing = window.localStorage.getItem(pendingKey(triageId));
    const queue: PendingPayload[] = existing ? JSON.parse(existing) : [];
    queue.push(payload);
    window.localStorage.setItem(pendingKey(triageId), JSON.stringify(queue));
  } catch {
    /* ignore */
  }
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
    if (queue.length === 0) {
      window.localStorage.removeItem(pendingKey(triageId));
    } else {
      window.localStorage.setItem(pendingKey(triageId), JSON.stringify(queue));
    }
  } catch {
    /* ignore */
  }
};

const isArray = (value: unknown): value is any[] => Array.isArray(value);

const isStepVisible = (step: StepDef, answers: Record<string, any>) => {
  if (!step.dependsOn || step.dependsOn.length === 0) return true;
  return step.dependsOn.every(condition => {
    const current = answers?.[condition.key];
    if (current === undefined || current === null) return false;
    const acceptedValues = Array.isArray(condition.value) ? condition.value : [condition.value];
    const result = isArray(current)
      ? acceptedValues.some(v => current.includes(v))
      : acceptedValues.includes(current);
    return condition.not ? !result : result;
  });
};

// Encontra todos os steps que dependem de um campo específico
const findDependentSteps = (steps: StepDef[], fieldKey: string): StepDef[] => {
  return steps.filter(step => 
    step.dependsOn?.some(condition => condition.key === fieldKey)
  );
};

// Limpa respostas de steps que não são mais visíveis após mudança em campo condicionante
const clearDependentAnswers = (
  steps: StepDef[],
  answers: Record<string, any>,
  changedField: string
): Record<string, any> => {
  const dependentSteps = findDependentSteps(steps, changedField);
  const cleanedAnswers = { ...answers };
  
  dependentSteps.forEach(step => {
    // Se o step não é mais visível, limpa sua resposta
    if (!isStepVisible(step, answers) && cleanedAnswers[step.key] !== undefined) {
      delete cleanedAnswers[step.key];
    }
  });
  
  return cleanedAnswers;
};

const isValueEmpty = (value: any) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (isArray(value)) return value.length === 0;
  return false;
};

const isStepAnswered = (step: StepDef, answers: Record<string, any>) => {
  const value = answers?.[step.key];
  if (step.type === "info") return value === SEEN_VALUE;
  if (value === SKIPPED_VALUE && !step.required) return true;
  if (isValueEmpty(value)) return false;
  // Validação específica para matrix
  if (step.type === 'matrix') {
    if (!isMatrixAnswer(value)) return false;
    // regra mínima: ao menos 1 célula preenchida
    if (!Object.values(value).some(x => x !== null && x !== undefined && x !== '')) return false;
  }
  return true;
};

const totalVisibleQuestions = (steps: StepDef[], answers: Record<string, any>) =>
  steps.filter(step => step.type !== "info" && isStepVisible(step, answers)).length;

const completedQuestions = (steps: StepDef[], answers: Record<string, any>) =>
  steps.filter(step => step.type !== "info" && isStepVisible(step, answers) && isStepAnswered(step, answers)).length;

const computeProgress = (steps: StepDef[], answers: Record<string, any>) => {
  const total = totalVisibleQuestions(steps, answers);
  if (total === 0) return 0;
  const completed = completedQuestions(steps, answers);
  return Math.round((completed / total) * 100);
};

// const questionEmojiPool = ["🌿", "🌱", "🌸", "🧘", "💚", "🩺", "🌞", "🌈", "🍃", "🪴", "🌤️", "💖", "🌟", "🥗"];

// const labelEmojiMatchers: Array<{ patterns: RegExp[]; emoji: string }> = [
//   { patterns: [/masculin/], emoji: "🧔" },
//   { patterns: [/femin/], emoji: "👩" },
//   { patterns: [/sono|dorm/i], emoji: "😴" },
//   { patterns: [/estresse|ansiedad/i], emoji: "😌" },
//   { patterns: [/atividade|exerc/i], emoji: "🏃" },
//   { patterns: [/aliment/i], emoji: "🥗" },
//   { patterns: [/dor|desconfort/i], emoji: "🤕" },
//   { patterns: [/tabag/i], emoji: "🚭" },
//   { patterns: [/gesta/i], emoji: "🤰" },
//   { patterns: [/mental|humor|emoç/i], emoji: "🧠" },
//   { patterns: [/peso|obes/i], emoji: "⚖️" },
//   { patterns: [/alcool|álcool|quím/i], emoji: "🍹" },
//   { patterns: [/sono|descanso/i], emoji: "🛌" }
// ];

// const _getEmojiForStep = (step: StepDef | undefined, fallbackIndex: number) => {
//   if (!step?.label) {
//     return questionEmojiPool[fallbackIndex % questionEmojiPool.length];
//   }
//   const normalized = step.label.toLowerCase();
//   const matcher = labelEmojiMatchers.find(({ patterns }) =>
//     patterns.some(pattern => pattern.test(normalized))
//   );
//   return matcher?.emoji ?? questionEmojiPool[fallbackIndex % questionEmojiPool.length];
// };

// const getProgressEmoji = (value: number) => {
//   if (value >= 90) return "🌳";
//   if (value >= 60) return "🌿";
//   if (value >= 30) return "🌱";
//   return "🌼";
// };

const deriveInitialValue = (step: StepDef | undefined, answers: Record<string, any>) => {
  if (!step) return "";
  const answer = answers?.[step.key];
  if (answer !== undefined) return answer;
  if (step.type === "multiselect" || step.type === "checkbox") return [];
  if (step.type === "scale" || step.type === "slider") return step.min ?? 0;
  return "";
};

const findNextIndex = (
  steps: StepDef[],
  answers: Record<string, any>,
  currentIndex: number
): number | null => {
  for (let i = currentIndex + 1; i < steps.length; i += 1) {
    const step = steps[i];
    if (step && isStepVisible(step, answers)) return i;
  }
  return null;
};

const findPrevIndex = (
  steps: StepDef[],
  answers: Record<string, any>,
  currentIndex: number
): number | null => {
  for (let i = currentIndex - 1; i >= 0; i -= 1) {
    const step = steps[i];
    if (step && isStepVisible(step, answers)) return i;
  }
  return null;
};

const findInitialIndex = (steps: StepDef[], answers: Record<string, any>) => {
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    if (!step || !isStepVisible(step, answers)) continue;
    if (step.type === "info" && isStepAnswered(step, answers)) continue;
    if (step.type === "info") return i;
    if (!isStepAnswered(step, answers)) return i;
  }
  return 0;
};

export function Runner({ triageId, flow, firstVisit, initialAnswers = {}, onComplete }: RunnerProps) {
  // const _router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  // Determinar brand baseado no slug
  const brand = useMemo(() => getBrandBySlug(flow.slug), [flow.slug]);
  const brandConfig = useMemo(() => BRAND_CONFIG[brand], [brand]);
  
  // Detectar produto ZapFarm pelo slug da triagem e obter cores específicas
  const productConfig = useMemo(() => {
    // Buscar produto pelo triageSlug
    try {
      const { ZAPFARM_PRODUCTS } = require('@/config/zapfarm/products');
      const allProducts = Object.values(ZAPFARM_PRODUCTS || {}) as Array<{ triageSlug: string; colors: { primary: string; secondary: string; gradient: string; gradientCTA: string } }>;
      return allProducts.find((p) => p.triageSlug === flow.slug) || null;
    } catch {
      return null;
    }
  }, [flow.slug]);
  
  const productColors = useMemo(() => {
    if (productConfig?.colors) {
      return getProductColorClasses(productConfig.colors);
    }
    return null;
  }, [productConfig]);
  
  // Mapeamento de cores por primary color para classes Tailwind completas
  const colorClassMap: Record<string, {
    bgGradient: string;
    progressGradient: string;
    buttonGradient: string;
    borderColor: string;
    textColor: string;
    selectedOption: string;
    optionHover: string;
    particleColor: string;
    particleGradients: string[];
    cardFrosted: string;
  }> = {
    purple: {
      bgGradient: 'bg-gradient-to-br from-purple-400 via-purple-300/90 to-indigo-400',
      particleColor: 'bg-purple-200/40',
      particleGradients: ['bg-gradient-to-br from-purple-300/70 to-orange-400/50', 'bg-gradient-to-br from-purple-400/60 to-pink-300/50', 'bg-gradient-to-br from-purple-200/60 to-indigo-300/50', 'bg-gradient-to-br from-orange-300/50 to-purple-400/40'],
      cardFrosted: 'bg-white border-purple-200/50',
      progressGradient: 'bg-gradient-to-r from-purple-500 via-purple-600 to-orange-500',
      buttonGradient: 'bg-gradient-to-r from-purple-600 via-purple-700 to-orange-600',
      borderColor: 'border-purple-200/50',
      textColor: 'text-purple-600',
      selectedOption: 'border-purple-400 bg-gradient-to-r from-purple-100 to-orange-100 text-purple-800 shadow-xl ring-4 ring-purple-200',
      optionHover: 'border-purple-200 bg-gradient-to-r from-white to-purple-50/50 text-gray-700 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-orange-50',
    },
    indigo: {
      bgGradient: 'bg-gradient-to-br from-indigo-400 via-indigo-300/90 to-blue-400',
      particleColor: 'bg-indigo-200/40',
      particleGradients: ['bg-gradient-to-br from-indigo-300/70 to-blue-400/50', 'bg-gradient-to-br from-indigo-400/60 to-purple-300/50', 'bg-gradient-to-br from-blue-300/60 to-indigo-400/50', 'bg-gradient-to-br from-indigo-200/60 to-blue-300/50'],
      cardFrosted: 'bg-white border-indigo-200/50',
      progressGradient: 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-500',
      buttonGradient: 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600',
      borderColor: 'border-indigo-200/50',
      textColor: 'text-indigo-600',
      selectedOption: 'border-indigo-400 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 shadow-xl ring-4 ring-indigo-200',
      optionHover: 'border-indigo-200 bg-gradient-to-r from-white to-indigo-50/50 text-gray-700 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50',
    },
    blue: {
      bgGradient: 'bg-gradient-to-br from-blue-400 via-blue-300/90 to-indigo-400',
      particleColor: 'bg-blue-200/40',
      particleGradients: ['bg-gradient-to-br from-blue-300/70 to-indigo-400/50', 'bg-gradient-to-br from-blue-400/60 to-cyan-300/50', 'bg-gradient-to-br from-indigo-300/60 to-blue-400/50', 'bg-gradient-to-br from-cyan-300/60 to-blue-400/50'],
      cardFrosted: 'bg-white border-blue-200/50',
      progressGradient: 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500',
      buttonGradient: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600',
      borderColor: 'border-blue-200/50',
      textColor: 'text-blue-600',
      selectedOption: 'border-blue-400 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 shadow-xl ring-4 ring-blue-200',
      optionHover: 'border-blue-200 bg-gradient-to-r from-white to-blue-50/50 text-gray-700 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50',
    },
    green: {
      bgGradient: 'bg-gradient-to-br from-green-400 via-green-300/90 to-teal-400',
      particleColor: 'bg-green-200/40',
      particleGradients: ['bg-gradient-to-br from-green-300/70 to-teal-400/50', 'bg-gradient-to-br from-emerald-400/60 to-green-300/50', 'bg-gradient-to-br from-teal-300/60 to-green-400/50', 'bg-gradient-to-br from-green-200/60 to-emerald-300/50'],
      cardFrosted: 'bg-white border-green-200/50',
      progressGradient: 'bg-gradient-to-r from-green-500 via-green-600 to-teal-500',
      buttonGradient: 'bg-gradient-to-r from-green-600 via-green-700 to-teal-600',
      borderColor: 'border-green-200/50',
      textColor: 'text-green-600',
      selectedOption: 'border-green-400 bg-gradient-to-r from-green-100 to-teal-100 text-green-800 shadow-xl ring-4 ring-green-200',
      optionHover: 'border-green-200 bg-gradient-to-r from-white to-green-50/50 text-gray-700 hover:border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50',
    },
    emerald: {
      bgGradient: 'bg-gradient-to-br from-emerald-400 via-emerald-300/90 to-green-400',
      particleColor: 'bg-emerald-200/40',
      particleGradients: ['bg-gradient-to-br from-emerald-300/70 to-green-400/50', 'bg-gradient-to-br from-emerald-400/60 to-teal-300/50', 'bg-gradient-to-br from-green-300/60 to-emerald-400/50', 'bg-gradient-to-br from-teal-300/60 to-emerald-400/50'],
      cardFrosted: 'bg-white border-emerald-200/50',
      progressGradient: 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-500',
      buttonGradient: 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600',
      borderColor: 'border-emerald-200/50',
      textColor: 'text-emerald-600',
      selectedOption: 'border-emerald-400 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 shadow-xl ring-4 ring-emerald-200',
      optionHover: 'border-emerald-200 bg-gradient-to-r from-white to-emerald-50/50 text-gray-700 hover:border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50',
    },
    amber: {
      bgGradient: 'bg-gradient-to-br from-amber-400 via-amber-300/90 to-yellow-400',
      particleColor: 'bg-amber-200/40',
      particleGradients: ['bg-gradient-to-br from-amber-300/70 to-yellow-400/50', 'bg-gradient-to-br from-amber-400/60 to-orange-300/50', 'bg-gradient-to-br from-yellow-300/60 to-amber-400/50', 'bg-gradient-to-br from-orange-300/60 to-amber-400/50'],
      cardFrosted: 'bg-white border-amber-200/50',
      progressGradient: 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500',
      buttonGradient: 'bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600',
      borderColor: 'border-amber-200/50',
      textColor: 'text-amber-600',
      selectedOption: 'border-amber-400 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 shadow-xl ring-4 ring-amber-200',
      optionHover: 'border-amber-200 bg-gradient-to-r from-white to-amber-50/50 text-gray-700 hover:border-amber-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50',
    },
    red: {
      bgGradient: 'bg-gradient-to-br from-red-400 via-red-300/90 to-rose-400',
      particleColor: 'bg-red-200/40',
      particleGradients: ['bg-gradient-to-br from-red-300/70 to-rose-400/50', 'bg-gradient-to-br from-red-400/60 to-pink-300/50', 'bg-gradient-to-br from-rose-300/60 to-red-400/50', 'bg-gradient-to-br from-pink-300/60 to-rose-400/50'],
      cardFrosted: 'bg-white border-red-200/50',
      progressGradient: 'bg-gradient-to-r from-red-500 via-red-600 to-rose-500',
      buttonGradient: 'bg-gradient-to-r from-red-600 via-red-700 to-rose-600',
      borderColor: 'border-red-200/50',
      textColor: 'text-red-600',
      selectedOption: 'border-red-400 bg-gradient-to-r from-red-100 to-rose-100 text-red-800 shadow-xl ring-4 ring-red-200',
      optionHover: 'border-red-200 bg-gradient-to-r from-white to-red-50/50 text-gray-700 hover:border-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50',
    },
    pink: {
      bgGradient: 'bg-gradient-to-br from-pink-400 via-pink-300/90 to-rose-400',
      particleColor: 'bg-pink-200/40',
      particleGradients: ['bg-gradient-to-br from-pink-300/70 to-rose-400/50', 'bg-gradient-to-br from-pink-400/60 to-red-300/50', 'bg-gradient-to-br from-rose-300/60 to-pink-400/50', 'bg-gradient-to-br from-pink-200/60 to-rose-300/50'],
      cardFrosted: 'bg-white border-pink-200/50',
      progressGradient: 'bg-gradient-to-r from-pink-500 via-pink-600 to-rose-500',
      buttonGradient: 'bg-gradient-to-r from-pink-600 via-pink-700 to-rose-600',
      borderColor: 'border-pink-200/50',
      textColor: 'text-pink-600',
      selectedOption: 'border-pink-400 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 shadow-xl ring-4 ring-pink-200',
      optionHover: 'border-pink-200 bg-gradient-to-r from-white to-pink-50/50 text-gray-700 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50',
    },
    slate: {
      bgGradient: 'bg-gradient-to-br from-slate-400 via-slate-300/90 to-gray-400',
      particleColor: 'bg-slate-200/40',
      particleGradients: ['bg-gradient-to-br from-slate-300/70 to-gray-400/50', 'bg-gradient-to-br from-slate-400/60 to-blue-300/50', 'bg-gradient-to-br from-gray-300/60 to-slate-400/50', 'bg-gradient-to-br from-slate-200/60 to-gray-300/50'],
      cardFrosted: 'bg-white border-slate-200/50',
      progressGradient: 'bg-gradient-to-r from-slate-500 via-slate-600 to-gray-500',
      buttonGradient: 'bg-gradient-to-r from-slate-600 via-slate-700 to-gray-600',
      borderColor: 'border-slate-200/50',
      textColor: 'text-slate-600',
      selectedOption: 'border-slate-400 bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 shadow-xl ring-4 ring-slate-200',
      optionHover: 'border-slate-200 bg-gradient-to-r from-white to-slate-50/50 text-gray-700 hover:border-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50',
    },
    cyan: {
      bgGradient: 'bg-gradient-to-br from-cyan-400 via-cyan-300/90 to-blue-400',
      particleColor: 'bg-cyan-200/40',
      particleGradients: ['bg-gradient-to-br from-cyan-300/70 to-blue-400/50', 'bg-gradient-to-br from-cyan-400/60 to-teal-300/50', 'bg-gradient-to-br from-blue-300/60 to-cyan-400/50', 'bg-gradient-to-br from-teal-300/60 to-cyan-400/50'],
      cardFrosted: 'bg-white border-cyan-200/50',
      progressGradient: 'bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-500',
      buttonGradient: 'bg-gradient-to-r from-cyan-600 via-cyan-700 to-blue-600',
      borderColor: 'border-cyan-200/50',
      textColor: 'text-cyan-600',
      selectedOption: 'border-cyan-400 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 shadow-xl ring-4 ring-cyan-200',
      optionHover: 'border-cyan-200 bg-gradient-to-r from-white to-cyan-50/50 text-gray-700 hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50',
    },
  };
  
  const colorClasses = useMemo(() => {
    if (productColors?.primary && colorClassMap[productColors.primary]) {
      return colorClassMap[productColors.primary];
    }
    // Fallback para brand padrão
    if (brand === 'zapfarm') {
      return colorClassMap.purple;
    }
    return {
      bgGradient: 'bg-gradient-to-br from-green-400 via-green-300/90 to-emerald-400',
      particleColor: 'bg-green-200/40',
      particleGradients: ['bg-gradient-to-br from-green-300/70 to-teal-400/50', 'bg-gradient-to-br from-emerald-400/60 to-green-300/50', 'bg-gradient-to-br from-teal-300/60 to-green-400/50', 'bg-gradient-to-br from-green-200/60 to-emerald-300/50'],
      cardFrosted: 'bg-white border-green-200/50',
      progressGradient: 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600',
      buttonGradient: 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-600',
      borderColor: 'border-green-200/50',
      textColor: 'text-green-600',
      selectedOption: 'border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-xl ring-4 ring-green-200',
      optionHover: 'border-green-200 bg-gradient-to-r from-white to-green-50/50 text-gray-700 hover:border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50',
    };
  }, [productColors, brand]);
  
  // Helper functions para classes CSS baseadas no produto específico ou brand padrão
  const getBgGradient = () => colorClasses.bgGradient;
  const getProgressGradient = () => colorClasses.progressGradient;
  const getParticleColor = () => colorClasses.particleColor;
  const getParticleGradient = (i: number) => {
    const grads = colorClasses.particleGradients ?? [colorClasses.particleColor];
    return grads[i % grads.length];
  };
  const getCardFrosted = () => colorClasses.cardFrosted;

  // Partículas nevando - 24 partículas, cores por produto
  const snowParticles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const animType = i % 3;
      const duration = 10 + Math.random() * 8;
      const initialY = -20 + Math.random() * 120;
      const progress = (initialY + 20) / 140;
      const delay = -progress * duration;
      return {
        id: i,
        animType: animType === 0 ? "triageFloat1" : animType === 1 ? "triageFloat2" : "triageFloat3",
        duration,
        delay,
        left: Math.random() * 100,
        size: 2 + Math.random() * 2.5,
        initialY,
      };
    });
  }, []);
  const getButtonGradient = () => colorClasses.buttonGradient;
  const getBorderColor = () => colorClasses.borderColor;
  const getTextColor = () => colorClasses.textColor;
  const getButtonClasses = () => colorClasses.buttonGradient;
  const getSelectedOptionClasses = () => colorClasses.selectedOption;
  const getOptionHoverClasses = () => colorClasses.optionHover;
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mergedInitial = useMemo(
    () => getStoredAnswers(triageId, initialAnswers),
    [triageId, initialAnswers]
  );

  const steps = useMemo<StepDef[]>(() => {
    // Filtrar steps removendo campos de entrada de dados (text, number, phone, textarea, date)
    // Manter apenas perguntas rápidas e fáceis: radio, select, multiselect, checkbox, scale, slider, matrix, info, select_cards
    // EXCEÇÃO: Para emagrecimento, permitir 'input' e 'number' para altura e peso (campos críticos para cálculo de IMC)
    const allowedTypes: StepDef['type'][] = [
      'radio',
      'select',
      'multiselect',
      'checkbox',
      'scale',
      'slider',
      'matrix',
      'info',
      'select_cards'
    ];
    
    // Se for emagrecimento, permitir também campos 'input' e 'number' que sejam altura ou peso
    // (convertLegacyStep converte 'input' para 'number', então precisamos permitir ambos)
    const isEmagrecimento = flow.slug === 'emagrecimento';
    const criticalFields = ['altura', 'peso'];
    
    return flow.steps.filter(step => {
      if (allowedTypes.includes(step.type)) return true;
      // Permitir number apenas para altura e peso no fluxo de emagrecimento
      // (convertLegacyStep já converte 'input' para 'number')
      if (isEmagrecimento && step.type === 'number' && step.key && criticalFields.includes(step.key)) {
        return true;
      }
      // WhatsApp final: campo texto obrigatório (P0 launch — canal oficial pós-triagem)
      if (isEmagrecimento && step.type === 'text' && step.key === 'whatsapp') {
        return true;
      }
      return false;
    });

  }, [flow.steps, flow.slug]);
  const [answers, setAnswers] = useState<Record<string, any>>(mergedInitial);
  const [index, setIndex] = useState(() => findInitialIndex(steps, mergedInitial));
  const [localValue, setLocalValue] = useState<any>(() =>
    deriveInitialValue(steps[index], mergedInitial)
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(() => computeProgress(steps, mergedInitial));
  const [flowCompleted, setFlowCompleted] = useState(false);
  const [finalizeStatus, setFinalizeStatus] = useState<RunnerCompletionStatus | "idle">("idle");
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [collectingProfileData, setCollectingProfileData] = useState(false);
  const pendingFlushRef = useRef(false);
  const finalizeInFlightRef = useRef(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startPollingForReportRef = useRef<() => void>(() => {});

  // Verificar se precisa coletar dados do perfil
  const needsProfileData = useMemo(() => {
    const hasName = answers.name && typeof answers.name === 'string' && answers.name.trim().length > 0;
    const hasWhatsapp = answers.whatsapp && typeof answers.whatsapp === 'string' && answers.whatsapp.trim().length > 0;
    const hasEmail = answers.email && typeof answers.email === 'string' && answers.email.trim().length > 0;
    // Suportar tanto 'weight'/'height' quanto 'peso'/'altura' (formulário emagrecimento usa português)
    const hasWeight = (answers.weight !== undefined && answers.weight !== null && answers.weight !== "__skipped__") ||
                      (answers.peso !== undefined && answers.peso !== null && answers.peso !== "__skipped__");
    const hasHeight = (answers.height !== undefined && answers.height !== null && answers.height !== "__skipped__") ||
                      (answers.altura !== undefined && answers.altura !== null && answers.altura !== "__skipped__");
    const hasAge = answers.age !== undefined && answers.age !== null && answers.age !== "__skipped__";
    
    // Se não tiver todos os dados necessários, precisa coletar
    return !(hasName && hasWhatsapp && hasEmail && hasWeight && hasHeight && hasAge);
  }, [answers]);

  const retryWithBackoff = useCallback(
    async <T,>(operation: () => Promise<T>, maxRetries = 2, baseDelayMs = 1000): Promise<T> => { // Reduced retries and increased delay
      let lastError: unknown = null;
      for (let attempt = 0; attempt < maxRetries; attempt += 1) {
        try {
          return await operation();
        } catch (error) {
          lastError = error;
          if (attempt === maxRetries - 1) break;
          const delay = baseDelayMs * 2 ** attempt;
          console.log(`[Runner] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      throw lastError instanceof Error ? lastError : new Error("Operação falhou após múltiplas tentativas.");
    },
    []
  );

  // const _redirectToReport = useCallback(
  //   async (reportId: string) => {
  //     const destination = `/relatorio/${reportId}`;
  //     try {
  //       await router.push(destination);
  //       return;
  //     } catch (error) {
  //       console.warn("router.push falhou, tentando window.location.assign", error);
  //     }
  //     try {
  //       window.location.assign(destination);
  //       return;
  //     } catch (error) {
  //       console.warn("window.location.assign falhou, tentando window.location.replace", error);
  //     }
  //     try {
  //       window.location.replace(destination);
  //     } catch (error) {
  //       console.warn("window.location.replace também falhou.", error);
  //     }
  //   },
  //   [router]
  // );

  const current = steps[index];
  const visibleQuestions = totalVisibleQuestions(steps, answers) || 1;
  const questionPosition = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= index; i += 1) {
      const step = steps[i];
      if (!step || step.type === "info") continue;
      if (!isStepVisible(step, answers)) continue;
      count += 1;
    }
    return count === 0 ? 1 : count;
  }, [steps, index, answers]);

  useEffect(() => {
    storeAnswers(triageId, answers);
  }, [triageId, answers]);

  useEffect(() => {
    setLocalValue(deriveInitialValue(steps[index], answers));
    setErrorMessage(null);
    setSubmitting(false); // Reset submitting sempre que mudar de pergunta
  }, [index, steps, answers]);

  useEffect(() => {
    setProgress(computeProgress(steps, answers));
  }, [answers, steps]);

  const clearCachedProgress = useCallback(() => {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(localKey(triageId));
      window.localStorage.removeItem(pendingKey(triageId));
    } catch {
      /* ignore */
    }
  }, [triageId]);

  const openSummary = useCallback(() => {
    if (!isBrowser) return;
    window.location.href = `/triagem/${flow.slug}/resumo?triageId=${triageId}`;
  }, [flow.slug, triageId]);

  useEffect(() => {
    if (!isBrowser) return;
    const handleOnline = () => {
      if (!pendingFlushRef.current) {
        void flushPendingQueue();
      }
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          body: JSON.stringify(item)
        });
        if (!response.ok) throw new Error("failed");
      } catch {
        remaining.push(item);
      }
    }
    writePending(triageId, remaining);
    pendingFlushRef.current = false;
  }, [triageId]);

  const finalizeTriage = useCallback(
    async (options: { force?: boolean } = {}) => {
      if (finalizeInFlightRef.current && !options.force) return;
      finalizeInFlightRef.current = true;
      setFinalizeStatus("running");
      setFinalizeError(null);

      try {
        await flushPendingQueue();
        console.log(`[Runner] Finalizing triageId: ${triageId}`);
        const response = await retryWithBackoff(async () => {
          const controller =
            typeof AbortController !== "undefined" ? new AbortController() : undefined;
          const timeoutId =
            typeof setTimeout === "function" && controller
              ? setTimeout(() => controller.abort(), 60_000)
              : null;

          try {
            // Em modo mock (sem Supabase), enviar dados completos para o servidor poder gerar relatório
            const body: { triageId: string; triageSlug?: string; answers?: Record<string, any> } = { 
              triageId 
            };
            
            // Adicionar triageSlug se disponível
            if (flow?.slug) {
              body.triageSlug = flow.slug;
            }
            
            // Em desenvolvimento, enviar respostas completas para modo mock usar dados reais
            // Usar answers do estado atual
            if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
              // Garantir que temos as respostas mais recentes
              body.answers = answers;
            }
            
            const requestInit: RequestInit = {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "X-Idempotency-Key": triageId
              },
              body: JSON.stringify(body),
              ...(controller?.signal ? { signal: controller.signal } : {})
            };
            const result = await fetch("/api/triage/finalize", requestInit);
            if (result.status >= 500) {
              throw new Error(result.statusText || "Falha temporária ao finalizar triagem.");
            }
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

        console.log("Runner: Resposta da API finalize:", { payload, responseOk: response.ok });

        if (!response.ok) {
          const message =
            typeof payload?.error === "string" ? payload.error : "Falha ao finalizar triagem.";
          throw new Error(message);
        }

        // Tratar diferentes tipos de resposta
        if (payload?.ok && payload?.redirect) {
          // Relatório já está pronto, redirecionar imediatamente
          setFinalizeStatus("completed");
          clearCachedProgress();
          console.log(`[Runner] Redirecting to: ${payload.redirect}`);
          if (typeof window !== "undefined") {
            window.location.href = payload.redirect;
          }
          if (onComplete) {
            await onComplete({
              triageId,
              status: "completed",
              reportId: triageId
            });
          }
        } else if (payload?.ok && payload?.status === 'running') {
          // Relatório está sendo gerado, iniciar polling
          console.log(`[Runner] Report is being generated, starting polling for triageId: ${triageId}`);
          setFinalizeStatus("running");
          if (onComplete) {
            await onComplete({
              triageId,
              status: "running",
              reportId: null
            });
          }
          // Iniciar polling para verificar quando o relatório estiver pronto
          startPollingForReportRef.current();
        } else {
          throw new Error("Resposta inválida da API de finalização");
        }
      } catch (error) {
        const fallbackMessage = "Não foi possível finalizar a triagem automaticamente. Tente novamente em instantes.";
        const message =
          error instanceof Error && error.message && !/aborted/i.test(error.message)
            ? error.message
            : fallbackMessage;
        setFinalizeStatus("failed");
        setFinalizeError(message);
        if (onComplete) {
          await onComplete({ triageId, status: "failed", error: message });
        }
      } finally {
        finalizeInFlightRef.current = false;
      }
    },
    [clearCachedProgress, flushPendingQueue, onComplete, retryWithBackoff, triageId, flow, answers]
  );

  const retryFinalize = useCallback(() => {
    void finalizeTriage({ force: true });
  }, [finalizeTriage]);

  // Função para fazer polling e verificar quando o relatório está pronto
  const startPollingForReport = useCallback(() => {
    // Limpar qualquer polling anterior
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    let attempts = 0;
    const maxAttempts = 60; // 60 tentativas = 5 minutos (5s * 60)
    const pollInterval = 5000; // 5 segundos

    const poll = async () => {
      attempts++;
      
      if (attempts > maxAttempts) {
        console.error(`[Runner] Polling timeout after ${maxAttempts} attempts`);
        setFinalizeStatus("failed");
        setFinalizeError("O relatório está demorando mais que o esperado. Por favor, tente novamente.");
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        return;
      }

      try {
        console.log(`[Runner] Polling attempt ${attempts} for triageId: ${triageId}`);
        const response = await fetch("/api/triage/finalize", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-Idempotency-Key": triageId
          },
          body: JSON.stringify({ 
            triageId,
            triageSlug: flow.slug
          }),
        });

        if (!response.ok) {
          console.warn(`[Runner] Polling failed with status ${response.status}`);
          return; // Continuar polling
        }

        const payload = await response.json();
        
        console.log(`[Runner] Polling response (attempt ${attempts}/${maxAttempts}):`, { 
          ok: payload?.ok, 
          status: payload?.status, 
          redirect: payload?.redirect ? 'present' : 'missing',
          error: payload?.error 
        });
        
        if (payload?.ok && payload?.redirect) {
          // Relatório está pronto!
          console.log(`[Runner] ✅ Report ready! Redirecting to: ${payload.redirect}`);
          setFinalizeStatus("completed");
          clearCachedProgress();
          
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          
          if (typeof window !== "undefined") {
            window.location.href = payload.redirect;
          }
          
          if (onComplete) {
            await onComplete({
              triageId,
              status: "completed",
              reportId: triageId
            });
          }
          return; // Parar polling
        } else if (payload?.ok && payload?.status === 'running') {
          // Ainda processando, continuar polling
          console.log(`[Runner] ⏳ Report still running, continuing poll... (attempt ${attempts}/${maxAttempts})`);
        } else if (payload?.ok === false || payload?.error || payload?.status === 'failed') {
          // Erro na geração do relatório
          console.error(`[Runner] ❌ Report generation failed:`, payload?.error || payload);
          setFinalizeStatus("failed");
          setFinalizeError(payload?.error || "Erro ao gerar relatório. Por favor, tente novamente.");
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          return; // Parar polling
        } else {
          // Status desconhecido - logar para debug mas continuar polling
          console.warn(`[Runner] ⚠️ Unexpected polling response (attempt ${attempts}):`, payload);
          // Continuar polling para dar mais uma chance (pode ser transição de estado)
        }
      } catch (error) {
        console.warn(`[Runner] Polling error:`, error);
        // Continuar polling mesmo em caso de erro de rede
      }
    };

    // Iniciar polling imediatamente e depois a cada intervalo
    void poll();
    pollingIntervalRef.current = setInterval(poll, pollInterval) as unknown as ReturnType<typeof setInterval>;
  }, [triageId, flow.slug, onComplete, clearCachedProgress]);

  // Atualizar ref quando a função mudar
  useEffect(() => {
    startPollingForReportRef.current = startPollingForReport;
  }, [startPollingForReport]);

  // Limpar polling ao desmontar
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    void flushPendingQueue();
  }, [flushPendingQueue]);

  const advanceTo = useCallback(
    (nextIndex: number | null) => {
      if (nextIndex === null) {
        if (!flowCompleted) {
          // Verificar se precisa coletar dados do perfil antes de finalizar
          if (needsProfileData && !collectingProfileData) {
            setCollectingProfileData(true);
            return;
          }
          setFlowCompleted(true);
          void finalizeTriage();
        }
        return;
      }
      // Atualiza índice para triggerar animação de transição
      setIndex(nextIndex);
    },
    [finalizeTriage, flowCompleted, needsProfileData, collectingProfileData]
  );

  const persistAnswer = useCallback(
    async (step: StepDef, value: any) => {
      const safe = normalizeAnswerValue(value);
      let updatedAnswers = { ...answers, [step.key]: safe };
      
      // Limpar respostas dependentes se o campo que mudou é um campo condicionante
      updatedAnswers = clearDependentAnswers(steps, updatedAnswers, step.key);
      
      setAnswers(updatedAnswers);
      storeAnswers(triageId, updatedAnswers);

      const nextProgress = computeProgress(steps, updatedAnswers);
      setProgress(nextProgress);

      const payload: PendingPayload = {
        triageId,
        stepKey: step.key,
        value: safe,
        progress: nextProgress,
        answeredAt: new Date().toISOString()
      };

      try {
        const response = await fetch("/api/triage/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to persist");
        await flushPendingQueue();
      } catch {
        enqueuePending(triageId, payload);
      }
    },
    [answers, flushPendingQueue, steps, triageId]
  );

  // Salvar dados do perfil coletados
  const saveProfileData = useCallback(
    async (profileData: {
      name: string;
      whatsapp: string;
      email: string;
      weight: number;
      height: number;
      age: number;
    }) => {
      setSubmitting(true);
      setErrorMessage(null);

      try {
        // Calcular data de nascimento a partir da idade (aproximada)
        const today = new Date();
        const birthYear = today.getFullYear() - profileData.age;
        const birthDate = new Date(birthYear, today.getMonth(), today.getDate()).toISOString().split('T')[0];

        // Salvar cada campo como resposta da triagem (para que sejam incluídos no profile_snapshot)
        const profileAnswers = {
          name: profileData.name,
          whatsapp: profileData.whatsapp,
          email: profileData.email,
          weight: profileData.weight,
          height: profileData.height,
          age: profileData.age,
          dob: birthDate // Data de nascimento calculada
        };

        // Atualizar respostas locais primeiro
        const updatedAnswers = { ...answers, ...profileAnswers };
        setAnswers(updatedAnswers);
        storeAnswers(triageId, updatedAnswers);

        // Salvar todas as respostas do perfil sequencialmente
        const currentProgress = Math.min(100, Math.max(progress, computeProgress(steps, updatedAnswers)));
        
        for (const [key, value] of Object.entries(profileAnswers)) {
          const payload: PendingPayload = {
            triageId,
            stepKey: key,
            value: value,
            progress: currentProgress,
            answeredAt: new Date().toISOString()
          };

          try {
            const response = await fetch("/api/triage/answer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || "Failed to persist");
            }
          } catch (err) {
            enqueuePending(triageId, payload);
            // Continuar mesmo se uma falhar
            console.warn(`[Runner] Failed to save ${key}, queued for retry`);
          }
        }

        // Aguardar um pouco para garantir que todas as respostas foram salvas
        await flushPendingQueue();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Finalizar triagem
        setCollectingProfileData(false);
        setFlowCompleted(true);
        void finalizeTriage();
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Não foi possível salvar os dados do perfil.");
        setSubmitting(false);
      }
    },
    [answers, triageId, flushPendingQueue, progress, steps]
  );

  const handleSubmit = useCallback(async () => {
    if (!current) return;
    if (!isStepVisible(current, answers)) {
      advanceTo(findNextIndex(steps, answers, index));
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const rawValue = localValue;
      const parsedValue = current.parse ? current.parse(rawValue) : rawValue;
      const valueForValidation = parsedValue ?? rawValue;

      // Validação específica para consentimento (aceita_termos)
      if (current.key === 'aceita_termos') {
        const aceito = valueForValidation === 'aceito';
        
        if (!aceito) {
          setErrorMessage("Por favor, aceite os termos para continuar. É necessário para sua segurança e conformidade legal.");
          setSubmitting(false);
          return;
        }
      }

      if (current.required && isValueEmpty(valueForValidation)) {
        throw new Error("Campo obrigatório.");
      }

      const validationError = current.validate?.(valueForValidation);
      if (validationError) throw new Error(validationError);

      const finalValue = isValueEmpty(valueForValidation) && !current.required ? SKIPPED_VALUE : valueForValidation;
      await persistAnswer(current, finalValue ?? null);
      const nextIndex = findNextIndex(steps, { ...answers, [current.key]: finalValue }, index);
      // Animação suave antes de avançar
      await new Promise(resolve => setTimeout(resolve, 150));
      advanceTo(nextIndex);
    } catch (err) {
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage("Não foi possível salvar esta resposta.");
      setSubmitting(false);
    }
  }, [advanceTo, answers, current, index, localValue, persistAnswer, steps]);

  const handleInfoContinue = useCallback(async () => {
    if (!current) return;
    await persistAnswer(current, SEEN_VALUE);
    const nextIndex = findNextIndex(steps, { ...answers, [current.key]: SEEN_VALUE }, index);
    // Animação suave antes de avançar
    await new Promise(resolve => setTimeout(resolve, 150));
    advanceTo(nextIndex);
  }, [advanceTo, answers, current, index, persistAnswer, steps]);

  const handleSkip = useCallback(async () => {
    if (!current || current.required) return;
    await persistAnswer(current, SKIPPED_VALUE);
    const nextIndex = findNextIndex(steps, { ...answers, [current.key]: SKIPPED_VALUE }, index);
    // Animação suave antes de avançar
    await new Promise(resolve => setTimeout(resolve, 150));
    advanceTo(nextIndex);
  }, [advanceTo, answers, current, index, persistAnswer, steps]);

  const handleBack = useCallback(() => {
    const prevIndex = findPrevIndex(steps, answers, index);
    if (prevIndex === null) return;
    setIndex(prevIndex);
  }, [answers, index, steps]);

  const renderOptions = (step: StepDef) => {
    if (!step.options) return null;
    const isMulti = step.multi || step.type === "multiselect" || step.type === "checkbox";
    const selected = isArray(localValue) ? localValue : [localValue];

    const toggleValue = (val: string) => {
      if (!isMulti) {
        setLocalValue(val);
        void (async () => {
          setSubmitting(true);
          setErrorMessage(null);
          try {
            await persistAnswer(step, val);
            const nextIndex = findNextIndex(steps, { ...answers, [step.key]: val }, index);
            // Animação suave antes de avançar
            await new Promise(resolve => setTimeout(resolve, 150));
            advanceTo(nextIndex);
            // Reset submitting após avançar (com pequeno delay para não interferir na animação)
            setTimeout(() => setSubmitting(false), 100);
          } catch (err) {
            if (err instanceof Error) setErrorMessage(err.message);
            else setErrorMessage("Não foi possível salvar esta resposta.");
            setSubmitting(false);
          }
        })();
        return;
      }

      const normalized = isArray(localValue) ? [...localValue] : [];
      if (normalized.includes(val)) {
        setLocalValue(normalized.filter(item => item !== val));
      } else {
        normalized.push(val);
        setLocalValue(normalized);
      }
    };

    // Layout especial para comorbidades: grid 2 colunas, compacto, sem emojis
    const isComorbidadesStep = step.key === 'comorbidades';
    const isCompactMode = isMulti && step.options && step.options.length > 6;
    
    return (
      <div className={cn(
        "mt-2 sm:mt-3",
        isComorbidadesStep ? "space-y-1" : isCompactMode ? "space-y-1" : "space-y-1.5 sm:space-y-2"
      )}>
        {isComorbidadesStep ? (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {step.options.map((option, index) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "rounded-lg border-2 px-2 py-1.5 text-left transition-all duration-200",
                    "flex items-center shadow-sm",
                    isSelected
                      ? getSelectedOptionClasses()
                      : getOptionHoverClasses()
                  )}
                  onClick={() => toggleValue(option.value)}
                  disabled={submitting}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs font-medium block leading-tight truncate">{option.label}</span>
                  </div>
                  {isSelected && (
                    <span className={cn("text-xs sm:text-sm flex-shrink-0 ml-1", brand === 'zapfarm' ? 'text-purple-600' : 'text-green-600')}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <>
            {step.options.map((option, index) => {
              const isSelected = selected.includes(option.value);
              // Sistema inteligente de emojis baseado no contexto da pergunta - OTIMIZADO PARA EMAGRECIMENTO
              const getContextualEmoji = (option: any, step: any, index: number) => {
            const label = option.label.toLowerCase();
            const value = option.value.toLowerCase();
            const stepLabel = step?.label?.toLowerCase() || '';
            const stepKey = step?.key?.toLowerCase() || '';
            
            // IMPACTO NA VIDA - VERIFICAÇÃO PRIORITÁRIA (antes de tudo)
            if (stepKey === 'impacto_vida' || stepKey.includes('impacto') || stepLabel.includes('limita') || stepLabel.includes('impacto')) {
              // Busca direta por valor (mais confiável e rápido) - SEMPRE retorna um emoji
              if (value === 'muito') return '😰';           // Rostinho preocupado/ansioso - dificulta bastante
              if (value === 'moderado') return '😕';       // Rostinho levemente triste - dificulta um pouco
              if (value === 'pouco') return '🙂';          // Rostinho neutro/ok - dificulta ocasionalmente
              if (value === 'nenhum') return '😄';        // Rostinho feliz - não dificulta
              
              // Busca por palavras-chave no label (fallback)
              const labelLower = label.toLowerCase();
              if (labelLower.includes('muito') || labelLower.includes('bastante')) return '😰';
              if (labelLower.includes('moderado') || labelLower.includes('um pouco')) return '😕';
              if (labelLower.includes('pouco') || labelLower.includes('ocasionalmente')) return '🙂';
              if (labelLower.includes('nenhum') || labelLower.includes('não dificulta') || labelLower.includes('nao dificulta')) return '😄';
              
              // Se chegou aqui e é step de impacto, retorna emoji padrão (não null!)
              return '💭';
            }
            
            // Emojis específicos para fluxo de emagrecimento
            // Idade/Faixa etária - EMOJIS OTIMIZADOS COM CONTEXTO
            if (stepKey.includes('idade') || stepLabel.includes('faixa etária') || stepLabel.includes('idade')) {
              const ageMap: Record<string, string> = {
                '18-30': '🎂',      // Bolo de aniversário - juventude
                '31-45': '💼',      // Maleta profissional - fase produtiva
                '46-60': '🌟',      // Estrela - maturidade brilhante
                '61+': '👑'         // Coroa - sabedoria e experiência
              };
              // Busca direta por valor primeiro
              if (ageMap[value]) return ageMap[value];
              // Busca por range no label
              if (label.includes('18') || label.includes('30')) return '🎂';
              if (label.includes('31') || label.includes('45')) return '💼';
              if (label.includes('46') || label.includes('60')) return '🌟';
              if (label.includes('61') || label.includes('mais')) return '👑';
              return ageMap[value] || ageMap[label] || '🎂';
            }
            
            // Sexo/Gênero
            if (stepKey.includes('sexo') || stepLabel.includes('gênero') || stepLabel.includes('sexo')) {
              const genderMap: Record<string, string> = {
                'masculino': '👨',
                'feminino': '👩',
                'outro': '🧑',
                'nao binario': '🌈',
                'não binário': '🌈',
                'não-binário': '🌈',
                'prefiro não dizer': '🤫',
                'prefiro nao dizer': '🤫'
              };
              return genderMap[label] || genderMap[value] || '👤';
            }
            
            // Gravidez
            if (stepKey.includes('gestacao') || stepKey.includes('gravidez') || stepLabel.includes('grávida') || stepLabel.includes('engravidar')) {
              const pregnancyMap: Record<string, string> = {
                'sim': '🤰',
                'não': '❌',
                'nao': '❌',
                'planejando': '👶'
              };
              return pregnancyMap[label] || pregnancyMap[value] || '🤰';
            }
            
            // Altura
            if (stepKey.includes('altura') || stepLabel.includes('altura')) {
              return '📏';
            }
            
            // Peso
            if (stepKey.includes('peso') || stepLabel.includes('peso')) {
              return '⚖️';
            }
            
            // Comorbidades - SEM EMOJIS para este step específico
            if (stepKey.includes('comorbidades') || stepLabel.includes('condições') || stepLabel.includes('comorbidades')) {
              // Retorna null para não mostrar emojis neste step
              return null;
            }
            
            // Contraindicações
            if (stepKey.includes('contraindicacoes') || stepLabel.includes('contraindicação')) {
              const contraindicationMap: Record<string, string> = {
                'pancreatite': '⚠️',
                'neoplasia': '🔬',
                'men2': '🔬',
                'câncer': '🔬',
                'cancer': '🔬',
                'tireoide': '🦋',
                'renal': '🫘',
                'insuficiência': '🫘',
                'alergia': '🚫',
                'nenhuma': '✅'
              };
              const found = Object.keys(contraindicationMap).find(key => label.includes(key) || value.includes(key));
              return found ? contraindicationMap[found] : '🚫';
            }
            
            // Objetivo principal
            if (stepKey.includes('objetivo') || stepLabel.includes('objetivo')) {
              const goalMap: Record<string, string> = {
                'perder peso': '🎯',
                'peso': '🎯',
                'saúde metabólica': '💚',
                'metabólica': '💚',
                'glicemia': '💚',
                'pressão': '❤️',
                'colesterol': '🧪',
                'ambos': '🌟',
                'outro': '💡'
              };
              const found = Object.keys(goalMap).find(key => label.includes(key) || value.includes(key));
              return found ? goalMap[found] : '🎯';
            }
            // Emojis para frequência de exercícios (mantido para outros fluxos)
            if (stepLabel.includes('exercício') || stepLabel.includes('atividade')) {
              const exerciseMap: Record<string, string> = {
                'diariamente': '🏃‍♂️',
                'todos os dias': '🏃‍♂️',
                'semanalmente': '🚶‍♀️',
                'raramente': '😴',
                'nunca': '🚫'
              };
              return exerciseMap[label] || exerciseMap[value] || '🏃';
            }
            // Emojis para alimentação
            if (stepLabel.includes('alimentação') || stepLabel.includes('dieta')) {
              const foodMap: Record<string, string> = {
                'muito saudável': '🥗',
                'saudável': '🥕',
                'regular': '🍽️',
                'pouco saudável': '🍔',
                'muito pouco saudável': '🍟'
              };
              return foodMap[label] || foodMap[value] || '🍎';
            }
            // Emojis para estresse
            if (stepLabel.includes('estresse') || stepLabel.includes('ansiedade')) {
              const stressMap: Record<string, string> = {
                'muito baixo': '😌',
                'baixo': '😊',
                'moderado': '😐',
                'alto': '😰',
                'muito alto': '😱'
              };
              return stressMap[label] || stressMap[value] || '🧘';
            }
            // Emojis para dor/desconforto
            if (stepLabel.includes('dor') || stepLabel.includes('desconforto')) {
              const painMap: Record<string, string> = {
                'nenhuma': '😌',
                'leve': '😐',
                'moderada': '😣',
                'intensa': '😰',
                'muito intensa': '😱'
              };
              return painMap[label] || painMap[value] || '🤕';
            }
            // Emojis para saúde gastrointestinal
            if (stepLabel.includes('gastrointestinal') || stepLabel.includes('digestivo') || stepLabel.includes('intestino')) {
              const gastroMap: Record<string, string> = {
                'menos de 2 semanas': '🕐',
                '2 a 8 semanas': '📅',
                '2 a 6 meses': '📆',
                'mais de 6 meses': '🗓️',
                'agudo': '⚡',
                'crônico': '🔄',
                'leve': '😌',
                'moderado': '😐',
                'intenso': '😰'
              };
              return gastroMap[label] || gastroMap[value] || '🩺';
            }
            // Emojis para tempo/duração
            if (stepLabel.includes('tempo') || stepLabel.includes('duração') || stepLabel.includes('quanto tempo')) {
              const timeMap: Record<string, string> = {
                'menos de': '🕐',
                'mais de': '🗓️',
                'semanas': '📅',
                'meses': '📆',
                'anos': '🗓️',
                'dias': '📅'
              };
              return timeMap[label] || timeMap[value] || '⏰';
            }
            // Emojis para intensidade/severidade
            if (stepLabel.includes('intensidade') || stepLabel.includes('severidade') || stepLabel.includes('nível')) {
              const intensityMap: Record<string, string> = {
                'nenhuma': '😌',
                'leve': '😊',
                'moderada': '😐',
                'intensa': '😰',
                'muito intensa': '😱',
                'baixa': '😊',
                'alta': '😰'
              };
              return intensityMap[label] || intensityMap[value] || '📊';
            }
            // Emojis para sono
            if (stepLabel.includes('sono') || stepLabel.includes('dormir')) {
              const sleepMap: Record<string, string> = {
                'excelente': '😴',
                'bom': '😊',
                'regular': '😐',
                'ruim': '😰',
                'muito ruim': '😱'
              };
              return sleepMap[label] || sleepMap[value] || '🛌';
            }
            // Sistema 50/50 inteligente: baseado no tipo de pergunta
            const questionTypes = ['gênero', 'sexo', 'exercício', 'atividade', 'alimentação', 'dieta', 'estresse', 'ansiedade', 'dor', 'desconforto', 'sono', 'dormir', 'gastrointestinal', 'digestivo', 'tempo', 'duração', 'intensidade', 'severidade'];
            const hasSpecificEmojis = questionTypes.some(type => stepLabel.includes(type));
            // Se não tem emojis específicos, usa sistema 50/50
            if (!hasSpecificEmojis) {
              const shouldHaveEmoji = (step?.key?.charCodeAt(0) || 0) % 2 === 0;
              if (!shouldHaveEmoji) {
                return null; // Sem emoji para esta pergunta
              }
            }
            // Emojis genéricos elegantes (não bolinhas)
            const elegantEmojis = ['✨', '💫', '🌟', '⭐', '🔸', '🔹', '▪️', '▫️'];
            return elegantEmojis[index % elegantEmojis.length];
          };
          const emoji = getContextualEmoji(option, step, index);
          return (
            <button
              key={option.value}
              type="button"
              className={cn(
                "w-full rounded-lg sm:rounded-xl border-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left transition-all duration-300",
                "flex items-center shadow-sm overflow-hidden",
                emoji ? "gap-1.5 sm:gap-2" : "gap-0",
                isSelected
                  ? getSelectedOptionClasses()
                  : getOptionHoverClasses()
              )}
              onClick={() => toggleValue(option.value)}
              disabled={submitting}
            >
              {emoji && <span className="text-base sm:text-lg flex-shrink-0">{emoji}</span>}
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-semibold block leading-tight">{option.label}</span>
                {option.helper && <span className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 block leading-snug">{option.helper}</span>}
              </div>
              {isSelected && (
                <span className={cn("text-sm sm:text-base flex-shrink-0 ml-1.5", brand === 'zapfarm' ? 'text-purple-600' : 'text-green-600')}>✓</span>
              )}
            </button>
          );
        })}
          </>
        )}
        {isMulti && (
          <div className={cn("flex justify-end", isComorbidadesStep ? "mt-1.5" : "mt-2")}>
            <RefinedButton
              type="button"
              variant="primary"
              size={isComorbidadesStep ? "sm" : "md"}
              onClick={handleSubmit}
              loading={submitting}
              disabled={submitting || (step.required && isValueEmpty(localValue))}
              className={cn(getButtonClasses(), "shadow-lg")}
            >
              {submitting ? "Salvando..." : "Continuar"}
            </RefinedButton>
          </div>
        )}
      </div>
    );
  };

  const renderInput = () => {
    if (!current) return null;
    if (!isStepVisible(current, answers)) return null;

    if (current.type === "info") {
      const infoGradient = brand === 'zapfarm' 
        ? 'bg-gradient-to-br from-purple-50 via-white to-orange-50'
        : 'bg-gradient-to-br from-green-50 to-emerald-50';
      const infoBorder = brand === 'zapfarm'
        ? 'border-purple-200'
        : 'border-green-200';
      const tagBg = brand === 'zapfarm'
        ? 'bg-purple-100 text-purple-700'
        : 'bg-green-100 text-green-700';
      const illustrationVariant = getIllustrationVariant(flow.slug, current.key);
      const hasIllustration = illustrationVariant !== null;

      return (
        <div className="mt-2 sm:mt-4 md:mt-6 space-y-3 sm:space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 shadow-xl",
              infoGradient,
              infoBorder,
              hasIllustration && "flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start"
            )}
          >
            <div className={cn("flex-1", hasIllustration && "min-w-0")}>
            {current.highlightTag && (
                <div className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3", tagBg)}>
                {current.highlightTag}
              </div>
            )}
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2 mb-1 sm:mb-2">
                {current.icon && <span className="text-base sm:text-lg">{current.icon}</span>}
              {current.label}
            </h2>
            {current.description && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-2 sm:mb-3 leading-snug">
                {current.description}
              </p>
            )}
            {current.bullets && current.bullets.length > 0 && (
                <ul className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                {current.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                      <span className={cn("mt-0.5 flex-shrink-0 text-xs sm:text-sm", getTextColor())}>✓</span>
                      <span className="leading-snug">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
              {current.helper && <p className="mt-2 text-xs sm:text-sm text-gray-500">{current.helper}</p>}
            </div>
            {hasIllustration && (
              <div className="flex justify-center items-center w-full sm:w-auto sm:flex-shrink-0">
                <TriageStepIllustration variant={illustrationVariant} brand={brand} />
              </div>
            )}
          </motion.div>
          <div className="flex justify-end">
            <button
              type="button"
              className={cn("rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-lg transition hover:shadow-xl flex items-center gap-1.5", getButtonClasses())}
              onClick={handleInfoContinue}
            >
              ➡️ Continuar
            </button>
          </div>
        </div>
      );
    }

    if (current.type === "select_cards") {
      const selectedValue = localValue as string | undefined;
      // Layout compacto otimizado para não precisar scroll
      return (
        <div className="mt-1 sm:mt-1.5 space-y-1 sm:space-y-1.5">
          {/* HelperText removido daqui - será renderizado no JSX principal para evitar duplicação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2">
            {current.cardOptions?.map((option) => {
              const isSelected = selectedValue === option.value;
              const isRecommended = option.badge?.includes('potência') || option.badge?.includes('Maior');
              return (
                <motion.button
                  key={option.value}
                  type="button"
                  layout
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={async () => {
                    setLocalValue(option.value);
                    setErrorMessage(null);
                    // Avançar automaticamente após selecionar
                    setSubmitting(true);
                    try {
                      await persistAnswer(current, option.value);
                      const nextIndex = findNextIndex(steps, { ...answers, [current.key]: option.value }, index);
                      // Animação suave antes de avançar
                      await new Promise(resolve => setTimeout(resolve, 150));
                      advanceTo(nextIndex);
                      // Reset submitting após avançar (com pequeno delay para não interferir na animação)
                      setTimeout(() => setSubmitting(false), 100);
                    } catch (err) {
                      if (err instanceof Error) setErrorMessage(err.message);
                      else setErrorMessage("Não foi possível salvar esta resposta.");
                      setSubmitting(false);
                    }
                  }}
                  className={cn(
                    "relative rounded-lg p-2 sm:p-2.5 border-2 text-left transition-all duration-300",
                    isSelected
                      ? getSelectedOptionClasses()
                      : isRecommended
                      ? brand === 'zapfarm'
                        ? "border-purple-300 bg-white hover:border-purple-400 hover:shadow-md"
                        : "border-green-300 bg-white hover:border-green-400 hover:shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  )}
                >
                  {option.badge && (
                    <div className={cn(
                      "inline-block px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold mb-1",
                      isRecommended
                        ? brand === 'zapfarm'
                          ? "bg-purple-600 text-white"
                          : "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    )}>
                      {option.badge}
                    </div>
                  )}
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5 leading-tight">
                    {option.title}
                  </h3>
                  {option.subtitle && (
                    <p className="text-[9px] sm:text-[10px] text-gray-600 mb-1 leading-tight">
                      {option.subtitle}
                    </p>
                  )}
                  {option.priceHint && (
                    <p className="text-[9px] sm:text-[10px] font-semibold text-gray-700 mt-1 pt-1 border-t border-gray-200 leading-tight">
                      {option.priceHint}
                    </p>
                  )}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                      <div className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center",
                        brand === 'zapfarm' ? "bg-purple-600" : "bg-green-600"
                      )}>
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
          {/* EvidenceNote removido daqui - será renderizado no JSX principal para evitar duplicação */}
        </div>
      );
    }

    switch (current.type) {
      case "text":
      case "phone":
      case "textarea":
      case "number": {
        // Nota: 'input' do formulário já foi convertido para 'number' pelo convertLegacyStep
        const inputMode =
          current.type === "phone" ? "tel" : current.type === "number" ? "decimal" : "text";
        const phonePattern = current.type === "phone" ? "[0-9\\s()\\+\\-]+" : undefined;
        const inputProps = {
          value: typeof localValue === "string" ? localValue : localValue ?? "",
          onChange: (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const safe = normalizeAnswerValue(evt.target.value);
            setLocalValue(safe);
          },
          disabled: submitting,
          placeholder: current.placeholder,
          autoFocus: true
        };

        return (
          <div className="mt-10 space-y-8">
            {current.type === "textarea" ? (
              <textarea
                {...inputProps}
                rows={4}
                inputMode={inputMode}
                className="w-full rounded-2xl bg-gradient-to-br from-white to-green-50/50 border-2 border-green-200 px-5 py-4 text-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-400 shadow-md sm:shadow-lg transition-all duration-300"
              />
            ) : current.type === "number" ? (
              (() => {
                const numericProps: any = {
                  ...inputProps,
                  step: current.step ?? 1,
                  className: "w-full rounded-2xl bg-gradient-to-br from-white to-green-50/50 border-2 border-green-200 px-5 py-4 text-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-400 shadow-md sm:shadow-lg transition-all duration-300",
                  onChange: (evt: ChangeEvent<HTMLInputElement>) => {
                  const value = evt.target.value;
                  // Aplicar máscara baseada no campo
                  const maskedValue = current.key === 'peso' ? maskWeight(value) : 
                                    current.key === 'altura' ? maskHeight(value) : value;
                  const safe = normalizeAnswerValue(maskedValue);
                  setLocalValue(safe);
                },
                onBlur: () => {
                  // Normalizar valor ao sair do campo
                  if (typeof localValue === 'string') {
                    const normalized = toNumber(localValue);
                    if (!isNaN(normalized)) {
                      const safe = normalizeAnswerValue(normalized);
                      setLocalValue(safe);
                    }
                  }
                }
                };
                if (current.min !== undefined) numericProps.min = current.min;
                if (current.max !== undefined) numericProps.max = current.max;
                if (current.placeholder) numericProps.placeholder = current.placeholder;
                return <NumericInput {...numericProps} />;
              })()
            ) : (
              (() => {
                const enhancedProps: any = {
                  ...inputProps,
                  inputMode: inputMode as "text" | "tel" | "decimal",
                  className: "w-full rounded-2xl bg-gradient-to-br from-white to-green-50/50 border-2 border-green-200 px-5 py-4 text-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-400 shadow-md sm:shadow-lg transition-all duration-300"
                };
                if (phonePattern) enhancedProps.pattern = phonePattern;
                return <EnhancedInput {...enhancedProps} />;
              })()
            )}

            <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:justify-between">
              {!current.required && (
                <RefinedButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  disabled={submitting}
                  className="text-brand-600 hover:text-brand-700"
                >
                  ⏭️ Pular esta pergunta
                </RefinedButton>
              )}
              <RefinedButton
                type="button"
                variant="primary"
                size="md"
                onClick={handleSubmit}
                loading={submitting}
                disabled={submitting || (current.required && isValueEmpty(localValue))}
                className={cn(getButtonClasses(), "shadow-lg sm:shadow-xl")}
              >
                {submitting ? "Salvando..." : "Continuar"}
              </RefinedButton>
            </div>
          </div>
        );
      }

      case "date": {
        return (
          <div className="mt-10 space-y-8">
            <input
              type="date"
              className="w-full rounded-2xl bg-gradient-to-br from-white to-green-50/50 border-2 border-green-200 px-5 py-4 text-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-400 shadow-md sm:shadow-lg transition-all duration-300"
              value={localValue ?? ""}
              onChange={evt => {
                const safe = normalizeAnswerValue(evt.target.value);
                setLocalValue(safe);
              }}
              disabled={submitting}
            />
            <div className="flex justify-end">
              <RefinedButton
                type="button"
                variant="primary"
                size="md"
                onClick={handleSubmit}
                loading={submitting}
                disabled={submitting || (current.required && isValueEmpty(localValue))}
                className={cn(getButtonClasses(), "shadow-lg sm:shadow-xl")}
              >
                {submitting ? "Salvando..." : "Continuar"}
              </RefinedButton>
            </div>
          </div>
        );
      }

      case "radio":
      case "select":
      case "multiselect":
      case "checkbox":
        return renderOptions(current);

      case "matrix": {
        if (current.key === "bristol") {
          return (
            <div className="mt-10 space-y-8">
              <BristolMatrix
                value={localValue}
                onChange={(value) => {
                  const safe = normalizeAnswerValue(value);
                  setLocalValue(safe);
                  void (async () => {
                    setSubmitting(true);
                    setErrorMessage(null);
                    try {
                      await persistAnswer(current, safe);
                      const nextIndex = findNextIndex(steps, { ...answers, [current.key]: safe }, index);
                      // Animação suave antes de avançar
                      await new Promise(resolve => setTimeout(resolve, 150));
                      advanceTo(nextIndex);
                      // Reset submitting após avançar (com pequeno delay para não interferir na animação)
                      setTimeout(() => setSubmitting(false), 100);
                    } catch (err) {
                      if (err instanceof Error) setErrorMessage(err.message);
                      else setErrorMessage("Não foi possível salvar esta resposta.");
                      setSubmitting(false);
                    }
                  })();
                }}
                disabled={submitting}
              />
            </div>
          );
        }
        // Fallback para outros tipos de matrix
        return renderOptions(current);
      }

      case "scale":
      case "slider": {
        const min = current.min ?? 0;
        const max = current.max ?? 10;
        const step = current.step ?? 1;
        const value = typeof localValue === "number" ? localValue : Number(localValue) || min;

        return (
          <div className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-10">
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold text-white">
                {value}
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={evt => {
                  const safe = normalizeAnswerValue(Number(evt.target.value));
                  setLocalValue(safe);
                }}
                className="w-full accent-[#8d65ff]"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="min-h-[44px] rounded-full bg-gradient-to-r from-[#7c4dff] to-[#38b6ff] px-8 py-3 text-base font-semibold text-white shadow-[0_10px_30px_rgba(60,40,140,0.45)] transition hover:shadow-[0_12px_40px_rgba(60,40,140,0.65)] disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Salvando..." : "Continuar"}
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (!isMounted) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gradient-to-br from-[#0f1629] via-[#121c34] to-[#020307] text-white">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_20px_80px_rgba(22,12,64,0.45)] backdrop-blur">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        </div>
      </div>
    );
  }

  const isFinalizing = flowCompleted && (finalizeStatus === "running" || finalizeStatus === "idle");
  const isFinalizeSuccess = flowCompleted && finalizeStatus === "completed";
  const isFinalizeFailed = flowCompleted && finalizeStatus === "failed";

  // Mostrar coletor de dados do perfil se necessário
  if (collectingProfileData) {
    // Suportar tanto 'weight'/'height' quanto 'peso'/'altura' (formulário emagrecimento usa português)
    const weightValue = answers.weight ?? answers.peso;
    const heightValue = answers.height ?? answers.altura;
    
    const profileInitialData = {
      name: answers.name,
      whatsapp: answers.whatsapp,
      email: answers.email,
      weight: typeof weightValue === 'number' ? weightValue : undefined,
      height: typeof heightValue === 'number' ? heightValue : undefined,
      age: typeof answers.age === 'number' ? answers.age : undefined,
    };

    return (
      <div className={cn("relative flex min-h-screen max-h-screen items-center justify-center overflow-hidden py-2 sm:py-4 md:py-6 text-gray-900", getBgGradient())}>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(120,80,255,0.08),_transparent_55%)]" />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_bottom,_rgba(46,209,255,0.06),_transparent_40%)]" />
        <div className={cn("relative w-full max-w-3xl max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] rounded-2xl sm:rounded-3xl border p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl flex flex-col overflow-y-auto", getCardFrosted())}>
          <ProfileDataCollector
            triageSlug={flow.slug}
            initialData={profileInitialData}
            onSubmit={saveProfileData}
            onSkip={needsProfileData ? undefined : () => {
              setCollectingProfileData(false);
              setFlowCompleted(true);
              void finalizeTriage();
            }}
          />
        </div>
        <ConcentrationMusic />
      </div>
    );
  }

  if (flowCompleted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050914] py-12 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(120,80,255,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_bottom,_rgba(46,209,255,0.12),_transparent_40%)]" />
        {/* Botão de voltar às triagens */}
        <button
          onClick={() => window.location.href = brand === 'zapfarm' ? '/protocolos' : appendUtmsToUrl('/triagem')}
          className="absolute top-6 left-6 group flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
          title={brand === 'zapfarm' ? 'Voltar para protocolos' : 'Voltar às triagens'}
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-xs sm:text-sm font-medium text-white/80 group-hover:text-white hidden sm:inline">Triagens</span>
        </button>
        <div className="relative w-full max-w-2xl rounded-[36px] border border-white/10 bg-white/10 p-10 text-center shadow-[0_40px_120px_rgba(10,14,40,0.6)] backdrop-blur-xl">
          <span className="text-xs uppercase tracking-[0.4em] text-white/60">
            {isFinalizeFailed ? "Tivemos um contratempo" : isFinalizeSuccess ? "Relatório pronto" : "Finalizando"}
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            {isFinalizeFailed
              ? "Não conseguimos gerar seu relatório automaticamente."
              : isFinalizeSuccess
                ? "Seu relatório está pronto!"
                : "Gerando seu relatório personalizado"}
          </h1>

          {isFinalizing && (
            <>
              <div className="mx-auto mt-8 h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="mt-6 text-white/75">
                Estamos processando suas respostas e montando o relatório. Mantenha esta aba aberta por alguns segundos.
              </p>
            </>
          )}

          {isFinalizeSuccess && (
            <>
              <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/10 text-3xl text-emerald-200">
                ✓
              </div>
              <p className="mt-6 text-white/80">
                Seu relatório está pronto! Em alguns segundos você verá suas opções de tratamento e como falar com o médico.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={openSummary}
                  className="rounded-full bg-gradient-to-r from-[#7c4dff] to-[#38b6ff] px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(60,40,140,0.45)] transition hover:shadow-[0_12px_40px_rgba(60,40,140,0.65)]"
                >
                  Abrir resumo agora
                </button>
              </div>
            </>
          )}

          {isFinalizeFailed && (
            <>
              <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/50 bg-red-500/10 text-3xl text-red-200">
                !
              </div>
              <p className="mt-6 text-white/75">
                {finalizeError ?? "Não foi possível gerar o relatório neste momento. Seus dados continuam salvos."}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={retryFinalize}
                  className="rounded-full bg-gradient-to-r from-brand-500 to-brand-400 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,200,83,0.35)] transition hover:shadow-[0_12px_40px_rgba(0,200,83,0.45)]"
                >
                  Tentar novamente
                </button>
                <button
                  type="button"
                  onClick={openSummary}
                  className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white/80 hover:text-white"
                >
                  Ver respostas salvas
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-xs uppercase tracking-[0.35em] text-white/35">
            Sessão #{triageId.slice(0, 8)}
          </p>
        </div>
      </div>
    );
  }

  if (!current) return null;

  // const _showProfileCallout = firstVisit && !hasProfileData(answers);

  return (
    <div className={cn("relative flex min-h-screen max-h-screen items-center justify-center overflow-hidden py-2 sm:py-4 md:py-6 text-gray-900", getBgGradient())}>
      {/* Efeitos de fundo decorativos com animação suave e moderna */}
      {brand === 'zapfarm' ? (
        <>
          {/* Blob 1 - Top Left */}
          <motion.div
            className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 -z-10 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(124, 29, 149, 0.2) 0%, transparent 70%)'
            } as any}
            animate={{
              opacity: [0.5, 0.9, 0.5],
              scale: [1, 1.25, 1],
              x: [-30, 30, -30],
              y: [-30, 30, -30]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          {/* Blob 2 - Bottom Right */}
          <motion.div
            className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 -z-10 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, transparent 70%)'
            } as any}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
              x: [30, -30, 30],
              y: [30, -30, 30]
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 2.5
            }}
          />
          {/* Blob 3 - Center */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 sm:w-80 sm:h-80 -z-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)'
            } as any}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.15, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Blob 4 - Top Right */}
          <motion.div
            className="absolute top-20 right-20 w-48 h-48 sm:w-64 sm:h-64 -z-10 rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%)'
            } as any}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.35, 1]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 4
            }}
          />
        </>
      ) : (
        <>
          {/* Blob 1 - Top Left */}
          <motion.div
            className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 -z-10 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)'
            } as any}
            animate={{
              opacity: [0.5, 0.9, 0.5],
              scale: [1, 1.25, 1],
              x: [-30, 30, -30],
              y: [-30, 30, -30]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          {/* Blob 2 - Bottom Right */}
          <motion.div
            className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 -z-10 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)'
            } as any}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
              x: [30, -30, 30],
              y: [30, -30, 30]
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 2.5
            }}
          />
          {/* Blob 3 - Center */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 sm:w-80 sm:h-80 -z-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)'
            } as any}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.15, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Blob 4 - Top Right */}
          <motion.div
            className="absolute top-20 right-20 w-48 h-48 sm:w-64 sm:h-64 -z-10 rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)'
            } as any}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.35, 1]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 4
            }}
          />
        </>
      )}
      {/* Partículas nevando - fundo clarinho por produto */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes triageFloat1 {
            0% { transform: translateY(-100vh) translateX(0) rotate(0deg); opacity: 0; }
            3% { opacity: 0.5; }
            97% { opacity: 0.5; }
            100% { transform: translateY(200vh) translateX(30px) rotate(360deg); opacity: 0; }
          }
          @keyframes triageFloat2 {
            0% { transform: translateY(-100vh) translateX(0) rotate(0deg); opacity: 0; }
            3% { opacity: 0.45; }
            97% { opacity: 0.45; }
            100% { transform: translateY(200vh) translateX(-25px) rotate(-360deg); opacity: 0; }
          }
          @keyframes triageFloat3 {
            0% { transform: translateY(-100vh) translateX(0) rotate(0deg); opacity: 0; }
            3% { opacity: 0.55; }
            97% { opacity: 0.55; }
            100% { transform: translateY(200vh) translateX(15px) rotate(180deg); opacity: 0; }
          }
        `
      }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-[5]" aria-hidden>
        {snowParticles.map((p) => (
          <div
            key={p.id}
            className={cn("absolute rounded-full shadow-[0_0_6px_rgba(255,255,255,0.3)]", getParticleGradient(p.id))}
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              top: `${p.initialY}vh`,
              animation: `${p.animType} ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      <div className={cn("relative w-full max-w-3xl max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] rounded-2xl sm:rounded-3xl border p-3 sm:p-5 md:p-6 lg:p-8 shadow-2xl flex flex-col overflow-hidden", getCardFrosted())}>
        <header className={cn("flex flex-col gap-2 sm:gap-4 border-b pb-3 sm:pb-4 md:pb-5 sm:flex-row sm:items-center sm:justify-between", getBorderColor())}>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => window.location.href = brand === 'zapfarm' ? '/protocolos' : '/triagem'}
              className={cn("group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/80 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md", getBorderColor(), brand === 'zapfarm' ? 'border-purple-200/50 hover:border-purple-300' : 'border-green-200/50 hover:border-green-300')}
              title={brand === 'zapfarm' ? 'Voltar' : 'Voltar às triagens'}
            >
              <svg className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors", brand === 'zapfarm' ? 'text-purple-600 group-hover:text-purple-700' : 'text-green-600 group-hover:text-green-700')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className={cn("text-xs sm:text-sm font-medium hidden sm:inline", brand === 'zapfarm' ? 'text-purple-700 group-hover:text-purple-800' : 'text-green-700 group-hover:text-green-800')}>
                {brand === 'zapfarm' ? 'Voltar' : 'Triagens'}
              </span>
            </button>
            <div>
              <span className={cn("text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] font-semibold block", getTextColor())}>
                {brand === 'zapfarm' ? '💊 Check-up MeJoy' : '🌿 Triagem'}
              </span>
              <h1 className="mt-0.5 sm:mt-2 text-base sm:text-2xl font-bold text-gray-900 truncate">
                {(() => {
                  const patientName = answers.name || initialAnswers.name;
                  if (patientName && typeof patientName === 'string' && patientName.trim().length > 0) {
                    const firstName = patientName.split(' ')[0];
                    return `Olá, ${firstName}! 👋`;
                  }
                  return flow.title;
                })()}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className={cn("text-xs sm:text-sm font-medium", getTextColor())}>⏳ Progresso</span>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{progress}%</p>
          </div>
        </header>

        <div className="mt-3 sm:mt-4 md:mt-5 space-y-1">
          <div className="h-2 sm:h-2.5 md:h-3 w-full rounded-full bg-gradient-to-r from-gray-100 to-gray-200 shadow-inner overflow-hidden">
          <motion.div
            className={cn("h-3 rounded-full shadow-md sm:shadow-lg relative", getProgressGradient())}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              ease: [0.4, 0, 0.2, 1], 
              duration: 0.6,
              delay: 0.1
            }}
          >
            {/* Efeito shimmer na barra de progresso */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 text-center">⏰ Leva cerca de 2 minutos para concluir.</p>
        </div>


        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ 
              duration: 0.35, 
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.25 },
              scale: { duration: 0.35 }
            }}
            className="mt-2 sm:mt-3 md:mt-4 flex-1 min-h-0 overflow-y-auto"
          >
            {current.type !== "info" && (
              <>
                {current.type !== "select_cards" && (
                  <RefinedCard
                    variant="subtle"
                    padding="sm"
                    rounded="md"
                    className="inline-block mb-2"
                  >
                    <p className={cn("text-[10px] sm:text-xs font-semibold flex items-center gap-1.5", getTextColor())}>
                      <span className="text-brand-600">📝</span>
                      <span>Etapa {questionPosition} de {visibleQuestions}</span>
                    </p>
                  </RefinedCard>
                )}
                {current.type !== "select_cards" && (
                  <h2 className={cn(
                    "text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight",
                    current.key === 'comorbidades' ? "mt-1 sm:mt-1.5" : "mt-1.5 sm:mt-2"
                  )}>{current.label}</h2>
                )}
                {current.helperText && current.type !== "select_cards" && (
                  <p className={cn(
                    "text-xs sm:text-sm text-gray-600 leading-snug",
                    current.key === 'comorbidades' ? "mt-1 sm:mt-1.5" : "mt-1.5 sm:mt-2"
                  )}>
                {current.helperText}
              </p>
            )}
                {current.helper && current.type !== "select_cards" && !current.helperText && (
                  <p className={cn(
                    "text-xs sm:text-sm text-gray-600 leading-snug",
                    current.key === 'comorbidades' ? "mt-1 sm:mt-1.5" : "mt-1.5 sm:mt-2"
                  )}>{current.helper}</p>
            )}
                {current.why && current.type !== "select_cards" && (
              <QuestionWhy text={current.why} brand={brand} />
            )}
                {current.legalLinks && current.legalLinks.length > 0 && (
                  <LegalLinksAccordion links={current.legalLinks} brand={brand} />
                )}
                {current.evidenceNote && current.type !== "select_cards" && (
                  <div className={cn(
                    "p-2 sm:p-2.5 bg-gray-50 rounded-lg border border-gray-200",
                    current.key === 'comorbidades' ? "mt-1.5 sm:mt-2" : "mt-2 sm:mt-3"
                  )}>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                      <span className="font-semibold">💡 Dica:</span> {current.evidenceNote}
                    </p>
                  </div>
                )}
              </>
            )}
            {current.type === "select_cards" && (
              <>
                <h2 className="mt-1 sm:mt-1.5 text-sm sm:text-base font-bold text-gray-900 leading-tight">{current.label}</h2>
                {current.helperText && (
                  <p className="mt-1 text-[10px] sm:text-xs text-gray-600 leading-tight">
                    {current.helperText}
                  </p>
                )}
                {current.evidenceNote && (
                  <div className="mt-1 p-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-[9px] sm:text-[10px] text-gray-600 leading-tight">
                      <span className="font-semibold">💡 Dica:</span> {current.evidenceNote}
                    </p>
                  </div>
                )}
              </>
            )}

            {errorMessage && (
              <RefinedCard
                variant="default"
                padding="md"
                rounded="lg"
                className="mt-3 sm:mt-4 md:mt-5 border-red-200 bg-red-50"
              >
                <p className="text-xs sm:text-sm text-red-700 flex items-start gap-2">
                  <span className="text-red-600 flex-shrink-0">⚠️</span>
                  <span>{errorMessage}</span>
                </p>
              </RefinedCard>
            )}

            {renderInput()}
          </motion.div>
        </AnimatePresence>

        <footer className={cn("mt-2 sm:mt-3 md:mt-4 flex flex-col gap-2 sm:gap-3 border-t pt-2 sm:pt-3 md:pt-4 flex-shrink-0 sm:flex-row sm:items-center sm:justify-between", getBorderColor())}>
          <RefinedButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            className={cn(
              "w-full sm:w-auto",
              brand === 'zapfarm' 
                ? 'border-purple-300 text-purple-700 hover:border-purple-400 hover:text-purple-800 hover:bg-purple-50'
                : 'border-brand-300 text-brand-700 hover:border-brand-400 hover:text-brand-800 hover:bg-brand-50'
            )}
          >
            ⬅️ Voltar passo
          </RefinedButton>
          <span className={cn("text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] font-medium text-center sm:text-left", getTextColor())}>
            🔐 Sessão #{triageId.slice(0, 8)}
          </span>
        </footer>
      </div>
      <ConcentrationMusic />
    </div>
  );
}

export function shouldAskFirstVisit(answers?: Record<string, any>) {
  return !hasProfileData(answers);
}
