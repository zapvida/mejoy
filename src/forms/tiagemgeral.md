// src/forms/triagemGeral.ts

import { perguntasComuns } from './perguntasComuns';
import type { Step } from '@/types/triagem';

export const perguntasTriagemGeral: Step[] = [
  {
    type: 'intro',
    name: 'intro',
    justification:
      'Este formulário avalia sua saúde geral, hábitos de vida, riscos e sintomas. Ao final, você receberá um relatório personalizado com recomendações baseadas em evidência científica. Leva de 5 a 8 minutos.',
  },

  // 👤 Dados Pessoais
  ...perguntasComuns,

  // 🧠 Saúde Mental e Emocional
  {
    type: 'setor',
    name: 'setor_saude_mental',
    label: '🧠 Saúde Mental e Emocional',
    description:
      'Seu estado emocional influencia diretamente sua saúde física, imunológica e metabólica. Aqui buscamos entender seu equilíbrio emocional atual.',
    image: '/triagem/setores/saude_mental.png',
  },
  {
    type: 'select',
    name: 'estresse',
    label: 'Como está seu nível de estresse hoje?',
    options: [
      { value: 'Muito baixo', label: 'Muito baixo' },
      { value: 'Baixo', label: 'Baixo' },
      { value: 'Moderado', label: 'Moderado' },
      { value: 'Alto', label: 'Alto' },
    ],
    justification:
      'Estresse crônico aumenta o risco de doenças autoimunes, metabólicas e cardiovasculares (Lancet, 2022).',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'saude_mental',
  },
  {
    type: 'select',
    name: 'humor',
    label: '🟣 Como você descreveria seu humor predominante?',
    options: [
      { value: 'Estável', label: 'Estável' },
      { value: 'Ansioso', label: 'Ansioso' },
      { value: 'Triste', label: 'Triste' },
      { value: 'Irritado', label: 'Irritado' },
    ],
    justification:
      'Mudanças de humor frequentes são indicadores precoces de transtornos emocionais (DSM-5, 2020).',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'saude_mental',
  },
  {
    type: 'select',
    name: 'emocao_frequente',
    label: '🟣 Com que frequência você sente tristeza, ansiedade ou falta de motivação?',
    options: [
      { value: 'Nunca', label: 'Nunca' },
      { value: 'Raramente', label: 'Raramente' },
      { value: 'Frequentemente', label: 'Frequentemente' },
      { value: 'Quase sempre', label: 'Quase sempre' },
    ],
    justification:
      'Sintomas emocionais persistentes impactam sono, imunidade e longevidade (JAMA, 2020).',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'saude_mental',
  },
  {
    type: 'setor',
    name: 'setor_nutricao',
    label: '🍽️ Nutrição e Suplementação',
    description:
      'A alimentação impacta diretamente sua saúde metabólica, imunológica e emocional. Queremos entender seus padrões alimentares e necessidades.',
    image: '/triagem/setores/nutricao.png',
  },
  {
    type: 'select',
    name: 'quantidade_refeicoes',
    label: '🟣 Quantas refeições você costuma fazer por dia?',
    options: ['1', '2', '3', '4 ou mais'],
    justification: 'A frequência das refeições influencia o metabolismo e o controle glicêmico (Endocrine Reviews, 2021).',
    example: 'Exemplo: 3 refeições por dia – café, almoço e jantar.',
    required: true,
    prioridade: 'media',
    categoriaIA: 'nutricao',
  },
  {
    type: 'select',
    name: 'ultraprocessados',
    label: '🟣 Você consome alimentos ultraprocessados com frequência?',
    options: ['Não', '1 a 2x por semana', '3 ou mais vezes por semana'],
    justification:
      'Alimentos ultraprocessados estão associados a maior risco de obesidade, diabetes e câncer (BMJ, 2019).',
    example: 'Exemplo: Refrigerantes, salgadinhos, embutidos.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'nutricao',
  },
  {
    type: 'multiselect',
    name: 'suplementos',
    label: '🟣 Quais suplementos ou vitaminas você utiliza atualmente? (selecione os que usa)',
    isMulti: true,
    options: [
      { value: 'Nenhum', label: 'Nenhum' },
      { value: 'Vitamina D', label: 'Vitamina D' },
      { value: 'Ômega 3', label: 'Ômega 3' },
      { value: 'Whey protein', label: 'Whey protein' },
      { value: 'Multivitamínico', label: 'Multivitamínico' },
      { value: 'Creatina', label: 'Creatina' },
      { value: 'Outros', label: 'Outros' },
    ],
    justification: 'Suplementos influenciam exames laboratoriais, metabolismo e condutas clínicas.',
    example: 'Exemplo: Tomo ômega 3 e vitamina D diariamente.',
    required: true,
    prioridade: 'media',
    categoriaIA: 'nutricao',
  },

  // 😴 Sono
  {
    type: 'setor',
    name: 'setor_sono',
    label: '😴 Qualidade do Sono',
    description:
      'O sono regula funções hormonais, cognitivas e imunológicas. Avaliamos aqui seus padrões e qualidade do descanso.',
    image: '/triagem/setores/sono.png',
  },
  {
    type: 'select',
    name: 'qualidade_sono',
    label: '🟣 Como você avalia sua qualidade de sono?',
    options: ['Excelente', 'Boa', 'Regular', 'Ruim'],
    justification: 'Sono ruim está relacionado a alterações metabólicas, imunológicas e emocionais (Sleep Health, 2022).',
    example: 'Exemplo: Dorme 8h por noite, com bom despertar.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'sono',
  },
  {
    type: 'select',
    name: 'tempo_sono',
    label: '🟣 Quantas horas você dorme em media por noite?',
    options: ['Menos de 5h', '5-6h', '7-8h', 'Mais de 8h'],
    justification:
      'Dormir pouco ou em excesso aumenta o risco de doenças cardiovasculares, diabetes e ansiedade (JAMA, 2018).',
    example: 'Exemplo: 6h por noite durante a semana, 8h no fim de semana.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'sono',
  },
  {
    type: 'select',
    name: 'insonia',
    label: '🟣 Você tem dificuldade para dormir ou acorda frequentemente à noite?',
    options: ['Sim', 'Não'],
    justification:
      'Insônia está associada a distúrbios emocionais e risco aumentado de síndrome metabólica (Sleep Medicine, 2020).',
    example: 'Exemplo: Demoro para pegar no sono e acordo 2x por noite.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'sono',
  },
  {
    type: 'select',
    name: 'atividade_fisica',
    label: '🟣 Qual seu nível atual de atividade física e quais tipos de exercício você pratica?',
    options: [
      {
        value: 'Sedentário',
        label: 'Sedentário (não pratica exercícios)'
      },
      {
        value: 'Leve',
        label: 'Leve (1-2x por semana)'
      },
      {
        value: 'Moderado',
        label: 'Moderado (3-4x por semana)'
      },
      {
        value: 'Intenso',
        label: 'Intenso (5x ou mais por semana)'
      },
    ],
    justification:
      'Exercícios regulares reduzem risco de morte precoce, melhoram disposição, humor e sono (CDC, 2022). Cada tipo de exercício estimula sistemas diferentes: cardiovascular, muscular, mental, etc.',
    example: 'Exemplo: Caminho 30 minutos 3x na semana e faço musculação.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'atividade',
  },
    // 🚬 Uso de Substâncias
  {
    type: 'setor',
    name: 'setor_substancias',
    label: '🚬 Substâncias e Hábitos de Saúde',
    description:
      'Alguns hábitos como tabagismo e uso de substâncias afetam diretamente o metabolismo, humor e risco cardiovascular.',
    image: '/triagem/setores/habitos_substancias.png',
  },
  {
    type: 'multiselect',
    name: 'uso_substancias',
    label: '🟣 Você faz uso de alguma destas substâncias?',
    isMulti: true,
    options: [
      { value: 'Nenhuma', label: 'Nenhuma' },
      { value: 'Álcool', label: 'Álcool' },
      { value: 'Cigarro', label: 'Cigarro' },
      { value: 'Maconha', label: 'Maconha' },
      { value: 'Outras substâncias recreativas', label: 'Outras substâncias recreativas' },
    ],
    justification: 'Esses hábitos afetam diretamente sua saúde física e mental.',
    example: 'Exemplo: Consumo álcool socialmente e já fumei no passado.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'habitos',
  },
  {
    type: 'select',
    name: 'medicamentos',
    label: '🟣 Você utiliza algum medicamento atualmente?',
    options: ['Não', 'Sim, uso contínuo', 'Sim, uso esporádico'],
    justification:
      'Medicamentos impactam metabolismo, sintomas e decisões terapêuticas (UpToDate, 2022).',
    example: 'Exemplo: Uso diário de losartana e metformina.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'medicacao',
  },

  // ⚠️ Doenças Crônicas
  {
    type: 'setor',
    name: 'setor_doencas',
    label: '⚠️ Doenças Crônicas e Histórico Familiar',
    description:
      'Registrar doenças diagnosticadas permite traçar estratégias de controle, prevenção e rastreamento precoce.',
    image: '/triagem/setores/doencas_cronicas.png',
  },
  {
    type: 'multiselect',
    name: 'doenca_cronica',
    label: '🟣 Você tem alguma doença crônica diagnosticada? (Selecione todas que se aplicam)',
    isMulti: true,
    options: [
      { value: 'Nenhuma', label: 'Nenhuma' },
      { value: 'Diabetes', label: 'Diabetes' },
      { value: 'Hipertensão', label: 'Hipertensão' },
      { value: 'Dislipidemia', label: 'Colesterol/Triglicerídeos altos' },
      { value: 'Doença cardiovascular', label: 'Doença cardiovascular' },
      { value: 'Doença renal', label: 'Doença renal' },
      { value: 'Doença autoimune', label: 'Doença autoimune' },
      { value: 'Câncer', label: 'Câncer' },
      { value: 'Outra', label: 'Outra' },
    ],
    justification: 'A presença de doenças crônicas modifica metas clínicas e necessidade de acompanhamento contínuo.',
    example: 'Exemplo: Diabetes tipo 2 e hipertensão.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'cronicas',
  },
  {
    type: 'multiselect',
    name: 'historico_familiar',
    label: '🟣 Algum familiar possui doenças crônicas importantes? (Selecione todas que se aplicam)',
    isMulti: true,
    options: [
      { value: 'Nenhuma', label: 'Nenhuma' },
      { value: 'Diabetes', label: 'Diabetes' },
      { value: 'Hipertensão', label: 'Hipertensão' },
      { value: 'Câncer', label: 'Câncer' },
      { value: 'Doença cardiovascular', label: 'Doença cardiovascular' },
      { value: 'Outra', label: 'Outra' },
    ],
    justification: 'Histórico familiar é um forte preditor de doenças como diabetes, hipertensão e câncer (Lancet, 2021).',
    example: 'Exemplo: Mãe com hipertensão, pai com diabetes.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'familia',
  },

  // 💼 Trabalho e Estilo de Vida
  {
    type: 'setor',
    name: 'setor_trabalho',
    label: '💼 Trabalho, Rotina e Satisfação de Vida',
    description:
      'A forma como você vive sua rotina e trabalho influencia hábitos, saúde física e mental.',
    image: '/triagem/setores/trabalho_rotina.png',
  },
  {
    type: 'select',
    name: 'trabalho',
    label: '🟣 Você trabalha atualmente?',
    options: ['Sim', 'Não'],
    justification:
      'O trabalho impacta na rotina, exposição ao estresse, nível de atividade e estrutura social (CDC, 2022).',
    example: 'Exemplo: Trabalho remoto como analista de dados.',
    required: true,
    prioridade: 'media',
    categoriaIA: 'rotina',
  },
  {
    type: 'select',
    name: 'satisfacao_vida',
    label: '🟣 Você sente satisfação com sua vida atualmente?',
    options: ['Sim, totalmente', 'Parcialmente', 'Não muito', 'Nada satisfeito(a)'],
    justification:
      'A satisfação geral está relacionada ao bem-estar emocional e à saúde global (WHOQOL, 2021).',
    example: 'Exemplo: Satisfeito com a carreira, mas insatisfeito com saúde.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'bem_estar',
  },
    // 🎯 Objetivos e Barreiras
  {
    type: 'setor',
    name: 'setor_objetivos',
    label: '🎯 Objetivos, Barreiras e Autopercepção',
    description:
      'Entender seus objetivos e obstáculos ajuda a criar estratégias mais eficazes, personalizadas e alcançáveis.',
    image: '/triagem/setores/objetivos_barreiras.png',
  },
  {
    type: 'multiselect',
    name: 'objetivo_saude',
    label: '🟣 Qual é seu principal objetivo de saúde neste momento?',
    isMulti: true,
    options: [
      { value: 'Emagrecimento', label: 'Emagrecimento' },
      { value: 'Melhorar energia/disposição', label: 'Melhorar energia/disposição' },
      { value: 'Reduzir estresse/ansiedade', label: 'Reduzir estresse/ansiedade' },
      { value: 'Ganhar massa muscular', label: 'Ganhar massa muscular' },
      { value: 'Controlar doenças crônicas', label: 'Controlar doenças crônicas' },
      { value: 'Melhorar sono', label: 'Melhorar sono' },
      { value: 'Outro', label: 'Outro' }
    ],
    justification: 'Objetivos direcionam condutas específicas e aumentam a adesão a intervenções (J Clin Psychol, 2021).',
    example: 'Exemplo: Reduzir ansiedade e melhorar o sono.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'objetivos',
  },
  {
    type: 'multiselect',
    name: 'barreiras',
    label: '🟣 Qual sua principal dificuldade para alcançar seus objetivos de saúde?',
    isMulti: true,
    options: [
      { value: 'Falta de tempo', label: 'Falta de tempo' },
      { value: 'Falta de motivação', label: 'Falta de motivação' },
      { value: 'Rotina estressante', label: 'Rotina estressante' },
      { value: 'Problemas financeiros', label: 'Problemas financeiros' },
      { value: 'Falta de apoio', label: 'Falta de apoio' },
      { value: 'Outro', label: 'Outro' }
    ],
    justification: 'Identificar barreiras permite criar planos mais realistas e sustentáveis (BMC Public Health, 2022).',
    example: 'Exemplo: Falta de tempo devido à jornada dupla de trabalho.',
    required: true,
    prioridade: 'media',
    categoriaIA: 'objetivos',
  },

  // ✅ Encerramento
  {
    type: 'intro',
    name: 'encerramento',
    label: 'Triagem concluída! 🎉',
    justification:
      'Parabéns por dedicar esse tempo à sua saúde! Suas respostas agora serão analisadas por nossa IA e equipe médica para gerar um relatório completo e individualizado.',
  },
];