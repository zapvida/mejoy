import type { EmagrecimentoTrilha } from '@/lib/emagrecimento/checkoutUrls';

export type EmagrecimentoPlanId = 'programa-1m' | 'programa-3m' | 'programa-6m';
export type EmagrecimentoPlanKey = 'basico' | 'completo' | 'premium';
export type EmagrecimentoMolecule =
  | 'mounjaro'
  | 'wegovy'
  | 'rybelsus'
  | 'contrave';
export type EmagrecimentoBenefitTier = 'essential' | 'plus' | 'full';
export type EmagrecimentoSupportTier = 'guided' | 'extended' | 'concierge';
export type EmagrecimentoRefundPolicy = 'convert_or_refund_pre_shipment';
export type EmagrecimentoCoverageMode = 'coverage_available' | 'coverage_pending';

export interface EmagrecimentoPlan {
  id: EmagrecimentoPlanId;
  planKey: EmagrecimentoPlanKey;
  track: EmagrecimentoTrilha;
  durationMonths: number;
  duration: string;
  molecule: EmagrecimentoMolecule;
  moleculeLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  priceMain: string;
  priceDetail: string;
  totalAmount: number;
  totalAmountCents: number;
  installment12Cents: number;
  monthlyInstallment: number;
  installments: number;
  highlight: boolean;
  recommended: boolean;
  bullets: string[];
  ctaLabel: string;
  asaasEnvVar: string;
  benefitTier: EmagrecimentoBenefitTier;
  supportTier: EmagrecimentoSupportTier;
  refundPolicy: EmagrecimentoRefundPolicy;
  coverageMode: EmagrecimentoCoverageMode;
}

type PlanTemplate = {
  id: EmagrecimentoPlanId;
  planKey: EmagrecimentoPlanKey;
  badge: string;
  title: string;
  subtitle: string;
  durationMonths: number;
  duration: string;
  highlight: boolean;
  recommended: boolean;
  ctaLabel: string;
  benefitTier: EmagrecimentoBenefitTier;
  supportTier: EmagrecimentoSupportTier;
};

const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: 'programa-1m',
    planKey: 'basico',
    badge: 'Comece com seguranca',
    title: 'Programa 1 Mes',
    subtitle: 'Entrada clinica objetiva para iniciar o tratamento com avaliacao medica e acompanhamento real.',
    durationMonths: 1,
    duration: '1 mes',
    highlight: false,
    recommended: false,
    ctaLabel: 'Comecar com seguranca',
    benefitTier: 'essential',
    supportTier: 'guided',
  },
  {
    id: 'programa-3m',
    planKey: 'completo',
    badge: 'Mais escolhido',
    title: 'Programa 3 Meses',
    subtitle: 'Tempo suficiente para avaliar resposta, ajustar conduta e consolidar aderencia.',
    durationMonths: 3,
    duration: '3 meses',
    highlight: true,
    recommended: true,
    ctaLabel: 'Escolher plano recomendado',
    benefitTier: 'plus',
    supportTier: 'extended',
  },
  {
    id: 'programa-6m',
    planKey: 'premium',
    badge: 'Mais completo',
    title: 'Programa 6 Meses',
    subtitle: 'Continuacao premium com mais profundidade, suporte nomeado e manutencao da jornada.',
    durationMonths: 6,
    duration: '6 meses',
    highlight: false,
    recommended: false,
    ctaLabel: 'Quero o mais completo',
    benefitTier: 'full',
    supportTier: 'concierge',
  },
];

const MOLECULE_LABELS: Record<EmagrecimentoMolecule, string> = {
  mounjaro: 'Mounjaro',
  wegovy: 'Wegovy',
  rybelsus: 'Rybelsus',
  contrave: 'Contrave',
};

const MOLECULE_PRICE_MATRIX: Record<
  EmagrecimentoMolecule,
  Record<EmagrecimentoPlanId, number>
> = {
  mounjaro: {
    'programa-1m': 2500,
    'programa-3m': 7000,
    'programa-6m': 14000,
  },
  wegovy: {
    'programa-1m': 1500,
    'programa-3m': 4000,
    'programa-6m': 8000,
  },
  rybelsus: {
    'programa-1m': 1200,
    'programa-3m': 3300,
    'programa-6m': 6500,
  },
  contrave: {
    'programa-1m': 1200,
    'programa-3m': 3300,
    'programa-6m': 6500,
  },
};

function normalizePrincipio(raw: string | null | undefined): string {
  return (raw || '').trim().toLowerCase();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.round(value * 100) / 100);
}

function buildPriceMain(totalAmount: number, installments = 12) {
  return `${installments}x de ${formatCurrency(totalAmount / installments)}`;
}

function buildPriceDetail(totalAmount: number, installments = 12) {
  return `Total de ${formatCurrency(totalAmount)} em ate ${installments}x sem juros no cartao.`;
}

function buildBulletsForTier(
  template: PlanTemplate,
  moleculeLabel: string,
): string[] {
  const clinicalGuardrail = `Medicacao com ${moleculeLabel} apenas se houver indicacao medica.`;

  if (template.benefitTier === 'essential') {
    return [
      '1 consulta com endocrinologista ou nutrologo',
      '1 retorno clinico apos o pedido de check-up',
      '1 consulta com psicologa para aderencia',
      'App MeJoy Essential com timeline, status de prescricao/entrega e agenda de retornos',
      clinicalGuardrail,
    ];
  }

  if (template.benefitTier === 'plus') {
    return [
      'Tudo do plano de 1 mes',
      '1 consulta com nutricionista',
      '1 retorno adicional com especialista',
      'App MeJoy Plus com tarefas, lembretes, evolucao, documentos e trilha educacional',
      'Ajustes clinicos ao longo de 3 meses conforme resposta e tolerancia',
      clinicalGuardrail,
    ];
  }

  return [
    'Tudo do plano de 3 meses',
    'App MeJoy Full com toda a jornada liberada',
    'Linha dedicada do programa com roster medico nomeado e triagem 24/7',
    'Escalonamento imediato para o ZapVida em nova dor ou urgencia',
    'Follow-up prioritario e manutencao da jornada de 6 meses',
    clinicalGuardrail,
  ];
}

export function resolveEmagrecimentoCommercialSelection(input?: {
  trilha?: EmagrecimentoTrilha | null;
  principio?: string | null;
}): {
  track: EmagrecimentoTrilha;
  molecule: EmagrecimentoMolecule;
  moleculeLabel: string;
} {
  const track = input?.trilha || 'alternativas_clinicas';
  const principio = normalizePrincipio(input?.principio);

  if (track === 'tirzepatida' || principio.includes('mounjaro') || principio.includes('tirzepatida')) {
    return {
      track: 'tirzepatida',
      molecule: 'mounjaro',
      moleculeLabel: MOLECULE_LABELS.mounjaro,
    };
  }

  if (track === 'contrave' || principio.includes('contrave')) {
    return {
      track: 'contrave',
      molecule: 'contrave',
      moleculeLabel: MOLECULE_LABELS.contrave,
    };
  }

  if (principio.includes('rybelsus')) {
    return {
      track: 'semaglutida',
      molecule: 'rybelsus',
      moleculeLabel: MOLECULE_LABELS.rybelsus,
    };
  }

  if (track === 'semaglutida' || principio.includes('wegovy') || principio.includes('semaglutida')) {
    return {
      track: 'semaglutida',
      molecule: 'wegovy',
      moleculeLabel: MOLECULE_LABELS.wegovy,
    };
  }

  return {
    track: 'alternativas_clinicas',
    molecule: 'rybelsus',
    moleculeLabel: MOLECULE_LABELS.rybelsus,
  };
}

export function buildEmagrecimentoPlans(input?: {
  trilha?: EmagrecimentoTrilha | null;
  principio?: string | null;
}): EmagrecimentoPlan[] {
  const selection = resolveEmagrecimentoCommercialSelection(input);

  return PLAN_TEMPLATES.map((template) => {
    const totalAmount = MOLECULE_PRICE_MATRIX[selection.molecule][template.id];
    const monthlyInstallment = Math.round((totalAmount / 12) * 100) / 100;
    const installment12Cents = Math.round(monthlyInstallment * 100);

    return {
      id: template.id,
      planKey: template.planKey,
      track: selection.track,
      durationMonths: template.durationMonths,
      duration: template.duration,
      molecule: selection.molecule,
      moleculeLabel: selection.moleculeLabel,
      badge: template.badge,
      title: template.title,
      subtitle: template.subtitle,
      priceMain: buildPriceMain(totalAmount, 12),
      priceDetail: buildPriceDetail(totalAmount, 12),
      totalAmount,
      totalAmountCents: Math.round(totalAmount * 100),
      installment12Cents,
      monthlyInstallment,
      installments: 12,
      highlight: template.highlight,
      recommended: template.recommended,
      bullets: buildBulletsForTier(template, selection.moleculeLabel),
      ctaLabel: template.ctaLabel,
      asaasEnvVar: `ASAAS_PRICE_EMAGRECIMENTO_${selection.molecule.toUpperCase()}_${template.planKey.toUpperCase()}`,
      benefitTier: template.benefitTier,
      supportTier: template.supportTier,
      refundPolicy: 'convert_or_refund_pre_shipment',
      coverageMode: 'coverage_available',
    };
  });
}

export const emagrecimentoPlans: EmagrecimentoPlan[] =
  buildEmagrecimentoPlans();

export const PLANTAO_ZAPVIDA_URL = 'https://zapvida.com/pay/plantao';

export function buildZapVidaPlantaoUrl(utmContent: string): string {
  const url = new URL(PLANTAO_ZAPVIDA_URL);
  url.searchParams.set('utm_source', 'mejoy');
  url.searchParams.set('utm_medium', 'clinical_direct');
  url.searchParams.set('utm_campaign', 'emagrecimento_clinico');
  url.searchParams.set('utm_content', utmContent);
  return url.toString();
}

export const emagrecimentoLegalNote =
  'A conduta final e sempre medica. Se a molecula esperada nao for indicada, voce pode converter para um protocolo clinico alternativo ou solicitar reembolso integral antes do envio da medicacao.';

export const planIdMapping = {
  basico: 'programa-1m',
  completo: 'programa-3m',
  premium: 'programa-6m',
  mensal: 'programa-1m',
  trimestral: 'programa-3m',
  semestral: 'programa-6m',
} as const;

export const planIdToApiKey: Record<string, EmagrecimentoPlanKey> = {
  'programa-1m': 'basico',
  'programa-3m': 'completo',
  'programa-6m': 'premium',
  'start-glp1': 'basico',
  'programa-glp1-3m': 'completo',
  'programa-glp1-6m-premium': 'premium',
};

export function getPlanById(
  id: string,
  input?: {
    trilha?: EmagrecimentoTrilha | null;
    principio?: string | null;
  },
): EmagrecimentoPlan | undefined {
  const mappedId = planIdMapping[id as keyof typeof planIdMapping] || id;
  return buildEmagrecimentoPlans(input).find((plan) => plan.id === mappedId);
}

export function getRecommendedPlan(
  input?: {
    trilha?: EmagrecimentoTrilha | null;
    principio?: string | null;
  },
): EmagrecimentoPlan {
  return (
    buildEmagrecimentoPlans(input).find((plan) => plan.recommended) ||
    buildEmagrecimentoPlans(input)[1]
  );
}

export function getEmagrecimentoPlanByApiKey(
  planKey: EmagrecimentoPlanKey,
  input?: {
    trilha?: EmagrecimentoTrilha | null;
    principio?: string | null;
  },
): EmagrecimentoPlan {
  const match = buildEmagrecimentoPlans(input).find((plan) => plan.planKey === planKey);

  if (!match) {
    throw new Error(`Plano de emagrecimento nao encontrado para ${planKey}`);
  }

  return match;
}
