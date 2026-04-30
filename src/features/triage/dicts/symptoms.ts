// src/features/triage/dicts/symptoms.ts
// Dicionários de sintomas por domínio médico

export const SYMPTOMS_BY_DOMAIN = {
  cardiovascular: [
    "Dor no peito",
    "Palpitações",
    "Falta de ar",
    "Fadiga",
    "Tontura",
    "Desmaio",
    "Inchaço nas pernas",
    "Dor no braço esquerdo",
    "Sudorese fria",
    "Náusea"
  ],

  diabetes_metabolismo: [
    "Sede excessiva",
    "Urina frequente",
    "Fome excessiva",
    "Perda de peso",
    "Fadiga",
    "Visão embaçada",
    "Feridas que não cicatrizam",
    "Formigamento nas mãos/pés",
    "Infecções frequentes",
    "Mudanças de humor"
  ],

  dor_cronica: [
    "Dor muscular",
    "Dor articular",
    "Dor de cabeça",
    "Dor nas costas",
    "Dor no pescoço",
    "Dor generalizada",
    "Rigidez matinal",
    "Fadiga",
    "Distúrbios do sono",
    "Problemas de memória"
  ],

  coluna: [
    "Dor lombar",
    "Dor cervical",
    "Dor irradiada",
    "Rigidez",
    "Espasmos musculares",
    "Formigamento",
    "Fraqueza muscular",
    "Dificuldade para caminhar",
    "Perda de equilíbrio",
    "Dor ao sentar"
  ],

  respiratoria: [
    "Tosse",
    "Falta de ar",
    "Chiado no peito",
    "Dor no peito",
    "Catarro",
    "Sangue no catarro",
    "Febre",
    "Fadiga",
    "Perda de peso",
    "Suor noturno"
  ],

  renal: [
    "Dor lombar",
    "Dor ao urinar",
    "Urina escura",
    "Urina com sangue",
    "Urina espumosa",
    "Inchaço",
    "Fadiga",
    "Náusea",
    "Vômito",
    "Perda de apetite"
  ],

  hepatica: [
    "Dor abdominal",
    "Náusea",
    "Vômito",
    "Fadiga",
    "Perda de apetite",
    "Icterícia",
    "Urina escura",
    "Fezes claras",
    "Inchaço abdominal",
    "Coceira"
  ],

  mulher: [
    "Dor pélvica",
    "Irregularidade menstrual",
    "Sangramento excessivo",
    "Dor durante relação",
    "Corrimento vaginal",
    "Dor nas mamas",
    "Fadiga",
    "Mudanças de humor",
    "Ganho de peso",
    "Crescimento de pelos"
  ],

  prostata: [
    "Dificuldade para urinar",
    "Urina frequente",
    "Urgência urinária",
    "Dor ao urinar",
    "Sangue na urina",
    "Dor pélvica",
    "Dor lombar",
    "Disfunção erétil",
    "Dor durante ejaculação",
    "Incontinência"
  ],

  tireoide: [
    "Fadiga",
    "Ganho de peso",
    "Perda de peso",
    "Intolerância ao frio",
    "Intolerância ao calor",
    "Palpitações",
    "Tremor",
    "Ansiedade",
    "Depressão",
    "Problemas de concentração"
  ]
};

export function getSymptomsForDomain(domain: string): string[] {
  return SYMPTOMS_BY_DOMAIN[domain as keyof typeof SYMPTOMS_BY_DOMAIN] || [];
}
