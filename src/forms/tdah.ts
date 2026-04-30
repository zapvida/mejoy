import { Step } from '@/types/triagem';

export const perguntasTDAH: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '⚡ Triagem de TDAH (Transtorno de Déficit de Atenção e Hiperatividade)',
    justification: 'Identifica sinais de desatenção, impulsividade e hiperatividade com base em critérios clínicos adaptados para adultos.'
  },
  {
    name: 'foco',
    label: 'Você tem dificuldade em manter o foco em tarefas por longos períodos?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Às vezes', label: 'Às vezes' },
      { value: 'Frequentemente', label: 'Frequentemente' },
      { value: 'Quase sempre', label: 'Quase sempre' }
    ],
    required: true,
    justification: 'Desatenção prolongada é um dos principais sintomas do TDAH.'
  },
  {
    name: 'organizacao',
    label: 'Sente dificuldade em se organizar ou terminar tarefas iniciadas?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Leve', label: 'Leve' },
      { value: 'Moderada', label: 'Moderada' },
      { value: 'Grave', label: 'Grave' }
    ],
    justification: 'A desorganização impacta a funcionalidade e rotina de quem tem TDAH.'
  },
  {
    name: 'dispersao',
    label: 'Se distrai facilmente com estímulos ao redor?',
    type: 'select',
    options: [
      { value: 'Raramente', label: 'Raramente' },
      { value: 'Frequentemente', label: 'Frequentemente' },
      { value: 'Quase sempre', label: 'Quase sempre' }
    ],
    justification: 'A distração constante é uma queixa comum entre adultos com TDAH.'
  },
  {
    name: 'impulsividade',
    label: 'Costuma agir por impulso ou interromper os outros ao falar?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Às vezes', label: 'Às vezes' },
      { value: 'Frequentemente', label: 'Frequentemente' }
    ],
    justification: 'A impulsividade pode afetar relacionamentos e decisões no TDAH.'
  },
  {
    name: 'inquietude',
    label: 'Sente-se inquieto ou com dificuldade para relaxar mesmo em momentos calmos?',
    type: 'select',
    options: [
      { value: 'Nunca', label: 'Nunca' },
      { value: 'Às vezes', label: 'Às vezes' },
      { value: 'Frequentemente', label: 'Frequentemente' }
    ],
    justification: 'A hiperatividade pode ser subjetiva na fase adulta, com inquietação interna.'
  },
  {
    name: 'memoria',
    label: 'Tem dificuldade para lembrar compromissos, datas ou tarefas?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Leve', label: 'Leve' },
      { value: 'Moderada', label: 'Moderada' },
      { value: 'Alta', label: 'Alta' }
    ],
    justification: 'Déficits de memória operacional são comuns em adultos com TDAH.'
  },
  {
    name: 'emocional',
    label: 'Suas emoções oscilam facilmente ao longo do dia?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Leve', label: 'Leve' },
      { value: 'Moderada', label: 'Moderada' },
      { value: 'Intensa', label: 'Intensa' }
    ],
    justification: 'Labilidade emocional pode acompanhar o quadro clínico do TDAH.'
  },
  {
    name: 'infancia',
    label: 'Na infância, já apresentava sinais como agitação, distração ou desatenção escolar?',
    type: 'select',
    options: [
      { value: 'Não lembro', label: 'Não lembro' },
      { value: 'Sim, leves', label: 'Sim, leves' },
      { value: 'Sim, evidentes', label: 'Sim, evidentes' }
    ],
    justification: 'O TDAH é um transtorno do neurodesenvolvimento com início na infância.'
  },
  {
    name: 'funcionalidade',
    label: 'Esses sintomas impactam negativamente sua vida profissional, pessoal ou social?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Pouco', label: 'Pouco' },
      { value: 'Moderadamente', label: 'Moderadamente' },
      { value: 'Significativamente', label: 'Significativamente' }
    ],
    justification: 'O diagnóstico clínico exige impacto funcional claro.'
  }
];