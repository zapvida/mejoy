// src/lib/emagrecimento/planRecommendation.ts
// Lógica de recomendação inteligente de planos baseada em classificação e perfil

type Classification = 'candidato_glp1' | 'nao_indicado' | 'contraindicado';

export function getRecommendedPlan(
  classification: Classification,
  impactoVida: string | null | undefined,
  comorbidades: string[]
): 'mensal' | 'trimestral' | 'semestral' {
  const impactoAlto = impactoVida === 'muito';
  
  if (classification === 'contraindicado') {
    // Não empurrar protocolo agressivo se o caso é de alto risco
    return 'mensal';
  }
  
  if (classification === 'candidato_glp1' && (impactoAlto || comorbidades.length >= 2)) {
    // Caso mais complexo: múltiplas comorbidades ou impacto alto → plano completo
    return 'semestral';
  }
  
  if (classification === 'candidato_glp1') {
    // Caso moderado: candidato mas sem múltiplas comorbidades → plano intermediário
    return 'trimestral';
  }
  
  // não indicado → foco leve/acompanhamento
  return 'mensal';
}

export function getPlanRecommendationText(
  recommendedPlan: 'mensal' | 'trimestral' | 'semestral'
): string {
  const planNames: Record<string, string> = {
    mensal: 'Plano Mensal',
    trimestral: 'Plano Trimestral',
    semestral: 'Plano Semestral'
  };
  
  return planNames[recommendedPlan] || 'Plano Mensal';
}

