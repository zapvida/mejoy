import { isStepAnswered, isStepVisible } from '@/lib/triage/onePageHelpers';
import type { StepDef } from '@/lib/triage/schema';

export type EmagrecimentoPageItem =
  | {
      kind: 'field';
      key: string;
      required?: boolean;
      resumeRequired?: boolean;
    }
  | {
      kind: 'multiselectSlice';
      key: string;
      optionValues: string[];
      required?: boolean;
      resumeRequired?: boolean;
      includeNoneOption?: boolean;
    };

export interface EmagrecimentoPageConfig {
  id: string;
  section: number;
  title: string;
  description?: string;
  note?: string;
  ctaLabel: string;
  submit?: boolean;
  items: EmagrecimentoPageItem[];
}

export const EMAGRECIMENTO_TOTAL_SECTIONS = 6;

export const EMAGRECIMENTO_INTAKE_PAGES: EmagrecimentoPageConfig[] = [
  {
    id: 'perfil',
    section: 1,
    title: 'Qual é sua altura, peso e objetivo?',
    description:
      'Esses dados ajudam a avaliar elegibilidade e preparar uma recomendação clínica inicial.',
    ctaLabel: 'Próximo',
    items: [
      { kind: 'field', key: 'aceita_termos' },
      { kind: 'field', key: 'altura' },
      { kind: 'field', key: 'peso' },
      { kind: 'field', key: 'peso_meta' },
      { kind: 'field', key: 'sexo' },
      { kind: 'field', key: 'gestacao' },
      { kind: 'field', key: 'data_nascimento' },
    ],
  },
  {
    id: 'contraindicacoes',
    section: 2,
    title: 'Existe alguma contraindicação importante para a linha GLP-1?',
    description:
      'Marque tudo o que se aplica. Se nada se aplicar, selecione a opção correspondente.',
    ctaLabel: 'Próximo',
    items: [{ kind: 'field', key: 'contraindicacoes_glp1' }],
  },
  {
    id: 'comorbidades-1',
    section: 3,
    title: 'Quais condições de saúde se aplicam ao seu caso?',
    description: 'Parte 1 de 2. Marque somente o que realmente faz parte do seu histórico.',
    ctaLabel: 'Próximo',
    items: [
      {
        kind: 'multiselectSlice',
        key: 'comorbidades',
        optionValues: [
          'diabetes_tipo_2',
          'pre_diabetes',
          'hipertensao',
          'dislipidemia',
          'apneia_sono',
          'artrose',
        ],
        resumeRequired: true,
      },
    ],
  },
  {
    id: 'comorbidades-2',
    section: 3,
    title: 'Quais condições de saúde se aplicam ao seu caso?',
    description:
      'Parte 2 de 2. Se nenhuma das condições listadas se aplicar ao seu caso, escolha a opção correspondente.',
    ctaLabel: 'Próximo',
    items: [
      {
        kind: 'multiselectSlice',
        key: 'comorbidades',
        optionValues: ['depressao', 'refluxo', 'asma', 'pcos', 'hepatite_esteatose'],
        includeNoneOption: true,
        required: true,
      },
    ],
  },
  {
    id: 'historico-clinico',
    section: 4,
    title: 'Conte seu histórico clínico e terapêutico.',
    description:
      'Essa etapa reduz tentativa e erro na avaliação médica e evita repetir caminhos que já não funcionaram.',
    ctaLabel: 'Próximo',
    items: [
      { kind: 'field', key: 'cirurgia_bariatrica_previa' },
      { kind: 'field', key: 'uso_opioides_3meses' },
      { kind: 'field', key: 'medicamentos_prescritos_atual' },
      { kind: 'field', key: 'uso_medicacao_emagrecimento_recente' },
      { kind: 'field', key: 'efeitos_colaterais_previos' },
    ],
  },
  {
    id: 'contexto-cardiometabolico',
    section: 4,
    title: 'Como está seu contexto cardiometabólico hoje?',
    description:
      'São sinais simples, mas úteis para posicionar risco e orientar o próximo passo com mais precisão.',
    ctaLabel: 'Próximo',
    items: [
      { kind: 'field', key: 'pressao_arterial_faixa' },
      { kind: 'field', key: 'frequencia_cardiaca_repouso' },
    ],
  },
  {
    id: 'objetivos',
    section: 5,
    title: 'Qual é seu objetivo principal com o programa?',
    description:
      'Queremos entender o impacto do peso na sua rotina e como você prefere começar a estratégia.',
    ctaLabel: 'Próximo',
    items: [
      { kind: 'field', key: 'impacto_vida' },
      { kind: 'field', key: 'objetivo_principal' },
      { kind: 'field', key: 'preferencia_principio_ativo' },
    ],
  },
  {
    id: 'contato',
    section: 6,
    title: 'Para quem vamos enviar seu resultado?',
    description:
      'Seu resultado inicial e os próximos passos seguem pelo canal oficial da Mejoy.',
    note: 'Prescrição somente quando indicada após avaliação médica.',
    ctaLabel: 'Gerar meu resultado inicial',
    submit: true,
    items: [
      { kind: 'field', key: 'primeiro_nome' },
      { kind: 'field', key: 'whatsapp' },
      { kind: 'field', key: 'consentimento_whatsapp' },
    ],
  },
];

export function getEmagrecimentoStepByKey(steps: StepDef[], key: string) {
  return steps.find(step => step.key === key);
}

function isPageItemComplete(
  item: EmagrecimentoPageItem,
  steps: StepDef[],
  answers: Record<string, any>,
  mode: 'resume' | 'validate'
) {
  const step = getEmagrecimentoStepByKey(steps, item.key);
  if (!step || !isStepVisible(step, answers)) return true;

  const isRequired =
    mode === 'resume'
      ? item.resumeRequired ?? item.required ?? step.required ?? false
      : item.required ?? step.required ?? false;

  if (!isRequired) return true;
  return isStepAnswered(step, answers);
}

export function getFirstIncompleteEmagrecimentoPageIndex(
  pages: EmagrecimentoPageConfig[],
  steps: StepDef[],
  answers: Record<string, any>
) {
  const index = pages.findIndex(page =>
    page.items.some(item => !isPageItemComplete(item, steps, answers, 'resume'))
  );

  if (index === -1) return Math.max(pages.length - 1, 0);
  return index;
}
