// src/features/triage/dicts/redflags.ts
// Red flags por domínio médico para alertas críticos

export type RedFlag = {
  id: string;
  condition: string;
  severity: "high" | "critical";
  message: string;
  cta: "zapvida" | "emergency";
};

export const RED_FLAGS_BY_DOMAIN = {
  cardiovascular: [
    {
      id: "chest_pain_severe",
      condition: "dor_toracica_intensa",
      severity: "critical" as const,
      message: "Dor torácica súbita e intensa pode indicar emergência cardíaca. Procure atendimento médico imediato.",
      cta: "emergency" as const
    },
    {
      id: "syncope",
      condition: "desmaio",
      severity: "critical" as const,
      message: "Desmaio pode indicar problemas cardíacos graves. Procure avaliação médica urgente.",
      cta: "zapvida" as const
    },
    {
      id: "hypertension_severe",
      condition: "pressao_alta_extrema",
      severity: "high" as const,
      message: "Pressão arterial muito elevada requer avaliação médica imediata.",
      cta: "zapvida" as const
    }
  ],
  
  coluna: [
    {
      id: "neurological_deficit",
      condition: "deficit_neurologico",
      severity: "critical" as const,
      message: "Perda de força ou sensibilidade pode indicar compressão nervosa. Procure avaliação médica urgente.",
      cta: "zapvida" as const
    },
    {
      id: "cauda_equina",
      condition: "perda_esfincteres",
      severity: "critical" as const,
      message: "Perda de controle da bexiga ou intestino é emergência médica. Procure atendimento imediato.",
      cta: "emergency" as const
    }
  ],

  respiratoria: [
    {
      id: "severe_dyspnea",
      condition: "falta_ar_repouso",
      severity: "critical" as const,
      message: "Falta de ar em repouso pode indicar emergência respiratória. Procure atendimento médico imediato.",
      cta: "emergency" as const
    },
    {
      id: "cyanosis",
      condition: "cianose",
      severity: "critical" as const,
      message: "Coloração azulada dos lábios ou unhas indica falta de oxigênio. Procure atendimento urgente.",
      cta: "emergency" as const
    }
  ],

  dor_cronica: [
    {
      id: "red_flags_pain",
      condition: "dor_com_red_flags",
      severity: "high" as const,
      message: "Dor com características específicas pode indicar condições graves. Procure avaliação médica.",
      cta: "zapvida" as const
    }
  ],

  diabetes_metabolismo: [
    {
      id: "diabetic_emergency",
      condition: "sintomas_diabeticos_agudos",
      severity: "critical" as const,
      message: "Sintomas de emergência diabética requerem atendimento médico imediato.",
      cta: "emergency" as const
    }
  ],

  renal: [
    {
      id: "renal_failure",
      condition: "sintomas_insuficiencia_renal",
      severity: "critical" as const,
      message: "Sintomas de insuficiência renal requerem avaliação médica urgente.",
      cta: "zapvida" as const
    }
  ],

  hepatica: [
    {
      id: "liver_failure",
      condition: "sintomas_falencia_hepatica",
      severity: "critical" as const,
      message: "Sintomas de falência hepática requerem avaliação médica urgente.",
      cta: "zapvida" as const
    }
  ],

  mulher: [
    {
      id: "pelvic_emergency",
      condition: "dor_pelvica_severa",
      severity: "critical" as const,
      message: "Dor pélvica severa pode indicar emergência ginecológica. Procure atendimento médico.",
      cta: "zapvida" as const
    }
  ],

  prostata: [
    {
      id: "urinary_retention",
      condition: "retencao_urinaria",
      severity: "critical" as const,
      message: "Incapacidade de urinar é emergência médica. Procure atendimento imediato.",
      cta: "emergency" as const
    }
  ],

  tireoide: [
    {
      id: "thyroid_storm",
      condition: "crise_tireoidiana",
      severity: "critical" as const,
      message: "Sintomas de crise tireoidiana requerem atendimento médico urgente.",
      cta: "zapvida" as const
    }
  ]
};

export function getRedFlagsForDomain(domain: string): RedFlag[] {
  return RED_FLAGS_BY_DOMAIN[domain as keyof typeof RED_FLAGS_BY_DOMAIN] || [];
}

export function checkRedFlags(domain: string, answers: Record<string, any>): RedFlag[] {
  const redFlags = getRedFlagsForDomain(domain);
  const triggeredFlags: RedFlag[] = [];
  
  redFlags.forEach(flag => {
    if (answers[flag.condition] === true || answers[flag.condition] === "sim") {
      triggeredFlags.push(flag);
    }
  });
  
  return triggeredFlags;
}
