import {
  emagrecimentoPlans,
  planIdMapping,
  type EmagrecimentoPlan,
} from '@/config/zapfarm/emagrecimento-plans';
import {
  getPricesForProduct,
  isTestPriceSequenceEnabled,
} from '@/lib/zapfarm/price-resolver';

const PLAN_KEYS_BY_ID = {
  'programa-1m': 'basico',
  'programa-3m': 'completo',
  'programa-6m': 'premium',
} as const;

type EmagrecimentoPlanKey = (typeof PLAN_KEYS_BY_ID)[keyof typeof PLAN_KEYS_BY_ID];

export interface EmagrecimentoCheckoutPlanCatalogResult {
  planCatalog: EmagrecimentoPlan[];
  isTestMode: boolean;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.round(value * 100) / 100);
}

function buildPriceMain(totalAmount: number, installments: number) {
  if (installments <= 1) {
    return `1x de ${formatCurrency(totalAmount)}`;
  }

  return `${installments}x de ${formatCurrency(totalAmount / installments)}`;
}

function buildPriceDetail(totalAmount: number, installments: number, isTestMode: boolean) {
  if (isTestMode) {
    return 'Valor temporario de homologacao em producao para validar pagamento, redirecionamento e dashboards.';
  }

  return `Total de ${formatCurrency(totalAmount)} em ate ${installments}x sem juros no cartao.`;
}

export function buildEmagrecimentoCheckoutPlanCatalog(): EmagrecimentoCheckoutPlanCatalogResult {
  const resolved = getPricesForProduct('emagrecimento', undefined, true);
  const isTestMode = isTestPriceSequenceEnabled();

  const planCatalog = emagrecimentoPlans.map((plan) => {
    const planKey = PLAN_KEYS_BY_ID[plan.id] as EmagrecimentoPlanKey;
    const totalAmountCents = resolved[planKey];
    const totalAmount = totalAmountCents / 100;
    const installments = isTestMode ? 1 : plan.installments;
    const monthlyInstallment = Math.round((totalAmount / installments) * 100) / 100;

    return {
      ...plan,
      totalAmount,
      totalAmountCents,
      installments,
      monthlyInstallment,
      priceMain: buildPriceMain(totalAmount, installments),
      priceDetail: buildPriceDetail(totalAmount, installments, isTestMode),
    };
  });

  return {
    planCatalog,
    isTestMode,
  };
}

export function getEmagrecimentoPlanFromCatalog(
  planCatalog: EmagrecimentoPlan[],
  id: string
) {
  const mappedId = planIdMapping[id as keyof typeof planIdMapping] || id;
  return planCatalog.find((plan) => plan.id === mappedId);
}
