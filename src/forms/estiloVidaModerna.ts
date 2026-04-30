import { Step } from '@/types/triagem';

export const perguntasEstiloVidaModerna: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '📱 Triagem de Estilo de Vida Moderna',
    justification:
      'Avalia impactos da rotina atual sobre a saúde física, mental e metabólica, considerando o excesso de estímulos, sedentarismo e hábitos digitais.'
  },
  {
    name: 'tela',
    label: 'Quantas horas por dia você passa em frente a telas (celular, computador, TV)?',
    type: 'select',
    options: [
      { value: 'Até 4h', label: 'Até 4h' },
      { value: 'Entre 4h e 8h', label: 'Entre 4h e 8h' },
      { value: 'Mais de 8h', label: 'Mais de 8h' }
    ],
    required: true,
    justification: 'Tempo excessivo de tela está associado à fadiga mental, sedentarismo e distúrbios do sono.'
  },
  {
    name: 'sono',
    label: 'Como está sua qualidade de sono?',
    type: 'select',
    options: [
      { value: 'Boa', label: 'Boa' },
      { value: 'Ruim', label: 'Ruim' },
      { value: 'Sono interrompido', label: 'Sono interrompido' },
      { value: 'Insônia', label: 'Insônia' }
    ],
    justification: 'Estilo de vida moderno afeta o ritmo circadiano e a recuperação noturna.'
  },
  {
    name: 'atividade',
    label: 'Pratica atividade física?',
    type: 'select',
    options: [
      { value: 'Sim, regularmente', label: 'Sim, regularmente' },
      { value: 'Ocasionalmente', label: 'Ocasionalmente' },
      { value: 'Não', label: 'Não' }
    ],
    justification: 'Sedentarismo é um dos maiores vilões da saúde moderna.'
  },
  {
    name: 'alimentacao',
    label: 'Como avalia sua alimentação diária?',
    type: 'select',
    options: [
      { value: 'Equilibrada', label: 'Equilibrada' },
      { value: 'Irregular', label: 'Irregular' },
      { value: 'Rica em ultraprocessados', label: 'Rica em ultraprocessados' }
    ],
    justification: 'Hábitos alimentares impactam diretamente energia, humor e metabolismo.'
  },
  {
    name: 'estresse',
    label: 'Como avalia seu nível de estresse atualmente?',
    type: 'select',
    options: [
      { value: 'Baixo', label: 'Baixo' },
      { value: 'Moderado', label: 'Moderado' },
      { value: 'Alto', label: 'Alto' },
      { value: 'Extremo', label: 'Extremo' }
    ],
    justification: 'Rotinas aceleradas e hiperconectividade aumentam o estresse crônico.'
  },
  {
    name: 'dopamina',
    label: 'Você sente que está viciado em estímulos digitais (redes sociais, vídeos curtos, etc)?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Às vezes', label: 'Às vezes' },
      { value: 'Frequentemente', label: 'Frequentemente' }
    ],
    justification: 'O uso compulsivo de estímulos rápidos está ligado a disfunções dopaminérgicas e procrastinação.'
  },
  {
    name: 'energia',
    label: 'Como está sua energia ao longo do dia?',
    type: 'select',
    options: [
      { value: 'Boa e constante', label: 'Boa e constante' },
      { value: 'Oscila muito', label: 'Oscila muito' },
      { value: 'Baixa a maior parte do tempo', label: 'Baixa a maior parte do tempo' }
    ],
    justification: 'Queda de energia pode indicar desregulação hormonal, burnout ou déficit nutricional.'
  },
  {
    name: 'dopamina_livre',
    label: 'Deseja relatar algum hábito que considera prejudicial na sua rotina?',
    type: 'text',
    placeholder: 'Ex.: Uso excessivo de celular à noite, alimentação compulsiva...',
    justification: 'Relato espontâneo ajuda a personalizar o plano de ação.'
  },
  {
    name: 'familiares',
    label: 'Tem histórico familiar de doenças relacionadas ao estilo de vida (diabetes, hipertensão, obesidade)?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, 1 condição', label: 'Sim, 1 condição' },
      { value: 'Sim, múltiplas', label: 'Sim, múltiplas' }
    ],
    justification: 'Fatores genéticos somados ao estilo de vida aumentam o risco metabólico.'
  }
];