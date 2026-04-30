import { Step } from '@/types/triagem';

export const perguntasQuimica: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '💊 Triagem de Dependência Química',
    justification: 'Vamos avaliar seu padrão de uso de substâncias e identificar riscos para sua saúde física, mental e social.'
  },
  {
    name: 'habitos',
    label: 'Quais substâncias você utiliza com maior frequência?',
    type: 'text',
    placeholder: 'Ex.: Álcool, maconha, cocaína, medicamentos, etc.',
    required: true,
    justification: 'Identificar o tipo de substância é essencial para direcionamento clínico e prevenção de complicações.'
  },
  {
    name: 'frequencia',
    label: 'Com que frequência você faz uso dessas substâncias?',
    type: 'select',
    options: [
      { value: 'Raramente', label: 'Raramente' },
      { value: '1 a 2 vezes por semana', label: '1 a 2 vezes por semana' },
      { value: 'Diariamente', label: 'Diariamente' }
    ],
    justification: 'A frequência do uso é um indicativo da gravidade e risco de dependência química.'
  },
  {
    name: 'emocional',
    label: 'Seu estado emocional influencia o uso de substâncias?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, ansiedade', label: 'Sim, ansiedade' },
      { value: 'Sim, estresse', label: 'Sim, estresse' },
      { value: 'Sim, tristeza', label: 'Sim, tristeza' }
    ],
    justification: 'Fatores emocionais podem ser gatilhos importantes para o consumo abusivo.'
  },
  {
    name: 'familiares',
    label: 'Há histórico familiar de dependência química?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, familiares próximos', label: 'Sim, familiares próximos' },
      { value: 'Sim, casos mais distantes', label: 'Sim, casos mais distantes' }
    ],
    justification: 'Histórico familiar pode indicar predisposição genética à dependência.'
  },
  {
    name: 'exercicio',
    label: 'Você pratica atividade física?',
    type: 'select',
    options: [
      { value: 'Sim, com regularidade', label: 'Sim, com regularidade' },
      { value: 'Ocasionalmente', label: 'Ocasionalmente' },
      { value: 'Não pratico', label: 'Não pratico' }
    ],
    justification: 'Exercício físico é uma estratégia importante de prevenção e recuperação.'
  },
  {
    name: 'sono',
    label: 'Como está sua qualidade de sono atualmente?',
    type: 'select',
    options: [
      { value: 'Boa', label: 'Boa' },
      { value: 'Ruim', label: 'Ruim' },
      { value: 'Insônia frequente', label: 'Insônia frequente' },
      { value: 'Sono leve ou interrompido', label: 'Sono leve ou interrompido' }
    ],
    justification: 'Distúrbios do sono aumentam vulnerabilidade ao uso de substâncias.'
  },
  {
    name: 'ambiente',
    label: 'Seu ambiente social favorece o uso de substâncias?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, no trabalho', label: 'Sim, no trabalho' },
      { value: 'Sim, com amigos ou familiares', label: 'Sim, com amigos ou familiares' }
    ],
    justification: 'Ambientes de risco aumentam a chance de consumo e recaídas.'
  },
  {
    name: 'problema_atual',
    label: 'Qual seu maior desafio em relação ao uso atualmente?',
    type: 'text',
    placeholder: 'Ex.: Abstinência, compulsão, perda de controle...',
    justification: 'Essa informação ajuda a entender as dificuldades específicas e a oferecer suporte adequado.'
  },
  {
    name: 'diagnostico_tempo',
    label: 'Há quanto tempo você utiliza essas substâncias?',
    type: 'text',
    placeholder: 'Ex.: Desde os 15 anos, há mais de 10 anos...',
    justification: 'Tempo de uso ajuda a determinar o grau de dependência e a necessidade de intervenção.'
  }
];