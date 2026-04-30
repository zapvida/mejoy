import { Step } from '@/types/triagem';

export const perguntasSono: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '😴 Triagem de Qualidade do Sono',
    justification: 'Esta triagem investiga distúrbios do sono, seus impactos na saúde e oferece orientações baseadas em evidências científicas.'
  },
  {
    name: 'sono',
    label: 'Como você avalia sua qualidade de sono?',
    type: 'select',
    options: [
      { value: 'Excelente', label: 'Excelente' },
      { value: 'Boa', label: 'Boa' },
      { value: 'Regular', label: 'Regular' },
      { value: 'Ruim', label: 'Ruim' },
      { value: 'Péssima', label: 'Péssima' }
    ],
    required: true,
    justification: 'A percepção pessoal do sono é essencial para identificar padrões prejudiciais.'
  },
  {
    name: 'sono_livre',
    label: 'Descreva brevemente seus principais problemas com o sono.',
    type: 'text',
    placeholder: 'Ex.: Insônia, pesadelos, acorda várias vezes...',
    justification: 'Relatos abertos ajudam a identificar distúrbios específicos.'
  },
  {
    name: 'tempo',
    label: 'Quantas horas você dorme, em media, por noite?',
    type: 'text',
    placeholder: 'Ex.: 6 horas',
    required: true,
    justification: 'A duração do sono está diretamente associada à saúde metabólica e mental.'
  },
  {
    name: 'dormir',
    label: 'Você demora para adormecer?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, às vezes', label: 'Sim, às vezes' },
      { value: 'Sim, com frequência', label: 'Sim, com frequência' }
    ],
    justification: 'Dificuldade para iniciar o sono pode indicar insônia inicial ou ansiedade.'
  },
  {
    name: 'acorda_noite',
    label: 'Você acorda durante a noite?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Raramente', label: 'Raramente' },
      { value: 'Frequentemente', label: 'Frequentemente' }
    ],
    justification: 'Acordar à noite pode estar relacionado a estresse ou apneia.'
  },
  {
    name: 'ronco',
    label: 'Você ou alguém percebe que você ronca?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, às vezes', label: 'Sim, às vezes' },
      { value: 'Sim, com frequência', label: 'Sim, com frequência' }
    ],
    justification: 'Roncos frequentes podem ser indicativos de apneia obstrutiva do sono.'
  },
  {
    name: 'acorda_cansado',
    label: 'Você acorda se sentindo descansado?',
    type: 'select',
    options: [
      { value: 'Sempre', label: 'Sempre' },
      { value: 'Às vezes', label: 'Às vezes' },
      { value: 'Quase nunca', label: 'Quase nunca' }
    ],
    justification: 'Sensação de descanso é um bom marcador de qualidade do sono.'
  },
  {
    name: 'cochilos',
    label: 'Você sente necessidade de cochilar durante o dia?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Raramente', label: 'Raramente' },
      { value: 'Frequentemente', label: 'Frequentemente' },
      { value: 'Todos os dias', label: 'Todos os dias' }
    ],
    justification: 'Sonolência diurna pode indicar privação de sono ou distúrbios ocultos.'
  },
  {
    name: 'familiares',
    label: 'Algum familiar tem ou teve distúrbios do sono?',
    type: 'text',
    placeholder: 'Ex.: Apneia, insônia, sonambulismo...',
    justification: 'Histórico familiar sugere predisposição genética.'
  }
];