// src/lib/emagrecimento/evidence.ts
// Base de conhecimento científico para evidências do relatório de emagrecimento

export type Classification = 'candidato_glp1' | 'nao_indicado' | 'contraindicado' | 'any';

export interface EvidenceItem {
  id: string;
  title: string;
  summary: string; // Texto pronto para paciente (2-3 linhas)
  source: string; // "Grande estudo clínico", "Diretriz de obesidade", etc.
  appliesTo: {
    classification?: Classification | Classification[];
    hasDiabetes?: boolean;
    hasHypertension?: boolean;
    hasSleepApnea?: boolean;
  };
}

// Evidências sobre mudança de estilo de vida
export const lifestyleEvidence: EvidenceItem[] = [
  {
    id: 'dpp-lifestyle',
    title: 'Mudanças de estilo de vida reduzem risco de diabetes',
    summary: 'Grandes estudos mostram que pessoas que perderam cerca de 7% do peso e fizeram atividade física regular reduziram de forma importante o risco de desenvolver diabetes tipo 2. Essas mudanças são eficazes mesmo quando mantidas por alguns anos.',
    source: 'Estudo clínico randomizado (Diabetes Prevention Program)',
    appliesTo: { classification: 'any' }
  },
  {
    id: 'look-ahead-lifestyle',
    title: 'Abordagem multimodal melhora saúde cardiovascular',
    summary: 'Estudos de longo prazo demonstram que combinar alimentação equilibrada, atividade física regular e acompanhamento médico pode melhorar significativamente a saúde do coração e reduzir eventos cardiovasculares em pessoas com excesso de peso.',
    source: 'Grande estudo clínico de longo prazo',
    appliesTo: { classification: 'any' }
  },
  {
    id: 'sustainable-changes',
    title: 'Mudanças pequenas e sustentáveis têm grande impacto',
    summary: 'Pesquisas mostram que pequenas mudanças mantidas ao longo de 6 a 12 meses podem levar a perda de peso significativa e melhora em indicadores de saúde. O importante é a consistência, não a velocidade.',
    source: 'Diretrizes de tratamento de obesidade',
    appliesTo: { classification: 'any' }
  }
];

// Evidências sobre medicações GLP-1/GIP
export const glp1Evidence: EvidenceItem[] = [
  {
    id: 'tirzepatida-weight-loss',
    title: 'Tratamento medicamentoso pode ajudar na perda de peso significativa',
    summary: 'Estudos clínicos mostram que, quando indicado e usado com acompanhamento médico adequado, medicações como tirzepatida podem ajudar pessoas com obesidade a perderem uma porcentagem significativa do peso corporal ao longo de 1 a 2 anos, especialmente quando combinadas com mudanças de estilo de vida.',
    source: 'Grande estudo clínico randomizado',
    appliesTo: { classification: 'candidato_glp1' }
  },
  {
    id: 'glp1-metabolic-benefits',
    title: 'Medicações para obesidade melhoram indicadores metabólicos',
    summary: 'Além da perda de peso, estudos mostram que medicações como semaglutida e tirzepatida podem melhorar o controle da glicose, reduzir pressão arterial e melhorar outros marcadores de saúde metabólica quando usadas com acompanhamento médico.',
    source: 'Estudos clínicos e meta-análises',
    appliesTo: { classification: 'candidato_glp1' }
  },
  {
    id: 'glp1-combination-therapy',
    title: 'Tratamento medicamentoso funciona melhor com mudanças de estilo de vida',
    summary: 'Evidências mostram que medicações para obesidade têm resultados muito melhores quando combinadas com mudanças na alimentação, atividade física e acompanhamento multidisciplinar. A medicação sozinha não é suficiente.',
    source: 'Diretrizes de tratamento de obesidade',
    appliesTo: { classification: 'candidato_glp1' }
  }
];

// Evidências sobre benefícios de perda de peso
export const weightLossBenefits: EvidenceItem[] = [
  {
    id: 'weight-loss-benefits',
    title: 'Perder 5-10% do peso traz grandes benefícios',
    summary: 'Mesmo perdas modestas de peso (5-10% do peso corporal) já melhoram de forma importante o controle da glicose, pressão arterial e saúde do fígado. Não precisa perder muito para ver resultados positivos na saúde.',
    source: 'Diretrizes de tratamento de obesidade',
    appliesTo: { classification: 'any' }
  },
  {
    id: 'weight-loss-diabetes',
    title: 'Perda de peso melhora controle glicêmico',
    summary: 'Para pessoas com diabetes tipo 2 ou pré-diabetes, perder peso pode melhorar bastante o controle da glicose e reduzir a necessidade de medicações. Isso é especialmente verdadeiro quando a perda de peso é mantida ao longo do tempo.',
    source: 'Diretrizes de diabetes e obesidade',
    appliesTo: { hasDiabetes: true }
  },
  {
    id: 'weight-loss-hypertension',
    title: 'Perda de peso reduz pressão arterial',
    summary: 'Estudos mostram que perder peso pode reduzir a pressão arterial de forma significativa. Para muitas pessoas, isso pode significar reduzir ou até mesmo parar medicações para pressão, sempre com acompanhamento médico.',
    source: 'Diretrizes de hipertensão',
    appliesTo: { hasHypertension: true }
  },
  {
    id: 'weight-loss-sleep-apnea',
    title: 'Perda de peso melhora apneia do sono',
    summary: 'Reduzir o peso corporal pode melhorar significativamente os sintomas de apneia do sono e reduzir a necessidade de aparelhos como CPAP. Isso melhora a qualidade do sono e a energia durante o dia.',
    source: 'Diretrizes de medicina do sono',
    appliesTo: { hasSleepApnea: true }
  }
];

/**
 * Retorna evidências científicas relevantes para o perfil do paciente
 */
export function getEvidenceForProfile(
  basics: { age?: number; sex?: string; bmi?: number },
  classification: Classification,
  comorbidades: string[]
): EvidenceItem[] {
  const allEvidence = [
    ...lifestyleEvidence,
    ...glp1Evidence,
    ...weightLossBenefits
  ];
  
  // Mapear comorbidades para flags booleanas
  const hasDiabetes = comorbidades.some(c => 
    c.toLowerCase().includes('diabetes') || c.toLowerCase().includes('glicose')
  );
  const hasHypertension = comorbidades.some(c => 
    c.toLowerCase().includes('pressão') || c.toLowerCase().includes('hipertensão')
  );
  const hasSleepApnea = comorbidades.some(c => 
    c.toLowerCase().includes('apneia') || c.toLowerCase().includes('sono')
  );
  
  // Filtrar evidências baseado no perfil
  const filtered = allEvidence.filter(evidence => {
    // Verificar classificação
    if (evidence.appliesTo.classification) {
      const classifications = Array.isArray(evidence.appliesTo.classification)
        ? evidence.appliesTo.classification
        : [evidence.appliesTo.classification];
      
      if (!classifications.includes(classification) && !classifications.includes('any')) {
        return false;
      }
    }
    
    // Verificar comorbidades específicas
    if (evidence.appliesTo.hasDiabetes !== undefined && evidence.appliesTo.hasDiabetes !== hasDiabetes) {
      return false;
    }
    if (evidence.appliesTo.hasHypertension !== undefined && evidence.appliesTo.hasHypertension !== hasHypertension) {
      return false;
    }
    if (evidence.appliesTo.hasSleepApnea !== undefined && evidence.appliesTo.hasSleepApnea !== hasSleepApnea) {
      return false;
    }
    
    return true;
  });
  
  // Priorizar evidências relevantes e retornar no máximo 4
  // Prioridade: lifestyle sempre, depois específicas por comorbidade, depois GLP-1 se candidato
  const prioritized = filtered.sort((a, b) => {
    // Lifestyle primeiro
    if (lifestyleEvidence.includes(a) && !lifestyleEvidence.includes(b)) return -1;
    if (!lifestyleEvidence.includes(a) && lifestyleEvidence.includes(b)) return 1;
    
    // Específicas por comorbidade têm prioridade
    if ((a.appliesTo.hasDiabetes || a.appliesTo.hasHypertension || a.appliesTo.hasSleepApnea) && 
        !(b.appliesTo.hasDiabetes || b.appliesTo.hasHypertension || b.appliesTo.hasSleepApnea)) {
      return -1;
    }
    
    return 0;
  });
  
  return prioritized.slice(0, 4);
}

