import { Step } from '@/types/triagem';

export const perguntasJogosAzar: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '🎰 Triagem de Vício em Jogos de Azar',
    justification:
      'Avaliação dos comportamentos relacionados a apostas e jogos de azar, com foco em riscos psicológicos, financeiros e sociais.'
  },
  {
    name: 'frequencia',
    label: 'Com que frequência você participa de jogos de azar (cassino, apostas, bingo, etc)?',
    type: 'select',
    options: [
      { value: 'Nunca', label: 'Nunca' },
      { value: 'Raramente', label: 'Raramente' },
      { value: 'Semanalmente', label: 'Semanalmente' },
      { value: 'Diariamente', label: 'Diariamente' }
    ],
    required: true,
    justification: 'A frequência ajuda a identificar o grau de envolvimento e risco de dependência.'
  },
  {
    name: 'gastos',
    label: 'Quanto costuma gastar por mês com jogos?',
    type: 'text',
    placeholder: 'Ex.: R$ 200, R$ 1000, mais de R$ 2000...',
    justification: 'O impacto financeiro é um dos principais indicadores de prejuízo associado.'
  },
  {
    name: 'controle',
    label: 'Sente que perdeu o controle sobre o hábito de jogar?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, às vezes', label: 'Sim, às vezes' },
      { value: 'Sim, frequentemente', label: 'Sim, frequentemente' }
    ],
    justification: 'Perda de controle é critério diagnóstico para transtornos de impulso.'
  },
  {
    name: 'emocional',
    label: 'Costuma jogar mais quando está ansioso ou estressado?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, ocasionalmente', label: 'Sim, ocasionalmente' },
      { value: 'Sim, com frequência', label: 'Sim, com frequência' }
    ],
    justification: 'Uso como válvula de escape emocional está associado a vício comportamental.'
  },
  {
    name: 'familiares',
    label: 'Alguém na sua família já teve problemas com jogos?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, na família próxima', label: 'Sim, na família próxima' },
      { value: 'Sim, casos distantes', label: 'Sim, casos distantes' }
    ],
    justification: 'Fatores genéticos e familiares influenciam comportamentos aditivos.'
  },
  {
    name: 'dificuldades',
    label: 'Já teve problemas financeiros, familiares ou emocionais por causa dos jogos?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, leves', label: 'Sim, leves' },
      { value: 'Sim, graves', label: 'Sim, graves' }
    ],
    justification: 'As consequências sociais e emocionais indicam gravidade do quadro.'
  },
  {
    name: 'tentativas',
    label: 'Já tentou parar de jogar e não conseguiu?',
    type: 'select',
    options: [
      { value: 'Nunca tentei', label: 'Nunca tentei' },
      { value: 'Sim, tentei e consegui', label: 'Sim, tentei e consegui' },
      { value: 'Sim, mas não consegui', label: 'Sim, mas não consegui' }
    ],
    justification: 'Tentativas frustradas de cessar indicam dependência comportamental.'
  },
  {
    name: 'apoio',
    label: 'Você se sente confortável para buscar ajuda sobre isso?',
    type: 'select',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não' },
      { value: 'Tenho receio ou vergonha', label: 'Tenho receio ou vergonha' }
    ],
    justification: 'Avaliar abertura ao cuidado é essencial para adesão ao tratamento.'
  },
  {
    name: 'comentarios_finais',
    label: 'Deseja compartilhar algo sobre sua relação com jogos?',
    type: 'text',
    placeholder: 'Ex.: Jogo escondido da família, me sinto mal depois...',
    justification: 'Espaço para expressão emocional livre e dados adicionais importantes.'
  }
];