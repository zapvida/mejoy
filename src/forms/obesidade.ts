import { Step } from '@/types/triagem';

export const perguntasObesidade: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '⚖️ Triagem de Controle de Peso e Obesidade',
    justification: 'Avalia fatores relacionados ao peso, hábitos e risco metabólico.'
  },
  {
    name: 'peso',
    type: 'text',
    label: 'Qual seu peso atual?',
    placeholder: 'Ex.: 85',
    required: true,
    justification: 'O peso corporal é um dos principais parâmetros no rastreio de obesidade.'
  },
  {
    name: 'altura',
    type: 'text',
    label: 'Qual sua altura?',
    placeholder: 'Ex.: 1.75',
    required: true,
    justification: 'Altura é necessária para o cálculo do IMC e avaliação de risco.'
  },
  {
    name: 'alimentacao',
    type: 'text',
    label: 'Como você descreveria sua alimentação atual?',
    placeholder: 'Ex.: Fast-food frequente, muitas frutas, refeições irregulares...',
    justification: 'A qualidade da dieta influencia diretamente no peso corporal.'
  },
  {
    name: 'sono',
    type: 'select',
    label: 'Como está sua qualidade de sono?',
    options: [
      { value: 'Bom', label: 'Bom' },
      { value: 'Ruim', label: 'Ruim' },
      { value: 'Interrompido', label: 'Sono interrompido' },
      { value: 'Insônia', label: 'Insônia' }
    ],
    justification: 'Distúrbios de sono podem favorecer o ganho de peso e alterações metabólicas.'
  },
  {
    name: 'exercicio',
    type: 'select',
    label: 'Você pratica atividade física?',
    options: [
      { value: 'Sim, regularmente', label: 'Sim, regularmente' },
      { value: 'Ocasionalmente', label: 'Ocasionalmente' },
      { value: 'Não', label: 'Não pratico' }
    ],
    justification: 'A prática de exercício físico é um fator protetor contra obesidade.'
  },
  {
    name: 'emocional',
    type: 'select',
    label: 'Seu estado emocional afeta sua alimentação?',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, como mais quando ansioso(a)', label: 'Sim, como mais quando ansioso(a)' },
      { value: 'Sim, perco o apetite', label: 'Sim, perco o apetite' }
    ],
    justification: 'Comportamentos alimentares podem estar associados ao estado emocional.'
  },
  {
    name: 'familiares',
    type: 'select',
    label: 'Há casos de obesidade na sua família?',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim', label: 'Sim' }
    ],
    justification: 'A presença de histórico familiar pode indicar predisposição genética.'
  },
  {
    name: 'habitos',
    type: 'text',
    label: 'Existe algum hábito que considera prejudicial ao controle de peso?',
    placeholder: 'Ex.: Comer à noite, sedentarismo, pular refeições...',
    justification: 'Conhecer hábitos individuais permite orientar mudanças de comportamento.'
  },
  {
    name: 'problema_atual',
    type: 'text',
    label: 'Deseja relatar alguma dificuldade atual relacionada ao seu peso?',
    placeholder: 'Ex.: Dificuldade para emagrecer, compulsão, autoestima...',
    justification: 'Permite considerar aspectos subjetivos e direcionar melhor o plano de ação.'
  }
];