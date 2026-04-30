// src/lib/report/score.ts
// Sistema de scores dinâmicos e paletas de cores baseadas nas respostas

export type ScorePalette = {
  grade: 'excellent' | 'good' | 'ok' | 'risk' | 'critical';
  bg: string;
  bar: string;
  text: string;
  accent: string;
  border: string;
};

export type ScoreContext = {
  triage: string;
  answers: Record<string, any>;
  redFlags: string[];
  age?: number;
  sex?: string;
  bmi?: number;
};

/**
 * Calcula score baseado nas respostas da triagem
 */
export function scoreFromAnswers(ctx: ScoreContext): number {
  let score = 72; // Score base neutro
  
  // Penalizações por red flags
  if (ctx.redFlags.length > 0) {
    score -= ctx.redFlags.length * 15; // -15 por red flag
  }
  
  // Ajustes específicos por triagem
  switch (ctx.triage) {
    case 'gastro':
      score += calculateGastroScore(ctx.answers);
      break;
    case 'mental':
      score += calculateMentalScore(ctx.answers);
      break;
    case 'gestante':
      score += calculateGestanteScore(ctx.answers);
      break;
    case 'cardio':
      score += calculateCardioScore(ctx.answers);
      break;
    default:
      score += calculateGeneralScore(ctx.answers);
  }
  
  // Ajustes por idade
  if (ctx.age) {
    if (ctx.age < 30) score += 5; // Jovens têm score base melhor
    else if (ctx.age > 60) score -= 5; // Idosos têm mais riscos
  }
  
  // Ajustes por IMC
  if (ctx.bmi) {
    if (ctx.bmi < 18.5) score -= 10; // Abaixo do peso
    else if (ctx.bmi > 30) score -= 15; // Obesidade
    else if (ctx.bmi > 25) score -= 5; // Sobrepeso
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calcula score específico para triagem gastrointestinal
 */
function calculateGastroScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Hábitos positivos
  if (answers.waterLt1L === 'nao') score += 10; // Bebe água adequadamente
  if (answers.highFiber === 'sim') score += 8; // Consome fibras
  if (answers.exerciseRegular === 'sim') score += 5; // Exercita-se
  if (answers.stressLevel === 'baixo') score += 5; // Baixo estresse
  
  // Hábitos negativos
  if (answers.smoking === 'sim') score -= 15; // Fuma
  if (answers.alcoholFrequent === 'sim') score -= 10; // Bebe frequentemente
  if (answers.processedFoods === 'frequentemente') score -= 8; // Come processados
  if (answers.sleepHours < 6) score -= 5; // Dorme pouco
  
  // Sintomas específicos
  if (answers.bristol && answers.bristol >= 4 && answers.bristol <= 5) score += 5; // Bristol ideal
  if (answers.bristol && (answers.bristol <= 2 || answers.bristol >= 6)) score -= 10; // Bristol problemático
  
  return score;
}

/**
 * Calcula score específico para triagem mental
 */
function calculateMentalScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Fatores protetivos
  if (answers.socialSupport === 'alto') score += 10; // Bom suporte social
  if (answers.sleepQuality === 'boa') score += 8; // Boa qualidade do sono
  if (answers.exerciseRegular === 'sim') score += 8; // Exercita-se
  if (answers.stressManagement === 'eficaz') score += 5; // Gerencia estresse
  
  // Fatores de risco
  if (answers.anxietyLevel === 'alto') score -= 15; // Ansiedade alta
  if (answers.depressionSymptoms === 'sim') score -= 12; // Sintomas depressivos
  if (answers.isolation === 'sim') score -= 10; // Isolamento social
  if (answers.sleepHours < 6) score -= 8; // Dorme pouco
  
  return score;
}

/**
 * Calcula score específico para triagem de gestante
 */
function calculateGestanteScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Fatores positivos
  if (answers.prenatalCare === 'regular') score += 15; // Pré-natal regular
  if (answers.nutrition === 'adequada') score += 10; // Nutrição adequada
  if (answers.exerciseApproved === 'sim') score += 8; // Exercício aprovado
  if (answers.stressLevel === 'baixo') score += 5; // Baixo estresse
  
  // Fatores de risco
  if (answers.age > 35) score -= 5; // Idade materna avançada
  if (answers.previousComplications === 'sim') score -= 10; // Complicações anteriores
  if (answers.smoking === 'sim') score -= 20; // Fuma durante gestação
  if (answers.alcohol === 'sim') score -= 15; // Bebe durante gestação
  
  return score;
}

/**
 * Calcula score específico para triagem cardiovascular
 */
function calculateCardioScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Fatores protetivos
  if (answers.exerciseRegular === 'sim') score += 10; // Exercita-se regularmente
  if (answers.diet === 'saudavel') score += 8; // Dieta saudável
  if (answers.smoking === 'nao') score += 15; // Não fuma
  if (answers.alcoholModerate === 'sim') score += 5; // Consumo moderado de álcool
  
  // Fatores de risco
  if (answers.hypertension === 'sim') score -= 15; // Hipertensão
  if (answers.diabetes === 'sim') score -= 12; // Diabetes
  if (answers.familyHistory === 'sim') score -= 8; // Histórico familiar
  if (answers.stressLevel === 'alto') score -= 5; // Estresse alto
  
  return score;
}

/**
 * Calcula score geral para outras triagens
 */
function calculateGeneralScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Fatores gerais positivos
  if (answers.exerciseRegular === 'sim') score += 8; // Exercita-se
  if (answers.diet === 'saudavel') score += 6; // Dieta saudável
  if (answers.sleepHours >= 7) score += 5; // Dorme bem
  if (answers.stressLevel === 'baixo') score += 5; // Baixo estresse
  
  // Fatores gerais negativos
  if (answers.smoking === 'sim') score -= 12; // Fuma
  if (answers.alcoholExcessive === 'sim') score -= 8; // Bebe excessivamente
  if (answers.sleepHours < 6) score -= 8; // Dorme pouco
  if (answers.stressLevel === 'alto') score -= 5; // Estresse alto
  
  return score;
}

/**
 * Gera paleta de cores baseada no score
 */
export function paletteFromScore(score: number): ScorePalette {
  if (score >= 90) {
    return {
      grade: 'excellent',
      bg: 'bg-emerald-50',
      bar: 'bg-emerald-500',
      text: 'text-emerald-900',
      accent: 'text-emerald-600',
      border: 'border-emerald-200',
    };
  }
  
  if (score >= 75) {
    return {
      grade: 'good',
      bg: 'bg-green-50',
      bar: 'bg-green-500',
      text: 'text-green-900',
      accent: 'text-green-600',
      border: 'border-green-200',
    };
  }
  
  if (score >= 60) {
    return {
      grade: 'ok',
      bg: 'bg-amber-50',
      bar: 'bg-amber-500',
      text: 'text-amber-900',
      accent: 'text-amber-600',
      border: 'border-amber-200',
    };
  }
  
  if (score >= 40) {
    return {
      grade: 'risk',
      bg: 'bg-orange-50',
      bar: 'bg-orange-500',
      text: 'text-orange-900',
      accent: 'text-orange-600',
      border: 'border-orange-200',
    };
  }
  
  return {
    grade: 'critical',
    bg: 'bg-rose-50',
    bar: 'bg-rose-500',
    text: 'text-rose-900',
    accent: 'text-rose-600',
    border: 'border-rose-200',
  };
}

/**
 * Gera interpretação do score em texto amigável
 */
export function scoreInterpretation(score: number): string {
  if (score >= 90) return 'Excelente! Sua saúde está em ótimo estado.';
  if (score >= 75) return 'Muito bom! Pequenos ajustes podem melhorar ainda mais.';
  if (score >= 60) return 'Bom! Algumas mudanças podem fazer a diferença.';
  if (score >= 40) return 'Atenção necessária. Vamos trabalhar juntos para melhorar.';
  return 'Cuidado especial necessário. Vamos priorizar sua saúde agora.';
}

/**
 * Gera cor de fundo para gradientes baseada no score
 */
export function gradientFromScore(score: number): string {
  if (score >= 90) return 'from-emerald-500 to-green-600';
  if (score >= 75) return 'from-green-500 to-emerald-600';
  if (score >= 60) return 'from-amber-500 to-orange-600';
  if (score >= 40) return 'from-orange-500 to-red-600';
  return 'from-rose-500 to-red-600';
}

/**
 * Gera ícone baseado no score
 */
export function iconFromScore(score: number): string {
  if (score >= 90) return '🎉';
  if (score >= 75) return '😊';
  if (score >= 60) return '👍';
  if (score >= 40) return '⚠️';
  return '🚨';
}
