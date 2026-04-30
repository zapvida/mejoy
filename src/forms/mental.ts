import { Step } from '@/types/triagem';

export const perguntasMental: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '🧠 Avaliação de Saúde Mental',
    justification: 'Análise de fatores emocionais, estresse, ansiedade e bem-estar mental.'
  },
  {
    name: 'sono',
    label: 'Como está sua qualidade de sono?',
    type: 'select',
    setor: 'Sono e descanso',
    categoriaIA: 'sono',
    options: [
      { value: 'Boa', label: 'Boa' },
      { value: 'Ruim', label: 'Ruim' },
      { value: 'Insônia', label: 'Insônia' },
      { value: 'Sono interrompido', label: 'Sono interrompido' }
    ],
    required: true,
    justification: 'Sono impacta diretamente a saúde mental.',
    example: 'Insônia frequente há 2 meses'
  },
  {
    name: 'estresse',
    label: 'Nível atual de estresse?',
    type: 'select',
    setor: 'Estresse e carga emocional',
    categoriaIA: 'estresse',
    options: [
      { value: 'Baixo', label: 'Baixo' },
      { value: 'Moderado', label: 'Moderado' },
      { value: 'Alto', label: 'Alto' },
      { value: 'Extremo', label: 'Extremo' }
    ],
    required: true,
    justification: 'Estresse crônico está relacionado a transtornos mentais.',
    example: 'Alto, devido à sobrecarga no trabalho'
  },
  {
    name: 'humor',
    label: 'Como está seu humor na maior parte do tempo?',
    type: 'select',
    setor: 'Humor e bem-estar emocional',
    categoriaIA: 'humor',
    options: [
      { value: 'Estável', label: 'Estável' },
      { value: 'Ansioso', label: 'Ansioso' },
      { value: 'Triste', label: 'Triste' },
      { value: 'Irritado', label: 'Irritado' }
    ],
    required: true,
    justification: 'Alterações de humor são indicadores importantes.',
    example: 'Ansioso frequentemente, especialmente à noite'
  },
  {
    name: 'ansiedade',
    label: 'Sente ansiedade com frequência?',
    type: 'select',
    setor: 'Ansiedade e tensões internas',
    categoriaIA: 'ansiedade',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, leve', label: 'Sim, leve' },
      { value: 'Sim, moderada', label: 'Sim, moderada' },
      { value: 'Sim, intensa', label: 'Sim, intensa' }
    ],
    required: true,
    justification: 'Avalia a presença de sintomas ansiosos.',
    example: 'Sim, moderada, com sintomas físicos como taquicardia'
  },
  {
    name: 'familiares',
    label: 'Tem histórico familiar de transtornos mentais?',
    type: 'select',
    setor: 'Histórico familiar',
    categoriaIA: 'histórico',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, ansiedade', label: 'Sim, ansiedade' },
      { value: 'Sim, depressão', label: 'Sim, depressão' },
      { value: 'Outros', label: 'Outros' }
    ],
    required: true,
    justification: 'A hereditariedade é um fator de risco relevante.',
    example: 'Sim, mãe com depressão'
  },
  {
    name: 'isolamento',
    label: 'Tem se sentido isolado ou solitário?',
    type: 'select',
    setor: 'Relacionamentos sociais',
    categoriaIA: 'isolamento',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Às vezes', label: 'Às vezes' },
      { value: 'Frequentemente', label: 'Frequentemente' },
      { value: 'Quase sempre', label: 'Quase sempre' }
    ],
    required: true,
    justification: 'Isolamento social impacta diretamente a saúde mental.',
    example: 'Frequentemente, especialmente nos fins de semana'
  },
  {
    name: 'atividade',
    label: 'Pratica atividades relaxantes ou hobbies?',
    type: 'select',
    setor: 'Hábitos e lazer',
    categoriaIA: 'hábitos',
    options: [
      { value: 'Sim, sempre', label: 'Sim, sempre' },
      { value: 'Ocasionalmente', label: 'Ocasionalmente' },
      { value: 'Nunca', label: 'Nunca' }
    ],
    required: true,
    justification: 'Atividades de lazer ajudam na saúde emocional.',
    example: 'Sim, pinto aquarela aos sábados'
  },
  {
    name: 'suporte',
    label: 'Tem rede de apoio (família, amigos)?',
    type: 'select',
    setor: 'Rede de apoio',
    categoriaIA: 'apoio',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não' }
    ],
    required: true,
    justification: 'Suporte social reduz riscos de adoecimento mental.',
    example: 'Sim, tenho contato diário com familiares próximos'
  },
  {
    name: 'emocional_livre',
    label: 'Quer compartilhar algo sobre seu estado emocional?',
    type: 'text',
    placeholder: 'Descreva livremente...',
    setor: 'Observações finais',
    categoriaIA: 'observação',
    justification: 'Espaço aberto para informações importantes não abordadas nas perguntas anteriores.',
    example: 'Sinto que estou desmotivado há meses, mesmo sem motivo claro'
  }
];