import {
  buildEmagrecimentoPlans,
  planIdMapping,
  type EmagrecimentoPlan,
} from '@/config/zapfarm/emagrecimento-plans';
import type { EmagrecimentoTrilha } from '@/lib/emagrecimento/checkoutUrls';

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

export function buildEmagrecimentoCheckoutPlanCatalog(
  trilha?: EmagrecimentoTrilha | null,
  principio?: string | null,
): EmagrecimentoCheckoutPlanCatalogResult {
  const isTestMode = false;
  const planCatalog = buildEmagrecimentoPlans({ trilha, principio }).map((plan) => {
    const planKey = PLAN_KEYS_BY_ID[plan.id] as EmagrecimentoPlanKey;
    return {
      ...plan,
      planKey,
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
