// src/lib/medicalScales.ts
// Escalas médicas padronizadas para triagens

export interface ScaleItem {
  value: number;
  label: string;
  description?: string;
}

export interface MedicalScale {
  name: string;
  description: string;
  items: ScaleItem[];
  interpretation: {
    min: number;
    max: number;
    levels: Array<{
      range: [number, number];
      label: string;
      description: string;
    }>;
  };
}

// Escala PHQ-9 (Depressão)
export const PHQ9_SCALE: MedicalScale = {
  name: "PHQ-9",
  description: "Escala de Depressão do Patient Health Questionnaire",
  items: [
    { value: 0, label: "Nenhum dia", description: "Não sentiu isso" },
    { value: 1, label: "Vários dias", description: "Sentiu isso alguns dias" },
    { value: 2, label: "Mais da metade dos dias", description: "Sentiu isso frequentemente" },
    { value: 3, label: "Quase todos os dias", description: "Sentiu isso quase sempre" }
  ],
  interpretation: {
    min: 0,
    max: 27,
    levels: [
      { range: [0, 4], label: "Mínima", description: "Sintomas mínimos de depressão" },
      { range: [5, 9], label: "Leve", description: "Depressão leve" },
      { range: [10, 14], label: "Moderada", description: "Depressão moderada" },
      { range: [15, 19], label: "Moderadamente severa", description: "Depressão moderadamente severa" },
      { range: [20, 27], label: "Severa", description: "Depressão severa" }
    ]
  }
};

// Escala GAD-7 (Ansiedade)
export const GAD7_SCALE: MedicalScale = {
  name: "GAD-7",
  description: "Escala de Ansiedade Generalizada",
  items: [
    { value: 0, label: "Nenhum dia", description: "Não sentiu isso" },
    { value: 1, label: "Vários dias", description: "Sentiu isso alguns dias" },
    { value: 2, label: "Mais da metade dos dias", description: "Sentiu isso frequentemente" },
    { value: 3, label: "Quase todos os dias", description: "Sentiu isso quase sempre" }
  ],
  interpretation: {
    min: 0,
    max: 21,
    levels: [
      { range: [0, 4], label: "Mínima", description: "Ansiedade mínima" },
      { range: [5, 9], label: "Leve", description: "Ansiedade leve" },
      { range: [10, 14], label: "Moderada", description: "Ansiedade moderada" },
      { range: [15, 21], label: "Severa", description: "Ansiedade severa" }
    ]
  }
};

// Escala de Epworth (Sonolência)
export const EPWORTH_SCALE: MedicalScale = {
  name: "Epworth",
  description: "Escala de Sonolência de Epworth",
  items: [
    { value: 0, label: "Nunca", description: "Nunca cochilaria" },
    { value: 1, label: "Pouca chance", description: "Pouca chance de cochilar" },
    { value: 2, label: "Chance moderada", description: "Chance moderada de cochilar" },
    { value: 3, label: "Alta chance", description: "Alta chance de cochilar" }
  ],
  interpretation: {
    min: 0,
    max: 24,
    levels: [
      { range: [0, 7], label: "Normal", description: "Sonolência normal" },
      { range: [8, 9], label: "Limítrofe", description: "Sonolência limítrofe" },
      { range: [10, 15], label: "Moderada", description: "Sonolência moderada" },
      { range: [16, 24], label: "Severa", description: "Sonolência severa" }
    ]
  }
};

// Escala de Dor (0-10)
export const PAIN_SCALE: MedicalScale = {
  name: "Escala de Dor",
  description: "Escala Visual Analógica de Dor",
  items: [
    { value: 0, label: "Sem dor", description: "Nenhuma dor" },
    { value: 1, label: "1", description: "Dor muito leve" },
    { value: 2, label: "2", description: "Dor leve" },
    { value: 3, label: "3", description: "Dor leve a moderada" },
    { value: 4, label: "4", description: "Dor moderada" },
    { value: 5, label: "5", description: "Dor moderada a forte" },
    { value: 6, label: "6", description: "Dor forte" },
    { value: 7, label: "7", description: "Dor muito forte" },
    { value: 8, label: "8", description: "Dor intensa" },
    { value: 9, label: "9", description: "Dor muito intensa" },
    { value: 10, label: "Dor insuportável", description: "Dor máxima" }
  ],
  interpretation: {
    min: 0,
    max: 10,
    levels: [
      { range: [0, 3], label: "Leve", description: "Dor leve" },
      { range: [4, 6], label: "Moderada", description: "Dor moderada" },
      { range: [7, 10], label: "Severa", description: "Dor severa" }
    ]
  }
};

// Escala de Frequência (Sintomas)
export const FREQUENCY_SCALE: MedicalScale = {
  name: "Frequência",
  description: "Escala de Frequência de Sintomas",
  items: [
    { value: 0, label: "Nunca", description: "Nunca acontece" },
    { value: 1, label: "Raramente", description: "Menos de uma vez por semana" },
    { value: 2, label: "Ocasionalmente", description: "Uma vez por semana" },
    { value: 3, label: "Frequentemente", description: "Várias vezes por semana" },
    { value: 4, label: "Sempre", description: "Todos os dias" }
  ],
  interpretation: {
    min: 0,
    max: 4,
    levels: [
      { range: [0, 1], label: "Baixa", description: "Frequência baixa" },
      { range: [2, 3], label: "Moderada", description: "Frequência moderada" },
      { range: [4, 4], label: "Alta", description: "Frequência alta" }
    ]
  }
};

// Escala de Satisfação
export const SATISFACTION_SCALE: MedicalScale = {
  name: "Satisfação",
  description: "Escala de Satisfação",
  items: [
    { value: 1, label: "Muito insatisfeito", description: "Completamente insatisfeito" },
    { value: 2, label: "Insatisfeito", description: "Insatisfeito" },
    { value: 3, label: "Neutro", description: "Nem satisfeito nem insatisfeito" },
    { value: 4, label: "Satisfeito", description: "Satisfeito" },
    { value: 5, label: "Muito satisfeito", description: "Completamente satisfeito" }
  ],
  interpretation: {
    min: 1,
    max: 5,
    levels: [
      { range: [1, 2], label: "Baixa", description: "Satisfação baixa" },
      { range: [3, 3], label: "Neutra", description: "Satisfação neutra" },
      { range: [4, 5], label: "Alta", description: "Satisfação alta" }
    ]
  }
};

// Catálogo de escalas por tipo de triagem
export const SCALES_BY_TRIAGE: Record<string, MedicalScale[]> = {
  depressao: [PHQ9_SCALE, GAD7_SCALE, SATISFACTION_SCALE],
  mental: [PHQ9_SCALE, GAD7_SCALE, SATISFACTION_SCALE],
  estresse: [GAD7_SCALE, SATISFACTION_SCALE],
  sono: [EPWORTH_SCALE, FREQUENCY_SCALE],
  gastro: [PAIN_SCALE, FREQUENCY_SCALE],
  gestante: [PAIN_SCALE, SATISFACTION_SCALE],
  cancer: [PAIN_SCALE, FREQUENCY_SCALE],
  tabagismo: [FREQUENCY_SCALE, SATISFACTION_SCALE],
  obesidade: [SATISFACTION_SCALE, FREQUENCY_SCALE],
  geral: [PAIN_SCALE, FREQUENCY_SCALE, SATISFACTION_SCALE]
};

// Função para obter escalas por tipo de triagem
export function getScalesByTriage(triageType: string): MedicalScale[] {
  return SCALES_BY_TRIAGE[triageType] || SCALES_BY_TRIAGE.geral;
}

// Função para interpretar pontuação de escala
export function interpretScaleScore(scale: MedicalScale, score: number): string {
  const level = scale.interpretation.levels.find(l => 
    score >= l.range[0] && score <= l.range[1]
  );
  
  return level ? `${level.label}: ${level.description}` : "Pontuação fora do range esperado";
}

// Função para calcular pontuação total de uma escala
export function calculateScaleScore(responses: number[]): number {
  return responses.reduce((sum, response) => sum + response, 0);
}
