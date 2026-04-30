// src/lib/redFlags.ts
// Sistema de red flags por tipo de triagem (sinais de alerta)

export interface RedFlag {
  id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  action: string;
  category: string;
}

export const redFlagsCatalog: Record<string, RedFlag[]> = {
  gastro: [
    {
      id: 'gastro_blood',
      description: 'Sangue nas fezes ou vômito',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Sangramento'
    },
    {
      id: 'gastro_severe_pain',
      description: 'Dor abdominal intensa e persistente',
      severity: 'high',
      action: 'Procure atendimento médico urgente',
      category: 'Dor'
    },
    {
      id: 'gastro_weight_loss',
      description: 'Perda de peso não intencional (>5kg em 3 meses)',
      severity: 'high',
      action: 'Consulte um médico para investigação',
      category: 'Perda de Peso'
    },
    {
      id: 'gastro_difficulty_swallowing',
      description: 'Dificuldade para engolir alimentos',
      severity: 'high',
      action: 'Procure avaliação médica especializada',
      category: 'Disfagia'
    },
    {
      id: 'gastro_persistent_nausea',
      description: 'Náuseas persistentes por mais de 1 semana',
      severity: 'medium',
      action: 'Consulte um médico se persistir',
      category: 'Náuseas'
    },
    {
      id: 'gastro_chronic_diarrhea',
      description: 'Diarreia crônica (>2 semanas)',
      severity: 'medium',
      action: 'Procure avaliação médica',
      category: 'Diarreia'
    }
  ],
  
  depressao: [
    {
      id: 'depression_suicidal_thoughts',
      description: 'Pensamentos de morte ou suicídio',
      severity: 'high',
      action: 'Procure ajuda imediata - CVV 188',
      category: 'Risco de Suicídio'
    },
    {
      id: 'depression_severe_functional_impairment',
      description: 'Incapacidade de realizar atividades básicas',
      severity: 'high',
      action: 'Procure atendimento psiquiátrico urgente',
      category: 'Comprometimento Funcional'
    },
    {
      id: 'depression_psychotic_symptoms',
      description: 'Alucinações ou delírios',
      severity: 'high',
      action: 'Procure atendimento psiquiátrico imediato',
      category: 'Sintomas Psicóticos'
    },
    {
      id: 'depression_severe_anxiety',
      description: 'Ansiedade severa com ataques de pânico',
      severity: 'medium',
      action: 'Consulte um profissional de saúde mental',
      category: 'Ansiedade'
    },
    {
      id: 'depression_substance_abuse',
      description: 'Uso excessivo de álcool ou drogas',
      severity: 'medium',
      action: 'Procure ajuda especializada',
      category: 'Uso de Substâncias'
    },
    {
      id: 'depression_persistent_symptoms',
      description: 'Sintomas depressivos por mais de 2 semanas',
      severity: 'medium',
      action: 'Consulte um profissional de saúde mental',
      category: 'Sintomas Persistentes'
    }
  ],
  
  gestante: [
    {
      id: 'pregnancy_severe_bleeding',
      description: 'Sangramento vaginal intenso',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Sangramento'
    },
    {
      id: 'pregnancy_severe_pain',
      description: 'Dor abdominal intensa e persistente',
      severity: 'high',
      action: 'Procure atendimento médico urgente',
      category: 'Dor'
    },
    {
      id: 'pregnancy_high_fever',
      description: 'Febre alta (>38°C)',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Febre'
    },
    {
      id: 'pregnancy_severe_nausea',
      description: 'Náuseas e vômitos excessivos',
      severity: 'medium',
      action: 'Consulte seu obstetra',
      category: 'Náuseas'
    },
    {
      id: 'pregnancy_swelling',
      description: 'Inchaço súbito nas mãos e rosto',
      severity: 'medium',
      action: 'Procure avaliação médica',
      category: 'Edema'
    },
    {
      id: 'pregnancy_reduced_movement',
      description: 'Redução significativa dos movimentos fetais',
      severity: 'medium',
      action: 'Consulte seu obstetra imediatamente',
      category: 'Movimentos Fetais'
    }
  ],
  
  sono: [
    {
      id: 'sleep_breathing_pauses',
      description: 'Pausas na respiração durante o sono',
      severity: 'high',
      action: 'Procure avaliação médica especializada',
      category: 'Apneia do Sono'
    },
    {
      id: 'sleep_excessive_daytime_sleepiness',
      description: 'Sonolência excessiva durante o dia',
      severity: 'high',
      action: 'Consulte um médico especialista em sono',
      category: 'Sonolência Diurna'
    },
    {
      id: 'sleep_chronic_insomnia',
      description: 'Insônia crônica (>3 meses)',
      severity: 'medium',
      action: 'Procure ajuda médica especializada',
      category: 'Insônia'
    },
    {
      id: 'sleep_nightmares',
      description: 'Pesadelos frequentes e perturbadores',
      severity: 'medium',
      action: 'Consulte um profissional de saúde mental',
      category: 'Pesadelos'
    },
    {
      id: 'sleep_restless_legs',
      description: 'Síndrome das pernas inquietas',
      severity: 'medium',
      action: 'Procure avaliação médica',
      category: 'Movimentos Involuntários'
    }
  ],
  
  cancer: [
    {
      id: 'cancer_unexplained_weight_loss',
      description: 'Perda de peso inexplicável (>5kg em 3 meses)',
      severity: 'high',
      action: 'Procure avaliação médica imediatamente',
      category: 'Perda de Peso'
    },
    {
      id: 'cancer_persistent_lump',
      description: 'Nódulo ou massa persistente',
      severity: 'high',
      action: 'Procure avaliação médica urgente',
      category: 'Nódulos'
    },
    {
      id: 'cancer_persistent_cough',
      description: 'Tosse persistente por mais de 3 semanas',
      severity: 'medium',
      action: 'Consulte um médico para investigação',
      category: 'Tosse'
    },
    {
      id: 'cancer_unusual_bleeding',
      description: 'Sangramento incomum ou secreções',
      severity: 'medium',
      action: 'Procure avaliação médica',
      category: 'Sangramento'
    },
    {
      id: 'cancer_persistent_pain',
      description: 'Dor persistente sem causa aparente',
      severity: 'medium',
      action: 'Consulte um médico para investigação',
      category: 'Dor'
    },
    {
      id: 'cancer_fatigue',
      description: 'Fadiga extrema e persistente',
      severity: 'medium',
      action: 'Procure avaliação médica',
      category: 'Fadiga'
    }
  ],
  
  tabagismo: [
    {
      id: 'smoking_chest_pain',
      description: 'Dor no peito ou falta de ar',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Sintomas Cardíacos'
    },
    {
      id: 'smoking_coughing_blood',
      description: 'Tosse com sangue',
      severity: 'high',
      action: 'Procure atendimento médico urgente',
      category: 'Sangramento'
    },
    {
      id: 'smoking_severe_shortness_breath',
      description: 'Falta de ar severa',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Respiração'
    },
    {
      id: 'smoking_persistent_cough',
      description: 'Tosse persistente por mais de 3 semanas',
      severity: 'medium',
      action: 'Consulte um médico para investigação',
      category: 'Tosse'
    },
    {
      id: 'smoking_wheezing',
      description: 'Chiado no peito',
      severity: 'medium',
      action: 'Procure avaliação médica',
      category: 'Respiração'
    }
  ],
  
  obesidade: [
    {
      id: 'obesity_chest_pain',
      description: 'Dor no peito ou palpitações',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Sintomas Cardíacos'
    },
    {
      id: 'obesity_severe_shortness_breath',
      description: 'Falta de ar severa',
      severity: 'high',
      action: 'Procure atendimento médico urgente',
      category: 'Respiração'
    },
    {
      id: 'obesity_diabetes_symptoms',
      description: 'Sede excessiva, urina frequente, visão turva',
      severity: 'high',
      action: 'Procure avaliação médica imediatamente',
      category: 'Diabetes'
    },
    {
      id: 'obesity_high_blood_pressure',
      description: 'Pressão arterial elevada persistente',
      severity: 'medium',
      action: 'Consulte um médico para controle',
      category: 'Pressão Arterial'
    },
    {
      id: 'obesity_joint_pain',
      description: 'Dor articular severa',
      severity: 'medium',
      action: 'Procure avaliação médica',
      category: 'Articulações'
    }
  ],
  
  estresse: [
    {
      id: 'stress_chest_pain',
      description: 'Dor no peito ou palpitações',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Sintomas Cardíacos'
    },
    {
      id: 'stress_suicidal_thoughts',
      description: 'Pensamentos de morte ou suicídio',
      severity: 'high',
      action: 'Procure ajuda imediata - CVV 188',
      category: 'Risco de Suicídio'
    },
    {
      id: 'stress_panic_attacks',
      description: 'Ataques de pânico frequentes',
      severity: 'medium',
      action: 'Consulte um profissional de saúde mental',
      category: 'Ataques de Pânico'
    },
    {
      id: 'stress_severe_insomnia',
      description: 'Insônia severa por mais de 1 semana',
      severity: 'medium',
      action: 'Procure ajuda médica especializada',
      category: 'Sono'
    },
    {
      id: 'stress_substance_abuse',
      description: 'Uso excessivo de álcool ou drogas',
      severity: 'medium',
      action: 'Procure ajuda especializada',
      category: 'Uso de Substâncias'
    }
  ],
  
  mental: [
    {
      id: 'mental_suicidal_thoughts',
      description: 'Pensamentos de morte ou suicídio',
      severity: 'high',
      action: 'Procure ajuda imediata - CVV 188',
      category: 'Risco de Suicídio'
    },
    {
      id: 'mental_psychotic_symptoms',
      description: 'Alucinações ou delírios',
      severity: 'high',
      action: 'Procure atendimento psiquiátrico imediato',
      category: 'Sintomas Psicóticos'
    },
    {
      id: 'mental_severe_functional_impairment',
      description: 'Incapacidade de realizar atividades básicas',
      severity: 'high',
      action: 'Procure atendimento psiquiátrico urgente',
      category: 'Comprometimento Funcional'
    },
    {
      id: 'mental_severe_anxiety',
      description: 'Ansiedade severa com ataques de pânico',
      severity: 'medium',
      action: 'Consulte um profissional de saúde mental',
      category: 'Ansiedade'
    },
    {
      id: 'mental_substance_abuse',
      description: 'Uso excessivo de álcool ou drogas',
      severity: 'medium',
      action: 'Procure ajuda especializada',
      category: 'Uso de Substâncias'
    }
  ],
  
  geral: [
    {
      id: 'general_severe_pain',
      description: 'Dor severa e persistente',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Dor'
    },
    {
      id: 'general_high_fever',
      description: 'Febre alta (>39°C)',
      severity: 'high',
      action: 'Procure atendimento médico urgente',
      category: 'Febre'
    },
    {
      id: 'general_severe_bleeding',
      description: 'Sangramento severo',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Sangramento'
    },
    {
      id: 'general_severe_shortness_breath',
      description: 'Falta de ar severa',
      severity: 'high',
      action: 'Procure atendimento médico urgente',
      category: 'Respiração'
    },
    {
      id: 'general_chest_pain',
      description: 'Dor no peito',
      severity: 'high',
      action: 'Procure atendimento médico imediatamente',
      category: 'Sintomas Cardíacos'
    }
  ]
};

// Função para obter red flags por tipo de triagem
export function getRedFlagsByType(triageType: string): RedFlag[] {
  return redFlagsCatalog[triageType] || redFlagsCatalog.geral;
}

// Função para filtrar red flags por severidade
export function getRedFlagsBySeverity(triageType: string, severity: 'high' | 'medium' | 'low'): RedFlag[] {
  const flags = getRedFlagsByType(triageType);
  return flags.filter(flag => flag.severity === severity);
}

// Função para obter red flags baseadas nas respostas do usuário
export function getRelevantRedFlags(triageType: string, userResponses: Record<string, any>): RedFlag[] {
  const allFlags = getRedFlagsByType(triageType);
  const relevantFlags: RedFlag[] = [];
  
  // Lógica simples para detectar red flags baseadas nas respostas
  // Esta função pode ser expandida com mais lógica específica
  
  Object.entries(userResponses).forEach(([, value]) => {
    if (typeof value === 'string' && value.toLowerCase().includes('sangue')) {
      const bloodFlags = allFlags.filter(flag => 
        flag.description.toLowerCase().includes('sangue') || 
        flag.description.toLowerCase().includes('sangramento')
      );
      relevantFlags.push(...bloodFlags);
    }
    
    if (typeof value === 'string' && value.toLowerCase().includes('dor')) {
      const painFlags = allFlags.filter(flag => 
        flag.description.toLowerCase().includes('dor')
      );
      relevantFlags.push(...painFlags);
    }
    
    if (typeof value === 'string' && value.toLowerCase().includes('suicídio')) {
      const suicideFlags = allFlags.filter(flag => 
        flag.description.toLowerCase().includes('suicídio') || 
        flag.description.toLowerCase().includes('morte')
      );
      relevantFlags.push(...suicideFlags);
    }
  });
  
  // Remover duplicatas
  const uniqueFlags = relevantFlags.filter((flag, index, self) => 
    index === self.findIndex(f => f.id === flag.id)
  );
  
  return uniqueFlags;
}
