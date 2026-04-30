import { Step } from '@/types/triagem';

export const perguntasSaudeMasculina: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '🧔 Triagem de Saúde Masculina',
    justification:
      'Essa triagem visa promover o cuidado integral do homem, avaliando hábitos, sintomas e fatores de risco negligenciados na rotina.'
  },
  {
    name: 'idade',
    label: 'Qual sua idade atual?',
    type: 'text',
    placeholder: 'Ex.: 42',
    required: true,
    justification: 'A idade orienta o risco cardiovascular, hormonal e urológico.'
  },
  {
    name: 'checkup',
    label: 'Com que frequência realiza check-ups médicos?',
    type: 'select',
    options: [
      { value: 'Anualmente', label: 'Anualmente' },
      { value: 'A cada 2 anos', label: 'A cada 2 anos' },
      { value: 'Raramente', label: 'Raramente' },
      { value: 'Nunca', label: 'Nunca' }
    ],
    justification: 'A falta de rastreios periódicos está ligada à maior mortalidade masculina evitável.'
  },
  {
    name: 'urina',
    label: 'Percebe alterações urinárias (jato fraco, frequência aumentada, acorda à noite)?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, leves', label: 'Sim, leves' },
      { value: 'Sim, frequentes', label: 'Sim, frequentes' }
    ],
    justification: 'Podem indicar hiperplasia prostática ou outras alterações urológicas.'
  },
  {
    name: 'libido',
    label: 'Como está sua libido (desejo sexual)?',
    type: 'select',
    options: [
      { value: 'Normal', label: 'Normal' },
      { value: 'Reduzida', label: 'Reduzida' },
      { value: 'Ausente', label: 'Ausente' }
    ],
    justification: 'Quedas na libido podem estar relacionadas a testosterona ou causas emocionais.'
  },
  {
    name: 'disfuncoes',
    label: 'Já teve disfunção erétil (dificuldade de ereção)?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, ocasionalmente', label: 'Sim, ocasionalmente' },
      { value: 'Sim, frequentemente', label: 'Sim, frequentemente' }
    ],
    justification: 'Importante marcador de saúde vascular e hormonal.'
  },
  {
    name: 'emocional',
    label: 'Como avalia seu estado emocional?',
    type: 'select',
    options: [
      { value: 'Estável', label: 'Estável' },
      { value: 'Ansioso', label: 'Ansioso' },
      { value: 'Estressado', label: 'Estressado' },
      { value: 'Desmotivado', label: 'Desmotivado' }
    ],
    justification: 'Saúde mental masculina é frequentemente negligenciada e pouco discutida.'
  },
  {
    name: 'sono',
    label: 'Como está sua qualidade de sono?',
    type: 'select',
    options: [
      { value: 'Boa', label: 'Boa' },
      { value: 'Ruim', label: 'Ruim' },
      { value: 'Insônia', label: 'Insônia' },
      { value: 'Sono interrompido', label: 'Sono interrompido' }
    ],
    justification: 'Distúrbios do sono afetam hormônios, humor e performance.'
  },
  {
    name: 'habitos',
    label: 'Descreva brevemente seus hábitos de saúde.',
    type: 'text',
    placeholder: 'Ex.: Alimentação, bebida, cigarro, exercícios...',
    justification: 'Hábitos de vida determinam até 70% das doenças crônicas do homem moderno.'
  },
  {
    name: 'familiares',
    label: 'Há histórico familiar de doenças cardiovasculares, diabetes ou câncer de próstata?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, 1 condição', label: 'Sim, 1 condição' },
      { value: 'Sim, múltiplas', label: 'Sim, múltiplas' }
    ],
    justification: 'Histórico familiar aumenta a vigilância para doenças silenciosas.'
  }
];