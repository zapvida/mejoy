import { Step } from '@/types/triagem';

export const perguntasEstresseBurnout: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '🔥 Triagem de Estresse e Burnout',
    justification: 'Avalia sinais de esgotamento físico, emocional e mental relacionados ao estresse crônico e exaustão profissional.'
  },
  {
    name: 'cansaço',
    label: 'Você tem se sentido fisicamente ou mentalmente exausto(a)?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Ocasionalmente', label: 'Ocasionalmente' },
      { value: 'Frequentemente', label: 'Frequentemente' },
      { value: 'Quase todos os dias', label: 'Quase todos os dias' }
    ],
    required: true,
    justification: 'A exaustão é o principal sinal clínico do burnout.'
  },
  {
    name: 'sono',
    label: 'Como está seu sono nos últimos dias?',
    type: 'select',
    options: [
      { value: 'Normal', label: 'Normal' },
      { value: 'Com dificuldade para dormir', label: 'Com dificuldade para dormir' },
      { value: 'Acordo várias vezes', label: 'Acordo várias vezes' },
      { value: 'Sono não reparador', label: 'Sono não reparador' }
    ],
    justification: 'Alterações no sono estão diretamente ligadas ao estresse crônico.'
  },
  {
    name: 'irritabilidade',
    label: 'Você está mais irritado(a) ou impaciente que o normal?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, levemente', label: 'Sim, levemente' },
      { value: 'Sim, moderadamente', label: 'Sim, moderadamente' },
      { value: 'Sim, excessivamente', label: 'Sim, excessivamente' }
    ],
    justification: 'Irritabilidade é um sinal frequente do estresse emocional crônico.'
  },
  {
    name: 'procrastinacao',
    label: 'Você sente dificuldade de concentração ou tem procrastinado tarefas?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Às vezes', label: 'Às vezes' },
      { value: 'Frequentemente', label: 'Frequentemente' }
    ],
    justification: 'Burnout afeta funções executivas como foco e tomada de decisão.'
  },
  {
    name: 'trabalho',
    label: 'Como você se sente em relação ao seu trabalho ou rotina profissional?',
    type: 'select',
    options: [
      { value: 'Motivado(a)', label: 'Motivado(a)' },
      { value: 'Neutro(a)', label: 'Neutro(a)' },
      { value: 'Sobrecarregado(a)', label: 'Sobrecarregado(a)' },
      { value: 'Sem energia ou propósito', label: 'Sem energia ou propósito' }
    ],
    justification: 'A percepção do ambiente de trabalho é central na identificação do burnout ocupacional.'
  },
  {
    name: 'emocional',
    label: 'Você sente oscilação de humor ou alterações emocionais constantes?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, leves', label: 'Sim, leves' },
      { value: 'Sim, moderadas', label: 'Sim, moderadas' },
      { value: 'Sim, intensas', label: 'Sim, intensas' }
    ],
    justification: 'Instabilidade emocional é comum em quadros de esgotamento.'
  },
  {
    name: 'atividade_fisica',
    label: 'Tem conseguido manter alguma atividade física ou lazer?',
    type: 'select',
    options: [
      { value: 'Sim, regularmente', label: 'Sim, regularmente' },
      { value: 'Pouco frequente', label: 'Pouco frequente' },
      { value: 'Não tenho conseguido', label: 'Não tenho conseguido' }
    ],
    justification: 'A perda de interesse por lazer e autocuidado é típica do burnout avançado.'
  },
  {
    name: 'sintomas',
    label: 'Você tem sentido sintomas físicos sem explicação aparente (dores, taquicardia, falta de ar)?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Raramente', label: 'Raramente' },
      { value: 'Frequentemente', label: 'Frequentemente' }
    ],
    justification: 'Somatizações são comuns em indivíduos sob alto estresse.'
  },
  {
    name: 'apoio',
    label: 'Você sente que possui rede de apoio emocional (amigos, família)?',
    type: 'select',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Mais ou menos', label: 'Mais ou menos' },
      { value: 'Não', label: 'Não' }
    ],
    justification: 'Rede de apoio protege contra o agravamento de quadros de esgotamento.'
  }
];