import { Step } from '@/types/triagem';

export const perguntasEnxaqueca: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '💥 Triagem para Prevenção de Enxaqueca',
    justification: 'Vamos entender os fatores que podem desencadear suas crises de enxaqueca e orientar a prevenção.'
  },
  {
    type: 'setor',
    name: 'setor_frequencia_dor',
    label: '📆 Frequência e Intensidade da Dor',
    description: 'Avalia a frequência, intensidade e impacto das dores de cabeça na sua rotina.'
  },
  {
    name: 'dor',
    label: 'Com que frequência você sente dor de cabeça?',
    type: 'select',
    options: [
      { value: 'Nunca', label: 'Nunca' },
      { value: '1 vez por mês', label: '1 vez por mês' },
      { value: '1 vez por semana', label: '1 vez por semana' },
      { value: 'Quase todos os dias', label: 'Quase todos os dias' }
    ],
    required: true,
    justification: 'A frequência da dor é um critério diagnóstico fundamental.',
    prioridade: 'alta',
    categoriaIA: 'frequencia'
  },
  {
    name: 'intensidade',
    label: 'Qual a intensidade media das suas dores?',
    type: 'select',
    options: [
      { value: 'Leve', label: 'Leve' },
      { value: 'Moderada', label: 'Moderada' },
      { value: 'Forte', label: 'Forte' },
      { value: 'Incapacita', label: 'Incapacita' }
    ],
    justification: 'Intensidade define gravidade e necessidade de intervenção.',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'intensidade'
  },
  {
    type: 'setor',
    name: 'setor_fatores',
    label: '🧠 Fatores Desencadeantes',
    description: 'Alguns fatores como sono, estresse e alimentação podem influenciar diretamente suas crises.'
  },
  {
    name: 'sono',
    label: 'Seu sono influencia nas crises?',
    type: 'select',
    options: [
      { value: 'Não percebo relação', label: 'Não percebo relação' },
      { value: 'Sim, quando durmo mal', label: 'Sim, quando durmo mal' },
      { value: 'Quando durmo muito', label: 'Quando durmo muito' }
    ],
    justification: 'Distúrbios do sono são gatilhos comuns para enxaqueca.',
    prioridade: 'media',
    categoriaIA: 'sono'
  },
  {
    name: 'alimentacao',
    label: 'Percebe relação entre alimentação e dor de cabeça?',
    type: 'text',
    placeholder: 'Ex.: Chocolate, vinho, jejum prolongado...',
    justification: 'Alimentos específicos são reconhecidos gatilhos para enxaqueca.',
    prioridade: 'media',
    categoriaIA: 'alimentacao'
  },
  {
    name: 'estresse',
    label: 'O estresse influencia suas dores?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, muito', label: 'Sim, muito' },
      { value: 'Às vezes', label: 'Às vezes' }
    ],
    justification: 'Estresse é um dos principais fatores desencadeantes.',
    prioridade: 'alta',
    categoriaIA: 'estresse'
  },
  {
    name: 'ambiente',
    label: 'Alguns ambientes pioram sua dor?',
    type: 'text',
    placeholder: 'Ex.: Locais barulhentos, muito claros...',
    justification: 'Ambientes podem ser gatilhos sensoriais importantes.',
    prioridade: 'media',
    categoriaIA: 'ambiente'
  },
  {
    type: 'setor',
    name: 'setor_historico',
    label: '📚 Histórico Pessoal e Familiar',
    description: 'Identifica predisposições genéticas, uso de medicamentos e duração do quadro.'
  },
  {
    name: 'familiares',
    label: 'Há histórico familiar de enxaqueca?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, na mãe', label: 'Sim, na mãe' },
      { value: 'Sim, no pai', label: 'Sim, no pai' },
      { value: 'Sim, em irmãos ou outros', label: 'Sim, em irmãos ou outros' }
    ],
    justification: 'A predisposição genética é um fator forte para enxaqueca.',
    prioridade: 'media',
    categoriaIA: 'historico_familiar'
  },
  {
    name: 'medicamentos',
    label: 'Faz uso de medicamentos para dor de cabeça?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, esporadicamente', label: 'Sim, esporadicamente' },
      { value: 'Sim, frequentemente', label: 'Sim, frequentemente' }
    ],
    justification: 'O uso constante de analgésicos pode levar à cefaleia de rebote.',
    prioridade: 'media',
    categoriaIA: 'medicacao'
  },
  {
    name: 'diagnostico_tempo',
    label: 'Há quanto tempo você tem essas dores?',
    type: 'text',
    placeholder: 'Ex.: Desde a adolescência, há 5 anos...',
    justification: 'O tempo de evolução auxilia na avaliação clínica e no prognóstico.',
    prioridade: 'alta',
    categoriaIA: 'historico_clinico'
  }
];