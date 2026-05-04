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

export const EMAGRECIMENTO_TOTAL_SECTIONS = 3;

export const EMAGRECIMENTO_INTAKE_PAGES: EmagrecimentoPageConfig[] = [
  {
    id: 'etapa-1-perfil',
    section: 1,
    title: 'Vamos começar pelo seu perfil clínico.',
    description:
      'Precisamos dos dados básicos para calcular elegibilidade e personalizar sua leitura inicial.',
    ctaLabel: 'Próximo',
    items: [
      { kind: 'field', key: 'aceita_termos', required: true, resumeRequired: true },
      { kind: 'field', key: 'altura', required: true, resumeRequired: true },
      { kind: 'field', key: 'peso', required: true, resumeRequired: true },
      { kind: 'field', key: 'peso_meta', required: true, resumeRequired: true },
      { kind: 'field', key: 'sexo', required: true, resumeRequired: true },
      { kind: 'field', key: 'gestacao', required: true, resumeRequired: true },
      { kind: 'field', key: 'data_nascimento', required: true, resumeRequired: true },
    ],
  },
  {
    id: 'etapa-2-clinico',
    section: 2,
    title: 'Agora precisamos do seu histórico de saúde.',
    description:
      'Essas respostas ajudam a reduzir risco, evitar contraindicações e poupar tempo na avaliação médica.',
    ctaLabel: 'Próximo',
    items: [
      { kind: 'field', key: 'contraindicacoes_glp1', required: true, resumeRequired: true },
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
      {
        kind: 'multiselectSlice',
        key: 'comorbidades',
        optionValues: ['depressao', 'refluxo', 'asma', 'pcos', 'hepatite_esteatose'],
        includeNoneOption: true,
        required: true,
        resumeRequired: true,
      },
      { kind: 'field', key: 'cirurgia_bariatrica_previa', required: true, resumeRequired: true },
      { kind: 'field', key: 'uso_opioides_3meses', required: true, resumeRequired: true },
      { kind: 'field', key: 'medicamentos_prescritos_atual', required: true, resumeRequired: true },
      {
        kind: 'field',
        key: 'uso_medicacao_emagrecimento_recente',
        required: true,
        resumeRequired: true,
      },
      { kind: 'field', key: 'efeitos_colaterais_previos', required: true, resumeRequired: true },
      { kind: 'field', key: 'pressao_arterial_faixa', required: true, resumeRequired: true },
      {
        kind: 'field',
        key: 'frequencia_cardiaca_repouso',
        required: true,
        resumeRequired: true,
      },
    ],
  },
  {
    id: 'etapa-3-objetivo-e-contato',
    section: 3,
    title: 'Falta só entender seu objetivo e onde enviar o resultado.',
    description:
      'Com isso, a Me Joy consegue montar sua leitura inicial e orientar o próximo passo pelo canal oficial.',
    note: 'Prescrição e medicação somente quando indicadas após avaliação médica.',
    ctaLabel: 'Gerar meu resultado inicial',
    submit: true,
    items: [
      { kind: 'field', key: 'impacto_vida', required: true, resumeRequired: true },
      { kind: 'field', key: 'objetivo_principal', required: true, resumeRequired: true },
      { kind: 'field', key: 'preferencia_principio_ativo', required: true, resumeRequired: true },
      { kind: 'field', key: 'primeiro_nome', required: true, resumeRequired: true },
      { kind: 'field', key: 'whatsapp', required: true, resumeRequired: true },
      { kind: 'field', key: 'consentimento_whatsapp', required: true, resumeRequired: true },
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
