#!/usr/bin/env node

// scripts/generate-triage.ts
// Gerador automatizado de triagens baseado no catálogo

import fs from 'fs';
import path from 'path';

import { TRIAGE_CATALOG } from '../src/features/triage/catalog';

console.log('🚀 Iniciando geração de triagens...');

// Template para formulário de triagem
const FORM_TEMPLATE = `import type { Step } from '@/types/triagem';

export const perguntas{SLUG}: Step[] = [
  {
    type: 'intro',
    name: 'intro',
    label: '{TITLE}',
    description: '{SUBTITLE}. Responda em ~{DURATION}. Geramos um plano claro com prioridades e próximos passos.',
    justification: 'Leva de {DURATION} para completar.',
  },

  // Dados básicos (se não coletados anteriormente)
  {
    type: 'setor',
    name: 'setor_dados_basicos',
    label: '📋 Dados Básicos',
    description: 'Informações essenciais para personalizar sua triagem.',
  },
  {
    type: 'select',
    name: 'sexo',
    label: 'Sexo',
    options: ['Masculino', 'Feminino', 'Outro'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'dados_basicos',
  },
  {
    type: 'input',
    name: 'idade',
    label: 'Idade',
    placeholder: 'Ex: 35',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'dados_basicos',
  },
  {
    type: 'input',
    name: 'peso',
    label: 'Peso (kg)',
    placeholder: 'Ex: 70.5',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'dados_basicos',
  },
  {
    type: 'input',
    name: 'altura',
    label: 'Altura (cm)',
    placeholder: 'Ex: 175',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'dados_basicos',
  },

  // Sintomas principais
  {
    type: 'setor',
    name: 'setor_sintomas',
    label: '🔍 Sintomas Principais',
    description: 'Identifique os sintomas relacionados à {CATEGORY}.',
  },
  {
    type: 'multiselect',
    name: 'sintomas_principais',
    label: 'Quais sintomas você apresenta?',
    options: {SYMPTOMS_OPTIONS},
    required: true,
    prioridade: 'alta',
    categoriaIA: 'sintomas',
  },
  {
    type: 'select',
    name: 'intensidade_sintomas',
    label: 'Como você avalia a intensidade dos sintomas?',
    options: ['Leve', 'Moderada', 'Intensa', 'Muito intensa'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'sintomas',
  },
  {
    type: 'select',
    name: 'duracao_sintomas',
    label: 'Há quanto tempo você apresenta esses sintomas?',
    options: ['Menos de 1 semana', '1-4 semanas', '1-3 meses', '3-6 meses', 'Mais de 6 meses'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'sintomas',
  },

  // Red flags
  {
    type: 'setor',
    name: 'setor_red_flags',
    label: '🚨 Sinais de Alerta',
    description: 'Identifique sinais que requerem atenção médica imediata.',
  },
  {RED_FLAGS_QUESTIONS}

  // Histórico e fatores de risco
  {
    type: 'setor',
    name: 'setor_historico',
    label: '📚 Histórico e Fatores de Risco',
    description: 'Informações sobre seu histórico médico e familiar.',
  },
  {
    type: 'multiselect',
    name: 'historico_familiar',
    label: 'Há histórico familiar de problemas relacionados?',
    options: ['Sim, na família', 'Não sei', 'Não'],
    required: true,
    prioridade: 'media',
    categoriaIA: 'historico',
  },
  {
    type: 'multiselect',
    name: 'medicamentos',
    label: 'Você toma algum medicamento regularmente?',
    options: ['Sim', 'Não', 'Prefiro não informar'],
    required: true,
    prioridade: 'media',
    categoriaIA: 'historico',
  },
  {
    type: 'multiselect',
    name: 'comorbidades',
    label: 'Você possui alguma dessas condições?',
    options: ['Diabetes', 'Hipertensão', 'Colesterol alto', 'Nenhuma das anteriores'],
    required: true,
    prioridade: 'media',
    categoriaIA: 'historico',
  },

  // Estilo de vida
  {
    type: 'setor',
    name: 'setor_estilo_vida',
    label: '🏃 Estilo de Vida',
    description: 'Informações sobre seus hábitos e rotina.',
  },
  {
    type: 'select',
    name: 'atividade_fisica',
    label: 'Com que frequência você pratica atividade física?',
    options: ['Diariamente', '3-4x por semana', '1-2x por semana', 'Raramente', 'Nunca'],
    required: true,
    prioridade: 'media',
    categoriaIA: 'estilo_vida',
  },
  {
    type: 'select',
    name: 'qualidade_sono',
    label: 'Como você avalia a qualidade do seu sono?',
    options: ['Excelente', 'Boa', 'Regular', 'Ruim', 'Muito ruim'],
    required: true,
    prioridade: 'media',
    categoriaIA: 'estilo_vida',
  },
  {
    type: 'select',
    name: 'nivel_estresse',
    label: 'Como você avalia seu nível de estresse atual?',
    options: ['Muito baixo', 'Baixo', 'Moderado', 'Alto', 'Muito alto'],
    required: true,
    prioridade: 'media',
    categoriaIA: 'estilo_vida',
  },

  // Impacto e objetivos
  {
    type: 'setor',
    name: 'setor_objetivos',
    label: '🎯 Impacto e Objetivos',
    description: 'Como isso afeta sua vida e quais são seus objetivos.',
  },
  {
    type: 'select',
    name: 'impacto_vida',
    label: 'Como isso afeta sua qualidade de vida?',
    options: ['Não afeta', 'Afeta pouco', 'Afeta moderadamente', 'Afeta muito', 'Afeta extremamente'],
    required: true,
    prioridade: 'baixa',
    categoriaIA: 'objetivos',
  },
  {
    type: 'textarea',
    name: 'objetivos',
    label: 'Quais são seus principais objetivos relacionados à saúde?',
    placeholder: 'Ex: Reduzir sintomas, melhorar qualidade de vida, prevenir problemas...',
    required: false,
    prioridade: 'baixa',
    categoriaIA: 'objetivos',
  },

  // Consentimento
  {
    type: 'setor',
    name: 'setor_consentimento',
    label: '📋 Consentimento e Privacidade',
    description: 'Última etapa antes de gerar seu relatório personalizado.',
  },
  {
    type: 'select',
    name: 'consentimento',
    label: 'Você concorda com o processamento dos seus dados para fins de triagem?',
    options: ['Sim, concordo', 'Não concordo'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'consentimento',
  },
];
`;

// Template para configuração de relatório
const CONFIG_TEMPLATE = `import type { ReportData } from '@/lib/report/types';
import { deriveAge, deriveBMI, bmiCategory } from '@/features/patient/profile';
import { createCTAContext, getContextualCTA } from '@/features/triage/ctas';
import { useEmoji, createEmojiContext } from '@/features/triage/emojis';

export function toReportData(answers: any, patientBasics?: any): ReportData {
  const age = patientBasics ? deriveAge(patientBasics.birthDateISO) : undefined;
  const bmi = patientBasics ? deriveBMI(patientBasics.weightKg, patientBasics.heightCm) : undefined;
  
  // Detectar red flags
  const hasRedFlag = detectRedFlags(answers);
  
  // Criar contexto para CTA
  const ctaContext = createCTAContext(
    '{SLUG}',
    '{MOTIVATOR}',
    hasRedFlag,
    { age, sex: patientBasics?.sex }
  );
  
  const cta = getContextualCTA(ctaContext);
  
  return {
    narrative: {
      heroSummary: generateHeroSummary(answers, hasRedFlag),
      healthStatement: "Siga cada seção como um roteiro diário. Pequenas vitórias em sequência criam grandes mudanças."
    },
    pillars: generatePillars(),
    quickWins: generateQuickWins(answers),
    weeklyGoal: generateWeeklyGoal(),
    patient: {
      sex: patientBasics?.sex,
      age,
      bmi,
      bmiCategory: age && age >= 19 && bmi ? bmiCategory(bmi, age) : undefined
    },
    alerts: generateAlerts(answers, hasRedFlag),
    preventiveExams: generatePreventiveExams(age, patientBasics?.sex),
    grocery: generateGrocery(),
    citations: generateCitations()
  };
}

function detectRedFlags(answers: any): boolean {
  // Implementar lógica específica para detectar red flags
  const redFlagFields = {RED_FLAG_FIELDS};
  
  for (const field of redFlagFields) {
    if (answers[field] === 'Sim' || answers[field] === 'Muito intensa') {
      return true;
    }
  }
  
  return false;
}

function generateHeroSummary(answers: any, hasRedFlag: boolean): string {
  if (hasRedFlag) {
    return "Identificamos sinais que requerem atenção médica. Procure avaliação profissional o quanto antes.";
  }
  
  return "Seu retrato de saúde — simples, claro e acionável. Focamos em prevenção e bem-estar.";
}

function generatePillars() {
  return [
    {
      title: "Rotina {CATEGORY}",
      description: "Hábitos diários para manter sua saúde em dia",
      quickWins: [
        { title: "Ação rápida 1", description: "Implemente esta mudança hoje" },
        { title: "Ação rápida 2", description: "Pequeno ajuste, grande impacto" }
      ],
      goal: {
        title: "Meta semanal",
        description: "Objetivo específico para esta semana"
      }
    },
    {
      title: "Nutrição Inteligente",
      description: "Alimentação como medicina preventiva",
      quickWins: [
        { title: "Hidratação", description: "Beba mais água ao longo do dia" },
        { title: "Vegetais", description: "Aumente o consumo de vegetais" }
      ],
      goal: {
        title: "Meta nutricional",
        description: "Foque em uma mudança alimentar específica"
      }
    },
    {
      title: "Sono & Recuperação",
      description: "Qualidade do sono como base da saúde",
      quickWins: [
        { title: "Rotina", description: "Estabeleça horários regulares" },
        { title: "Ambiente", description: "Otimize seu ambiente de sono" }
      ],
      goal: {
        title: "Meta de sono",
        description: "Melhore a qualidade do seu descanso"
      }
    }
  ];
}

function generateQuickWins(answers: any) {
  return [
    { title: "Ação imediata", description: "Comece hoje mesmo" },
    { title: "Hábito simples", description: "Fácil de implementar" },
    { title: "Impacto alto", description: "Grande benefício" }
  ];
}

function generateWeeklyGoal() {
  return {
    title: "Meta desta semana",
    description: "Foque em uma mudança específica"
  };
}

function generateAlerts(answers: any, hasRedFlag: boolean) {
  const alerts = [];
  
  if (hasRedFlag) {
    alerts.push({
      id: 'red-flag',
      level: 'danger',
      title: 'Atenção Médica Necessária',
      why: 'Identificamos sinais que requerem avaliação profissional imediata',
      action: {
        label: 'Falar com um médico agora',
        href: '/atendimento?utm_source=triage&utm_medium=report_{SLUG}&utm_campaign=2025Q4'
      }
    });
  }
  
  return alerts;
}

function generatePreventiveExams(age?: number, sex?: string) {
  const exams = [];
  
  if (age && age >= 18) {
    exams.push({
      name: "Exame básico",
      when: "Anualmente",
      why: "Prevenção e detecção precoce",
      prep: "Jejum de 8 horas"
    });
  }
  
  return exams;
}

function generateGrocery() {
  return [
    { category: "Vegetais", items: ["Brócolis", "Espinafre", "Cenoura"] },
    { category: "Frutas", items: ["Maçã", "Banana", "Laranja"] },
    { category: "Proteínas", items: ["Frango", "Peixe", "Ovos"] }
  ];
}

function generateCitations() {
  return [
    "Baseado em diretrizes médicas atualizadas",
    "Evidências científicas recentes",
    "Recomendações de especialistas"
  ];
}
`;

// Dicionários de sintomas por categoria
const SYMPTOMS_DICT: Record<string, string[]> = {
  "Cardiologia": ["Dor no peito", "Palpitações", "Falta de ar", "Cansaço excessivo", "Tontura", "Desmaio"],
  "Endocrinologia": ["Sede excessiva", "Urina frequente", "Fome excessiva", "Perda de peso", "Ganho de peso", "Cansaço"],
  "Reumatologia": ["Dor nas articulações", "Rigidez matinal", "Inchaço", "Dificuldade para se mover", "Fadiga"],
  "Ortopedia": ["Dor nas costas", "Dor no pescoço", "Dificuldade para caminhar", "Rigidez", "Fraqueza muscular"],
  "Pneumologia": ["Tosse", "Falta de ar", "Chiado", "Dor no peito", "Cansaço"],
  "Nefrologia": ["Dor lombar", "Alteração na urina", "Inchaço", "Pressão alta", "Cansaço"],
  "Gastroenterologia": ["Dor abdominal", "Náusea", "Vômito", "Diarréia", "Constipação", "Azia"],
  "Ginecologia": ["Dor pélvica", "Alteração menstrual", "Corrimento", "Dor na relação", "Irritação"],
  "Urologia": ["Dificuldade para urinar", "Dor ao urinar", "Urgência urinária", "Incontinência", "Dor pélvica"],
  "Mastologia": ["Dor na mama", "Nódulo", "Alteração na pele", "Secreção", "Inchaço"],
  "Oftalmologia": ["Visão embaçada", "Dor nos olhos", "Sensibilidade à luz", "Olhos secos", "Dor de cabeça"],
  "Otorrinolaringologia": ["Perda auditiva", "Zumbido", "Dor de ouvido", "Tontura", "Náusea"],
  "Dermatologia": ["Coceira", "Vermelhidão", "Descamação", "Feridas", "Manchas"],
  "Alergologia": ["Espirros", "Coriza", "Coceira nos olhos", "Tosse", "Falta de ar"],
  "Sexologia": ["Disfunção erétil", "Baixa libido", "Dor na relação", "Ansiedade", "Estresse"],
  "Geriatria": ["Quedas", "Esquecimento", "Dificuldade para caminhar", "Isolamento", "Depressão"],
  "Odontologia": ["Dor de dente", "Sangramento gengival", "Sensibilidade", "Mau hálito", "Dentes soltos"],
  "Pediatria": ["Febre", "Choro excessivo", "Dificuldade para dormir", "Falta de apetite", "Irritabilidade"],
  "Medicina do Trabalho": ["Dor nas costas", "Dor no pescoço", "Estresse", "Cansaço", "Irritabilidade"],
  "Medicina Preventiva": ["Cansaço", "Falta de energia", "Dificuldade para dormir", "Estresse", "Ansiedade"],
  "Medicina Funcional": ["Fadiga", "Dificuldade para dormir", "Problemas digestivos", "Ansiedade", "Estresse"],
  "Nutrição": ["Fadiga", "Dificuldade para dormir", "Problemas digestivos", "Ansiedade", "Estresse"]
};

// Red flags por categoria
const RED_FLAGS_DICT: Record<string, string[]> = {
  "Cardiologia": ["dor_toracica_sudita", "desmaio", "falta_ar_repouso"],
  "Endocrinologia": ["perda_peso_rapida", "sede_excessiva", "urina_frequente"],
  "Reumatologia": ["dor_intensa", "inchaço_severo", "febre"],
  "Ortopedia": ["deficit_motor", "perda_sensibilidade", "febre_dor"],
  "Pneumologia": ["chiado_severo", "cianose", "saturacao_baixa"],
  "Nefrologia": ["dor_lombar_intensa", "urina_sangue", "inchaço_severo"],
  "Gastroenterologia": ["dor_abdominal_intensa", "vomito_sangue", "febre_alta"],
  "Ginecologia": ["sangramento_excessivo", "dor_pelvica_intensa", "febre"],
  "Urologia": ["retencao_urinaria", "dor_intensa", "febre"],
  "Mastologia": ["nodulo_duro", "alteracao_pele", "secrecao_sangue"],
  "Oftalmologia": ["perda_visao_sudita", "dor_intensa", "fotofobia"],
  "Otorrinolaringologia": ["perda_auditiva_sudita", "dor_intensa", "febre"],
  "Dermatologia": ["ferida_nao_cicatriza", "mancha_escura", "coceira_intensa"],
  "Alergologia": ["reacao_severa", "dificuldade_respirar", "inchaço_garganta"],
  "Sexologia": ["dor_intensa", "sangramento", "febre"],
  "Geriatria": ["queda_recente", "confusao_mental", "febre"],
  "Odontologia": ["dor_intensa", "inchaço_face", "febre"],
  "Pediatria": ["febre_alta", "vomito_persistente", "letargia"],
  "Medicina do Trabalho": ["dor_intensa", "deficit_motor", "febre"],
  "Medicina Preventiva": ["fadiga_extrema", "perda_peso", "febre"],
  "Medicina Funcional": ["fadiga_extrema", "problemas_graves", "febre"],
  "Nutrição": ["fadiga_extrema", "problemas_graves", "febre"]
};

async function generateTriages() {
  console.log(`📋 Processando ${TRIAGE_CATALOG.length} triagens...`);
  
  for (const meta of TRIAGE_CATALOG) {
    console.log(`🔄 Gerando ${meta.slug}...`);
    
    // Gerar formulário
    const symptomsOptions = SYMPTOMS_DICT[meta.category] || ["Sintoma 1", "Sintoma 2", "Sintoma 3"];
    const redFlags = RED_FLAGS_DICT[meta.category] || ["red_flag_1", "red_flag_2"];
    
    const formContent = FORM_TEMPLATE
      .replace(/{SLUG}/g, meta.slug)
      .replace(/{TITLE}/g, meta.title)
      .replace(/{SUBTITLE}/g, meta.subtitle)
      .replace(/{DURATION}/g, meta.duration)
      .replace(/{CATEGORY}/g, meta.category)
      .replace(/{SYMPTOMS_OPTIONS}/g, JSON.stringify(symptomsOptions))
      .replace(/{RED_FLAGS_QUESTIONS}/g, generateRedFlagQuestions(redFlags))
      .replace(/{RED_FLAG_FIELDS}/g, JSON.stringify(redFlags));
    
    const formPath = path.join(process.cwd(), 'src/forms', `${meta.slug}.ts`);
    fs.writeFileSync(formPath, formContent);
    
    // Gerar configuração
    const configContent = CONFIG_TEMPLATE
      .replace(/{SLUG}/g, meta.slug)
      .replace(/{MOTIVATOR}/g, meta.motivator)
      .replace(/{CATEGORY}/g, meta.category);
    
    const configPath = path.join(process.cwd(), 'src/features/triage/configs', `${meta.slug}.ts`);
    fs.writeFileSync(configPath, configContent);
    
    console.log(`✅ ${meta.slug} gerado com sucesso`);
  }
  
  console.log('🎉 Todas as triagens foram geradas!');
}

function generateRedFlagQuestions(redFlags: string[]): string {
  return redFlags.map(flag => `
  {
    type: 'select',
    name: '${flag}',
    label: '${formatRedFlagLabel(flag)}',
    options: ['Sim', 'Não'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'red_flags',
  }`).join(',');
}

function formatRedFlagLabel(flag: string): string {
  const labels: Record<string, string> = {
    'dor_toracica_sudita': 'Você sente dor no peito súbita e intensa?',
    'desmaio': 'Você já desmaiou recentemente?',
    'falta_ar_repouso': 'Você sente falta de ar mesmo em repouso?',
    'perda_peso_rapida': 'Você perdeu peso rapidamente sem motivo?',
    'sede_excessiva': 'Você sente sede excessiva?',
    'urina_frequente': 'Você urina com muita frequência?',
    'dor_intensa': 'Você sente dor intensa que não melhora?',
    'inchaço_severo': 'Você apresenta inchaço severo?',
    'febre': 'Você está com febre?',
    'deficit_motor': 'Você apresenta dificuldade para se mover?',
    'perda_sensibilidade': 'Você perdeu sensibilidade em alguma parte do corpo?',
    'febre_dor': 'Você está com febre e dor intensa?',
    'chiado_severo': 'Você apresenta chiado severo?',
    'cianose': 'Você apresenta coloração azulada?',
    'saturacao_baixa': 'Sua saturação está baixa?',
    'dor_lombar_intensa': 'Você sente dor lombar intensa?',
    'urina_sangue': 'Você apresenta sangue na urina?',
    'dor_abdominal_intensa': 'Você sente dor abdominal intensa?',
    'vomito_sangue': 'Você vomitou sangue?',
    'febre_alta': 'Você está com febre alta?',
    'sangramento_excessivo': 'Você apresenta sangramento excessivo?',
    'dor_pelvica_intensa': 'Você sente dor pélvica intensa?',
    'retencao_urinaria': 'Você não consegue urinar?',
    'nodulo_duro': 'Você sente um nódulo duro?',
    'alteracao_pele': 'Você apresenta alteração na pele?',
    'secrecao_sangue': 'Você apresenta secreção com sangue?',
    'perda_visao_sudita': 'Você perdeu a visão subitamente?',
    'fotofobia': 'Você apresenta sensibilidade extrema à luz?',
    'perda_auditiva_sudita': 'Você perdeu a audição subitamente?',
    'ferida_nao_cicatriza': 'Você apresenta ferida que não cicatriza?',
    'mancha_escura': 'Você apresenta mancha escura?',
    'coceira_intensa': 'Você apresenta coceira intensa?',
    'reacao_severa': 'Você apresenta reação alérgica severa?',
    'dificuldade_respirar': 'Você tem dificuldade para respirar?',
    'inchaço_garganta': 'Você apresenta inchaço na garganta?',
    'sangramento': 'Você apresenta sangramento?',
    'queda_recente': 'Você caiu recentemente?',
    'confusao_mental': 'Você apresenta confusão mental?',
    'inchaço_face': 'Você apresenta inchaço no rosto?',
    'vomito_persistente': 'Você apresenta vômito persistente?',
    'letargia': 'Você apresenta letargia?',
    'fadiga_extrema': 'Você apresenta fadiga extrema?',
    'perda_peso': 'Você perdeu peso?',
    'problemas_graves': 'Você apresenta problemas graves?'
  };
  
  return labels[flag] || `Você apresenta ${flag.replace(/_/g, ' ')}?`;
}

// Executar geração
generateTriages().catch(console.error);