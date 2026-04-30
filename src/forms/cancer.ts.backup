import { Step } from '@/types/triagem';

export const perguntasCancer: Step[] = [
  {
    name: 'intro',
    type: 'intro',
    label: '🧪 Triagem de Risco para Câncer',
    justification: 'Avalia fatores de risco pessoais e familiares para prevenção e detecção precoce de câncer.'
  },
  {
    type: 'setor',
    name: 'setor_cancer_pessoal',
    label: '🧬 Fatores Pessoais e Familiares',
    description: 'Aqui buscamos entender se há riscos pessoais ou familiares que aumentam a chance de câncer.'
  },
  {
    name: 'idade',
    label: 'Qual sua idade?',
    type: 'text',
    placeholder: 'Ex.: 45',
    required: true,
    justification: 'Idade avançada é um dos principais fatores de risco.',
    categoriaIA: 'cancer',
    prioridade: 'alta'
  },
  {
    name: 'familiares',
    label: 'Algum familiar teve câncer?',
    type: 'multiselect',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Câncer de mama', label: 'Câncer de mama' },
      { value: 'Câncer de próstata', label: 'Câncer de próstata' },
      { value: 'Câncer intestinal', label: 'Câncer intestinal' },
      { value: 'Outros', label: 'Outros' }
    ],
    justification: 'Histórico familiar aumenta significativamente o risco.',
    categoriaIA: 'cancer',
    prioridade: 'alta'
  },
  {
    name: 'habitos',
    label: 'Você fuma ou consome álcool com frequência?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Fuma', label: 'Fuma' },
      { value: 'Bebe álcool', label: 'Bebe álcool' },
      { value: 'Ambos', label: 'Ambos' }
    ],
    justification: 'Tabaco e álcool são fatores de risco conhecidos para diversos tipos de câncer.',
    required: true,
    categoriaIA: 'habitos',
    prioridade: 'alta'
  },
  {
    name: 'sono',
    label: 'Como você avalia seu sono?',
    type: 'select',
    options: [
      { value: 'Bom', label: 'Bom' },
      { value: 'Ruim', label: 'Ruim' },
      { value: 'Insônia', label: 'Insônia' },
      { value: 'Sono interrompido', label: 'Sono interrompido' }
    ],
    justification: 'Sono ruim pode impactar imunidade e saúde celular.',
    required: true,
    categoriaIA: 'sono',
    prioridade: 'media'
  },
  {
    name: 'alimentacao',
    label: 'Como está sua alimentação atual?',
    type: 'select',
    options: [
      { value: 'Natural e balanceada', label: 'Natural e balanceada' },
      { value: 'Industrializados com frequência', label: 'Industrializados com frequência' },
      { value: 'Rica em embutidos e frituras', label: 'Rica em embutidos e frituras' },
      { value: 'Pouco variada ou restritiva', label: 'Pouco variada ou restritiva' }
    ],
    justification: 'Alimentação rica em industrializados, gorduras e embutidos eleva riscos.',
    required: true,
    categoriaIA: 'nutricao',
    prioridade: 'alta'
  },
  {
    name: 'exercicio',
    label: 'Você pratica atividade física?',
    type: 'select',
    options: [
      { value: 'Sim, regularmente', label: 'Sim, regularmente' },
      { value: 'Ocasionalmente', label: 'Ocasionalmente' },
      { value: 'Nunca', label: 'Nunca' }
    ],
    justification: 'Sedentarismo é um fator de risco para câncer.',
    required: true,
    categoriaIA: 'atividade',
    prioridade: 'media'
  },
  {
    name: 'ambiente',
    label: 'Você se expõe a produtos químicos ou radiação?',
    type: 'select',
    options: [
      { value: 'Não', label: 'Não' },
      { value: 'Sim, no trabalho', label: 'Sim, no trabalho' },
      { value: 'Sim, em casa', label: 'Sim, em casa' }
    ],
    justification: 'Exposição ambiental influencia significativamente o risco de câncer.',
    required: true,
    categoriaIA: 'ambiente',
    prioridade: 'alta'
  },
  {
    name: 'problema_atual',
    label: 'Há algum sintoma atual que te preocupa?',
    type: 'text',
    placeholder: 'Ex.: Nódulos, sangramentos, emagrecimento...',
    justification: 'Sintomas podem indicar necessidade de investigação imediata.',
    required: false,
    categoriaIA: 'cancer',
    prioridade: 'alta'
  },
  {
    name: 'diagnostico_tempo',
    label: 'Você já teve diagnóstico de câncer ou lesões suspeitas?',
    type: 'text',
    placeholder: 'Ex.: Sim, pólipos no intestino há 2 anos...',
    justification: 'Histórico pessoal é determinante na avaliação de risco.',
    required: false,
    categoriaIA: 'cancer',
    prioridade: 'alta'
  }
];