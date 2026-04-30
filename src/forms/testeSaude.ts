// src/forms/testeSaude.ts
// Triagem Teste Saúde - 7 perguntas rápidas para testes em produção
// Compatível com o sistema existente de triagens

import type { Step } from '@/types/triagem';

export const perguntasTesteSaude: Step[] = [
  {
    type: 'intro',
    name: 'intro',
    label: '🧪 Teste Saúde',
    description: 'Triagem rápida de teste com 7 perguntas essenciais para validação do sistema.',
    justification: 'Leva menos de 2 minutos para completar.',
  },

  // 👤 Dados Básicos
  {
    type: 'setor',
    name: 'setor_dados',
    label: '👤 Dados Básicos',
    description: 'Informações essenciais para personalizar sua análise.',
  },
  {
    name: 'idade',
    label: 'Qual sua idade?',
    type: 'text',
    placeholder: 'Ex.: 28',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'dados_pessoais',
    justification: 'A idade é um fator importante para análise de saúde.',
    example: 'Exemplo: 32 anos'
  },

  // 🏃‍♂️ Estilo de Vida
  {
    type: 'setor',
    name: 'setor_estilo_vida',
    label: '🏃‍♂️ Estilo de Vida',
    description: 'Avaliamos seus hábitos diários que impactam sua saúde.',
  },
  {
    name: 'exercicio',
    label: 'Com que frequência você pratica exercícios físicos?',
    type: 'select',
    options: ['Diariamente', '3-4 vezes por semana', '1-2 vezes por semana', 'Raramente', 'Nunca'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'estilo_vida',
    justification: 'Exercícios regulares reduzem o risco de doenças cardiovasculares e melhoram a qualidade de vida.',
  },
  {
    name: 'sono',
    label: 'Como você avalia a qualidade do seu sono?',
    type: 'select',
    options: ['Excelente', 'Boa', 'Regular', 'Ruim', 'Muito ruim'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'sono',
    justification: 'A qualidade do sono afeta diretamente a saúde física e mental.',
  },
  {
    name: 'alimentacao',
    label: 'Como você descreveria sua alimentação?',
    type: 'select',
    options: ['Muito saudável', 'Saudável', 'Regular', 'Pouco saudável', 'Muito pouco saudável'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'alimentacao',
    justification: 'Uma alimentação equilibrada é fundamental para prevenir doenças e manter a saúde.',
  },
  {
    name: 'estresse',
    label: 'Como está seu nível de estresse atual?',
    type: 'select',
    options: ['Muito baixo', 'Baixo', 'Moderado', 'Alto', 'Muito alto'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'saude_mental',
    justification: 'O estresse crônico pode impactar negativamente diversos sistemas do organismo.',
  },

  // 🩺 Saúde Geral
  {
    type: 'setor',
    name: 'setor_saude_geral',
    label: '🩺 Saúde Geral',
    description: 'Avaliação geral do seu estado de saúde atual.',
  },
  {
    name: 'sintomas',
    label: 'Você tem algum sintoma que o preocupa atualmente?',
    type: 'select',
    options: ['Nenhum', 'Leves', 'Moderados', 'Intensos'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'sintomas',
    justification: 'Sintomas persistentes podem indicar condições que precisam de atenção médica.',
  },
  {
    name: 'medicamentos',
    label: 'Você toma algum medicamento regularmente?',
    type: 'select',
    options: ['Não', 'Sim, 1-2 medicamentos', 'Sim, 3-5 medicamentos', 'Sim, mais de 5 medicamentos'],
    required: true,
    prioridade: 'alta',
    categoriaIA: 'medicamentos',
    justification: 'O uso de medicamentos é importante para avaliar interações e riscos.',
  },
];
