// src/lib/referencesCatalog.ts
// Catálogo de referências médicas confiáveis por tipo de triagem

export interface Reference {
  title: string;
  source: string;
  category: string;
}

export const referencesCatalog: Record<string, Reference[]> = {
  gastro: [
    {
      title: "Diretrizes Brasileiras para Síndrome do Intestino Irritável",
      source: "Sociedade Brasileira de Gastroenterologia",
      category: "Diretrizes Nacionais"
    },
    {
      title: "Functional Gastrointestinal Disorders",
      source: "Rome Foundation",
      category: "Classificação Internacional"
    },
    {
      title: "Dietary Guidelines for Digestive Health",
      source: "World Gastroenterology Organisation",
      category: "Nutrição"
    },
    {
      title: "Probiotics and Prebiotics in Digestive Health",
      source: "Cochrane Reviews",
      category: "Evidências Científicas"
    },
    {
      title: "Stress and Gastrointestinal Function",
      source: "Harvard Medical School",
      category: "Psicossomática"
    }
  ],
  
  depressao: [
    {
      title: "Diretrizes Brasileiras para Depressão",
      source: "Associação Brasileira de Psiquiatria",
      category: "Diretrizes Nacionais"
    },
    {
      title: "Depression Treatment Guidelines",
      source: "American Psychiatric Association",
      category: "Tratamento"
    },
    {
      title: "Exercise for Depression",
      source: "Cochrane Reviews",
      category: "Intervenções Não-Farmacológicas"
    },
    {
      title: "Mindfulness-Based Interventions",
      source: "Journal of Clinical Psychology",
      category: "Terapias Alternativas"
    },
    {
      title: "Sleep and Mental Health",
      source: "World Health Organization",
      category: "Sono e Saúde Mental"
    }
  ],
  
  gestante: [
    {
      title: "Pré-natal de Baixo Risco",
      source: "Ministério da Saúde do Brasil",
      category: "Diretrizes Nacionais"
    },
    {
      title: "Pregnancy Nutrition Guidelines",
      source: "World Health Organization",
      category: "Nutrição"
    },
    {
      title: "Exercise During Pregnancy",
      source: "American College of Obstetricians",
      category: "Atividade Física"
    },
    {
      title: "Prenatal Supplements",
      source: "Cochrane Reviews",
      category: "Suplementação"
    },
    {
      title: "Mental Health in Pregnancy",
      source: "Royal College of Psychiatrists",
      category: "Saúde Mental"
    }
  ],
  
  sono: [
    {
      title: "Diretrizes Brasileiras para Distúrbios do Sono",
      source: "Associação Brasileira do Sono",
      category: "Diretrizes Nacionais"
    },
    {
      title: "Sleep Hygiene Guidelines",
      source: "American Academy of Sleep Medicine",
      category: "Higiene do Sono"
    },
    {
      title: "Cognitive Behavioral Therapy for Insomnia",
      source: "Cochrane Reviews",
      category: "Tratamento"
    },
    {
      title: "Sleep and Circadian Rhythms",
      source: "Harvard Medical School",
      category: "Fisiologia"
    },
    {
      title: "Technology and Sleep Quality",
      source: "Sleep Foundation",
      category: "Fatores Ambientais"
    }
  ],
  
  cancer: [
    {
      title: "Diretrizes Brasileiras para Prevenção do Câncer",
      source: "Instituto Nacional de Câncer",
      category: "Prevenção"
    },
    {
      title: "Cancer Prevention Guidelines",
      source: "World Health Organization",
      category: "Prevenção Global"
    },
    {
      title: "Lifestyle Factors and Cancer Risk",
      source: "American Cancer Society",
      category: "Fatores de Risco"
    },
    {
      title: "Screening Recommendations",
      source: "US Preventive Services Task Force",
      category: "Rastreamento"
    },
    {
      title: "Nutrition and Cancer Prevention",
      source: "Cochrane Reviews",
      category: "Nutrição"
    }
  ],
  
  tabagismo: [
    {
      title: "Diretrizes Brasileiras para Cessação do Tabagismo",
      source: "Ministério da Saúde do Brasil",
      category: "Diretrizes Nacionais"
    },
    {
      title: "Tobacco Cessation Guidelines",
      source: "World Health Organization",
      category: "Cessação"
    },
    {
      title: "Nicotine Replacement Therapy",
      source: "Cochrane Reviews",
      category: "Tratamento"
    },
    {
      title: "Behavioral Interventions for Smoking",
      source: "American Psychological Association",
      category: "Intervenções Comportamentais"
    },
    {
      title: "Secondhand Smoke Effects",
      source: "Centers for Disease Control",
      category: "Exposição Passiva"
    }
  ],
  
  obesidade: [
    {
      title: "Diretrizes Brasileiras para Obesidade",
      source: "Associação Brasileira para Estudo da Obesidade",
      category: "Diretrizes Nacionais"
    },
    {
      title: "Obesity Management Guidelines",
      source: "World Health Organization",
      category: "Manejo"
    },
    {
      title: "Dietary Approaches for Weight Loss",
      source: "Cochrane Reviews",
      category: "Dieta"
    },
    {
      title: "Exercise and Weight Management",
      source: "American College of Sports Medicine",
      category: "Exercício"
    },
    {
      title: "Metabolic Health and Obesity",
      source: "Harvard T.H. Chan School of Public Health",
      category: "Saúde Metabólica"
    }
  ],
  
  estresse: [
    {
      title: "Diretrizes para Manejo do Estresse",
      source: "Conselho Federal de Psicologia",
      category: "Diretrizes Nacionais"
    },
    {
      title: "Stress Management Techniques",
      source: "American Psychological Association",
      category: "Técnicas de Manejo"
    },
    {
      title: "Mindfulness-Based Stress Reduction",
      source: "Cochrane Reviews",
      category: "Mindfulness"
    },
    {
      title: "Workplace Stress Prevention",
      source: "World Health Organization",
      category: "Estresse Laboral"
    },
    {
      title: "Stress and Physical Health",
      source: "Mayo Clinic",
      category: "Saúde Física"
    }
  ],
  
  mental: [
    {
      title: "Diretrizes Brasileiras para Saúde Mental",
      source: "Ministério da Saúde do Brasil",
      category: "Diretrizes Nacionais"
    },
    {
      title: "Mental Health Promotion",
      source: "World Health Organization",
      category: "Promoção"
    },
    {
      title: "Digital Mental Health Interventions",
      source: "Cochrane Reviews",
      category: "Intervenções Digitais"
    },
    {
      title: "Mental Health Stigma Reduction",
      source: "American Psychiatric Association",
      category: "Redução de Estigma"
    },
    {
      title: "Community Mental Health",
      source: "Harvard Medical School",
      category: "Saúde Mental Comunitária"
    }
  ],
  
  geral: [
    {
      title: "Diretrizes Brasileiras para Promoção da Saúde",
      source: "Ministério da Saúde do Brasil",
      category: "Promoção da Saúde"
    },
    {
      title: "Primary Health Care Guidelines",
      source: "World Health Organization",
      category: "Atenção Primária"
    },
    {
      title: "Preventive Medicine Guidelines",
      source: "American College of Preventive Medicine",
      category: "Medicina Preventiva"
    },
    {
      title: "Health Promotion Strategies",
      source: "Cochrane Reviews",
      category: "Estratégias de Promoção"
    },
    {
      title: "Digital Health Interventions",
      source: "Harvard Medical School",
      category: "Saúde Digital"
    }
  ]
};

// Função para obter referências por tipo de triagem
export function getReferencesByType(triageType: string): Reference[] {
  return referencesCatalog[triageType] || referencesCatalog.geral;
}

// Função para obter referências aleatórias (máximo 5)
export function getRandomReferences(triageType: string, maxCount: number = 5): Reference[] {
  const references = getReferencesByType(triageType);
  const shuffled = [...references].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(maxCount, references.length));
}
