// src/utils/scales.ts
// Escalas validadas para triagens

export interface ScaleQuestion {
  id: string;
  question: string;
  options: Array<{ value: string; label: string; score: number }>;
}

export interface ScaleResult {
  total: number;
  classification: string;
  interpretation: string;
  recommendations: string[];
}

// PHQ-9 - Escala de Depressão
export const PHQ9_SCALE: ScaleQuestion[] = [
  {
    id: 'phq9_1',
    question: 'Pouco interesse ou prazer em fazer coisas',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'phq9_2',
    question: 'Sentindo-se para baixo, deprimido ou sem esperança',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'phq9_3',
    question: 'Dificuldade para dormir ou dormir demais',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'phq9_4',
    question: 'Sentindo-se cansado ou com pouca energia',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'phq9_5',
    question: 'Pouco apetite ou comendo demais',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'phq9_6',
    question: 'Sentindo-se mal consigo mesmo',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'phq9_7',
    question: 'Dificuldade para se concentrar',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'phq9_8',
    question: 'Movendo-se ou falando muito devagar ou muito rápido',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'phq9_9',
    question: 'Pensamentos de que seria melhor estar morto',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  }
];

// GAD-7 - Escala de Ansiedade
export const GAD7_SCALE: ScaleQuestion[] = [
  {
    id: 'gad7_1',
    question: 'Sentindo-se nervoso, ansioso ou no limite',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'gad7_2',
    question: 'Não sendo capaz de parar ou controlar a preocupação',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'gad7_3',
    question: 'Preocupando-se demais com diferentes coisas',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'gad7_4',
    question: 'Dificuldade para relaxar',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'gad7_5',
    question: 'Ficando tão inquieto que é difícil ficar sentado',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'gad7_6',
    question: 'Tornando-se facilmente irritado ou irritável',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  },
  {
    id: 'gad7_7',
    question: 'Sentindo medo de que algo terrível vai acontecer',
    options: [
      { value: '0', label: 'Nenhum dia', score: 0 },
      { value: '1', label: 'Vários dias', score: 1 },
      { value: '2', label: 'Mais da metade dos dias', score: 2 },
      { value: '3', label: 'Quase todos os dias', score: 3 }
    ]
  }
];

// Escala de Epworth - Sonolência Diurna
export const EPWORTH_SCALE: ScaleQuestion[] = [
  {
    id: 'epworth_1',
    question: 'Sentado e lendo',
    options: [
      { value: '0', label: 'Nunca cochilaria', score: 0 },
      { value: '1', label: 'Pouca chance de cochilar', score: 1 },
      { value: '2', label: 'Chance moderada de cochilar', score: 2 },
      { value: '3', label: 'Alta chance de cochilar', score: 3 }
    ]
  },
  {
    id: 'epworth_2',
    question: 'Assistindo TV',
    options: [
      { value: '0', label: 'Nunca cochilaria', score: 0 },
      { value: '1', label: 'Pouca chance de cochilar', score: 1 },
      { value: '2', label: 'Chance moderada de cochilar', score: 2 },
      { value: '3', label: 'Alta chance de cochilar', score: 3 }
    ]
  },
  {
    id: 'epworth_3',
    question: 'Sentado, inativo, em local público',
    options: [
      { value: '0', label: 'Nunca cochilaria', score: 0 },
      { value: '1', label: 'Pouca chance de cochilar', score: 1 },
      { value: '2', label: 'Chance moderada de cochilar', score: 2 },
      { value: '3', label: 'Alta chance de cochilar', score: 3 }
    ]
  },
  {
    id: 'epworth_4',
    question: 'Como passageiro em carro por 1 hora sem parada',
    options: [
      { value: '0', label: 'Nunca cochilaria', score: 0 },
      { value: '1', label: 'Pouca chance de cochilar', score: 1 },
      { value: '2', label: 'Chance moderada de cochilar', score: 2 },
      { value: '3', label: 'Alta chance de cochilar', score: 3 }
    ]
  },
  {
    id: 'epworth_5',
    question: 'Deitado para descansar à tarde',
    options: [
      { value: '0', label: 'Nunca cochilaria', score: 0 },
      { value: '1', label: 'Pouca chance de cochilar', score: 1 },
      { value: '2', label: 'Chance moderada de cochilar', score: 2 },
      { value: '3', label: 'Alta chance de cochilar', score: 3 }
    ]
  },
  {
    id: 'epworth_6',
    question: 'Sentado e conversando com alguém',
    options: [
      { value: '0', label: 'Nunca cochilaria', score: 0 },
      { value: '1', label: 'Pouca chance de cochilar', score: 1 },
      { value: '2', label: 'Chance moderada de cochilar', score: 2 },
      { value: '3', label: 'Alta chance de cochilar', score: 3 }
    ]
  },
  {
    id: 'epworth_7',
    question: 'Sentado calmamente após almoço sem álcool',
    options: [
      { value: '0', label: 'Nunca cochilaria', score: 0 },
      { value: '1', label: 'Pouca chance de cochilar', score: 1 },
      { value: '2', label: 'Chance moderada de cochilar', score: 2 },
      { value: '3', label: 'Alta chance de cochilar', score: 3 }
    ]
  },
  {
    id: 'epworth_8',
    question: 'No carro, parado no trânsito por alguns minutos',
    options: [
      { value: '0', label: 'Nunca cochilaria', score: 0 },
      { value: '1', label: 'Pouca chance de cochilar', score: 1 },
      { value: '2', label: 'Chance moderada de cochilar', score: 2 },
      { value: '3', label: 'Alta chance de cochilar', score: 3 }
    ]
  }
];

// Função para calcular resultado das escalas
export function calculateScaleResult(scale: ScaleQuestion[], answers: Record<string, string>): ScaleResult {
  const total = scale.reduce((sum, question) => {
    const answer = answers[question.id];
    const option = question.options.find(opt => opt.value === answer);
    return sum + (option?.score || 0);
  }, 0);

  return {
    total,
    classification: getClassification(scale, total),
    interpretation: getInterpretation(scale, total),
    recommendations: getRecommendations(scale, total)
  };
}

function getClassification(scale: ScaleQuestion[], total: number): string {
  if (scale === PHQ9_SCALE) {
    if (total <= 4) return 'Depressão mínima';
    if (total <= 9) return 'Depressão leve';
    if (total <= 14) return 'Depressão moderada';
    if (total <= 19) return 'Depressão moderadamente grave';
    return 'Depressão grave';
  }
  
  if (scale === GAD7_SCALE) {
    if (total <= 4) return 'Ansiedade mínima';
    if (total <= 9) return 'Ansiedade leve';
    if (total <= 14) return 'Ansiedade moderada';
    return 'Ansiedade grave';
  }
  
  if (scale === EPWORTH_SCALE) {
    if (total <= 6) return 'Sonolência normal';
    if (total <= 10) return 'Sonolência leve';
    if (total <= 15) return 'Sonolência moderada';
    return 'Sonolência excessiva';
  }
  
  return 'Não classificado';
}

function getInterpretation(scale: ScaleQuestion[], total: number): string {
  if (scale === PHQ9_SCALE) {
    if (total <= 4) return 'Sintomas de depressão mínimos ou ausentes.';
    if (total <= 9) return 'Sintomas leves de depressão. Pode se beneficiar de mudanças no estilo de vida.';
    if (total <= 14) return 'Sintomas moderados de depressão. Recomenda-se acompanhamento médico.';
    if (total <= 19) return 'Sintomas moderadamente graves de depressão. Necessário acompanhamento médico.';
    return 'Sintomas graves de depressão. Procure ajuda médica imediatamente.';
  }
  
  if (scale === GAD7_SCALE) {
    if (total <= 4) return 'Sintomas de ansiedade mínimos ou ausentes.';
    if (total <= 9) return 'Sintomas leves de ansiedade. Técnicas de relaxamento podem ajudar.';
    if (total <= 14) return 'Sintomas moderados de ansiedade. Recomenda-se acompanhamento médico.';
    return 'Sintomas graves de ansiedade. Procure ajuda médica.';
  }
  
  if (scale === EPWORTH_SCALE) {
    if (total <= 6) return 'Nível normal de sonolência diurna.';
    if (total <= 10) return 'Sonolência leve. Pode indicar privação de sono.';
    if (total <= 15) return 'Sonolência moderada. Pode indicar distúrbio do sono.';
    return 'Sonolência excessiva. Procure avaliação médica para apneia do sono.';
  }
  
  return 'Resultado não interpretado.';
}

function getRecommendations(scale: ScaleQuestion[], total: number): string[] {
  if (scale === PHQ9_SCALE) {
    if (total <= 4) return ['Mantenha hábitos saudáveis', 'Exercite-se regularmente'];
    if (total <= 9) return ['Mantenha rotina de sono', 'Exercite-se regularmente', 'Considere terapia'];
    if (total <= 14) return ['Procure acompanhamento médico', 'Considere terapia', 'Mantenha rotina de sono'];
    return ['Procure ajuda médica imediatamente', 'Considere acompanhamento psiquiátrico', 'Mantenha rede de apoio'];
  }
  
  if (scale === GAD7_SCALE) {
    if (total <= 4) return ['Mantenha hábitos saudáveis', 'Pratique técnicas de relaxamento'];
    if (total <= 9) return ['Pratique meditação', 'Exercite-se regularmente', 'Mantenha rotina de sono'];
    if (total <= 14) return ['Procure acompanhamento médico', 'Considere terapia', 'Pratique técnicas de relaxamento'];
    return ['Procure ajuda médica', 'Considere acompanhamento psiquiátrico', 'Evite cafeína em excesso'];
  }
  
  if (scale === EPWORTH_SCALE) {
    if (total <= 6) return ['Mantenha hábitos de sono regulares'];
    if (total <= 10) return ['Melhore a higiene do sono', 'Evite cafeína à tarde'];
    if (total <= 15) return ['Procure avaliação médica', 'Considere estudo do sono', 'Melhore a higiene do sono'];
    return ['Procure avaliação médica urgente', 'Considere estudo do sono', 'Evite dirigir se sonolento'];
  }
  
  return ['Consulte um médico para avaliação'];
}
