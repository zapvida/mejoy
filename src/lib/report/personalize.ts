// src/lib/report/personalize.ts
// Sistema de personalização com tom amigável e microcopy específica por triagem

export type TriageContext = {
  symptom?: string;
  bristol?: number;
  redFlags?: string[];
  mainGoal?: string;
  age?: number;
  sex?: string;
  bmi?: number | { bmi: number; classification?: string };
};

/**
 * Extrai o primeiro nome de um nome completo
 */
export const firstName = (full?: string): string => {
  if (!full) return 'você';
  return full.split(' ')[0] || 'você';
};

/**
 * Gera saudação amigável baseada no tipo de triagem
 */
export function friendlyGreeting(name?: string, triage?: string): string {
  const nameStr = firstName(name);
  
  const greetings: Record<string, string> = {
    gastro: `Oi, ${nameStr}! Vamos cuidar do seu intestino juntos.`,
    mental: `Oi, ${nameStr}! Vamos cuidar da sua saúde mental juntos.`,
    gestante: `Oi, ${nameStr}! Vamos cuidar da sua gestação juntos.`,
    cancer: `Oi, ${nameStr}! Vamos cuidar da sua saúde preventiva juntos.`,
    coluna: `Oi, ${nameStr}! Vamos cuidar da sua coluna juntos.`,
    bucal: `Oi, ${nameStr}! Vamos cuidar da sua saúde bucal juntos.`,
    crianca: `Oi, ${nameStr}! Vamos cuidar da saúde do seu pequeno juntos.`,
    idoso: `Oi, ${nameStr}! Vamos cuidar da sua saúde na melhor idade juntos.`,
    sexual: `Oi, ${nameStr}! Vamos cuidar da sua saúde sexual juntos.`,
    biohacking: `Oi, ${nameStr}! Vamos otimizar sua saúde juntos.`,
    tireoide: `Oi, ${nameStr}! Vamos cuidar da sua tireoide juntos.`,
    microbioma: `Oi, ${nameStr}! Vamos cuidar do seu microbioma juntos.`,
    respiratoria: `Oi, ${nameStr}! Vamos cuidar da sua respiração juntos.`,
    auditiva: `Oi, ${nameStr}! Vamos cuidar da sua audição juntos.`,
    ocular: `Oi, ${nameStr}! Vamos cuidar da sua visão juntos.`,
    pele: `Oi, ${nameStr}! Vamos cuidar da sua pele juntos.`,
    mama: `Oi, ${nameStr}! Vamos cuidar da saúde das suas mamas juntos.`,
    emagrecimento: `Oi, ${nameStr}! Vamos cuidar da sua jornada de emagrecimento juntos.`,
    metabolico: `Oi, ${nameStr}! Vamos otimizar seu metabolismo juntos.`,
    geral: `Oi, ${nameStr}! Vamos cuidar da sua saúde juntos.`,
  };
  
  return greetings[triage || 'geral'] || greetings.geral;
}

/**
 * Gera resumo executivo personalizado
 */
export function executiveSummary(triage: string, ctx: TriageContext): string[] {
  const bullets: string[] = [];
  
  // Sintoma principal
  if (ctx.symptom) {
    bullets.push(`Você relatou ${ctx.symptom} como principal incômodo.`);
  }
  
  // Bristol score (específico para GI)
  if (triage === 'gastro' && ctx.bristol) {
    const bristolDesc = getBristolDescription(ctx.bristol);
    bullets.push(`Seu padrão de fezes está no Bristol ${ctx.bristol} — ${bristolDesc}.`);
  }
  
  // IMC e classificação (específico para emagrecimento)
  if ((triage === 'emagrecimento' || triage === 'metabolico') && ctx.bmi) {
    const bmiValue = typeof ctx.bmi === 'number' ? ctx.bmi : ctx.bmi.bmi;
    let classification = 'normal';
    if (bmiValue >= 30) classification = 'obesidade';
    else if (bmiValue >= 25) classification = 'sobrepeso';
    else if (bmiValue >= 18.5) classification = 'normal';
    else classification = 'abaixo do peso';
    
    bullets.push(`Seu IMC atual é ${bmiValue.toFixed(1)} — classificado como ${classification}.`);
  }
  
  // Red flags
  if (ctx.redFlags?.length) {
    bullets.push(`Encontrei ${ctx.redFlags.length} sinal(is) de alerta — vamos priorizar isso agora.`);
  }
  
  // Objetivo principal
  if (ctx.mainGoal) {
    bullets.push(`Seu objetivo principal é ${ctx.mainGoal}.`);
  }
  
  // Fallback se não há contexto específico
  if (bullets.length === 0) {
    bullets.push('Analisamos suas respostas e montamos um plano personalizado para você.');
  }
  
  return bullets;
}

/**
 * Gera plano de ações para hoje
 */
export function todayPlan(triage: string, _ctx: TriageContext): string[] {
  const plans: Record<string, string[]> = {
    gastro: [
      'Beba 2 copos de água ao acordar e 1 a cada refeição.',
      'Inclua 1 porção de fibra solúvel (aveia/chia) no café da manhã.',
      'Evite café em jejum por 7 dias; reavalie sintomas.',
      'Faça 5–10 min de caminhada após o almoço.',
      'Mastigue devagar e evite refeições volumosas à noite.',
    ],
    emagrecimento: [
      'Beba 2 copos de água ao acordar e 1 a cada refeição.',
      'Inclua proteína em todas as refeições principais (ovos, frango, peixe, leguminosas).',
      'Evite alimentos ultraprocessados e bebidas açucaradas hoje.',
      'Faça 10-15 minutos de caminhada após o almoço.',
      'Mastigue devagar e pare de comer quando sentir 80% de saciedade.',
    ],
    metabolico: [
      'Beba 2 copos de água ao acordar e 1 a cada refeição.',
      'Inclua proteína em todas as refeições principais.',
      'Evite alimentos ultraprocessados e bebidas açucaradas hoje.',
      'Faça 10-15 minutos de caminhada após o almoço.',
      'Mastigue devagar e pare de comer quando sentir 80% de saciedade.',
    ],
    mental: [
      'Reserve 10 minutos pela manhã para respiração profunda.',
      'Faça uma pausa de 5 minutos a cada 2 horas de trabalho.',
      'Evite telas 1 hora antes de dormir.',
      'Anote 3 coisas positivas do seu dia antes de dormir.',
    ],
    gestante: [
      'Beba pelo menos 2 litros de água por dia.',
      'Faça 30 min de caminhada leve pela manhã.',
      'Evite alimentos ultraprocessados e prefira naturais.',
      'Durma 8 horas por noite com travesseiro entre as pernas.',
    ],
    geral: [
      'Beba 2 litros de água ao longo do dia.',
      'Faça 30 min de atividade física moderada.',
      'Durma 7-8 horas por noite.',
      'Evite alimentos ultraprocessados.',
    ],
  };
  
  return plans[triage] || plans.geral;
}

/**
 * Gera plano para 7-14 dias
 */
export function shortTermPlan(triage: string, _ctx: TriageContext): string[] {
  const plans: Record<string, string[]> = {
    gastro: [
      'Estabeleça horários regulares para as refeições.',
      'Reduza alimentos ultraprocessados em 50%.',
      'Inclua probióticos naturais (kefir, kombucha).',
      'Pratique técnicas de relaxamento após refeições.',
    ],
    emagrecimento: [
      'Estabeleça horários regulares para as refeições (café da manhã, almoço, jantar).',
      'Reduza alimentos ultraprocessados em 70% e aumente consumo de alimentos naturais.',
      'Inclua atividade física moderada 3-4 vezes por semana (caminhada, natação, ciclismo).',
      'Monitore seu peso semanalmente no mesmo horário e condições.',
    ],
    metabolico: [
      'Estabeleça horários regulares para as refeições.',
      'Reduza alimentos ultraprocessados em 70% e aumente consumo de alimentos naturais.',
      'Inclua atividade física moderada 3-4 vezes por semana.',
      'Monitore indicadores de saúde regularmente.',
    ],
    mental: [
      'Estabeleça uma rotina de sono consistente.',
      'Limite uso de redes sociais a 30 min/dia.',
      'Pratique meditação ou mindfulness diariamente.',
      'Conecte-se com pessoas queridas pelo menos 1x/semana.',
    ],
    geral: [
      'Estabeleça uma rotina de exercícios consistente.',
      'Melhore a qualidade do sono.',
      'Reduza estresse com técnicas de relaxamento.',
      'Mantenha hidratação adequada.',
    ],
  };
  
  return plans[triage] || plans.geral;
}

/**
 * Gera plano para 1-3 meses
 */
export function longTermPlan(triage: string, _ctx: TriageContext): string[] {
  const plans: Record<string, string[]> = {
    gastro: [
      'Mantenha hábitos intestinais saudáveis.',
      'Considere suplementação com orientação médica.',
      'Monitore sintomas e ajuste conforme necessário.',
      'Faça acompanhamento médico regular.',
    ],
    emagrecimento: [
      'Mantenha hábitos alimentares saudáveis e atividade física regular.',
      'Considere acompanhamento médico especializado para tratamento medicamentoso se necessário.',
      'Monitore progresso e ajuste estratégias conforme necessário.',
      'Faça exames de acompanhamento (glicemia, perfil lipídico) a cada 3-6 meses.',
    ],
    metabolico: [
      'Mantenha hábitos alimentares saudáveis e atividade física regular.',
      'Considere acompanhamento médico especializado se necessário.',
      'Monitore indicadores metabólicos regularmente.',
      'Faça exames de acompanhamento conforme orientação médica.',
    ],
    mental: [
      'Desenvolva estratégias de enfrentamento saudáveis.',
      'Mantenha rede de apoio social ativa.',
      'Pratique autocompaixão e autocuidado.',
      'Considere terapia se necessário.',
    ],
    geral: [
      'Mantenha estilo de vida saudável.',
      'Faça exames preventivos regulares.',
      'Monitore indicadores de saúde.',
      'Ajuste hábitos conforme necessário.',
    ],
  };
  
  return plans[triage] || plans.geral;
}

/**
 * Gera conselhos não-medicamentosos
 */
export function nonMedicalAdvice(triage: string, _ctx: TriageContext): string[] {
  const advice: Record<string, string[]> = {
    gastro: [
      'Mastigue devagar e evite distrações durante as refeições.',
      'Eleve a cabeceira da cama 15-20 cm para reduzir refluxo.',
      'Evite deitar-se imediatamente após comer.',
      'Pratique respiração diafragmática para relaxar o sistema digestivo.',
    ],
    emagrecimento: [
      'Priorize sono de qualidade (7-9 horas por noite) para regular hormônios do apetite.',
      'Gerencie estresse com técnicas de relaxamento (meditação, respiração, yoga).',
      'Evite dietas restritivas extremas; prefira mudanças graduais e sustentáveis.',
      'Mantenha um diário alimentar para aumentar consciência sobre hábitos.',
    ],
    metabolico: [
      'Priorize sono de qualidade para regular hormônios e metabolismo.',
      'Gerencie estresse com técnicas de relaxamento.',
      'Evite dietas restritivas extremas; prefira mudanças graduais.',
      'Mantenha registro de indicadores de saúde para acompanhamento.',
    ],
    mental: [
      'Pratique técnicas de respiração para controle da ansiedade.',
      'Mantenha rotina regular de sono e alimentação.',
      'Evite isolamento social prolongado.',
      'Pratique atividades que tragam prazer e relaxamento.',
    ],
    geral: [
      'Mantenha rotina regular de sono.',
      'Pratique atividade física regular.',
      'Evite hábitos prejudiciais (tabagismo, álcool excessivo).',
      'Mantenha alimentação equilibrada e hidratação.',
    ],
  };
  
  return advice[triage] || advice.geral;
}

/**
 * Gera texto de quando procurar médico
 */
export function whenToSeekMedical(triage: string, _ctx: TriageContext): string[] {
  const warnings: Record<string, string[]> = {
    gastro: [
      'Procure atendimento imediatamente se houver sangramento nas fezes.',
      'Consulte médico se sintomas persistirem por mais de 2 semanas.',
      'Procure ajuda se houver perda de peso involuntária.',
      'Consulte se houver dificuldade para engolir ou dor intensa.',
    ],
    emagrecimento: [
      'Procure atendimento médico se houver perda de peso muito rápida (mais de 5kg/mês sem esforço).',
      'Consulte endocrinologista se IMC estiver acima de 30 ou se houver comorbidades (diabetes, hipertensão).',
      'Procure ajuda imediata se houver sintomas de distúrbios alimentares ou pensamentos obsessivos sobre comida.',
      'Consulte médico se houver dificuldade para perder peso apesar de mudanças no estilo de vida.',
    ],
    metabolico: [
      'Procure atendimento médico se houver sintomas de descontrole glicêmico (sede excessiva, urina frequente).',
      'Consulte endocrinologista se houver alterações metabólicas significativas.',
      'Procure ajuda se houver sintomas de resistência à insulina ou síndrome metabólica.',
      'Consulte médico para acompanhamento regular de indicadores metabólicos.',
    ],
    mental: [
      'Procure ajuda imediatamente se tiver pensamentos de autolesão.',
      'Consulte profissional se sintomas persistirem por mais de 2 semanas.',
      'Procure ajuda se houver dificuldade para realizar atividades diárias.',
      'Consulte se houver isolamento social prolongado.',
    ],
    geral: [
      'Procure atendimento se sintomas persistirem por mais de 2 semanas.',
      'Consulte médico se houver piora dos sintomas.',
      'Procure ajuda se houver dificuldade para realizar atividades diárias.',
      'Consulte se houver sinais de alerta específicos.',
    ],
  };
  
  return warnings[triage] || warnings.geral;
}

/**
 * Gera evidências científicas (1 linha por estudo)
 */
export function scientificEvidence(triage: string): string[] {
  const evidence: Record<string, string[]> = {
    gastro: [
      'Estudo de 2023 mostra que probióticos reduzem sintomas de IBS em 40% dos pacientes.',
      'Pesquisa indica que exercícios regulares melhoram motilidade intestinal.',
      'Meta-análise confirma benefícios da fibra solúvel para saúde digestiva.',
      'Estudo randomizado demonstra eficácia da respiração diafragmática para refluxo.',
    ],
    emagrecimento: [
      'Estudos clínicos mostram perda média de até 22% do peso corporal com tirzepatida em 72 semanas.',
      '95% dos pacientes perderam pelo menos 5% do peso corporal em estudos controlados.',
      'Meta-análise confirma que tratamento medicamentoso associado a mudanças de estilo de vida aumenta sucesso em 3x.',
      'Estudo randomizado demonstra redução média de 15 cm na circunferência abdominal com tratamento adequado.',
    ],
    metabolico: [
      'Estudos clínicos mostram melhora significativa em indicadores metabólicos com tratamento adequado.',
      'Pesquisa indica que mudanças de estilo de vida reduzem risco cardiovascular em até 40%.',
      'Meta-análise confirma benefícios de tratamento medicamentoso para obesidade e síndrome metabólica.',
      'Estudo randomizado demonstra melhora em controle glicêmico e perfil lipídico com abordagem integrada.',
    ],
    mental: [
      'Meta-análise de 2023 confirma eficácia da meditação para ansiedade e depressão.',
      'Estudo longitudinal mostra que exercícios reduzem sintomas depressivos em 30%.',
      'Pesquisa indica que sono adequado melhora regulação emocional.',
      'Estudo randomizado demonstra benefícios da terapia cognitivo-comportamental.',
    ],
    geral: [
      'Meta-análise confirma benefícios do exercício regular para saúde geral.',
      'Estudo longitudinal mostra que alimentação equilibrada reduz risco de doenças.',
      'Pesquisa indica que sono adequado fortalece sistema imunológico.',
      'Estudo randomizado demonstra eficácia de hábitos saudáveis para longevidade.',
    ],
  };
  
  return evidence[triage] || evidence.geral;
}

/**
 * Gera descrição do Bristol score
 */
function getBristolDescription(score: number): string {
  const descriptions: Record<number, string> = {
    1: 'fezes muito duras e secas (constipação severa)',
    2: 'fezes duras e grumosas (constipação moderada)',
    3: 'fezes com fissuras (constipação leve)',
    4: 'fezes macias e bem formadas (ideal)',
    5: 'fezes macias com bordas bem definidas (normal)',
    6: 'fezes pastosas com bordas irregulares (diarreia leve)',
    7: 'fezes líquidas sem pedaços sólidos (diarreia severa)',
  };
  
  return descriptions[score] || 'padrão não identificado';
}

/**
 * Gera tom de conselho amigável
 */
export function toneAdvice(triage: string, ctx: TriageContext): string {
  const base: string[] = [];
  
  if (ctx.symptom) {
    base.push(`Pelo que você contou, ${ctx.symptom} tem sido o principal incômodo.`);
  }
  
  if (triage === 'gastro' && ctx.bristol) {
    base.push(`Seu padrão de fezes está no Bristol ${ctx.bristol} — já já te explico o que isso indica.`);
  }
  
  if ((triage === 'emagrecimento' || triage === 'metabolico') && ctx.bmi) {
    const bmiValue = typeof ctx.bmi === 'number' ? ctx.bmi : ctx.bmi.bmi;
    base.push(`Seu IMC atual é ${bmiValue.toFixed(1)} — vamos trabalhar juntos para melhorar isso.`);
  }
  
  if (ctx.redFlags?.length) {
    base.push(`Notei ${ctx.redFlags.length} sinal(is) de alerta. Vamos priorizar isso agora.`);
  }
  
  if (ctx.age && ctx.age > 50) {
    base.push(`Na sua idade, é ainda mais importante cuidar bem da saúde.`);
  }
  
  return base.join(' ');
}
