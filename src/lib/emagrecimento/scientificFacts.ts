// src/lib/emagrecimento/scientificFacts.ts
// Curiosidades científicas verdadeiras para o relatório de emagrecimento

export interface ScientificFact {
  id: string;
  title: string; // Frase curta "Você sabia que..."
  description: string; // Explicação simples
  tags: string[]; // ['sono'], ['atividade_fisica'], ['microbiota'], etc.
}

export const scientificFacts: ScientificFact[] = [
  {
    id: 'sleep-appetite',
    title: 'Você sabia que dormir pouco aumenta a fome?',
    description: 'Quando dormimos menos de 6-7 horas, nosso corpo produz mais grelina (hormônio da fome) e menos leptina (hormônio da saciedade). Isso pode fazer você sentir mais fome e ter mais dificuldade para controlar o apetite durante o dia.',
    tags: ['sono', 'apetite', 'hormonios']
  },
  {
    id: 'microbiota-weight',
    title: 'Você sabia que as bactérias do seu intestino influenciam o peso?',
    description: 'A microbiota intestinal (as bactérias boas do seu intestino) ajuda a regular como seu corpo processa os alimentos e armazena gordura. Uma alimentação rica em fibras e vegetais alimenta essas bactérias benéficas e pode ajudar no controle do peso.',
    tags: ['microbiota', 'alimentacao', 'intestino']
  },
  {
    id: 'small-changes-big-impact',
    title: 'Você sabia que pequenas mudanças têm grande impacto ao longo do tempo?',
    description: 'Estudos mostram que mudanças pequenas e sustentáveis (como caminhar 10 minutos a mais por dia ou trocar um refrigerante por água) podem levar a perda de peso significativa quando mantidas por 6 a 12 meses. A consistência é mais importante que a velocidade.',
    tags: ['habitos', 'sustentabilidade', 'mudancas']
  },
  {
    id: 'muscle-metabolism',
    title: 'Você sabia que músculos queimam mais calorias mesmo em repouso?',
    description: 'Quanto mais massa muscular você tem, mais calorias seu corpo queima naturalmente, mesmo quando está descansando. Por isso, atividades que fortalecem músculos são importantes para manter o peso a longo prazo, além de melhorar a força e a disposição.',
    tags: ['atividade_fisica', 'metabolismo', 'musculos']
  },
  {
    id: 'water-metabolism',
    title: 'Você sabia que beber água pode ajudar no metabolismo?',
    description: 'Manter-se bem hidratado ajuda o corpo a funcionar melhor, incluindo o metabolismo. Além disso, às vezes confundimos sede com fome. Beber água antes das refeições também pode ajudar a sentir saciedade mais rápido.',
    tags: ['hidratacao', 'metabolismo', 'alimentacao']
  },
  {
    id: 'protein-satiety',
    title: 'Você sabia que proteínas ajudam a sentir mais saciedade?',
    description: 'Alimentos ricos em proteínas (como ovos, peixes, frango, feijões) demoram mais para serem digeridos e ajudam a manter a sensação de saciedade por mais tempo. Isso pode reduzir a vontade de comer entre as refeições.',
    tags: ['alimentacao', 'proteina', 'saciedade']
  },
  {
    id: 'stress-weight',
    title: 'Você sabia que o estresse crônico pode dificultar a perda de peso?',
    description: 'Quando estamos estressados por muito tempo, nosso corpo produz mais cortisol, um hormônio que pode aumentar o apetite e facilitar o acúmulo de gordura, especialmente na região abdominal. Gerenciar o estresse é parte importante do processo.',
    tags: ['estresse', 'hormonios', 'saude_mental']
  },
  {
    id: 'breakfast-metabolism',
    title: 'Você sabia que não pular refeições ajuda o metabolismo?',
    description: 'Quando ficamos muito tempo sem comer, o corpo pode entrar em "modo economia" e queimar menos calorias. Fazer refeições regulares e equilibradas ajuda a manter o metabolismo funcionando bem ao longo do dia.',
    tags: ['alimentacao', 'metabolismo', 'refeicoes']
  },
  {
    id: 'fiber-satiety',
    title: 'Você sabia que fibras ajudam a controlar o apetite?',
    description: 'Alimentos ricos em fibras (como frutas, vegetais, grãos integrais) demoram mais para serem digeridos e ajudam a manter a sensação de saciedade. Além disso, alimentam as bactérias boas do intestino, que também influenciam o peso.',
    tags: ['alimentacao', 'fibras', 'saciedade', 'microbiota']
  },
  {
    id: 'sleep-recovery',
    title: 'Você sabia que dormir bem ajuda na recuperação muscular?',
    description: 'Durante o sono profundo, o corpo produz hormônios que ajudam na recuperação e crescimento muscular. Isso é importante porque músculos mais fortes queimam mais calorias e ajudam a manter o peso a longo prazo.',
    tags: ['sono', 'atividade_fisica', 'recuperacao']
  }
];

/**
 * Gera um número pseudoaleatório determinístico baseado em uma string seed
 */
function deterministicRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Normalizar para 0-1
  return Math.abs(hash) / 2147483647;
}

/**
 * Embaralha array de forma determinística usando seed
 */
function deterministicShuffle<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];
  let currentSeed = seed;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const random = deterministicRandom(currentSeed);
    const j = Math.floor(random * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    // Atualizar seed para próxima iteração
    currentSeed = `${currentSeed}-${i}`;
  }
  
  return shuffled;
}

/**
 * Retorna curiosidades científicas relevantes para o perfil do paciente
 * @param basics Informações básicas do paciente
 * @param comorbidades Lista de comorbidades
 * @param count Quantidade de fatos a retornar
 * @param seed Seed determinístico para garantir consistência entre servidor e cliente (ex: triageId ou reportId)
 */
export function getScientificFactsForProfile(
  basics: { age?: number; sex?: string },
  comorbidades: string[],
  count: number = 2,
  seed?: string
): ScientificFact[] {
  // Criar seed determinístico se não fornecido
  const deterministicSeed = seed || `${basics.age || 0}-${basics.sex || 'unknown'}-${comorbidades.join('-')}`;
  
  // Se não há comorbidades específicas, retornar fatos gerais
  if (comorbidades.length === 0) {
    const generalFacts = scientificFacts.filter(fact => 
      fact.tags.includes('alimentacao') || 
      fact.tags.includes('atividade_fisica') || 
      fact.tags.includes('sono')
    );
    const shuffled = deterministicShuffle(generalFacts, deterministicSeed);
    return shuffled.slice(0, count);
  }
  
  // Priorizar fatos relevantes às comorbidades
  const relevantTags: string[] = [];
  
  if (comorbidades.some(c => c.toLowerCase().includes('diabetes') || c.toLowerCase().includes('glicose'))) {
    relevantTags.push('alimentacao', 'metabolismo');
  }
  if (comorbidades.some(c => c.toLowerCase().includes('pressão') || c.toLowerCase().includes('hipertensão'))) {
    relevantTags.push('alimentacao', 'atividade_fisica');
  }
  if (comorbidades.some(c => c.toLowerCase().includes('apneia') || c.toLowerCase().includes('sono'))) {
    relevantTags.push('sono', 'recuperacao');
  }
  
  // Se há tags relevantes, priorizar fatos com essas tags
  if (relevantTags.length > 0) {
    const relevantFacts = scientificFacts.filter(fact =>
      fact.tags.some(tag => relevantTags.includes(tag))
    );
    
    if (relevantFacts.length >= count) {
      const shuffled = deterministicShuffle(relevantFacts, deterministicSeed);
      return shuffled.slice(0, count);
    }
    
    // Se não há fatos suficientes, completar com fatos gerais
    const remaining = count - relevantFacts.length;
    const generalFacts = scientificFacts.filter(fact => 
      !relevantFacts.includes(fact) &&
      (fact.tags.includes('alimentacao') || fact.tags.includes('atividade_fisica'))
    );
    const shuffledGeneral = deterministicShuffle(generalFacts, `${deterministicSeed}-general`);
    return [...relevantFacts, ...shuffledGeneral.slice(0, remaining)];
  }
  
  // Fallback: retornar fatos determinísticos
  const shuffled = deterministicShuffle(scientificFacts, deterministicSeed);
  return shuffled.slice(0, count);
}

