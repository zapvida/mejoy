import type { Step } from '@/types/triagem';

export const perguntasMicronutrientes: Step[] = [
  {
    type: 'intro',
    name: 'intro',
    label: 'Deficiências de Micronutrientes',
    description: 'Vitamina D, B12, Ferro. Responda em ~4-5 min. Geramos um plano claro com prioridades e próximos passos.',
    justification: 'Leva de 4-5 min para completar.',
  },



  // Sintomas principais
  {
    type: 'setor',
    name: 'setor_sintomas',
    label: '🔍 Sintomas Principais',
    description: 'Identifique os sintomas relacionados à Nutrição.',
  },
  {
    type: 'multiselect',
    name: 'sintomas_principais',
    label: 'Quais sintomas você apresenta?',
    options: ["Fadiga","Dificuldade para dormir","Problemas digestivos","Ansiedade","Estresse"],
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
  
  {
    type: 'select',
    name: 'fadiga_extrema',
    label: 'Você apresenta fadiga extrema?',
    options: ['Sim', 'Não'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'red_flags',
  },
  {
    type: 'select',
    name: 'problemas_graves',
    label: 'Você apresenta problemas graves?',
    options: ['Sim', 'Não'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'red_flags',
  },
  {
    type: 'select',
    name: 'febre',
    label: 'Você está com febre?',
    options: ['Sim', 'Não'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'red_flags',
  },

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
