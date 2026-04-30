import { Step } from '@/types/triagem';

export const perguntasDepressao: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '🌧️ Triagem de Depressão',
    justification: 'Identifica sinais e sintomas de depressão para intervenção precoce e orientação adequada.'
  },
  {
    name: 'humor',
    label: 'Você tem se sentido triste, vazio(a) ou desanimado(a) na maior parte dos dias?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Às vezes', label: 'Às vezes' },
      { value: 'Frequentemente', label: 'Frequentemente' },
      { value: 'Todos os dias', label: 'Todos os dias' }
    ],
    required: true,
    justification: 'Tristeza persistente é um critério central no diagnóstico de depressão.'
  },
  {
    name: 'interesse',
    label: 'Percebeu perda de interesse ou prazer em atividades que antes gostava?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Leve', label: 'Leve' },
      { value: 'Moderada', label: 'Moderada' },
      { value: 'Intensa', label: 'Intensa' }
    ],
    justification: 'Anedonia (perda de prazer) é um sinal típico de depressão clínica.'
  },
  {
    name: 'energia',
    label: 'Você sente cansaço ou falta de energia mesmo sem esforço físico?',
    type: 'select',
    options: [
      { value: 'Raramente', label: 'Raramente' },
      { value: 'Frequentemente', label: 'Frequentemente' },
      { value: 'Todos os dias', label: 'Todos os dias' }
    ],
    justification: 'Fadiga sem causa física é recorrente em quadros depressivos.'
  },
  {
    name: 'concentracao',
    label: 'Tem tido dificuldade de concentração, foco ou memória?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Leve', label: 'Leve' },
      { value: 'Moderada', label: 'Moderada' },
      { value: 'Intensa', label: 'Intensa' }
    ],
    justification: 'Déficits cognitivos são frequentes em transtornos depressivos.'
  },
  {
    name: 'sono',
    label: 'Como está o seu sono nos últimos dias?',
    type: 'select',
    options: [
      { value: 'Normal', label: 'Normal' },
      { value: 'Insônia', label: 'Insônia' },
      { value: 'Sono excessivo', label: 'Sono excessivo' },
      { value: 'Sono não reparador', label: 'Sono não reparador' }
    ],
    justification: 'Alterações no sono são sintomas clássicos da depressão.'
  },
  {
    name: 'autoimagem',
    label: 'Como está sua autoestima e percepção de si?',
    type: 'select',
    options: [
      { value: 'Boa', label: 'Boa' },
      { value: 'Neutra', label: 'Neutra' },
      { value: 'Baixa', label: 'Baixa' },
      { value: 'Muito negativa', label: 'Muito negativa' }
    ],
    justification: 'A baixa autoestima está ligada à gravidade dos sintomas depressivos.'
  },
  {
    name: 'culpa',
    label: 'Você tem se sentido culpado(a) excessivamente ou inútil?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, ocasionalmente', label: 'Sim, ocasionalmente' },
      { value: 'Sim, frequentemente', label: 'Sim, frequentemente' }
    ],
    justification: 'Sentimento de culpa é um marcador emocional importante em depressão maior.'
  },
  {
    name: 'pensamentos',
    label: 'Já teve pensamentos sobre morte ou desistência da vida?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, pensamentos leves', label: 'Sim, pensamentos leves' },
      { value: 'Sim, recorrentes', label: 'Sim, recorrentes' }
    ],
    justification: 'Ideação suicida deve sempre ser avaliada com atenção e responsabilidade.'
  },
  {
    name: 'apoio',
    label: 'Você sente que tem apoio emocional de pessoas próximas?',
    type: 'select',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Pouco', label: 'Pouco' },
      { value: 'Não', label: 'Não' }
    ],
    justification: 'Rede de apoio é fator protetor em quadros depressivos.'
  }
];