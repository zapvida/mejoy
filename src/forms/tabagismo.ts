import { Step } from '@/types/triagem';

export const perguntasTabagismo: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '🚬 Triagem de Tabagismo',
    justification: 'Vamos entender o impacto do cigarro na sua saúde e planejar juntos uma possível cessação.'
  },
  {
    name: 'habitos',
    label: 'Você fuma atualmente?',
    type: 'select',
    options: [
      { value: 'Não fumo', label: 'Não fumo' },
      { value: 'Sim, apenas socialmente', label: 'Sim, apenas socialmente' },
      { value: 'Sim, todos os dias', label: 'Sim, todos os dias' }
    ],
    required: true,
    justification: 'Fumar com frequência aumenta o risco de doenças respiratórias, cardiovasculares e câncer.'
  },
  {
    name: 'quantidade',
    label: 'Quantos cigarros consome por dia, em media?',
    type: 'text',
    placeholder: 'Ex.: 5, 10, 20...',
    justification: 'A quantidade fumada define o grau de dependência e os riscos associados.'
  },
  {
    name: 'tentativas',
    label: 'Já tentou parar de fumar anteriormente?',
    type: 'select',
    options: [
      { value: 'Nunca tentei', label: 'Nunca tentei' },
      { value: 'Tentei uma vez', label: 'Tentei uma vez' },
      { value: 'Tentei várias vezes', label: 'Tentei várias vezes' }
    ],
    justification: 'O histórico de tentativas mostra a prontidão para mudança e direciona o suporte.'
  },
  {
    name: 'motivacao',
    label: 'Qual é sua principal motivação para parar de fumar?',
    type: 'text',
    placeholder: 'Ex.: Saúde, filhos, economia, desempenho físico...',
    justification: 'A motivação pessoal é essencial para planejar estratégias eficazes de cessação.'
  },
  {
    name: 'sono',
    label: 'Como você avalia a qualidade do seu sono?',
    type: 'select',
    options: [
      { value: 'Boa', label: 'Boa' },
      { value: 'Ruim', label: 'Ruim' },
      { value: 'Sono interrompido', label: 'Sono interrompido' },
      { value: 'Insônia frequente', label: 'Insônia frequente' }
    ],
    justification: 'Tabagismo afeta negativamente o sono e a recuperação do corpo.'
  },
  {
    name: 'exercicio',
    label: 'Você pratica atividade física atualmente?',
    type: 'select',
    options: [
      { value: 'Sim, regularmente', label: 'Sim, regularmente' },
      { value: 'Ocasionalmente', label: 'Ocasionalmente' },
      { value: 'Não pratico', label: 'Não pratico' }
    ],
    justification: 'Exercício físico auxilia no controle da ansiedade e no processo de cessação.'
  },
  {
    name: 'emocional',
    label: 'Como você descreveria seu estado emocional atual?',
    type: 'select',
    options: [
      { value: 'Estável', label: 'Estável' },
      { value: 'Ansioso(a)', label: 'Ansioso(a)' },
      { value: 'Estressado(a)', label: 'Estressado(a)' },
      { value: 'Triste ou deprimido(a)', label: 'Triste ou deprimido(a)' }
    ],
    justification: 'Alterações emocionais podem estar relacionadas ao uso e recaídas.'
  },
  {
    name: 'familiares',
    label: 'Há outros fumantes na sua casa ou família próxima?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, na família próxima', label: 'Sim, na família próxima' },
      { value: 'Sim, em outras pessoas próximas', label: 'Sim, em outras pessoas próximas' }
    ],
    justification: 'Ambientes com fumantes aumentam o risco de recaída e dificultam o abandono.'
  },
  {
    name: 'problema_atual',
    label: 'Deseja relatar algum sintoma ou impacto atual relacionado ao cigarro?',
    type: 'text',
    placeholder: 'Ex.: Tosse crônica, falta de ar, dor no peito...',
    justification: 'Sintomas atuais ajudam a definir a urgência e a abordagem terapêutica.'
  }
];