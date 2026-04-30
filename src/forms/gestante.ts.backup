import { Step } from '@/types/triagem';

export const perguntasGestante: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '🤰 Triagem de Saúde na Gestação',
    justification: 'Identificar fatores de risco e oferecer orientações personalizadas para uma gestação saudável.'
  },
  {
    name: 'setor_dados',
    type: 'setor',
    label: '👩‍🍼 Sobre você e sua gestação',
    description: 'Coletamos dados essenciais sobre seu histórico e fase gestacional atual para uma análise segura e personalizada.'
  },
  {
    name: 'idade',
    label: 'Qual sua idade?',
    type: 'text',
    placeholder: 'Ex.: 28',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'dados_pessoais',
    justification: 'A idade influencia diretamente nos riscos obstétricos.',
    example: 'Exemplo: 32 anos'
  },
  {
    name: 'nascimento',
    label: 'Qual a data da sua última menstruação?',
    type: 'text',
    placeholder: 'Ex.: 10/01/2024',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'gestacao',
    justification: 'Permite calcular o tempo gestacional e estimar o parto.',
    example: 'Exemplo: 05/03/2024'
  },
  {
    name: 'familiares',
    label: 'Há histórico familiar de doenças genéticas?',
    type: 'text',
    placeholder: 'Ex.: Diabetes, hipertensão, síndromes...',
    required: false,
    prioridade: 'media',
    categoriaIA: 'genetica',
    justification: 'Auxilia na triagem de riscos hereditários.',
    example: 'Exemplo: Mãe com diabetes tipo 2'
  },
  {
    name: 'setor_habitos',
    type: 'setor',
    label: '🧬 Hábitos e Rotina na Gestação',
    description: 'Identificamos fatores de estilo de vida que afetam diretamente a saúde gestacional.'
  },
  {
    name: 'habitos',
    label: 'Fuma ou consome álcool?',
    type: 'select',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'habitos',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Fumo', label: 'Fumo' },
      { value: 'Álcool', label: 'Álcool' },
      { value: 'Ambos', label: 'Ambos' }
    ],
    justification: 'Substâncias impactam diretamente o desenvolvimento fetal.'
  },
  {
    name: 'sono',
    label: 'Como está seu sono durante a gestação?',
    type: 'select',
    required: true,
    prioridade: 'media',
    categoriaIA: 'sono',
    options: [
      { value: 'Bom', label: 'Bom' },
      { value: 'Ruim', label: 'Ruim' },
      { value: 'Insônia', label: 'Insônia' },
      { value: 'Sono interrompido', label: 'Sono interrompido' }
    ],
    justification: 'Distúrbios do sono afetam o bem-estar materno e fetal.'
  },
  {
    name: 'alimentacao',
    label: 'Descreva brevemente sua alimentação.',
    type: 'text',
    required: true,
    prioridade: 'media',
    categoriaIA: 'nutricao',
    placeholder: 'Ex.: Rica em frutas, legumes, proteínas...',
    justification: 'A nutrição impacta diretamente a saúde da mãe e do bebê.',
    example: 'Exemplo: Evito ultraprocessados, consumo vegetais diariamente'
  },
  {
    name: 'medicamentos',
    label: 'Faz uso de algum medicamento durante a gestação?',
    type: 'text',
    required: false,
    prioridade: 'media',
    categoriaIA: 'medicacao',
    placeholder: 'Ex.: Ácido fólico, vitaminas, outros...',
    justification: 'Avaliar a segurança e adequação da medicação.',
    example: 'Exemplo: Uso de ácido fólico e sulfato ferroso'
  },
  {
    name: 'problema_atual',
    label: 'Existe alguma queixa ou desconforto atual?',
    type: 'text',
    required: false,
    prioridade: 'alta',
    categoriaIA: 'queixas',
    placeholder: 'Ex.: Inchaço, dores, sangramento...',
    justification: 'Permite intervenção precoce e orientação adequada.',
    example: 'Exemplo: Cólica leve e cansaço excessivo'
  },
  {
    name: 'emocional',
    label: 'Como está seu estado emocional na gestação?',
    type: 'select',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'emocional',
    options: [
      { value: 'Tranquila', label: 'Tranquila' },
      { value: 'Ansiosa', label: 'Ansiosa' },
      { value: 'Estressada', label: 'Estressada' },
      { value: 'Oscilando muito', label: 'Oscilando muito' }
    ],
    justification: 'Saúde mental impacta diretamente na gestação e no desenvolvimento do bebê.'
  }
];